import {expect, assert} from 'chai';
import {chai} from 'chai';
import mockery from 'mockery';
import cheerio from 'cheerio';
import fs from 'fs';
import bluebird from 'bluebird';
import {getMainPage, getShows} from '../src/shows-av';

describe('parse http://arenavision.in/schedule web', () => {

  var mockShows;

  before(function (done) {
    mockery.enable({
        warnOnReplace: false,
        warnOnUnregistered: false,
        useCleanCache: true
    });
    mockery.registerMock('request-promise', function (options) {
      let uri = (typeof options == 'object') ? uri = options.uri : uri = options;
      const response = fs.readFileSync(__dirname + '/data/' + 'links-av.html', 'utf8');

      if (uri === 'http://arenavision.in/schedule') {
        return bluebird.resolve(options.transform(response.trim()));
      } else {
        return bluebird.resolve(response.trim());
      }
    });
    mockShows = require('../src/shows-av');
    done();
  });

  it('get main page', () => {
    return getMainPage()
      .then(($) => {
        expect($.html().indexOf("EVENTS GUIDE | ArenaVision | We Love Sports") !== -1).to.be.true;
      });
  });

  it('get mock main page', () => {
    return mockShows.getMainPage()
      .then(($) => {
        expect($.html().indexOf("EVENTS GUIDE | ArenaVision | We Love Sports") !== -1).to.be.true;
      });
  });

  it('get mock list shows', () => {
    return mockShows.getShows().then((data) => {
      let shows = data.shows;
      expect(shows[0].date).to.be.eq('29/12/2016');
      expect(shows[0].hour).to.be.eq('01:00 CET');
      expect(shows[0].sport).to.be.eq('BASKETBALL');
      expect(shows[0].competition).to.be.eq('USA NBA');
      expect(shows[0].event).to.be.eq('WASHINGTON WIZARDS-INDIANA PACERS');
      expect(shows[0].channels).to.be.eq('20 [ENG]');
      expect(shows.length).to.be.eq(84);
    })
  });

  after(function (done) {
    mockery.disable();
    mockery.deregisterAll();
    done();
  });

});
