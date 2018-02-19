
const CASHBACK_DATA_PATH = '../data/cashbacks.json';
const DEAL_DATA_PATH = '../data/deals.json';

let cashbacks = null;
let deals = null;
let enabledCashbacks = {};
let enabledItems = {};

fetchJSONFile(CASHBACK_DATA_PATH, function (data) {
  cashbacks = data;

  fetchJSONFile(DEAL_DATA_PATH, function (data) {
    deals = data;
    chrome.tabs.onRemoved.addListener(onTabRemoved);
    chrome.tabs.onUpdated.addListener(onTabUpdated);
  });

});

function onTabRemoved(tabId, removeInfo) {
  delete enabledItems[tabId];
  console.debug(enabledItems);
}

function onTabUpdated(tabId, changeInfo, tab) {
  if (!cashbacks || !deals) {
    // console.warn(tabId, 'Waiting for discover deals and cashback rewards to load');
    return;
  }

  if (!changeInfo.url) {
    // console.debug(tabId, 'Something other than the URL changed');
    return;
  }

  let new_url = changeInfo.url;
  // console.log(tabId, 'New url:', new_url);

  let items = getItemsForUrl(new_url);
  if (items.length === 0) {
    // console.debug(tabId, new_url, 'has no deals');

    if (!getEnabledItems(tabId)) {
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
    // console.info(tabId, 'Removing', tabId, 'from enabledItems');
    delete enabledItems[tabId];
    console.debug(enabledItems);

    return;
  }

  console.log(tabId, new_url, 'has items', items);

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
 * Returns the deal and cashback objects that match the url
 */
function getItemsForUrl(url) {
  let items = [];

  for (let i = 0; i < deals.length; i++) {
    let deal = deals[i];
    let deal_url = deal.site_url;

    if (url.includes(deal_url)) {
      deal.type = 'deal';
      items.push(deal);
    }
  }

  for (let i = 0; i < cashbacks.length; i++) {
    let cashback = cashbacks[i];
    let cashback_url = cashback.site_url;

    if (url.includes(cashback_url)) {
      cashback.type = 'cashback';
      items.push(cashback);
    }
  }

  return items;
}

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

function getEnabledItems(tabId) {
  return enabledItems[tabId];
}