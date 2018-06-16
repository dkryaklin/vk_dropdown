const DEFAULT_PROPS = {
  multiselect: true,
  autocomplete: true,
  showPics: true,
  items: [],
};

const DEFAULT_STATE = {
  isOpen: false,
  inputValue: '',
  selectedItems: [],
  items: [],
};

class StatePropsHelper {
  constructor(props) {
    this.props = Object.assign({}, DEFAULT_PROPS, props);
    this.store = DEFAULT_STATE;

    this.subscribes = {};
  }

  setState(newState) {
    this.state = Object.assign({}, this.state, newState);

    Object.keys(newState).forEach((field) => {
      if (this.subscribes[field]) {
        this.subscribes[field].forEach((callback) => {
          callback(newState[field]);
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
