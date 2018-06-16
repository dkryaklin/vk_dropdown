import clssnms from 'clssnms';
import { DropdownItem, EmptyList } from './stateless_components';
import advancedSearch from '../helpers/search_helper';
import '../css/dropdown_list.pcss';

const classNames = clssnms('dropdown');

const MAX_ITEMS_AMOUNT = 20;

class DropdownListWrapper {
  constructor(statePropsHelper) {
    this.statePropsHelper = statePropsHelper;
    this.statePropsHelper.stateSubscribe(['isOpen', 'items', 'inputValue', 'extraItems'], this.updateList);
    this.itemsCache = {};
  }

  selectItem = (selectedItem) => {
    const { multiselect } = this.statePropsHelper.getProps();
    const { items, selectedItems } = this.statePropsHelper.getState();
    const newState = {};

    if (!multiselect) {
      newState.items = [...items];
      if (selectedItems.length) {
        newState.items.push(selectedItems[0]);
      }

      newState.selectedItems = [selectedItem];
      newState.isOpen = false;
    } else {
      newState.selectedItems = [...selectedItems, selectedItem];
      newState.items = [...items];
      newState.isOpen = true;
    }

    const itemIndex = newState.items.indexOf(selectedItem);
    if (itemIndex !== -1) {
      newState.items.splice(itemIndex, 1);
    }

    this.statePropsHelper.setState(newState);
  }

  onClick = (event) => {
    const { items } = this.statePropsHelper.getState();

    const itemEl = event.target.closest(`.${classNames('item')}`);
    if (itemEl && itemEl.id) {
      const itemId = parseInt(itemEl.id, 10);
      const itemsArr = items.filter(item => itemId === item.id);

      if (itemsArr.length) {
        this.selectItem(itemsArr[0]);
      }
    }

    event.stopPropagation();
  }

  render() {
    const dropdownWrapperEl = document.createElement('div');
    dropdownWrapperEl.className = classNames('list-wrapper', { hidden: true });
    dropdownWrapperEl.onclick = this.onClick;

    this.el = dropdownWrapperEl;
    this.emptyListEl = EmptyList();

    return this.el;
  }

  updateList = () => {
    this.clear();

    const { showPics } = this.statePropsHelper.getProps();
    const {
      isOpen, items, inputValue, extraItems,
    } = this.statePropsHelper.getState();

    this.el.className = classNames('list-wrapper', { hidden: !isOpen });
    if (!isOpen) {
      return;
    }

    let dropdownListEl = this.emptyListEl;

    const filteredItemsMap = {};
    items.forEach((item) => {
      const str = `${item.first_name} ${item.last_name}`.toLowerCase();
      if (advancedSearch(str, inputValue)) {
        filteredItemsMap[item.id] = item;
      }
    });

    if (Object.keys(filteredItemsMap).length < MAX_ITEMS_AMOUNT && extraItems.length) {
      for (let i = 0; i < extraItems.length; i++) {
        const extraItem = extraItems[i];
        filteredItemsMap[extraItem.id] = extraItem;

        if (Object.keys(filteredItemsMap).length >= MAX_ITEMS_AMOUNT) {
          break;
        }
      }
    }

    const filteredItems = Object.keys(filteredItemsMap).map(itemId => filteredItemsMap[itemId]);

    filteredItems.sort((a, b) => a.id - b.id);

    const itemEls = filteredItems.map((item) => {
      let itemEl = this.itemsCache[item.id];
      if (!itemEl) {
        itemEl = DropdownItem(item, showPics);
        this.itemsCache[item.id] = itemEl;
      }

      return itemEl;
    });

    if (itemEls.length) {
      dropdownListEl = document.createElement('div');
      dropdownListEl.className = classNames('list');

      itemEls.forEach(itemEl => dropdownListEl.appendChild(itemEl));
    }

    this.el.appendChild(dropdownListEl);
  }

  clear() {
    while (this.el.firstChild) {
      this.el.removeChild(this.el.firstChild);
    }
  }
}

export default DropdownListWrapper;
