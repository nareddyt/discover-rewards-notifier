
const LATEST_DATA_PATH = '../data/latest_data.json';
let deals = null;
let enabledTabs = {};

fetchJSONFile(LATEST_DATA_PATH, function (data) {
  deals = data;
  chrome.tabs.onRemoved.addListener(onTabRemoved);
  chrome.tabs.onUpdated.addListener(onTabUpdated);
});

function onTabRemoved(tabId, removeInfo) {
  delete enabledTabs[tabId];
  console.debug(enabledTabs);
}

function onTabUpdated(tabId, changeInfo, tab) {
  if (!deals) {
    // console.warn(tabId, 'Waiting for discover deals to load');
    return;
  }

  if (!changeInfo.url) {
    // console.debug(tabId, 'Something other than the URL changed');
    return;
  }

  let new_url = changeInfo.url;
  // console.log(tabId, 'New url:', new_url);

  let deal = getDealForUrl(new_url);
  if (!deal) {
    // console.debug(tabId, new_url, 'has no deals');

    // If tab is enabled
    // Hide page icon
    // Hide popup (title for now)
    // Remove from enabled
    if (enabledTabs[tabId]) {
      console.info(tabId, 'Hiding page action');
      chrome.pageAction.hide(tabId);

      // console.info(tabId, 'Setting default title');
      chrome.pageAction.setTitle({
        tabId: tabId,
        title: 'No Discover Deal for this page'
      });

      // console.info(tabId, 'Removing', tabId, 'from enabledTabs');
      delete enabledTabs[tabId];
      console.debug(enabledTabs);

      return;
    }

    return;
  }

  console.log(tabId, new_url, 'has deal', deal);

  // Enable page action
  // Set popup (title for now)
  // Add to enabled
  // console.info(tabId, 'Showing page action');
  chrome.pageAction.show(tabId);

  // console.info(tabId, 'Setting title');
  chrome.pageAction.setTitle({
    tabId: tabId,
    title: deal.title
  });

  // console.info(tabId, 'Adding', tabId, 'to enabledTabs');
  enabledTabs[tabId] = deal;
  console.debug(enabledTabs);
}

/**
 * Returns the deal object or null
 */
function getDealForUrl(url) {
  for (let i = 0; i < deals.length; i++) {
    let deal = deals[i];
    let deal_url = deal.site_url;

    if (url.includes(deal_url)) {
      return deal;
    }
  }

  return null;
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
