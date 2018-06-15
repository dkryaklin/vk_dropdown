import clssnms from 'clssnms';

const classNames = clssnms('dropdown');

const SelectedItem = (item, isNew = false) => {
  const label = item && !isNew ? 'Добавить' : `${item.first_name} ${item.last_name}`;

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

class SelectedList {
  constructor(statePropsHelper) {
    this.statePropsHelper = statePropsHelper;
    this.statePropsHelper.stateSubscribe(['selectedItems'], this.updateList);
    this.statePropsHelper.stateSubscribe(['isOpen'], this.updateAddButton);
    this.itemsCache = {};
  }

  getItems() {
    const { selectedItems } = this.statePropsHelper.getState();

    return selectedItems.map((selectedItem) => {
      let itemEl = this.itemsCache[selectedItem.id];
      if (!itemEl) {
        itemEl = SelectedItem(selectedItem);
        this.itemsCache[selectedItem.id] = itemEl;
      }

      return itemEl;
    });
  }

  onClick = (event) => {
    const itemEl = event.target.closest(`.${classNames('selected-item')}`);
    if (itemEl && itemEl.id) {
      const itemId = parseInt(itemEl.id, 10);

      if (event.target.className === classNames('selected-cross')) {
        const { selectedItems } = this.statePropsHelper.getState();
        const itemsArr = selectedItems.filter(item => itemId === item.id);

        if (itemsArr.length) {
          this.props.dropSelected(itemsArr[0]);
        }
      } else if (itemId === -1) {
        return;
      }
    } else if (event.target.className === classNames('selected-list')) {
      return;
    }

    event.stopPropagation();
  }

  render() {
    const selectedListEl = document.createElement('div');
    selectedListEl.className = classNames('selected-list');
    selectedListEl.onclick = this.onClick;

    this.el = selectedListEl;

    this.addItemEl = SelectedItem(null, true);

    return this.el;
  }

  updateList() {
    this.clear();
    this.getItems().forEach((item) => {
      this.el.appendChild(item);
    });
    this.updateAddButton();
  }

  updateAddButton() {
    const { isOpen } = this.statePropsHelper.getState();
    const { multiselect } = this.statePropsHelper.getProps();

    if (this.el.childElementCount && !isOpen && multiselect) {
      this.el.appendChild(this.addItemEl);
    } else {
      this.el.removeChild(this.addItemEl);
    }
  }

  clear() {
    while (this.el.firstChild) {
      this.el.removeChild(this.el.firstChild);
    }
  }
}

export default SelectedList;
