export function removeLiterals(description, literals, language) {
  let result = description;
  literals.forEach((elem, i) => {
    if (i<literals.length && elem.language === language) {
      var ini = result.indexOf(elem.text);
      result = result.substring(0, ini) + result.substring(ini+elem.text.length, result.length);
    }
  });
  return result;
}

export function removeText(description, text) {
  let ini = description.indexOf(text)
  return (ini !==-1) ? description.substring(0, ini) + description.substring(ini+text.length, description.length) : description
}

export function getStreamingUrl(html, protocol) {
  let url = '';
  let ini = html.indexOf(protocol);
  let fin = html.indexOf('"', ini);
  if (ini !== -1) {
    url = html.substring(ini, fin);
  }
  return url;
}

const isNumeric = /^(\d+)$/;

export function getLeftNumber(data, index) {
  let number;
  let pos = index-1;
  while(pos >= 0) {
    let sub = data.substring(pos,index);
    if (sub.match(isNumeric)) {
      number = sub;
      pos = pos - 1;
    } else {
      pos = -1;
    }
  }
  return Number(number);
}

export function getRightNumber(data, index) {
  let number;
  let pos = index + 2;
  while(pos < data.length) {
    let sub = data.substring(index + 1, pos);
    if (sub.match(isNumeric)) {
      number = sub;
      pos = pos + 1;
    } else {
      pos = data.length;
    }
  }
  return Number(number);
}

function upperCase(str) {
    return str.toUpperCase();
}

export function toTitleCase(str) {
    str.replace('-', ' - ')
    var firstLetterRx = /(^|\s)[a-z]/g;
    return str.replace(firstLetterRx, upperCase);
}
