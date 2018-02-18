
function fetchDeal() {
  let tabId = chrome.extension.getBackgroundPage().getLatestTabId();
  let enabledTabs = chrome.extension.getBackgroundPage().getEnabledTabs();
  console.info('Popup for tab', tabId);
  console.debug(enabledTabs);

  let deal = enabledTabs[tabId];
  createHtml(deal);
}

function createHtml(deal) {
  let template = Handlebars.templates['deal'];
  document.body.innerHTML = template(deal);
}

window.onload = fetchDeal;