/**
 * This script is used to transform Deals and Cashback data from HTML into JSON.
 * This makes it easier for the actual extension to use and render the data.
 *
 * Additionally, this script attaches a URL to each deal and cashback.
 * This makes it easy for the extension to determine which sites qualify for a deal / cashback!
 *
 * The HTMLs from Discover's website are located in the `../data` folder.
 * The processed JSONs (cashbacks.json and deals.json) are also located there.
 * Files labelled *single_schema.json` in that directory explain the json fields.
 *
 * NOTE this is a ES6 node.js script.
 * NOTE you must install the devDependencies from `../package.json`.
 * NOTE this script is not used by the extension in any way. Instead, developers run this script
 *      to transform the data. The extension only uses the transformed data!
 *
 * @author Tejasvi Nareddy
 */

const DEAL_URL = "https://card.discover.com/cardmembersvcs/deals/app/home";
const DEAL_INPUT_FILE = '../data/deal/raw-02-13-2018.html';
const DEAL_OUTPUT_FILE = '../data/deal/data.json';
const CASHBACK_INPUT_FOLDER = '../data/cashback/raw-02-18-2018/';
const CASHBACK_OUTPUT_FILE = '../data/cashback/data.json';

let argv = require('yargs')
  .alias('c', 'cashback')
  .alias('d', 'deal')
  .usage('Usage: $0 <--cashback> or <--deal>')
  .argv;

let fs = require('fs');
let decode = require('unescape');
let jsonfile = require('jsonfile');
const { URL } = require('url');
let cheerio = require('cheerio');
let google = require('google');
google.resultsPerPage = 10;

// Holds processed data
let deals = [];
let cashbacks = [];

if (argv.deal) {
  parseDeals();
} else if (argv.cashback) {
  parseCashbacks();
} else {
  console.error('Unexpected args', argv);
  process.exit(1);
}

function parseCashbacks() {
// Read cashback HTMLs from folder
  fs.readdirSync(CASHBACK_INPUT_FOLDER).forEach(file => {
    console.log('Found cashback file', file);

    let html = fs.readFileSync(CASHBACK_INPUT_FOLDER + file);
    let $ = cheerio.load(html, {
      ignoreWhitespace: true,
    });

    let items = $('div[class=items]');

    let rows = items.find('div[class=item-row]');
    rows.each(function (index, row) {
      let items = $(row).find('div[class=rfy-item]');
      parseItems(items);
    });
    rows.each(function (index, row) {
      let items = $(row).find('div[class="rfy-item specialBackground"]');
      parseItems(items);
    });

    function parseItems(items) {
      items.each(function (index, item) {
        let cashback = {
          site_url: null,
          offers: []
        };

        let linkTag = $('a[class=brandImg]', item);
        cashback.cashback_url = 'https://card.discover.com' + linkTag.attr('href');

        let imgTag = $('img[class=item-logo-img]', item);
        cashback.img_src_url = 'https://card.discover.com' + imgTag.attr('src');
        cashback.site_name = imgTag.attr('title');

        let offerTags = $(item).find('div[class="pill giftItem"]');
        offerTags.each(function (index, offer) {
          let offerTag = $('a', offer);
          let offerUrl = new URL('https://card.discover.com' + offerTag.attr('href'));

          let pointsNeeded = offerUrl.searchParams.get('modeAmt');
          let reward = offerUrl.searchParams.get('disbAmt');
          cashback.offers.push('$' + pointsNeeded + ' gets you $' + reward);
        });

        cashbacks.push(cashback);
      });
    }
  });

  // We now have all the cashbacks, need to google for host names
  let index = 0;
  googleSearch(cashbacks[index].site_name, onGoogleCashback);

  function onGoogleCashback(url) {

    // Store the site url
    cashbacks[index].site_url = url;
    index++;

    if (index === cashbacks.length) {
      // We have finished googling, save all cashbacks!
      saveCashbacksData();
      return;
    }

    // Keep googling
    googleSearch(cashbacks[index].site_name, onGoogleCashback);
  }
}


function parseDeals() {
// Read deals HTML as an array of lines
  let deals_html_lines = fs.readFileSync(DEAL_INPUT_FILE).toString().split("\n");
  console.log('Found deal file', DEAL_INPUT_FILE);

// Deals: HTML -> JSON
  for (let i = 0; i < deals_html_lines.length; i++) {
    let xml_line = deals_html_lines[i];

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

  // We now have all the deals, need to google for the hostnames
  let index = 0;
  googleSearch(deals[index].site_name, onGoogleDeal);

  function onGoogleDeal (url) {

    // Store the site url
    deals[index].site_url = url;
    index++;

    if (index === deals.length) {
      // We have finished googling, save all deals!
      saveDealsData();
      return;
    }

    // Keep googling
    googleSearch(deals[index].site_name, onGoogleDeal);
  }

}

function googleSearch(input, callback) {
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

    for (let i = 0; true; i++) {
      let link = res.links[i].href;

      if (link) {
        // Only keep hostname
        const siteUrl = new URL(link);
        const hostname = siteUrl.hostname;
        console.log('Found hostname', hostname);
        callback(hostname);
        return;
      }

      console.warn('next link...');
    }

  });
}

// Deals: Write to json
function saveDealsData() {
  jsonfile.writeFile(DEAL_OUTPUT_FILE, deals, {spaces: 2}, function (err) {
    if (err) {
      console.error(err);
    }
  })
}

// Cashbacks: Write to json
function saveCashbacksData() {
  jsonfile.writeFile(CASHBACK_OUTPUT_FILE, cashbacks, {spaces: 2}, function (err) {
    if (err) {
      console.error(err);
    }
  })
}