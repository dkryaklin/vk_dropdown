import clssnms from 'clssnms';
import { div, img } from './dom_helpers';
import { filterItem } from './string_helpers';

const classNames = clssnms('dropdown');

const DropdownItem = (item = {}) => (
  div({ className: classNames('item'), id: item.id }, [
    img({ className: classNames('item-img'), src: item.photo_100 }),
    div({ className: classNames('item-data') }, [
      div({ className: classNames('item-title') }, [`${item.first_name} ${item.last_name}`]),
      div({ className: classNames('item-desc') }, [item.university_name]),
    ]),
  ])
);

const EmptyList = () => div({ text: 'Пустой список :(', className: classNames('empty-list') });

const DropdownList = ({ isOpen, items, searchValue }) => {
  if (isOpen) {
    const filteredItems = items.filter(item => filterItem(item, searchValue));

    if (!filteredItems.length) {
      return EmptyList();
    }

    // simple sort
    filteredItems.sort((a, b) => a.id - b.id);

    const itemsEl = filteredItems.map(item => DropdownItem(item));
    return div({ className: classNames('list') }, itemsEl);
  }

  return EmptyList();
};

class DropdownListWrapper {
  constructor(props) {
    this.props = Object.assign({}, {
      isOpen: false,
      items: [],
      onSelect: () => {},
    }, props);
  }

  setProps(newProps) {
    this.props = Object.assign({}, this.props, newProps);
    this.update();
  }

  onClick = (event) => {
    const itemEl = event.target.closest(`.${classNames('item')}`);
    if (itemEl && itemEl.id) {
      const itemId = parseInt(itemEl.id, 10);
      const itemsArr = this.props.items.filter(item => itemId === item.id);

      if (itemsArr.length) {
        this.props.onSelect(itemsArr[0]);
      }
    }

    event.stopPropagation();
  }

  render() {
    this.el = div({
      className: classNames('list-wrapper', {
        hidden: !this.props.isOpen,
      }),
      onClick: this.onClick,
    }, [DropdownList({
      isOpen: this.props.isOpen,
      items: this.props.items,
      searchValue: this.props.searchValue,
    })]);
    return this.el;
  }

  update() {
    this.el.className = classNames('list-wrapper', {
      hidden: !this.props.isOpen,
    });
    this.el.replaceChild(DropdownList({
      isOpen: this.props.isOpen,
      items: this.props.items,
      searchValue: this.props.searchValue,
    }), this.el.firstChild);
  }
}

export default DropdownListWrapper;
