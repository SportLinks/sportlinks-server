import express from 'express';
import {getShows, filterShows} from './src/shows';
import {getShows as getShowsAv} from './src/shows-av'

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

function getFiltredShows(shows, type) {
  let result = Object.assign({}, cachedShows);
  result.shows = filterShows(shows.shows, type)
  return result
}

app.get('/shows', function(req, res) {
  if (req.query.cache !== 'false') {
    res.json(getFiltredShows(cachedShows, req.query.type));
  } else {
    getShows().then((shows) => {
      cachedShows = {
        date: Date.now(),
        shows: shows
      };
      res.json(getFiltredShows(cachedShows, req.query.type));
    });
  }
});

app.get('/shows-av', function(req, res) {
  getShowsAv().then((shows) => {
    res.json(shows);
  });
});

app.listen(port);
