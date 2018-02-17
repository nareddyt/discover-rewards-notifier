
const LATEST_DATA_PATH = '../data/latest_data.json';

// When the extension is installed or upgraded
chrome.runtime.onInstalled.addListener(function() {

  chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {

    fetchJSONFile(LATEST_DATA_PATH, function(data){

       chrome.declarativeContent.onPageChanged.addRules([
        formatDataIntoRule(data)
      ]);

    });

  });

});


function formatDataIntoRule(deals) {
  let rule = {
    conditions: [],
    actions: [
      new chrome.declarativeContent.ShowPageAction()
    ]
  };

  deals.forEach(deal => {
    let condition = makeCondition(deal.site_url);
    rule.conditions.push(condition);
  });

  return rule;
}

function makeCondition(site_url) {
  console.log('condition for', site_url);
  return new chrome.declarativeContent.PageStateMatcher({
    pageUrl: {
      hostEquals: site_url.toLowerCase()
    }
  });
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
