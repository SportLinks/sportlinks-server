import {expect, assert} from 'chai';
import {chai} from 'chai';
import mockery from 'mockery';
import cheerio from 'cheerio';
import fs from 'fs';
import bluebird from 'bluebird';
import {getMainPage, getShows} from '../src/shows';

describe('parse http://www.rinconrojadirecta.com web', () => {

  var mockShows;

  before(function (done) {
    mockery.enable({
        warnOnReplace: false,
        warnOnUnregistered: false,
        useCleanCache: true
    });
    mockery.registerMock('request-promise', function (options) {
      let uri = (typeof options == 'object') ? uri = options.uri : uri = options;
      const response = fs.readFileSync(__dirname + '/data/' + 'links-rd.html', 'utf8');

      if (uri === 'http://www.rinconrojadirecta.com/rd/rd.php') {
        return bluebird.resolve(options.transform(response.trim()));
      } else {
        return bluebird.resolve(response.trim());
      }
    });
    mockShows = require('../src/shows');
    done();
  });

  it('get main page', () => {
    return getMainPage()
      .then(($) => {
        expect($.html().indexOf("ROJADIRECTA") !== -1).to.be.true;
      });
  });

  xit('get list shows', (done) => {
    return getShows().then((shows) => {
      expect(shows.length).to.be.at.least(10);
    })
  });

  it('get mock list shows', () => {
    return mockShows.getShows().then((shows) => {
      shows.forEach((show,index, array) => {
      })

      expect(shows[1].startDate).to.be.eq('2016-11-11T20:45');
      expect(shows[1].description).to.be.eq('World Cup Qualification, Simulcast');
      expect(shows[1].streamings.length).to.be.eq(3);
      expect(shows.length).to.be.at.least(10);
    })
  });

  after(function (done) {
    mockery.disable();
    mockery.deregisterAll();
    done();
  });

});
