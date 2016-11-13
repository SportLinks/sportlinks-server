import {getShows} from './links';
import rp from 'request-promise';

function getSopcastUrl(url) {
  return new Promise((fullfill, reject) => {
    var options = {
      uri: url,
      timeout: 10000
    };
    rp(options)
      .then((html) => {
        var ini = html.indexOf('sop://');
        var fin = html.indexOf('"', ini);
        var urlSopcast = html.substring(ini, fin);
        fullfill({'url': url, 'urlSopcast': urlSopcast});
      })
      .catch((error) => {
        console.log(error);
        fullfill({'url': url, 'urlSopcast': ''})
      })
  });
}

export function getShowsSopcast() {
  return getShows().then((shows) => {
    var showsSopCast = [];
    var promises = [];
    shows.forEach((show, index) => {
      var streamingsSopCast = [];
      show.streamings.forEach((streaming, index) => {
        if (streaming.type.indexOf("Sopcast") !== -1) {
          promises.push(getSopcastUrl(streaming.url));
          streamingsSopCast.push(streaming);
        }
      });
      if (streamingsSopCast.length > 0) {
        show.streamings = streamingsSopCast;
        showsSopCast.push(show);
      }
    });
    return Promise.all(promises).then((values) => {
      shows.forEach((show, index, array) => {
        var streamings = [];
        show.streamings.forEach((streaming, index) => {
          values.forEach((value) => {
            if (streaming.url === value.url) {
              streaming.urlSopcast = value.urlSopcast;
            }
          });
          streamings.push(streaming);
        });
        show.streamings = streamings;
        array[index] = show;
      });
      return shows;
    })
  });
}
