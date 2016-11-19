export default function removeLiterals(description, literals, language) {
  var result = description;
  literals.forEach((elem, i) => {
    if (i<literals.length && elem.language === language) {
      var ini = result.indexOf(elem.text);
      result = result.substring(0, ini) + result.substring(ini+elem.text.length, result.length);
    }
  });
  return result;
}
