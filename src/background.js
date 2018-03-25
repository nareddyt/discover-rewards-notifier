/**
 * This is the extension's background script. It always runs in the background.
 * It is in charge of determining which deals or cashback rewards correspond to the current site the user is browsing.
 * It does this by matching the tab's url to the urls in the data files.
 */

const CASHBACK_DATA_PATH = '../data/cashback/data.json';
const DEAL_DATA_PATH = '../data/deal/data.json';

// Loaded data from the files
let cashbacks = null;
let deals = null;

// Dictionary that keeps track of the currently enabled "items" for each tab
// Example: { 'tab 1': ['deal_1', 'deal_2', 'cashback_1'] }
let enabledItems = {};

// Load the cashback data into memory
fetchJSONFile(CASHBACK_DATA_PATH, function (data) {
  cashbacks = data;

  // Load the deals data into memory
  fetchJSONFile(DEAL_DATA_PATH, function (data) {
    deals = data;

    // All the data is loaded into memory!
    // Add event listeners for the tabs now. These actually do the matching and state changes
    chrome.tabs.onRemoved.addListener(onTabRemoved);
    chrome.tabs.onUpdated.addListener(onTabUpdated);
  });

});

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
  console.debug(tabId, changeInfo, tab);

  if (!cashbacks || !deals) {
    // Should never happen
    console.error(tabId, 'Discover deals or cashback rewards have not loaded properly');
    return;
  }

  // If loading, then the url might not be populated yet.
  // Note this doesn't correspond to the **page** loading. This is the **url** loading.
  if (changeInfo.status !== "loading") {
    return;
  }

  let newUrl = tab.url;
  console.log(tabId, 'New url:', newUrl);

  // Determine which items should be displayed for this url
  // FIXME loading this each time might be inefficient. Could try caching the results
  let items = getItemsForUrl(newUrl);
  if (items.length === 0) {
    // There are no items for this url

    console.debug(tabId, newUrl, 'has no deals');

    if (!getEnabledItems(tabId)) {
      // Page action for tab was already inactive, no need to do anything
      return;
    }

    // Hide page icon and set title
    console.info(tabId, 'Hiding page action');
    chrome.pageAction.hide(tabId);
    chrome.pageAction.setTitle({
      tabId: tabId,
      title: 'No Discover Deals or Cashback Rewards'
    });

    // Remove from enabled
    console.info(tabId, 'Removing', tabId, 'from enabledItems');
    delete enabledItems[tabId];
    console.debug(enabledItems);

    return;
  }
  // else, there are items for this page!
  console.log(tabId, newUrl, 'has items', items);

  // Enable page action and set title
  console.info(tabId, 'Showing page action');
  chrome.pageAction.show(tabId);
  chrome.pageAction.setTitle({
    tabId: tabId,
    title: 'New deal or Cashback reward! Click on icon to view'
  });

  // Add to enabled
  console.info(tabId, 'Adding', tabId, 'to enabledItems');
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
 * Loads a json file into memory. Returns the object
 */
function fetchJSONFile(path, callback) {
  let httpRequest = new XMLHttpRequest();
  httpRequest.onreadystatechange = function() {
    if (httpRequest.readyState === 4) {
      if (httpRequest.status === 200) {
        let data = JSON.parse(httpRequest.responseText);
        if (callback) callback(data);
      }
    }
  };
  httpRequest.open('GET', path);
  httpRequest.send();
}

/**
 * Gets the enabled items for a tab.
 * Note this is used across files! Popup.js calls this.
 */
function getEnabledItems(tabId) {
  return enabledItems[tabId];
}