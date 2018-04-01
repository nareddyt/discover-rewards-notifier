/**
 * TODO
 *
 * @author nareddyt
 */

const DEALS_JSON_FILE = '../data/deal/data.json';
const CASHBACKS_JSON_FILE = '../data/cashback/data.json';

const deals_data = require(DEALS_JSON_FILE);
const cashback_data = require(CASHBACKS_JSON_FILE);

const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const port = process.env.PORT || 5000;

app.use(bodyParser.json());

app.get('/', function (req, res) {
  console.log('info', req.originalUrl + ' with payload ' + JSON.stringify(req.body) + ' and headers ' + JSON.stringify(req.headers));
  res.send('Hello World! See this link for more info: https://www.tejunareddy.com/discover-rewards-notifier/');
});

app.get('/ping', function (req, res) {
  res.send('pong');
});

app.get('/deals', function (req, res) {
  res.json(deals_data);
});

app.get('/cashbacks', function (req, res) {
  res.json(cashback_data);
});

app.listen(port, function () {
  console.warn('Listening on port', port)
});