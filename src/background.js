// When the extension is installed or upgraded
chrome.runtime.onInstalled.addListener(function() {

  chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {

    loadJSON(function(response) {
      // Parse JSON string into object
      let data = JSON.parse(response);

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
  return  new chrome.declarativeContent.PageStateMatcher({
    pageUrl: {
      hostEquals: site_url
    }
  });
}

function loadJSON(callback) {

  let xobj = new XMLHttpRequest();
  xobj.overrideMimeType("application/json");
  xobj.open('GET', '../data/latest_data.json', true);
  xobj.onreadystatechange = function () {
    if (xobj.readyState === 4 && xobj.status === "200") {
      // Required use of an anonymous callback as .open will NOT return a value but simply returns undefined in asynchronous mode
      callback(xobj.responseText);
    }
  };
  xobj.send(null);
}
