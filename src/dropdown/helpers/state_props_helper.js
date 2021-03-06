const DEFAULT_PROPS = {
  multiselect: true,
  autocomplete: true,
  showPics: true,
  items: [],
  placeholderLabel: 'Введите имя пользователя или domain',
  emptyListLabel: 'Пустой список :(',
  searchOnServer: true,
};

const DEFAULT_STATE = {
  isOpen: false,
  inputValue: '',
  selectedItems: [],
  items: [],
  extraItems: [],
  offset: 0,
};

class StatePropsHelper {
  constructor(props) {
    this.props = Object.assign({}, DEFAULT_PROPS, props);
    this.state = Object.assign({}, DEFAULT_STATE, { items: this.props.items });

    this.subscribes = {};
  }

  setState(newState) {
    this.state = Object.assign({}, this.state, newState);

    Object.keys(newState).forEach((field) => {
      if (this.subscribes[field]) {
        this.subscribes[field].forEach((callback) => {
          callback(newState);
        });
      }
    });
  }

  getState() {
    return this.state;
  }

  getProps() {
    return this.props;
  }

  stateSubscribe(fields, callback) {
    fields.forEach((field) => {
      if (!this.subscribes[field]) {
        this.subscribes[field] = [];
      }

      this.subscribes[field].push(callback);
    });
  }

  reset() {
    this.subscribes = {};
  }
}

export default StatePropsHelper;
