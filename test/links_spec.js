import {expect, assert} from 'chai';
import {chai} from 'chai';
import mockery from 'mockery';
import cheerio from 'cheerio';
import fs from 'fs';
import bluebird from 'bluebird';
import {getMainPage, getShows} from '../src/links';

describe('parse http://www.rinconrojadirecta.com web', () => {

  var mockPage;

  before(function (done) {
    mockery.enable({
        warnOnReplace: false,
        warnOnUnregistered: false,
        useCleanCache: true
    });
    mockery.registerMock('request-promise', function (options) {
      if (typeof options == 'object') {
        if (options.uri === 'http://www.rinconrojadirecta.com/rd/rd.php') {
          var response = fs.readFileSync(__dirname + '/data/' + 'links.html', 'utf8');
          return bluebird.resolve(options.transform(response.trim()));
        }
      } else {
        return rp(options);
      }
    });
    mockPage = require('../src/links');
    done();
  });

  it('get main page', () => {
    return getMainPage()
      .then(($) => {
        expect($.html().indexOf("ROJADIRECTA") !== -1).to.be.true;
      });
  });

  it('get list shows', () => {
    return getShows().then((shows) => {
      expect(shows.length).to.be.at.least(10);
    })
  });

  it('get mock list shows', () => {
    return mockPage.getShows().then((shows) => {
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
