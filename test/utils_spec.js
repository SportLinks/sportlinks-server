import {expect, assert} from 'chai';
import {chai} from 'chai';
import removeLiterals from '../src/utils';

describe('utils', () => {

  it('remove literals', () => {
    const description = 'FranciaFrance - SueciaSweden';
    const literals = [
      { text: 'Francia', language: 'es' },
      { text: 'France', language: 'en' },
      { text: 'Suecia', language: 'es' },
      { text: 'Sweden', language: 'en' }
    ];
    expect(removeLiterals(description, literals, 'en') === 'Francia - Suecia').to.be.true;
    expect(removeLiterals(description, literals, 'es') === 'France - Sweden').to.be.true;
  });

});
