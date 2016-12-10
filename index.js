import express from 'express';
import {getShows, filterShows} from './src/shows';

var app = express();

var port = process.env.PORT || 3001;

// Add headers
app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});

let cachedShows = {};
getShows().then((shows) => {
  cachedShows = {
    date: Date.now(),
    shows: shows
  };
});

app.get('/shows', function(req, res) {
if (req.query.cache !== 'false') {
    res.json(filterShows(cachedShows, req.query.type));
  } else {
    getShows().then((shows) => {
      cachedShows = {
        date: Date.now(),
        shows: shows
      };
      res.json(filterShows(cachedShows, req.query.type));
    });
  }
});

app.listen(port);
