/**
 * This is the extension's background script. It always runs in the background.
 * It is in charge of determining which deals or cashback rewards correspond to the current site the user is browsing.
 * It does this by matching the tab's url to the urls in the data files.
 */

// Switch this if you want to load data directly from the `/data` folder
// In prod, the extension always loads data from our project website
const IS_DEV_MODE = 0;

// Constants
const PRODUCT_WEBSITE_URL = 'https://www.tejunareddy.com/discover-rewards-notifier/';
const CASHBACK_DATA_URL_PROD = PRODUCT_WEBSITE_URL + 'cashbacks.json';
const DEAL_DATA_URL_PROD = PRODUCT_WEBSITE_URL + 'deals.json';
const CASHBACK_DATA_PATH_DEV = '../data/cashback/data.json';
const DEAL_DATA_PATH_DEV = '../data/deal/data.json';
const REFRESH_DATA_ALARM_NAME = 'refresh-data-alarm';
const REFRESH_DATA_INTERVAL_MINUTES = 60;
const REQUEST_TIMEOUT_SECONDS = 10;

// Loaded data from the url / files (depending on mode)
let cashbacks = null;
let deals = null;

// Dictionary that keeps track of the currently enabled "items" for each tab
// Example: { 'tab 1': ['deal_1', 'deal_2', 'cashback_1'] }
let enabledItems = {};

// Fetch latest data. Register listeners after data is fetched
fetchData(registerListeners);

/**
 * Fetches the latest Discover Deals and Cashback Rewards data.
 * Fetches data from local file if in DEV mode. Otherwise fetches data from product website.
 */
function fetchData(callback) {

  // Call cashback data fetcher based on DEV or PROD
  const CASHBACK_LOCATION = IS_DEV_MODE? CASHBACK_DATA_PATH_DEV : CASHBACK_DATA_URL_PROD;
  console.debug('Cashback data location', CASHBACK_LOCATION);
  fetchJSON(CASHBACK_LOCATION, onCashbackData);

  function onCashbackData(err, data) {
    if (err) {
      console.warn('Could not load cashback data.', err);

      if (!cashbacks) {
        console.error('Cashback data has never been loaded! Extension will not work');
        // TODO retry
      }
      return;
    }

    // Set the data
    cashbacks = data;

    // Call deal data fetcher based on DEV or PROD
    const DEAL_LOCATION = IS_DEV_MODE? DEAL_DATA_PATH_DEV : DEAL_DATA_URL_PROD;
    console.debug('Deals data location', DEAL_LOCATION);
    fetchJSON(DEAL_LOCATION, onDealData);
  }

  function onDealData(err, data) {
    if (err) {
      console.warn('Could not load deals data.', err);

      if (!deals) {
        console.error('Deals data has never been loaded! Extension will not work');
        // TODO retry
      }
      return;
    }

    // Set the data
    deals = data;

    // Done fetching and loading the data, call the callback
    console.info('Fetched and loaded the latest Discover data successfully :)');
    callback();
  }
}

/**
 * This method registers listeners for Chrome Tabs and Extension updates.
 * Only needs to be called once. Subsequent calls have no affect.
 */
function registerListeners() {
  // Add event listeners for the tabs. These actually do the matching and state changes
  chrome.tabs.onRemoved.addListener(onTabRemoved);
  chrome.tabs.onUpdated.addListener(onTabUpdated);

  // Whenever we detect an update is available, reload the extension
  // We need this (for now) because we use a persistent background page
  // This ensures that users get the latest discover data
  chrome.runtime.onUpdateAvailable.addListener(function(details) {
    console.warn('New update available!', details);
    chrome.runtime.reload();
  });

  // Create an alarm that refreshes the deals and cashback data every so often
  // This keeps the data up-to-date
  // But first, Add a listener to listen for updates
  chrome.alarms.onAlarm.addListener(onAlarmFired);
  chrome.alarms.create(REFRESH_DATA_ALARM_NAME, {
    periodInMinutes: REFRESH_DATA_INTERVAL_MINUTES
  });

  console.info('Registered all listeners :)');
}

function onAlarmFired(alarm) {
  let name = alarm.name;

  switch (name) {

    case REFRESH_DATA_ALARM_NAME:
      fetchData(function() {
        console.info(name, 'alarm done refreshing data');
      });
      break;

    default:
      console.error('Unknown alarm fired:', alarm);
      break;

  }
}

/**
 * Callback for when a tab is removed. Tied to the chrome event handler.
 */
function onTabRemoved(tabId) {
  // Remove all enabled items for this tab
  delete enabledItems[tabId];
  console.debug(enabledItems);
}

/**
 * Callback for when a tab is updated. Tied to the chrome event handler.
 */
function onTabUpdated(tabId, changeInfo, tab) {

  if (!cashbacks || !deals) {
    // Should never happen
    console.error(tabId, 'Discover deals or cashback rewards have not loaded properly');
    return;
  }

  let newUrl = tab.url;
  let newTitle = tab.title;

  // Continue with the logic only if there are no items or the page is loading
  if (getEnabledItems(tabId) && changeInfo.status !== "loading") {
    return;
  }

  // Determine which items should be displayed for this url
  // FIXME loading this each time might be inefficient. Could try caching the results or using a better DS
  let items = getItemsForUrlOrName(newUrl, newTitle);
  if (items.length === 0) {
    // There are no items for this url

    if (!getEnabledItems(tabId)) {
      // Page action for tab was already inactive, no need to do anything
      return;
    }

    // Hide page icon and set title
    chrome.pageAction.hide(tabId);
    chrome.pageAction.setTitle({
      tabId: tabId,
      title: 'No Discover Deals or Cashback Rewards'
    });

    // Remove from enabled
    delete enabledItems[tabId];
    console.debug(enabledItems);

    return;
  }
  // else, there are items for this page!
  console.debug(tabId, newUrl, 'for site', newTitle, 'has items', items);

  // Enable page action and set title
  chrome.pageAction.show(tabId);
  chrome.pageAction.setTitle({
    tabId: tabId,
    title: 'New deal or Cashback reward! Click on icon to view'
  });

  // Add to enabled
  enabledItems[tabId] = items;
  console.debug(enabledItems);
}

/**
 * Returns the deal and cashback objects that match the given url OR title.
 */
function getItemsForUrlOrName(url, title) {
  let items = [];
  title = title.toLowerCase();

  // Iterate through deals
  for (let i = 0; i < deals.length; i++) {
    let deal = deals[i];
    let deal_url = deal.site_url;
    let deal_name = deal.site_name.toLowerCase();

    // Simple sub-stringing to match urls with hostname or tab title with site name
    // FIXME need to clean this up. Possibly merge with the loop below
    if (url.includes(deal_url)) {
      deal.type = 'deal';
      items.push(deal);
    } else if (title.indexOf(deal_name + ' ') === 0 || title.includes(' ' + deal_name + ' ')) {
      // FIXME this doesn't match the case where the word shows up at the very end of the title
      console.warn(deal_url, 'with name', deal_name, 'did not match', url, '... falling back to title');
      deal.type = 'deal';
      items.push(deal);
    }
  }

  // Iterate through cashbacks
  for (let i = 0; i < cashbacks.length; i++) {
    let cashback = cashbacks[i];
    let cashback_url = cashback.site_url;
    let cashback_name = cashback.site_name.toLowerCase();

    // Simple sub-stringing to match urls with hostname or site title with site name
    // FIXME need to clean this up. Possibly merge with the loop above
    if (url.includes(cashback_url)) {
      cashback.type = 'cashback';
      items.push(cashback);
    } else if (title.indexOf(cashback_name + ' ') === 0 || title.includes(' ' + cashback_name + ' ')) {
      // FIXME this doesn't match the case where the word shows up at the very end of the title
      console.warn(cashback_url, 'with name', cashback_name, 'did not match', url, '... falling back to title');
      cashback.type = 'cashback';
      items.push(cashback);
    }
  }

  return items;
}

/**
 * Loads a json file into memory. Returns the object.
 * Can pass in a path to a local file or a URL to a remote file.
 */
function fetchJSON(location, callback) {
  let httpRequest = new XMLHttpRequest();

  httpRequest.onreadystatechange = function() {
    if (httpRequest.readyState === XMLHttpRequest.DONE) {

      if (httpRequest.status === 200) {

        try {
          let data = JSON.parse(httpRequest.responseText);
          return callback(null, data);
        } catch (e) {
          return callback(e, null);
        }

      } else {
        let err = 'HTTP Error Code: ' + httpRequest.status;
        return callback(err, null);
      }
    }
  };

  httpRequest.ontimeout = function (e) {
    let err = 'Request timed out after ' + REQUEST_TIMEOUT_SECONDS + ' seconds';
    callback(err, null);
  };

  httpRequest.open('GET', location);
  httpRequest.timeout = REQUEST_TIMEOUT_SECONDS * 1000;
  httpRequest.send();
}

/**
 * Gets the enabled items for a tab.
 * Note this is used across files! Popup.js calls this.
 */
function getEnabledItems(tabId) {
  return enabledItems[tabId];
}
