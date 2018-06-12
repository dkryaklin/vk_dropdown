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

export const div = ({ id, className, onClick } = {}, childrens) => {
  const divEl = document.createElement('div');

  if (id) {
    divEl.id = id;
  }
  divEl.className = className;
  divEl.onclick = onClick;

  appendChildrens(divEl, childrens);

  return divEl;
};

export const input = (props = {}, childrens, _el = document.createElement('input')) => {
  const {
    className, type, placeholder, onChange, value,
  } = props;

  const inputEl = _el;

  inputEl.className = className;
  inputEl.type = type;
  inputEl.placeholder = placeholder;
  inputEl.value = value;
  inputEl.onkeyup = onChange;

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
