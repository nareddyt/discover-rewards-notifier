
chrome.extension.onMessage.addListener(function(message, messageSender, sendResponse) {
  // message is the message you sent, probably an object
  // messageSender is an object that contains info about the context that sent the message
  // sendResponse is a function to run when you have a response

  alert(message.deal);
});

function createHtml(deal) {
  let template = Handlebars.templates['deal'];
  document.body.innerHTML = template(deal);
}