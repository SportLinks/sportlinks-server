import rp from 'request-promise';
import cheerio from 'cheerio';
import iconv from 'iconv-lite';
import {removeLiterals} from './utils';

iconv.skipDecodeWarning = true;

let shows = [];

const options = {
    uri: 'http://www.rinconrojadirecta.com/rd/rd.php',
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

function getDescription(elem, $) {
  var description = elem.text();
  var literals = [];

  var spans = elem.children('span');
  if (spans !== undefined) {
    var sizeElem = spans.length;
    spans.each((i, elem) => {
      if (i<sizeElem) {
        var text = $(elem).text();
        var language = 'es';
        if (text !== undefined && text !== '') {
          if ($(elem).attr('class') === 'en') {
            language = 'en';
          }
          literals.push({text: text, language: language});
        }
      }
    });
  }

  if (literals.length > 0) {
    description = removeLiterals(description, literals, 'en');
  }

  return description;
}

export function getShows(cache) {
  if (cache !== 'false') {
    return new Promise((fullfill, reject) => {
      fullfill(shows);
    });
  }
  return getMainPage().then(($) => {
    const sizeShows = $('.menutitle').length;
    $('.menutitle').each((i, elem) => {
      if (i<sizeShows-1) {
        var show = {};
        show.startDate = $(elem).children('meta').attr('content');
        show.category_es = $(elem).children('span').eq(1).text();
        show.category_en = $(elem).children('span').eq(2).text();
        show.country_es = $(elem).children('span').eq(3).text();
        show.country_en = $(elem).children('span').eq(4).text();
        show.description = getDescription($(elem).children('b').children('span'), $);
        show.streamings = [];

        const sizeStremings = $(elem).next().children().children().children().length;
        $(elem).next().children().children().children().each((i, elem) =>  {
          if (i!==0 && i<sizeStremings-2) {
            var streaming = {};
            streaming.p2p = $(elem).children('td').eq(0).text();
            streaming.name = $(elem).children('td', 'span').eq(1).text();
            streaming.language = $(elem).children('td', 'span').eq(2).text();
            streaming.type = $(elem).children('td', 'span').eq(3).text();
            streaming.kbps = $(elem).children('td').eq(4).text();
            streaming.url = $(elem).children().children().children().attr('href');
            show.streamings.push(streaming);
          }
        });
        shows.push(show);
      }
    });
    return shows;
  });
}
