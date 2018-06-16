import clssnms from 'clssnms';
import { SelectedItem } from './stateless_components';

const classNames = clssnms('dropdown');

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

  removeItem(selectedItem) {
    const state = this.statePropsHelper.getState();

    const selectedItems = [...state.selectedItems];
    const items = [...state.items, selectedItem];

    const itemIndex = selectedItems.indexOf(selectedItem);
    if (itemIndex !== -1) {
      selectedItems.splice(itemIndex, 1);
    }

    this.statePropsHelper.setState({ isOpen: false, selectedItems, items });
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
