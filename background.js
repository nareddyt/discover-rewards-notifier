// When the extension is installed or upgraded
chrome.runtime.onInstalled.addListener(function() {

  // Replace all rules
  chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {

    // With a new rule
    chrome.declarativeContent.onPageChanged.addRules([

      {
        // That fires for a specific url
        conditions: [
          new chrome.declarativeContent.PageStateMatcher({
            pageUrl: {
              hostEquals: 'ae.com'
            }
          })
        ],
        // And shows the extension's page action.
        actions: [ new chrome.declarativeContent.ShowPageAction() ]
      }

    ]);

  });

});
