import clssnms from 'clssnms';
import 'es6-object-assign/auto';
import 'element-closest';
import DropdownList from './components/dropdown_list';
import SelectedList from './components/selected_list';
import InputField from './components/input_field';
import StatePropsHelper from './helpers/state_props_helper';
import ExtraItemsHelper from './helpers/extra_items_helper';
import './css/dropdown.pcss';

const classNames = clssnms('dropdown');

export default class Dropdown {
  constructor(el, props) {
    this.extraItemsHelper = new ExtraItemsHelper();

    this.statePropsHelper = new StatePropsHelper(props);
    this.statePropsHelper.stateSubscribe(['isOpen'], this.update);
    this.statePropsHelper.stateSubscribe(['inputValue'], this.updateExtraItems);

    this.el = el;
    this.render();

    document.addEventListener('click', this.closeDropdown, true);
  }

  closeDropdown = (event) => {
    const dropdownEl = event.target.closest(`.${classNames()}`);
    if (dropdownEl !== this.el && event.target.className !== classNames('expander')) {
      this.statePropsHelper.setState({ isOpen: false });
    }
  }

  render() {
    this.clear();

    const dropdownEl = document.createElement('div');
    dropdownEl.className = classNames();

    const selectEl = document.createElement('div');
    selectEl.className = classNames('selects');
    selectEl.onclick = (event) => {
      this.statePropsHelper.setState({ isOpen: true });
      event.stopPropagation();
    };
    this.selectEl = selectEl;

    const selectConstrolsEl = document.createElement('div');
    selectConstrolsEl.className = classNames('select-controls');

    const selectedListItem = new SelectedList(this.statePropsHelper);
    const inputFieldItem = new InputField(this.statePropsHelper);

    selectConstrolsEl.appendChild(selectedListItem.render());
    selectConstrolsEl.appendChild(inputFieldItem.render());

    const expanderEl = document.createElement('div');
    expanderEl.className = classNames('expander');
    expanderEl.onclick = (event) => {
      const { isOpen } = this.statePropsHelper.getState();
      this.statePropsHelper.setState({ isOpen: !isOpen });
      event.stopPropagation();
    };

    selectEl.appendChild(selectConstrolsEl);
    selectEl.appendChild(expanderEl);

    const dropdownListItem = new DropdownList(this.statePropsHelper);

    dropdownEl.appendChild(selectEl);
    dropdownEl.appendChild(dropdownListItem.render());

    this.el.appendChild(dropdownEl);
  }

  update = ({ isOpen }) => {
    this.selectEl.className = classNames('selects', { open: isOpen });
  }

  updateExtraItems = ({ inputValue }) => {
    const { searchOnServer } = this.statePropsHelper.getProps();
    if (!searchOnServer) {
      return;
    }

    this.extraItemsHelper.getItems(inputValue, (extraItems) => {
      this.statePropsHelper.setState({ extraItems, offset: 0 });
    });
  }

  clear() {
    while (this.el.firstChild) {
      this.el.removeChild(this.el.firstChild);
    }
  }

  getSelectedItems() {
    const { selectedItems } = this.statePropsHelper.getState();
    return selectedItems;
  }

  destroy() {
    this.statePropsHelper.reset();
    this.clear();
    document.removeEventListener('click', this.closeDropdown);
  }
}
