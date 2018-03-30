/**
 * TODO
 *
 * @author nareddyt
 */

const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());
const port = process.env.PORT || 5000;

app.get('/', function (req, res) {
    console.log('info', req.originalUrl + ' with payload ' + JSON.stringify(req.body) + ' and headers ' + JSON.stringify(req.headers));
    res.send('Hello World! See this link for more info: https://www.tejunareddy.com/discover-rewards-notifier/');
});

app.get('/ping', function (req, res) {
    res.send('pong');
});

app.listen(port, function () {
    console.warn('Listening on port', port)
});