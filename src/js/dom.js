const appendChild = (el, children) => {
  if (Array.isArray(children)) {
    children.forEach((childEl) => {
      el.appendChild(childEl);
    });
  } else {
    el.appendChild(children);
  }
};

export const div = ({ className }, children) => {
  const divEl = document.createElement('div');
  divEl.className = className;

  appendChild(divEl, children);

  return divEl;
};

export const input = (props, childrens) => {
  console.log();
};
