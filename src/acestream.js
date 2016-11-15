import {getShows} from './links';
import rp from 'request-promise';

function getAcestreamUrl(url) {
  return new Promise((fullfill, reject) => {
    var options = {
      uri: url,
      timeout: 10000
    };
    rp(options)
      .then((html) => {
        var urlAcestream = '';
        var ini = html.indexOf('acestream://');
        var fin = html.indexOf('"', ini);
        if (ini !== -1) {
          var urlAcestream = html.substring(ini, fin);
        }
        fullfill({'url': url, 'urlAcestream': urlAcestream});
      })
      .catch((error) => {
        console.log(error);
        fullfill({'url': url, 'urlAcestream': ''})
      })
  });
}

export function getShowsAcestream() {
  return getShows().then((shows) => {
    var showsAcestream = [];
    var promises = [];
    shows.forEach((show, index) => {
      var streamingsAcestream = [];
      show.streamings.forEach((streaming, index) => {
        if (streaming.type.indexOf("Acestream") !== -1) {
          promises.push(getAcestreamUrl(streaming.url));
          streamingsAcestream.push(streaming);
        }
      });
      if (streamingsAcestream.length > 0) {
        show.streamings = streamingsAcestream;
        showsAcestream.push(show);
      }
    });
    var shows = [];
    return Promise.all(promises)
      .then((values) => {
        console.log('b')
        showsAcestream.forEach((show, index, array) => {
          var streamings = [];
          show.streamings.forEach((streaming, index, array) => {
            values.forEach((value) => {
              if (streaming.url === value.url) {
                streaming.urlAcestream = value.urlAcestream;
              }
            });
            if (streaming.urlAcestream !== '') {
              streamings.push(streaming);
            }
          });
          show.streamings = streamings;
          if (show.streamings.length > 0) {
            shows.push(show);
          }
        });
        return shows;
      })
      .catch((errors) => {
        console.log(errors);
      });
  });
}
