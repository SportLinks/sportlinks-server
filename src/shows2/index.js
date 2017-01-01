import rp from 'request-promise';
import cheerio from 'cheerio';
import iconv from 'iconv-lite';
import {getStreamingUrl, getLeftNumber, getRightNumber, toTitleCase} from '../utils'

iconv.skipDecodeWarning = true;

const options = {
    uri: (process.env.URL_LINKS2 || 'http://links2.fake') + '/schedule',
    encoding: null,
    transform: function (body) {
        var bodyWithCorrectEncoding = iconv.decode(body, 'iso-8859-1');
        return cheerio.load(bodyWithCorrectEncoding);
    }
};

function getMainPage() {
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
  return string
    .replace('\n\t\t', ' ')
    .replace('\n', ' ');
}

let streamingLinks = [];

function getStremingLinks() {

  if (streamingLinks.length > 0) {
    return Promise.resolve(streamingLinks);
  }

  let promises = []

  for (var i=1; i<=30; i++) {
    let options = {
      uri: process.env.URL_LINKS2,
      timeout: 10000
    };
    options.uri = options.uri + '/av' + i
    let promiseLinkUrl = new Promise((fullfill, reject) => {
        let link = i;
        rp(options)
          .then((html) => {
            let url = getStreamingUrl(html, 'acestream://')
            fullfill({'link': link, 'url': url})
          })
          .catch((error) => {
            console.log(error);
            fullfill({'link': link, 'url': ''});
          });
      });
    promises.push(promiseLinkUrl);
  }

  return Promise.all(promises)
    .then((values) => {
      values.forEach((value) => {
        streamingLinks[value.link-1] = (value)
      });
      return streamingLinks;
    })
    .catch((errors) => {
      console.log(errors);
    });
}
function getChannelsXXX(data, streamingLinks) {
  let channels = [];
  let index = data.indexOf('-');
  while (index !== -1) {
    let ini = getLeftNumber(data, index);
    let fin = getRightNumber(data, index);
    let index2 = data.indexOf('[', index);
    let index3 = data.indexOf(']', index);
    let language = data.substring(index2 + 1, index3);
    for (let i=ini; i<=fin; i++) {
      channels.push({
        link: i,
        url: streamingLinks[i-1],
        language: language,
      })
    }
    index = data.indexOf('-', index + 1);
  }
  return channels;
}

function getChannels(data, streamingLinks) {
  let channels = [];
  let start = 0;
  let index = data.indexOf('[');
  while (index !== -1) {
    let language = data.substring(index + 1, data.indexOf(']', index));
    let ini, fin
    let index2 = data.indexOf(('-'), start)
    if (index2 !== -1) {
      ini = getLeftNumber(data, index2);
      fin = getRightNumber(data, index2);
    } else {
      ini = fin = getLeftNumber(data, index-1)
    }
    for (let i=ini; i<=fin; i++) {
      channels.push({
        link: i,
        url: streamingLinks[i-1].url,
        language: language,
      })
    }
    start = index;
    index = data.indexOf('[', index + 1);
  }
  return channels;
}

export function getShows() {
  return getStremingLinks().then((streamingLinks) => {
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
          event: toTitleCase(cleanString(fields.eq(4).text()).toLowerCase()),
          channels: getChannels(cleanString(fields.eq(5).text()), streamingLinks),
        }
        shows.push(show)
      });
      return {
        shows: shows,
      }
    })
  });
}
