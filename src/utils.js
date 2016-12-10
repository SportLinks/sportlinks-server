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
