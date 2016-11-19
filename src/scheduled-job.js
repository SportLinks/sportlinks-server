import rp from 'request-promise';

const url = 'https://sportlinks.herokuapp.com/shows?cache=false';

rp(url)
  .then(($) => {
    console.log('service update');
  })
  .catch((error) => {
    console.log(error);
  });
