const appendChildrens = (el, childrens) => {
  if (childrens && childrens.length) {
    childrens.forEach((childEl) => {
      if (typeof childEl === 'string') {
        el.appendChild(document.createTextNode(childEl));
      } else if (childEl) {
        el.appendChild(childEl);
      }
    });
  }
};

export const div = ({
  id, className = '', onClick, text = '',
} = {}, childrens) => {
  const divEl = document.createElement('div');

  if (id) {
    divEl.id = id;
  }
  divEl.className = className;
  divEl.onclick = onClick;
  divEl.textContent = text;

  appendChildrens(divEl, childrens);

  return divEl;
};

export const input = (props = {}, childrens) => {
  const {
    className, type, placeholder, onKeyUp, value, disabled,
  } = props;

  const inputEl = document.createElement('input');

  inputEl.className = className;
  inputEl.type = type;
  inputEl.placeholder = placeholder;
  inputEl.value = value;
  inputEl.onkeyup = onKeyUp;
  if (disabled !== undefined) {
    inputEl.disabled = disabled;
  }

  appendChildrens(inputEl, childrens);

  return inputEl;
};

export const img = ({ className, src } = {}, childrens) => {
  const imgEl = document.createElement('img');

  imgEl.className = className;
  imgEl.src = src;

  appendChildrens(imgEl, childrens);

  return imgEl;
};
