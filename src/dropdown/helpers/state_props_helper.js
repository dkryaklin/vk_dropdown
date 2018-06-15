
class StatePropsHelper {
  props = {
    multiselect: true,
    autocomplete: true,
    showPics: true,
    items: [],
  }

  store = {
    items: [],
  }

  subscribes = {

  }

  setProps(newProps) {
    this.props = Object.assign({}, this.props, newProps);
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

  stateOnChangeSubscribe(field, callback) {
    if (!this.subscribes[field]) {
      this.subscribes[field] = [];
    }

    this.subscribes[field].push(callback);
  }
}

const statePropsHelper = new StatePropsHelper();

export default statePropsHelper;
