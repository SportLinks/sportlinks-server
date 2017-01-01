import {expect, assert} from 'chai';
import {chai} from 'chai';
import {removeLiterals, removeText, getLeftNumber, getRightNumber, toTitleCase} from '../src/utils';

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

  it('remove text', () => {
    const description = 'Hola mundo!'
    expect(removeText(description, 'mundo') === 'Hola !').to.be.true
    expect(removeText(description, 'adios') === 'Hola mundo!').to.be.true
  })

  it('get left number', () => {
    expect(getLeftNumber('30-4 [SPA] 26-27 [ENG]', 2)).to.be.eq(30);
    expect(getLeftNumber('h30-4 [SPA] 26-27 [ENG]', 3)).to.be.eq(30);
    expect(getLeftNumber('3-4 [SPA] 26-27 [ENG]', 1)).to.be.eq(3);
    expect(getLeftNumber('3-4 [SPA] 26-27 [ENG]', 12)).to.be.eq(26);
  })

  it('get rigth number', () => {
    expect(getRightNumber('3-4 [SPA] 26-27 [ENG]', 1)).to.be.eq(4);
    expect(getRightNumber('3-40 [SPA] 26-27 [ENG]', 1)).to.be.eq(40);
    expect(getRightNumber('3-4 [SPA] 26-27 [ENG]', 12)).to.be.eq(27);
    expect(getRightNumber('3-4 [SPA] 26-27h [ENG]', 12)).to.be.eq(27);
  })

  it('does string to title case', () => {
    expect(toTitleCase("help i'm very-sick")).to.be.eq("Help I'm Very - Sick")
  })

});
