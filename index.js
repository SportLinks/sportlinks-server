import express from 'express';
import {getShows} from './src/shows';

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

let cachedShows = [];

app.get('/shows', function(req, res) {
  if (req.query.cache !== 'false') {
    res.json(cachedShows);
  } else {
    getShows().then((shows) => {
      cachedShows = shows;
      res.json(shows);
    });
  }
});

app.listen(port);
