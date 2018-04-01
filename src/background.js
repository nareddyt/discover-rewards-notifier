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
  fetchJSON(CASHBACK_LOCATION, onCashbackData);

  function onCashbackData(data) {
    cashbacks = data;

    // Call deal data fetcher based on DEV or PROD
    const DEAL_LOCATION = IS_DEV_MODE? DEAL_DATA_PATH_DEV : DEAL_DATA_URL_PROD;
    fetchJSON(DEAL_LOCATION, onDealData);
  }

  function onDealData(data) {
    deals = data;

    // Done fetching and loading the data, call the callback
    console.debug('Fetched and loaded the latest data');
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
}

/**
 * Callback for when a tab is removed. Tied to the chrome event handler.
 */
function onTabRemoved(tabId) {
  // Remove all enabled items for this tab
  // console.debug(tabId, 'removed');
  delete enabledItems[tabId];
  console.debug(enabledItems);
}

/**
 * Callback for when a tab is updated. Tied to the chrome event handler.
 */
function onTabUpdated(tabId, changeInfo, tab) {
  // console.debug(tabId, changeInfo, tab);

  if (!cashbacks || !deals) {
    // Should never happen
    console.error(tabId, 'Discover deals or cashback rewards have not loaded properly');
    return;
  }

  // Only look at the url when tab state first changes to loading
  if (changeInfo.status !== "loading") {
    // console.debug(tabId, 'not doing anything interesting');
    return;
  }

  let newUrl = tab.url;
  // console.debug(tabId, 'New url:', newUrl);

  // Determine which items should be displayed for this url
  // FIXME loading this each time might be inefficient. Could try caching the results
  let items = getItemsForUrl(newUrl);
  if (items.length === 0) {
    // There are no items for this url

    // console.debug(tabId, newUrl, 'has no deals');

    if (!getEnabledItems(tabId)) {
      // Page action for tab was already inactive, no need to do anything
      return;
    }

    // Hide page icon and set title
    // console.debug(tabId, 'Hiding page action');
    chrome.pageAction.hide(tabId);
    chrome.pageAction.setTitle({
      tabId: tabId,
      title: 'No Discover Deals or Cashback Rewards'
    });

    // Remove from enabled
    // console.info(tabId, 'Removing', tabId, 'from enabledItems');
    delete enabledItems[tabId];
    console.debug(enabledItems);

    return;
  }
  // else, there are items for this page!
  console.info(tabId, newUrl, 'has items', items);

  // Enable page action and set title
  // console.info(tabId, 'Showing page action');
  chrome.pageAction.show(tabId);
  chrome.pageAction.setTitle({
    tabId: tabId,
    title: 'New deal or Cashback reward! Click on icon to view'
  });

  // Add to enabled
  // console.info(tabId, 'Adding', tabId, 'to enabledItems');
  enabledItems[tabId] = items;
  console.debug(enabledItems);
}

/**
 * Returns the deal and cashback objects that match the given url.
 */
function getItemsForUrl(url) {
  let items = [];

  // Iterate through deals
  for (let i = 0; i < deals.length; i++) {
    let deal = deals[i];
    let deal_url = deal.site_url;

    // Simple sub-stringing to match urls with hostname
    if (url.includes(deal_url)) {
      deal.type = 'deal';
      items.push(deal);
    }
  }

  // Iterate through cashbacks
  for (let i = 0; i < cashbacks.length; i++) {
    let cashback = cashbacks[i];
    let cashback_url = cashback.site_url;

    // Simple sub-stringing to match urls with hostname
    if (url.includes(cashback_url)) {
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
    if (httpRequest.readyState === 4) {
      if (httpRequest.status === 200) {
        let data = JSON.parse(httpRequest.responseText);
        callback(data);
      }
    }
  };
  httpRequest.open('GET', location);
  httpRequest.send();
}

/**
 * Gets the enabled items for a tab.
 * Note this is used across files! Popup.js calls this.
 */
function getEnabledItems(tabId) {
  return enabledItems[tabId];
}