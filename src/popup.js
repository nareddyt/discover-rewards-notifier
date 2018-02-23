
function fetchDeal() {

  let query = {
    active: true,
    currentWindow: true
  };

  chrome.tabs.query(query, function (tabs) {
    let tab = tabs[0];
    let tabId = tab.id;
    console.info('Popup for tab', tabId);

    let enabledItems = chrome.extension.getBackgroundPage().getEnabledItems(tabId);
    console.debug('Popup got', enabledItems);

    createHtml(enabledItems);
  });
}

function createHtml(items) {
  let dealTemplate = Handlebars.templates['deal'];
  let cashbackTemplate = Handlebars.templates['cashback'];

  let htmls = [];

  items.forEach(function (item) {
    let type = item.type;

    let html = "<div></div>";

    if (type === 'deal') {
      item.title = item.title.split(",")[0];
      if (item.expiry_date === "Ongoing") {
        item.expiry_date = "No Expiry Date"
      }

      html = dealTemplate(item);
    } else if (type === 'cashback') {
      html = cashbackTemplate(item);
    } else {
      console.error('Unsupported type', type);
    }

    htmls.push(html);
  });

  let obj = {
    items: htmls
  };

  let mainTemplate = Handlebars.templates['main'];
  document.body.innerHTML += mainTemplate(obj);

}

window.onload = fetchDeal;