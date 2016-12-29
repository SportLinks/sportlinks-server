import {expect, assert} from 'chai';
import {chai} from 'chai';
import mockery from 'mockery';
import cheerio from 'cheerio';
import fs from 'fs';
import bluebird from 'bluebird';
import {getMainPage, getShows} from '../src/shows1';

describe('parse links 1 web', () => {

  var mockShows;

  before(function (done) {
    mockery.enable({
        warnOnReplace: false,
        warnOnUnregistered: false,
        useCleanCache: true
    });
    mockery.registerMock('request-promise', function (options) {
      let uri = (typeof options == 'object') ? uri = options.uri : uri = options;
      const response = fs.readFileSync(__dirname + '/data/' + 'links1.html', 'utf8');

      if (uri === 'http://links1.fake') {
        return bluebird.resolve(options.transform(response.trim()));
      } else {
        return bluebird.resolve(response.trim());
      }
    });
    mockShows = require('../src/shows1');
    done();
  });

  it('get mock main page', () => {
    return mockShows.getMainPage()
      .then(($) => {
        expect($.html().indexOf("LINKS1") !== -1).to.be.true;
      });
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
