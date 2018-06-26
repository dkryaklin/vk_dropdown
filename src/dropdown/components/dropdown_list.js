import clssnms from 'clssnms';
import { DropdownItem, EmptyList } from './stateless_components';
import advancedSearch from '../helpers/search_helper';
import '../css/dropdown_list.pcss';

const classNames = clssnms('dropdown');

const MAX_ITEMS_AMOUNT = 50;
const SORT_FUNCTION = (a, b) => a.id - b.id;

class DropdownListWrapper {
  constructor(statePropsHelper) {
    this.statePropsHelper = statePropsHelper;

    this.statePropsHelper.stateSubscribe(['isOpen', 'items', 'extraItems', 'offset'], this.updateList);
    this.statePropsHelper.stateSubscribe(['isOpen'], this.resetOffset);
    this.statePropsHelper.stateSubscribe(['inputValue'], this.scrollTopTop);

    this.itemsCache = {};
  }

  selectItem = (selectedItem) => {
    const { multiselect } = this.statePropsHelper.getProps();
    const { selectedItems, offset } = this.statePropsHelper.getState();
    const newState = {};

    if (!multiselect) {
      newState.selectedItems = [selectedItem];
      newState.isOpen = false;
    } else {
      newState.selectedItems = [...selectedItems, selectedItem];
      newState.isOpen = true;
    }

    if (this.getItemsAmount(offset) < selectedItems.length + 10) {
      newState.offset = offset + 1;
    }

    this.statePropsHelper.setState(newState);
  }

  scrollTopTop = () => {
    this.el.scrollTop = 0;
  }

  getItemsAmount = offset => (offset * MAX_ITEMS_AMOUNT) + MAX_ITEMS_AMOUNT;

  resetOffset = (state) => {
    if (!state.isOpen) {
      this.statePropsHelper.setState({ offset: 0 });
    } else {
      const { selectedItems } = this.statePropsHelper.getState();
      let offset = 0;

      while (this.getItemsAmount(offset) < selectedItems.length + 10) {
        offset += 1;
      }

      this.statePropsHelper.setState({ offset });
      this.el.scrollTop = 0;
    }
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

  onScroll = (event) => {
    clearTimeout(this.scrollTimeout);
    this.scrollTimeout = setTimeout(() => {
      if (event.target.scrollHeight - event.target.offsetHeight - event.target.scrollTop < 300) {
        const { offset } = this.statePropsHelper.getState();
        this.statePropsHelper.setState({ offset: offset + 1 });
      }
    }, 100);
  }

  render() {
    const { emptyListLabel } = this.statePropsHelper.getProps();

    const dropdownWrapperEl = document.createElement('div');
    dropdownWrapperEl.className = classNames('list-wrapper', { hidden: true });
    dropdownWrapperEl.onclick = this.onClick;
    dropdownWrapperEl.onscroll = this.onScroll;

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
      isOpen, items, inputValue, extraItems, selectedItems, offset,
    } = this.statePropsHelper.getState();

    this.el.className = classNames('list-wrapper', { hidden: !isOpen });
    if (!isOpen) {
      return;
    }

    const itemsAmount = this.getItemsAmount(offset);

    let filteredItemsAmount = 0;
    let filteredItems = items.filter((item) => {
      if (filteredItemsAmount >= itemsAmount) {
        return false;
      }

      const str = `${item.first_name} ${item.last_name}`.toLowerCase();
      const toShow = advancedSearch(str, inputValue);

      if (toShow) {
        filteredItemsAmount += 1;
      }

      return toShow;
    });

    const filteredItemsMap = {};
    filteredItems.forEach((item, i) => {
      filteredItemsMap[item.id] = i;
    });

    if (!(filteredItems.length || newState.inputValue === undefined || !searchOnServer)) {
      return;
    }

    filteredItems.sort(SORT_FUNCTION);

    if (filteredItems.length < itemsAmount && extraItems.length) {
      extraItems.sort(SORT_FUNCTION);

      for (let i = 0; i < extraItems.length; i++) {
        const extraItem = extraItems[i];

        if (!filteredItemsMap[extraItem.id]) {
          filteredItems.push(extraItem);
        } else {
          filteredItems[filteredItemsMap[extraItem.id]] = extraItem;
        }

        if (filteredItems.length >= itemsAmount) {
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

      if (item.domain) {
        itemEl.querySelector(`.${classNames('item-desc')}`).innerText = item.domain;
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
