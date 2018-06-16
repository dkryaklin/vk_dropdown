import clssnms from 'clssnms';
import { DropdownItem, EmptyList } from './stateless_components';
import advancedSearch from '../helpers/search_helper';
import '../css/dropdown_list.pcss';

const classNames = clssnms('dropdown');

const MAX_ITEMS_AMOUNT = 20;
const SORT_FUNCTION = (a, b) => a.id - b.id;

class DropdownListWrapper {
  constructor(statePropsHelper) {
    this.statePropsHelper = statePropsHelper;
    this.statePropsHelper.stateSubscribe(['isOpen', 'items', 'extraItems'], this.updateList);
    this.itemsCache = {};
  }

  selectItem = (selectedItem) => {
    const { multiselect } = this.statePropsHelper.getProps();
    const { selectedItems } = this.statePropsHelper.getState();
    const newState = {};

    if (!multiselect) {
      newState.selectedItems = [selectedItem];
      newState.isOpen = false;
    } else {
      newState.selectedItems = [...selectedItems, selectedItem];
      newState.isOpen = true;
    }

    this.statePropsHelper.setState(newState);
  }

  onClick = (event) => {
    const { items, extraItems } = this.statePropsHelper.getState();
    const allItems = [...items, ...extraItems];

    const itemEl = event.target.closest(`.${classNames('item')}`);
    if (itemEl && itemEl.id) {
      const itemId = parseInt(itemEl.id, 10);
      const itemsArr = allItems.filter(item => itemId === item.id);

      if (itemsArr.length) {
        this.selectItem(itemsArr[0]);
      }
    }

    event.stopPropagation();
  }

  render() {
    const { emptyListLabel } = this.statePropsHelper.getProps();

    const dropdownWrapperEl = document.createElement('div');
    dropdownWrapperEl.className = classNames('list-wrapper', { hidden: true });
    dropdownWrapperEl.onclick = this.onClick;

    this.el = dropdownWrapperEl;
    this.emptyListEl = EmptyList(emptyListLabel);

    return this.el;
  }

  updateList = (newState) => {
    const { showPics, searchOnServer } = this.statePropsHelper.getProps();
    const {
      isOpen, items, inputValue, extraItems, selectedItems,
    } = this.statePropsHelper.getState();

    this.el.className = classNames('list-wrapper', { hidden: !isOpen });
    if (!isOpen) {
      return;
    }

    let dropdownListEl = this.emptyListEl;

    const filteredItemsMap = {};
    let filteredItems = items.filter((item) => {
      const str = `${item.first_name} ${item.last_name}`.toLowerCase();
      const toShow = advancedSearch(str, inputValue);

      if (toShow) {
        filteredItemsMap[item.id] = item;
      }

      return toShow;
    });

    if (filteredItems.length || newState.inputValue === undefined || !searchOnServer) {
      this.clear();
    } else {
      return;
    }

    filteredItems.sort(SORT_FUNCTION);

    if (filteredItems.length < MAX_ITEMS_AMOUNT && extraItems.length) {
      extraItems.sort(SORT_FUNCTION);

      for (let i = 0; i < extraItems.length; i++) {
        const extraItem = extraItems[i];

        if (!filteredItemsMap[extraItem.id]) {
          filteredItems.push(extraItem);
        }

        if (filteredItems.length >= MAX_ITEMS_AMOUNT) {
          break;
        }
      }
    }

    const selectedItemsMap = {};
    selectedItems.forEach((item) => {
      selectedItemsMap[item.id] = item;
    });

    filteredItems = filteredItems.filter(item => !selectedItemsMap[item.id]);

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
