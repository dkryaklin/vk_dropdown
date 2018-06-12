import clssnms from 'clssnms';
import 'es6-object-assign/auto';
import { div, input } from './dom_helpers';
import DropdownList from './dropdown_list';
import SelectedList from './selected_list';
import './dropdown.scss';

const classNames = clssnms('dropdown');

export default class Dropdown {
  constructor(el, props) {
    const defaultProps = {
      multiselect: true,
      autocomplete: true,
      autocompleteCallback: () => {},
      showPics: true,
      items: [],
    };

    this.props = Object.assign({}, defaultProps, props);

    this.state = {
      isOpen: false,
      searchValue: '',
      items: this.props.items,
      selectedItems: [],
    };

    this.el = el;

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

    this.clear();
    this.render();
  }

  setProps(newProps) {
    this.props = Object.assign({}, this.props, newProps);
    this.rerender();
  }

  setState(newState) {
    this.state = Object.assign({}, this.state, newState);
    this.rerender();
  }

  render() {
    this.inputAutocompleteEl = this.inputAutocomplete();

    const el = div({
      className: classNames(),
    }, [
      div({ className: classNames('selects'), onClick: () => this.setState({ isOpen: true }) }, [
        div({ className: classNames('select-controls') }, [
          this.selectedList.render(),
          this.inputAutocompleteEl,
        ]),
        div({ className: classNames('expander') }),
      ]),
      this.dropdownList.render(),
    ]);

    this.el.appendChild(el);
  }

  rerender() {
    this.inputAutocompleteEl = this.inputAutocomplete(this.inputAutocompleteEl);
    this.selectedList.setProps({
      selectedItems: this.state.selectedItems,
      isOpen: this.state.isOpen,
    });
    this.dropdownList.setProps({ isOpen: this.state.isOpen, items: this.state.items });
  }

  inputAutocomplete(inputEl) {
    const props = {
      className: classNames('input'),
      type: 'text',
      placeholder: 'Введите имя друга или email',
      value: this.state.searchValue,
      onChange: (event) => {
        this.setState({ searchValue: event.target.value });
      },
    };

    return input(props, [], inputEl);
  }

  clear() {
    while (this.el.firstChild) {
      this.el.removeChild(this.el.firstChild);
    }
  }
}
