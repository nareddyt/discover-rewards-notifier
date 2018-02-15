// This is a node.js script!

let fs = require('fs');
let xml_lines = fs.readFileSync('../data/deals_02-13-2018.html').toString().split("\n");
let google = require('google');

const DEAL_URL = "https://card.discover.com/cardmembersvcs/deals/app/home";
google.resultsPerPage = 25;

let deals = [];

for (let i = 0; i < xml_lines.length; i++) {
  let xml_line = xml_lines[i];

  let deal = {
    title: xml_line.match("\"sr-only\"> (.*)<\\/span>")[1],
    site_name: xml_line.match("<\\/b> (.*)<\\/h3>")[1],
    hostname: null,
    deal_url: DEAL_URL + xml_line.match("#\\/deal\\/\\d*")[0],
    img_src_url: xml_line.match("(https:\\/\\/www.discovercard.com\\/extras.*)\" alt")[1],
    expiry_date: xml_line.match("class=\"date\">(.*)<\\/div>")[1]
  };

  deals.push(deal);
}

let index = 0;
googleSearch(deals[index].site_name);

function googleSearch(input) {
  console.log('Googling for', input);
  google(input, function (err, res) {
    if (err) {
      console.error(err);
      return;
    }

    if (res.links.length === 0) {
      console.error('Wrong length for res.links', res.links.length);
      return;
    }

    let keepGoing = true;
    for (let i = 0; keepGoing; i++) {
      let link = res.links[i].href;
      console.log('Found link', link);
      if (link === null) {
        console.warn('next link...');
        i++;
      } else {
        deals[index].hostname = link;
        keepGoing = false;
      }
    }

    index++;
    if (index === deals.length) {
      fixHostNames();
    } else {
      googleSearch(deals[index].site_name);
    }
  });
}

function fixHostNames() {
  console.log(deals);
}