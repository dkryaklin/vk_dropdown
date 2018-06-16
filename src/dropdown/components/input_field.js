import clssnms from 'clssnms';

const classNames = clssnms('dropdown');

class InputField {
  constructor(statePropsHelper) {
    this.statePropsHelper = statePropsHelper;
    this.statePropsHelper.stateSubscribe(['isOpen', 'selectedItems'], this.update);
  }

  onKeyUp = (event) => {
    const inputValue = event.target.value;
    this.statePropsHelper.setState({ inputValue });
  }

  render() {
    const inputEl = document.createElement('input');

    inputEl.className = classNames('input');
    inputEl.type = 'text';
    inputEl.placeholder = 'Введите имя друга или email';
    inputEl.onKeyUp = this.onKeyUp;
    inputEl.disabled = !this.statePropsHelper.getProps().autocomplete;

    this.el = inputEl;
    return this.el;
  }

  update = () => {
    const { autocomplete } = this.statePropsHelper.getProps();
    const { isOpen, selectedItems } = this.statePropsHelper.getState();
    const hidden = (!autocomplete && isOpen && selectedItems.length)
      || (selectedItems.length && !isOpen);

    this.el.className = classNames('input', { hidden });
  }
}

export default InputField;
