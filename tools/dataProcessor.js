/**
 * This script is used to transform Deals and Cashback data from HTML into JSON.
 * This makes it easier for the actual extension to use and render the data.
 *
 * Additionally, this script attaches a URL (the website's hostname) to each deal and cashback.
 * This makes it easy for the extension to determine which sites qualify for a deal / cashback.
 *
 * The HTMLs from Discover's website are located in the `../data` folder.
 * The processed JSONs (cashbacks.json and deals.json) are also located there.
 * Files labelled *single_schema.json` in that directory explain the json fields.
 *
 * See `../data/README.md` and `../tools/README.md` for more info.
 *
 * NOTE: this is a ES6 node.js script.
 * NOTE: you must install the devDependencies from `../package.json`.
 * NOTE: this script is not used by the extension in any way. Instead, developers run this script
 *      to transform the data. The extension only uses the transformed data!
 *
 * @author Tejasvi Nareddy
 */

const DEAL_URL = "https://card.discover.com/cardmembersvcs/deals/app/home";
const DEAL_INPUT_FILE = 'data/deal/raw.html';
const DEAL_OUTPUT_FILE = 'data/deal/data.json';     // For developer use
const DEAL_OUTPUT_FILE_PROD = 'docs/deals.json';    // Served via the product website for end-users
const CASHBACK_INPUT_FOLDER = 'data/cashback/raw/';
const CASHBACK_INPUT_FILE = 'data/cashback/fixedInputData.json'; // Contains fixed cashback offers (e.g. Amazon offer)
const CASHBACK_OUTPUT_FILE = 'data/cashback/data.json';     // For developer use
const CASHBACK_OUTPUT_FILE_PROD = 'docs/cashbacks.json';    // Served via the product website for end-users

// CLI tooling with yargs. Note that using `npm run updateDeal` and `npm run updateCashback` uses this,
let argv = require('yargs')
  .alias('c', 'cashback')
  .alias('d', 'deal')
  .usage('Usage: $0 <--cashback> or <--deal>')
  .argv;

// Other dependencies
let fs = require('fs');
let decode = require('unescape');
let jsonfile = require('jsonfile');
const { URL } = require('url');
let cheerio = require('cheerio');
let google = require('google');
google.resultsPerPage = 10;

// Holds the final processed data
let deals = [];
let cashbacks = [];

// Decide which items to update
if (argv.deal) {
  parseDeals();
} else if (argv.cashback) {
  parseCashbacks();
} else {
  console.error('Unexpected args', argv);
  process.exit(1);
}

/**
 * Cashback offers.
 * Converts a folder of raw html files into a single json file.
 */
function parseCashbacks() {

  // First, load any predefined fixed cashback offers (e.g. Amazon cashback)
  let fixedCashbackData = fs.readFileSync(CASHBACK_INPUT_FILE, 'utf8');
  console.log('Found fixed cashback offers file',CASHBACK_INPUT_FILE);

  for(let offer of JSON.parse(fixedCashbackData)) {
    cashbacks.push(offer);
  }

  // Find all raw HTMLs from folder
  fs.readdirSync(CASHBACK_INPUT_FOLDER).forEach(file => {
    console.log('Found cashback file', file);

    // Read each html file.
    // Use cheerio for our HTML parser
    let html = fs.readFileSync(CASHBACK_INPUT_FOLDER + file);
    let $ = cheerio.load(html, {
      ignoreWhitespace: true,
    });

    let items = $('div[class=items]');

    // Find all "rows" of items in the html.
    let rows = items.find('div[class=item-row]');
    rows.each(function (index, row) {

      // Final all the items in a row.
      // Note that some items may be "special", but we treat them like regular items.
      let items = $(row).find('div[class=rfy-item]');
      let itemsSpecial = $(row).find('div[class="rfy-item specialBackground"]');

      // Parse all the items in the row
      parseItems(items);
      parseItems(itemsSpecial);
    });

    /**
     * Parses a set of items in a row.
     * Each item is converted to a single cashback offer.
     */
    function parseItems(items) {
      // Traverse through all items
      items.each(function (index, item) {

        // Start constructing the cashback reward object for this item
        let cashback = {
          site_url: null,   // Null for now, the `googleSearch` function fills this field in
          offers: []
        };

        // Get all the fields from the html and set them in the object
        let linkTag = $('a[class=brandImg]', item);
        cashback.cashback_url = 'https://card.discover.com' + linkTag.attr('href');

        let imgTag = $('img[class=item-logo-img]', item);
        cashback.img_src_url = 'https://card.discover.com' + imgTag.attr('src');
        cashback.site_name = imgTag.attr('title');

        // Removing unnecessary cashback suffixes
        let suffix_check = ['.com',' - Special',' - Featured','®','™' ]

        for(let i = 0; i < suffix_check.length; i++){
          if (cashback.site_name .indexOf(suffix_check[i]) != -1 && cashback.site_name != 'Hotels.com') {
            cashback.site_name  = cashback.site_name .replace(suffix_check[i],'');
          }
      }

        // Note that the number of offers for a single item varies
        let offerTags = $(item).find('div[class="pill giftItem"]');
        offerTags.each(function (index, offer) {
          let offerTag = $('a', offer);
          let offerUrl = new URL('https://card.discover.com' + offerTag.attr('href'));

          let pointsNeeded = offerUrl.searchParams.get('modeAmt');
          let reward = offerUrl.searchParams.get('disbAmt');
          cashback.offers.push('$' + pointsNeeded + ' gets you $' + reward);
        });

        // Put this cashback item into the main array
        cashbacks.push(cashback);
      });
    }
  });

  // We now have all the cashbacks, need to google for host names
  let index = 0;
  googleSearch(cashbacks[index].site_name, onGoogleCashback);

  // This executes after each google search is done
  function onGoogleCashback(url) {

    // Store the site url
    cashbacks[index].site_url = url;
    index++;

    if (index === cashbacks.length) {
      // We have finished googling, save all cashbacks to a json
      saveCashbacksData();
      return;
    }

    // Keep googling, there's more cashbacks to process
    googleSearch(cashbacks[index].site_name, onGoogleCashback);
  }
}

/**
 * Cashback offers.
 * Converts a single raw html file into a single json file.
 */
function parseDeals() {
  // Read deals HTML as an array of lines
  let deals_html_lines = fs.readFileSync(DEAL_INPUT_FILE).toString().split("\n");
  console.log('Found deal file', DEAL_INPUT_FILE);

  // Every line represents a discover deal.
  // This section of code converts a line to a deal object
  for (let i = 0; i < deals_html_lines.length; i++) {
    let xml_line = deals_html_lines[i];

    // Use some hacky regex patterns to create the deal objects
    let deal = {
      title: decode(xml_line.match("\"sr-only\"> (.*)<\\/span>")[1]),
      site_name: decode(xml_line.match("<\\/b> (.*)<\\/h3>")[1]),
      site_url: null,   // Null for now, the `googleSearch` function fills this field in
      deal_url: DEAL_URL + xml_line.match("#\\/deal\\/\\d*")[0],
      img_src_url: xml_line.match("(https:\\/\\/www.discovercard.com\\/extras.*)\" alt")[1],
      expiry_date: decode(xml_line.match("class=\"date\">(.*)<\\/div>")[1])
    };

    // Removing unnecessary deal suffixes
    let suffix_check = ['.com',' - Special',' - Featured','®','™' ]

    for(let i = 0; i < suffix_check.length; i++){
      if (deal.site_name.indexOf(suffix_check[i]) != -1 && deal.site_name != 'Hotels.com') {
        deal.site_name  = deal.site_name .replace(suffix_check[i],'');
      }
    }

    // Put this deal object into the main array
    deals.push(deal);
  }

  // We now have all the deals, need to google for the host names
  let index = 0;
  googleSearch(deals[index].site_name, onGoogleDeal);

  // This executes after each google search is done
  function onGoogleDeal (url) {

    // Store the site url
    deals[index].site_url = url;
    index++;

    if (index === deals.length) {
      // We have finished googling, save all deals to a json
      saveDealsData();
      return;
    }

    // Keep googling as there's more deals left
    googleSearch(deals[index].site_name, onGoogleDeal);
  }

}

/**
 * Determines a site's main hostname.
 * Does this by Googling for the site's name and just pulling the first result.
 */
function googleSearch(input, callback) {
  console.log('Googling for', input);

  // Google search
  google(input, function (err, res) {
    if (err) {
      console.error(err);
      return;
    }

    if (res.links.length === 0) {
      console.error('Wrong length for res.links', res.links.length);
      return;
    }

    // Iterate through all the links we received from Google
    for (let i = 0; true; i++) {
      let link = res.links[i].href;

      // Found a valid link
      if (link) {
        // Only keep hostname
        const siteUrl = new URL(link);
        const hostname = siteUrl.hostname;
        console.log('Found hostname', hostname);

        if (hostname.indexOf('wikipedia') > -1) {
          console.warn('next link...');
          continue;
        }

        // Call the callback we passed in
        callback(hostname);
        return;
      }

      // In come cases, the first google result has a card or ticker symbol.
      // Ignore those by skipping empty links
      console.warn('next link...');
    }

  });
}

// Deals: Write to json. Note we write the same data to 2 different places
function saveDealsData() {
  jsonfile.writeFile(DEAL_OUTPUT_FILE, deals, {spaces: 2}, function (err) {
    if (err) {
      console.error(err);
      return;
    }
    console.log('Deals written to', DEAL_OUTPUT_FILE);

    jsonfile.writeFile(DEAL_OUTPUT_FILE_PROD, deals, {spaces: 2}, function (err) {
      if (err) {
        console.error(err);
        return;
      }

      console.log('Deals written to', DEAL_OUTPUT_FILE_PROD);
    })
  })
}

// Cashbacks: Write to json. Note we write the same data to 2 different places
function saveCashbacksData() {
  jsonfile.writeFile(CASHBACK_OUTPUT_FILE, cashbacks, {spaces: 2}, function (err) {
    if (err) {
      console.error(err);
      return;
    }
    console.log('Cashbacks written to', CASHBACK_OUTPUT_FILE);

    jsonfile.writeFile(CASHBACK_OUTPUT_FILE_PROD, cashbacks, {spaces: 2}, function (err) {
      if (err) {
        console.error(err);
        return;
      }
      console.log('Cashbacks written to', CASHBACK_OUTPUT_FILE_PROD);
    })
  })
}