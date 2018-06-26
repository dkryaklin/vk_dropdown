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
    this.emptyListEl.style.display = 'none';

    this.dropdownListEl = document.createElement('div');
    this.dropdownListEl.className = classNames('list');
    this.dropdownListEl.style.display = 'none';

    this.el.appendChild(this.emptyListEl);
    this.el.appendChild(this.dropdownListEl);

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

    const filteredItemsMap = {};
    let filteredItems = items.filter((item) => {
      const str = `${item.first_name} ${item.last_name}`.toLowerCase();
      const toShow = advancedSearch(str, inputValue);

      if (toShow) {
        filteredItemsMap[item.id] = item;
      }

      return toShow;
    });

    if (!(filteredItems.length || newState.inputValue === undefined || !searchOnServer)) {
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
      while (itemEls.length < this.dropdownListEl.childElementCount) {
        this.dropdownListEl.removeChild(this.dropdownListEl.lastChild);
      }

      itemEls.forEach((itemEl, i) => {
        const oldItemEl = this.dropdownListEl.childNodes[i];
        if (oldItemEl && oldItemEl !== itemEl) {
          this.dropdownListEl.replaceChild(itemEl, oldItemEl);
        } else if (!oldItemEl) {
          this.dropdownListEl.appendChild(itemEl);
        }
      });

      this.dropdownListEl.style.display = 'block';
      this.emptyListEl.style.display = 'none';
    } else {
      this.dropdownListEl.style.display = 'none';
      this.emptyListEl.style.display = 'block';
    }
  }
}

export default DropdownListWrapper;
