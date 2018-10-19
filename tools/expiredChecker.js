function loadJSON(file) {
  var fs = require('fs');
  return JSON.parse(fs.readFileSync(file, 'utf8'));
}

function checkExpiredAll() {
  let files = ['data/cashback/data.json', 'data/deal/data.json'];
  files.forEach(function(file) {
    checkExpiredFile(file);
  });
}

function checkExpiredFile(file) {
  let json = loadJSON(file);
  let today = new Date();
  json.forEach(function(item) {
    if (item.hasOwnProperty('expiry_date')) {
      let expiry = item.expiry_date;
      if (expiry.indexOf('Expires ') !== -1) {
        let dateArray = expiry.replace('Expires ', '').split('/');
        let expiryDate = new Date(dateArray[2], dateArray[0], dateArray[1]);
        if (expiryDate < today) {
          throw file + ', ' + item.title + ', ' + item.expiry_date;
        }
      }
    }
  });
}

checkExpiredAll();
