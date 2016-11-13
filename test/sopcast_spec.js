import {expect, assert} from 'chai';
import {chai} from 'chai';
import mockery from 'mockery';
import cheerio from 'cheerio';
import fs from 'fs';
import bluebird from 'bluebird';
import {getMainPage, getShows} from '../src/links';
import {getShowsSopcast} from '../src/sopcast';
import rp from 'request-promise';

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
    mockPage = require('../src/sopcast');
    done();
  });

  it('get list shows Sopcast', () => {
    return getShowsSopcast().then((shows) => {
      expect(shows.length).to.be.at.least(0);
    })
  });

  it('get mock list shows Sopcast', () => {
    return mockPage.getShowsSopcast().then((shows) => {
      console.log(shows.length)
      expect(shows.length).to.be.eq(36);
    })
  });

  after(function (done) {
    mockery.disable();
    mockery.deregisterAll();
    done();
  });

});
