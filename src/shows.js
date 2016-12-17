import rp from 'request-promise';
import cheerio from 'cheerio';
import iconv from 'iconv-lite';
import {removeLiterals, removeText} from './utils';
import addStreamUrls from './streams';

iconv.skipDecodeWarning = true;

const types = [
  {
    type: 'Acestream',
    protocol: 'acestream://',
    uriName: 'urlAcestream'
  },
  {
    type: 'Sopcast',
    protocol: 'sop://',
    uriName: 'urlSopcast'
  }
];

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

function getCategory(elem, $) {
  let category = $(elem).text()
  category = removeText(category, $(elem).children('span').first().text())
  category = removeText(category, $(elem).children('b').text())
  category = category.trim()
  if (category.charAt(category.length-1) === ':') {
    category = category.substring(0, category.length-1)
  }
  let literals = []
  let spans = $(elem).children('span')
  if (spans !== undefined) {
    spans.each((i, elem) => {
      let text = $(elem).text();
      let language = 'es';
      if (text !== undefined && text !== '' && $(elem).attr('class') !== 't') {
        if ($(elem).attr('class') === 'en') {
          language = 'en';
        }
        literals.push({text: text, language: language});
      }
    })
  }
  if (literals.length > 0) {
    category = removeLiterals(category, literals, 'en');
  }
  return category;
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

export function getShows() {
  let shows = [];
  return getMainPage().then(($) => {
    const sizeShows = $('.menutitle').length;
    $('.menutitle').each((i, elem) => {
      if (i<sizeShows-1) {
        var show = {};
        show.startDate = $(elem).children('meta').attr('content');
        show.category = getCategory(elem, $);
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

    return addStreamUrls(shows, types[0])
      .then((shows) => {
        return addStreamUrls(shows, types[1]);
      });
  });
}

export function filterShows(shows, query) {
  let filteredShows = [];
  if (query === undefined || query === '') {
    return shows;
  }
  else if (query === 'p2p') {
    shows.forEach((show, index, array) => {
      let filteredStreamings = [];
      show.streamings.forEach((streaming, index, array) => {
        let found = false;
        types.forEach((type, index, array) => {
          if (streaming[type.uriName] !== undefined && streaming[type.uriName] !== '') {
            found = true;
          }
        });
        if (found) {
          filteredStreamings.push(streaming);
        }
      });
      if (filteredStreamings.length > 0) {
        show.streamings = filteredStreamings;
        filteredShows.push(show);
      }
    });
  }
  return filteredShows;
}
