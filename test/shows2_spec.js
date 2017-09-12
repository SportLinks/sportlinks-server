import {expect, assert} from 'chai';
import {chai} from 'chai';
import mockery from 'mockery';
import cheerio from 'cheerio';
import fs from 'fs';
import bluebird from 'bluebird';
import {getShows} from '../src/shows2';

describe('parse links2 web', () => {

  var mockShows;

  before(function (done) {
    mockery.enable({
        warnOnReplace: false,
        warnOnUnregistered: false,
        useCleanCache: true
    });
    mockery.registerMock('request-promise', function (options) {
      let uri = (typeof options == 'object') ? uri = options.uri : uri = options;
      const response = fs.readFileSync(__dirname + '/data/' + 'guide.html', 'utf8');
      const responseChannel = fs.readFileSync(__dirname + '/data/' + 'channel.html', 'utf8');
      
      if (uri === 'http://links2.fake/iguide') {
        return bluebird.resolve(options.transform(response.trim()));
      } else {
        return bluebird.resolve(responseChannel.trim());
      }
    });
    mockShows = require('../src/shows2');
    done();
  });

  it('get mock list shows', () => {
    return mockShows.getShows().then((data) => {
      let shows = data.shows;
      expect(shows[0].date).to.be.eq('12/09/2017');
      expect(shows[0].hour).to.be.eq('14:00 CEST');
      expect(shows[0].sport).to.be.eq('SOCCER');
      expect(shows[0].competition).to.be.eq('UEFA YOUTH LEAGUE');
      expect(shows[0].event).to.be.eq('Benfica - Cska Moscow');
      expect(shows[0].channels.length).to.be.eq(2);
      expect(shows.length).to.be.eq(160);
    })
  });

  after(function (done) {
    mockery.disable();
    mockery.deregisterAll();
    done();
  });

});
