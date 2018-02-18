
function createHtml() {
  let template = Handlebars.templates['deal'];
  let deal = {
    title: 'Teju Test Deal'
  };
  let html = template(deal);
  document.body.innerHTML = html;
}

window.onload = createHtml;