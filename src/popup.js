/**
 * This is the extension's popup script. It is responsible for displaying the correct items in the popup.
 * This script run every time the extension icon is clicked (every time the popup is opened).
 */

/**
 * Determine which items to show in the popup for the current tab
 */
function fetchDeal() {

  // Create a query to get the current tab the popup is for
  let query = {
    active: true,
    currentWindow: true
  };

  // Run the query
  chrome.tabs.query(query, function (tabs) {

    // Get the current tab id
    let tab = tabs[0];
    let tabId = tab.id;
    console.info('Popup for tab', tabId);

    // Get the enabled items for this tab.
    // This is all stored in the background page. See background.js
    let enabledItems = chrome.extension.getBackgroundPage().getEnabledItems(tabId);
    console.debug('Popup got', enabledItems);

    // Create the html with these items
    createHtml(enabledItems);
  });
}

/**
 * Creates the html for the items passed in. Then adds it to the DOM.
 */
function createHtml(items) {
  // Fetch handlebar templates for the deal and cashback
  // FIXME we don't need to load this in every time, move it out of this scope
  let dealTemplate = Handlebars.templates['deal'];
  let cashbackTemplate = Handlebars.templates['cashback'];

  // Temp array of html strings
  let htmls = [];

  items.forEach(function (item) {
    let html = "<div>Something went wrong!</div>";

    // Create the correct html based on the item type
    let type = item.type;
    if (type === 'deal') {

      // We need to change the expiry date for deals (a little)
      item.title = item.title.split(",")[0];
      if (item.expiry_date === "Ongoing") {
        item.expiry_date = "No Expiry Date"
      }

      // Create the html for the deal via the handlebars template
      html = dealTemplate(item);

    } else if (type === 'cashback') {
      // Create the html for the cashback reward via the handlebars template
      html = cashbackTemplate(item);

    } else {
      // This should never happen
      console.error('Unsupported type', type);
    }

    // Add the html to our temp array
    htmls.push(html);
  });

  // Add all html objects to the DOM
  let obj = {
    items: htmls
  };
  let mainTemplate = Handlebars.templates['main'];
  document.body.innerHTML += mainTemplate(obj);

}

// Add Handlebars helper to check length of an array
Handlebars.registerHelper('checklength', function (v1, v2, options) {
'use strict';
   if (v1.length>v2) {
     return options.fn(this);
  }
  return options.inverse(this);
});

// Whenever the script starts, run this function
window.onload = fetchDeal;