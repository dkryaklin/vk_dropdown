import clssnms from 'clssnms'
import './dropdown.scss'

const classNames = clssnms('dropdown')

export default class Dropdown {
  constructor(el) {
    this.el = el
    this.renderContainer()
  }

  renderContainer() {
    const dropdown = document.createElement('div')
    dropdown.className = classNames()

    const dropdownInput = document.createElement('input')
    dropdownInput.type = 'text'
    dropdownInput.placeholder = 'Введите имя друга или email'
    dropdownInput.className = classNames('input')

    const dropdownExpander = document.createElement('div')
    dropdownExpander.className = classNames('expander')

    dropdown.appendChild(dropdownInput)
    dropdown.appendChild(dropdownExpander)

    this.el.appendChild(dropdown)
  }
  renderList() {}
  renderItem() {}
  destroy() {}
}
