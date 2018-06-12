import clssnms from 'clssnms';
import { input } from './dom_helpers';

const classNames = clssnms('dropdown');

class InputField {
  constructor(props) {
    this.props = Object.assign({}, {
      onChange: () => {},
      isOpen: false,
      selectedItems: [],
    }, props);

    this.state = {
      inputValue: '',
    };
  }

  setState(newState) {
    this.state = Object.assign({}, this.state, newState);
    this.update();
  }

  setProps(newProps) {
    this.props = Object.assign({}, this.props, newProps);
    this.update();
  }

  onKeyUp(event) {
    const inputValue = event.target.value;
    if (this.state.inputValue !== inputValue) {
      this.props.onChange(inputValue);
    }

    this.setState({ inputValue: event.target.value });
  }

  render() {
    this.el = input({
      className: classNames('input'),
      type: 'text',
      placeholder: 'Введите имя друга или email',
      value: this.state.inputValue,
      onKeyUp: this.onKeyUp.bind(this),
    });

    return this.el;
  }

  update() {
    this.el.className = classNames('input', {
      hidden: this.props.selectedItems.length && !this.props.isOpen,
    });
  }
}

export default InputField;
