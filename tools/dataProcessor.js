// This is a ES6 node.js script! Please install dependencies from package.json
// TODO description

const DEAL_URL = "https://card.discover.com/cardmembersvcs/deals/app/home";
const DEAL_INPUT_FILE = '../data/deals_02-13-2018.html';
const DEAL_OUTPUT_FILE = '../data/deals.json';
const CASHBACK_INPUT_FOLDER = '../data/cashbacks_02-18-2018/';
const CASHBACK_OUTPUT_FILE = '../data/cashbacks.json';

let fs = require('fs');
let xml_lines = fs.readFileSync(DEAL_INPUT_FILE).toString().split("\n");
let decode = require('unescape');
let jsonfile = require('jsonfile');
const { URL } = require('url');
let google = require('google');
google.resultsPerPage = 10;

// Holds processed data
let deals = [];
let cashbacks = [];

// Deals: HTML -> JSON
for (let i = 0; i < xml_lines.length; i++) {
  let xml_line = xml_lines[i];

  let deal = {
    title: decode(xml_line.match("\"sr-only\"> (.*)<\\/span>")[1]),
    site_name: decode(xml_line.match("<\\/b> (.*)<\\/h3>")[1]),
    site_url: null,
    deal_url: DEAL_URL + xml_line.match("#\\/deal\\/\\d*")[0],
    img_src_url: xml_line.match("(https:\\/\\/www.discovercard.com\\/extras.*)\" alt")[1],
    expiry_date: decode(xml_line.match("class=\"date\">(.*)<\\/div>")[1])
  };

  deals.push(deal);
}

// Google search hostnames for all deals
let index = 0;
googleSearch(deals[index].site_name);

function googleSearch(input) {
  console.log('Googling for', input);
  setUserAgent();

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
      if (link === null) {
        console.warn('next link...');
        i++;
      } else {
        // Only keep hostname
        const myURL = new URL(link);
        deals[index].site_url = myURL.hostname;
        console.log('Found hostname', myURL.hostname);
        keepGoing = false;
      }
    }

    index++;
    if (index === deals.length) {
      saveData();
    } else {
      googleSearch(deals[index].site_name);
    }
  });
}

// Deals: Write to json
function saveData() {
  jsonfile.writeFile(DEAL_OUTPUT_FILE, deals, {spaces: 2}, function (err) {
    if (err) {
      console.error(err);
    }
  })
}