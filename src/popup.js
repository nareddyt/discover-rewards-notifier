
function fetchDeal() {

  let query = {
    active: true,
    currentWindow: true
  };

  chrome.tabs.query(query, function (tabs) {
    let tab = tabs[0];
    let tabId = tab.id;
    console.info('Popup for tab', tabId);

    let enabledTabs = chrome.extension.getBackgroundPage().getEnabledTabs();
    console.debug('Popup got', enabledTabs);

    let deal = enabledTabs[tabId];
    createHtml(deal);
  });
}

function createHtml(deal) {
  let template = Handlebars.templates['deal'];
  document.body.innerHTML = template(deal);
}

window.onload = fetchDeal;