import clssnms from 'clssnms';

const classNames = clssnms('dropdown');

class InputField {
  constructor(statePropsHelper) {
    this.statePropsHelper = statePropsHelper;
    this.statePropsHelper.stateSubscribe(['isOpen', 'selectedItems'], this.update);
  }

  onKeyUp = (event) => {
    const inputValue = event.target.value.toLowerCase();
    this.statePropsHelper.setState({ inputValue, extraItems: [] });
  }

  render() {
    const { placeholderLabel } = this.statePropsHelper.getProps();
    const inputEl = document.createElement('input');

    inputEl.className = classNames('input');
    inputEl.type = 'text';
    inputEl.placeholder = placeholderLabel;
    inputEl.onkeyup = this.onKeyUp;
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
