// This is a node.js script!

let fs = require('fs');
let xml_lines = fs.readFileSync('../data/deals_02-13-2018.html').toString().split("\n");

const DEAL_URL = "https://card.discover.com/cardmembersvcs/deals/app/home";

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

  console.log(deal);
}