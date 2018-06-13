import clssnms from 'clssnms';
import { div, img } from './dom_helpers';

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

const DropdownList = ({ isOpen, items }) => {
  if (isOpen) {
    const itemsEl = items.map(item => DropdownItem(item));
    return div({ className: classNames('list') }, itemsEl);
  }

  return div();
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

  isOpen() {
    return this.props.isOpen && this.props.items.length;
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
        hidden: !this.isOpen(),
      }),
      onClick: this.onClick,
    }, [DropdownList({ isOpen: this.isOpen(), items: this.props.items })]);
    return this.el;
  }

  update() {
    this.el.className = classNames('list-wrapper', {
      hidden: !this.isOpen(),
    });
    this.el.replaceChild(DropdownList(this.props), this.el.firstChild);
  }
}

export default DropdownListWrapper;
