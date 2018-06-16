import clssnms from 'clssnms';

const classNames = clssnms('dropdown');

export const DropdownItem = (item, showPics) => {
  const itemEl = document.createElement('div');
  itemEl.className = classNames('item');
  itemEl.id = item.id;

  if (showPics) {
    const imgEl = document.createElement('img');
    imgEl.className = classNames('item-img');
    imgEl.src = item.photo_100;

    itemEl.appendChild(imgEl);
  }

  const itemDataEl = document.createElement('div');
  itemDataEl.className = classNames('item-data');

  const titleEl = document.createElement('div');
  titleEl.className = classNames('item-title');
  titleEl.innerText = `${item.first_name} ${item.last_name}`;

  const descEl = document.createElement('div');
  descEl.className = classNames('item-desc');
  descEl.innerText = item.university_name;

  itemDataEl.appendChild(titleEl);
  itemDataEl.appendChild(descEl);

  itemEl.appendChild(itemDataEl);

  return itemEl;
};

export const EmptyList = () => {
  const emptyListEl = document.createElement('div');

  emptyListEl.className = classNames('empty-list');
  emptyListEl.innerText = 'Пустой список :(';

  return emptyListEl;
};

export const SelectedItem = (item, isNew = false) => {
  const label = item && !isNew ? `${item.first_name} ${item.last_name}` : 'Добавить';

  const itemEl = document.createElement('div');
  itemEl.id = item ? item.id : '-1';
  itemEl.className = classNames('selected-item', { new: isNew });

  const itemNameEl = document.createElement('div');
  itemNameEl.className = classNames('selected-name');
  itemNameEl.innerText = label;

  const itemCrossEl = document.createElement('div');
  itemCrossEl.className = classNames('selected-cross', { add: isNew });

  itemEl.appendChild(itemNameEl);
  itemEl.appendChild(itemCrossEl);

  return itemEl;
};
