// This is a node.js script!

let fs = require('fs');
let xml_lines = fs.readFileSync('../data/deals_02-13-2018.html').toString().split("\n");
console.log(xml_lines);