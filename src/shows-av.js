import rp from 'request-promise';
import cheerio from 'cheerio';
import iconv from 'iconv-lite';
import {removeLiterals, removeText} from './utils';
import addStreamUrls from './streams';

iconv.skipDecodeWarning = true;

let shows = [];

const options = {
    uri: 'http://arenavision.in/schedule',
    encoding: null,
    transform: function (body) {
        var bodyWithCorrectEncoding = iconv.decode(body, 'iso-8859-1');
        return cheerio.load(bodyWithCorrectEncoding);
    }
};

export function getMainPage() {
  return new Promise((fullfill, reject) => {
    rp(options)
      .then(($) => {
        fullfill($);
      })
      .catch((error) => {
        console.log(error);
        reject(error);
      })
  });
}

function cleanString(string) {
  return string.replace('\n\t\t', ' ');
}

export function getShows() {
  let shows = [];
  return getMainPage().then(($) => {
    let numberShows = $('table').find('tr').length;
    $('table').find('tr').each((i, elem) => {
      if (i<1 || i>numberShows-4) return;
      let fields = $(elem).children('td');
      let show = {
        date: fields.eq(0).text(),
        hour: fields.eq(1).text(),
        sport: cleanString(fields.eq(2).text()),
        competition: cleanString(fields.eq(3).text()),
        event: cleanString(fields.eq(4).text()),
        channels: fields.eq(5).text(),
      }
      shows.push(show)
    });
    return {
      shows: shows,
    }
  })
}
