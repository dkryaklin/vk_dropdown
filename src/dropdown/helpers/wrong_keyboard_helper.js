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

const keyboardMapObj = {};
for (let i = 0; i < keyboardMap.length; i++) {
  const [rusLetter, engLetter] = keyboardMap[i];

  keyboardMapObj[rusLetter] = engLetter;
  keyboardMapObj[engLetter] = rusLetter;
}

const wrongKeyboard = (str) => {
  let result = '';
  for (let i = 0; i < str.length; i++) {
    result += keyboardMapObj[str[i]];
  }
  return result;
};

export default wrongKeyboard;
