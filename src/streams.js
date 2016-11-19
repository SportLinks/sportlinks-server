import rp from 'request-promise';

function getApplicationUrl(url, protocol) {
  return new Promise((fullfill, reject) => {
    var options = {
      uri: url,
      timeout: 10000
    };
    rp(options)
      .then((html) => {
        var urlAcestream = '';
        var ini = html.indexOf(protocol);
        var fin = html.indexOf('"', ini);
        if (ini !== -1) {
          var urlApplication = html.substring(ini, fin);
        }
        fullfill({'url': url, 'urlApplication': urlApplication});
      })
      .catch((error) => {
        fullfill({'url': url, 'urlApplication': ''})
      })
  });
}

export default function addStreamUrls(shows, type, protocol, uriAplicationName) {
  var promises = [];
  shows.forEach((show, index) => {
    show.streamings.forEach((streaming, index) => {
      if (streaming.type.indexOf(type) !== -1) {
        promises.push(getApplicationUrl(streaming.url, protocol));
      }
    });
  });

  return Promise.all(promises)
    .then((values) => {
      shows.forEach((show, index, array) => {
        show.streamings.forEach((streaming, index, array) => {
          values.forEach((value) => {
            if (streaming.url === value.url) {
              streaming[uriAplicationName] = value.urlApplication;
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
