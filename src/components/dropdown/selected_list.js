import clssnms from 'clssnms';
import { div } from './dom_helpers';

const classNames = clssnms('dropdown');

const SelectedItem = (item = {}, isNew = false) => {
  const label = isNew ? 'добавить' : `${item.first_name} ${item.last_name}`;

  return div({ id: item.id || '-1', className: classNames('selected-item', { new: isNew }) }, [
    div({ className: classNames('selected-name') }, [label]),
    div({ className: classNames('selected-cross', { add: isNew }) }),
  ]);
};

class SelectedList {
  constructor(props) {
    this.props = Object.assign({}, {
      isOpen: false,
      selectedItems: [],
      dropSelected: () => {},
    }, props);
  }

  setProps(newProps) {
    this.props = Object.assign({}, this.props, newProps);
    this.update();
  }

  getItems() {
    const items = this.props.selectedItems.map(item => SelectedItem(item));
    if (items.length && !this.props.isOpen) {
      items.push(SelectedItem(undefined, true));
    }

    return items;
  }

  onClick(event) {
    const itemEl = event.target.closest(`.${classNames('selected-item')}`);
    if (itemEl && itemEl.id) {
      const itemId = parseInt(itemEl.id, 10);

      if (event.target.className === classNames('selected-cross')) {
        const itemsArr = this.props.selectedItems.filter(item => itemId === item.id);

        if (itemsArr.length) {
          this.props.dropSelected(itemsArr[0]);
        }
      } else if (itemId === -1) {
        return;
      }
    }

    event.stopPropagation();
  }

  render() {
    this.el = div({
      className: classNames('selected-list'),
      onClick: this.onClick.bind(this),
    }, this.getItems());
    return this.el;
  }

  update() {
    this.clear();
    this.getItems().forEach((item) => {
      this.el.appendChild(item);
    });
  }

  clear() {
    while (this.el.firstChild) {
      this.el.removeChild(this.el.firstChild);
    }
  }
}

export default SelectedList;
