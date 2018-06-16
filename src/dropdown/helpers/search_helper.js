import translitRusEng from 'translit-rus-eng';
import wrongKeyboardHelper from './wrong_keyboard_helper';

const switchTranslitHelper = (str) => {
  let result = translitRusEng(str);
  if (str === result) {
    result = translitRusEng(str, 'engToRus');
  }
  return result;
};

const COMMON_CACHE = {};

const advancedSearch = (str, searchValue) => {
  if (!searchValue) {
    return true;
  }

  if (str.indexOf(searchValue) !== -1) {
    return true;
  }

  if (!COMMON_CACHE[str]) {
    COMMON_CACHE[str] = [];
  }

  for (let i = 0; i < 3; i++) {
    if (i > 0 && searchValue.length < 2) {
      return false;
    }

    let pattern = COMMON_CACHE[str][i];
    if (!pattern) {
      if (i === 0) {
        pattern = switchTranslitHelper(str);
      } else if (i === 1) {
        pattern = wrongKeyboardHelper(str);
      } else {
        pattern = wrongKeyboardHelper(COMMON_CACHE[str][0]);
      }
      COMMON_CACHE[str][i] = pattern;
    }

    if (pattern.indexOf(searchValue) !== -1) {
      return true;
    }
  }

  return false;
};

export default advancedSearch;
