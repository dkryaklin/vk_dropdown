import clssnms from 'clssnms';
import 'es6-object-assign/auto';
import { div } from './dom_helpers';
import DropdownList from './dropdown_list';
import SelectedList from './selected_list';
import InputField from './input_field';
import './dropdown.scss';

const classNames = clssnms('dropdown');

const DEFAULT_PROPS = {
  multiselect: true,
  autocomplete: true,
  autocompleteCallback: () => {},
  showPics: true,
  items: [],
};

export default class Dropdown {
  constructor(el, props) {
    this.props = Object.assign({}, DEFAULT_PROPS, props);

    this.state = {
      isOpen: false,
      searchValue: '',
      items: this.props.items,
      selectedItems: [],
    };

    this.el = el;
    this.render();
  }

  mount() {
    this.dropdownList = new DropdownList({
      onSelect: (selectedItem) => {
        const selectedItems = [...this.state.selectedItems, selectedItem];
        const items = [...this.state.items];

        const itemIndex = items.indexOf(selectedItem);
        if (itemIndex !== -1) {
          items.splice(itemIndex, 1);
        }

        this.setState({ isOpen: false, selectedItems, items });
      },
    });

    this.selectedList = new SelectedList({
      dropSelected: (selectedItem) => {
        const selectedItems = [...this.state.selectedItems];
        const items = [...this.state.items, selectedItem];

        const itemIndex = selectedItems.indexOf(selectedItem);
        if (itemIndex !== -1) {
          selectedItems.splice(itemIndex, 1);
        }

        this.setState({ isOpen: false, selectedItems, items });
      },
    });

    this.inputField = new InputField({
      onChange: (newValue) => {
        this.setState({ searchValue: newValue });
      },
    });

    document.addEventListener('click', (event) => {
      if (!this.el.contains(event.target)) {
        this.setState({ isOpen: false });
      }
    });
  }

  setProps(newProps) {
    this.props = Object.assign({}, this.props, newProps);
    this.update();
  }

  setState(newState) {
    this.state = Object.assign({}, this.state, newState);
    this.update();
  }

  render() {
    this.clear();
    const el = div({
      className: classNames(),
    }, [
      div({ className: classNames('selects'), onClick: () => this.setState({ isOpen: true }) }, [
        div({ className: classNames('select-controls') }, [
          this.selectedList.render(),
          this.inputField.render(),
        ]),
        div({ className: classNames('expander'), onClick: (event) => {
          this.setState({ isOpen: !this.state.isOpen });
          event.stopPropagation();
        } }),
      ]),
      this.dropdownList.render(),
    ]);

    this.el.appendChild(el);
  }

  update() {
    this.inputField.setProps({
      isOpen: this.state.isOpen,
      selectedItems: this.state.selectedItems,
    });

    this.selectedList.setProps({
      selectedItems: this.state.selectedItems,
      isOpen: this.state.isOpen,
    });

    this.dropdownList.setProps({ isOpen: this.state.isOpen, items: this.state.items });
  }

  clear() {
    while (this.el.firstChild) {
      this.el.removeChild(this.el.firstChild);
    }
  }

  unmount() {
    document.removeEventListener('click', )
  }
}
