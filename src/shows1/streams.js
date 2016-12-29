import rp from 'request-promise';
import {getStreamingUrl} from '../utils'

function getApplicationUrl(url, protocol) {
  return new Promise((fullfill, reject) => {
    var options = {
      uri: url,
      timeout: 10000
    };
    rp(options)
      .then((html) => {
        let urlApplication = getStreamingUrl(html, protocol)
        fullfill({'url': url, 'urlApplication': urlApplication});
      })
      .catch((error) => {
        fullfill({'url': url, 'urlApplication': ''})
      })
  });
}

export default function addStreamUrls(shows, application) {
  var promises = [];
  shows.forEach((show, index) => {
    show.streamings.forEach((streaming, index) => {
      if (streaming.type.indexOf(application.type) !== -1) {
        promises.push(getApplicationUrl(streaming.url, application.protocol));
      }
    });
  });

  return Promise.all(promises)
    .then((values) => {
      shows.forEach((show, index, array) => {
        show.streamings.forEach((streaming, index, array) => {
          values.forEach((value) => {
            if (streaming.url === value.url) {
              streaming[application.uriName] = value.urlApplication;
            }
          });
        });
      });
      return shows;
    })
    .catch((errors) => {
      console.log(errors);
    });
}
