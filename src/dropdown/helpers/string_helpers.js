import translitRusEng from 'translit-rus-eng';

const keyboardMap = [
  ['а', 'f'],
  ['б', ','],
  ['в', 'd'],
  ['г', 'u'],
  ['д', 'l'],
  ['е', 't'],
  ['ж', ';'],
  ['з', 'p'],
  ['и', 'b'],
  ['й', 'q'],
  ['к', 'r'],
  ['л', 'k'],
  ['м', 'v'],
  ['н', 'y'],
  ['о', 'j'],
  ['п', 'g'],
  ['р', 'h'],
  ['с', 'c'],
  ['т', 'n'],
  ['у', 'e'],
  ['ф', 'a'],
  ['х', '['],
  ['ц', 'w'],
  ['ч', 'x'],
  ['ш', 'i'],
  ['щ', 'o'],
  ['ъ', ']'],
  ['ы', 's'],
  ['ь', 'm'],
  ['э', "'"],
  ['ю', '.'],
  ['я', 'z'],
  [' ', ' '],
];

const keyboardMapObj = keyboardMap.reduce((obj, item) => {
  obj[item[0]] = item[1];
  obj[item[1]] = item[0];
  return obj;
}, {});

const wrongKeyboard1 = (str) => {
  let result = '';
  for (let i = 0; i < str.length; i++) {
    result += keyboardMapObj[str[i]];
  }
  return result;
};

export const translit = (str) => {
  let result = translitRusEng(str);
  if (str === result) {
    result = translitRusEng(str, 'engToRus');
  }
  return result;
};

export const filterItem = (item, searchValue) => {
  if (!searchValue) {
    return true;
  }

  const search = `${item.first_name} ${item.last_name}`.replace(/ë/g, 'e').toLowerCase();
  searchValue = searchValue.replace(/ë/g, 'e').toLowerCase();

  if (search.indexOf(searchValue) !== -1) {
    return true;
  }
  console.log(search);

  const wrongKeyboard = wrongKeyboard1(search);
  if (wrongKeyboard.indexOf(searchValue) !== -1) {
    return true;
  }
  console.log(wrongKeyboard);

  const translitStr = translit(search);
  if (translitStr.indexOf(searchValue) !== -1) {
    return true;
  }
  console.log(translitStr);

  const translitWrongKey = wrongKeyboard1(translitStr);
  if (translitWrongKey.indexOf(searchValue) !== -1) {
    return true;
  }
  console.log(translitWrongKey);

  return false;
};
