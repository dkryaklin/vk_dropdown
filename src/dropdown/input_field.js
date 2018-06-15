import clssnms from 'clssnms';
import { input } from './dom_helpers';

const classNames = clssnms('dropdown');

class InputField {
  constructor(props) {
    this.props = Object.assign({}, {
      onChange: () => {},
      isOpen: false,
      selectedItems: [],
      autocomplete: true,
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

  onKeyUp = (event) => {
    const inputValue = event.target.value;
    if (this.state.inputValue !== inputValue) {
      this.props.onChange(inputValue);
    }
    console.log(event.keyCode);
    this.setState({ inputValue: event.target.value });
  }

  render() {
    this.el = input({
      className: this.getClassName(),
      type: 'text',
      placeholder: 'Введите имя друга или email',
      value: this.state.inputValue,
      onKeyUp: this.onKeyUp,
      disabled: !this.props.autocomplete,
    });

    return this.el;
  }

  update() {
    this.el.className = this.getClassName();
    this.el.disabled = !this.props.autocomplete;
  }

  getClassName() {
    return classNames('input', {
      hidden: (!this.props.autocomplete && this.props.isOpen && this.props.selectedItems.length) ||
        (this.props.selectedItems.length && !this.props.isOpen),
    });
  }
}

export default InputField;
