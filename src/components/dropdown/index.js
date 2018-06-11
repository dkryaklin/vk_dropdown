import clssnms from 'clssnms';
import '../../js/dom';
import './dropdown.scss';

const classNames = clssnms('dropdown');

export default class Dropdown {
  constructor(el) {
    this.el = el;
    this.renderContainer();
  }

  renderContainer() {
    div({
      className: classNames(),
    }, [
      input({
        type: 'text',
        placeholder: 'Введите имя друга или email',
        className: classNames('input'),
      }, [

      ]),
      div({}, []),
    ])

    // const dropdownInput = document.createElement('input')
    // dropdownInput.type = 'text'
    // dropdownInput.placeholder = 'Введите имя друга или email'
    // dropdownInput.className = classNames('input')

    // const dropdownExpander = document.createElement('div')
    // dropdownExpander.className = classNames('expander')

    // dropdown.appendChild(dropdownInput)
    // dropdown.appendChild(dropdownExpander)

    // this.el.appendChild(dropdown)
  }
  renderList() {}

  renderItem() {
    const dropdownItem = document.createElement('div')
    dropdownItem.className = classNames('item')

    const dropdownItemImg = document.createElement('div')
    

    const dropdownItemTitle = document.createElement('div')
    const dropdownItemDesc = document.createElement('div')

    this.el = ''
  }

  destroy() {}
}
