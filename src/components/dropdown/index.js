import clssnms from 'clssnms';
import 'es6-object-assign/auto';
import { div, input, img } from './dom_helpers';
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
    };

    this.el = el;

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
    this.dropdownListEl = this.dropdownList();

    const el = div({
      className: classNames(),
    }, [
      div({ className: classNames('selects'), onClick: () => this.setState({ isOpen: true }) }, [
        div({ className: classNames('select-controls') }, [
          div({ className: classNames('selected-list') }, [
            // Dropdown.selectedItem({ name: 'имя фамилия 1' }),
            // Dropdown.selectedItem({ name: 'имя фамилия 2' }),
            // Dropdown.selectedItem({ name: 'имя фамилия 3' }),
            // Dropdown.selectedItem({ name: 'имя фамилия 4' }),
            // Dropdown.selectedItem({ name: 'имя фамилия 5' }),
            // Dropdown.selectedItem(null, true),
          ]),
          this.inputAutocompleteEl,
        ]),
        div({ className: classNames('expander') }),
      ]),
      this.dropdownListEl,
    ]);
// пользователи у нас уже есть. Но нет domain. нужно сделать запрос на сервер и по подстроке вернуть пользователей
// найти разницу массивов. Берем все что совпадает и берем тех кто с доменом, но их еще нет в списке.
// сортируем
    this.el.appendChild(el);
  }

  rerender() {
    this.inputAutocompleteEl = this.inputAutocomplete(this.inputAutocompleteEl);
    this.dropdownListEl = this.dropdownList(this.dropdownListEl);
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

  dropdownList(dropdownListEl) {
    let resultEl;
    if (!this.state.isOpen || !this.props.items.length) {
      resultEl = div();
    } else {
      const itemsEl = this.props.items.map(item => Dropdown.dropdownItem({
        name: `${item.first_name || ''} ${item.last_name || ''}`,
        desc: item.university_name || '',
        src: item.photo_100,
      }));

      resultEl = div({ className: classNames('list-wrapper') }, [
        div({ className: classNames('list') }, itemsEl),
      ]);
    }

    if (dropdownListEl) {
      const parentEl = dropdownListEl.parentNode;
      parentEl.replaceChild(resultEl, dropdownListEl);
    }

    return resultEl;
  }

  static selectedItem(item = {}, isNew = false) {
    return div({ className: classNames('selected-item', { new: isNew }) }, [
      div({ className: classNames('selected-name') }, [
        isNew ? 'добавить' : item.name,
      ]),
      div({ className: classNames('selected-cross', { add: isNew }) }),
    ]);
  }

  static dropdownItem(item = {}) {
    return div({ className: classNames('item') }, [
      img({ className: classNames('item-img'), src: item.src }),
      div({ className: classNames('item-data') }, [
        div({ className: classNames('item-title') }, [item.name]),
        div({ className: classNames('item-desc') }, [item.desc]),
      ]),
    ]);
  }

  clear() {
    while (this.el.firstChild) {
      this.el.removeChild(this.el.firstChild);
    }
  }
}
