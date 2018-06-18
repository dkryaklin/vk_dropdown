import advancedSearch from '../helpers/search_helper';

const MAX_EXTRA_ITEMS_AMOUNT = 20;
const COMMON_CACHE = {};
const DEBOUNCE_TIMEOUT = 100;

class ExtraItemsHelper {
  constructor() {
    if (!window.dropdownCallbacks) {
      window.dropdownCallbacks = {};
    }
    this.callbacks = window.dropdownCallbacks;
  }

  getItems(searchValue, callback) {
    if (!searchValue) {
      return;
    }

    clearTimeout(this.debounceTimeout);

    if (COMMON_CACHE[searchValue]) {
      this.requestId = '';
      callback(COMMON_CACHE[searchValue]);
      return;
    }

    this.debounceTimeout = setTimeout(() => {
      this.callApi(searchValue, callback);
    }, DEBOUNCE_TIMEOUT);
  }

  createCallback(searchValue, callback) {
    const requestId = `c${Date.now()}`;

    this.callbacks[this.requestId] = () => {};
    this.requestId = requestId;

    this.callbacks[requestId] = (body) => {
      if (body && body.response && body.response.items) {
        const extraItems = [];
        for (let i = 0; i < body.response.items.length; i++) {
          const item = body.response.items[i];

          if (advancedSearch(item.domain, searchValue)) {
            extraItems.push(item);
          }

          if (extraItems.length >= MAX_EXTRA_ITEMS_AMOUNT) {
            break;
          }
        }

        COMMON_CACHE[searchValue] = extraItems;

        if (this.requestId === requestId) {
          callback(extraItems);
        }
      }
    };

    return requestId;
  }

  callApi(searchValue, callback) {
    const requestId = this.createCallback(searchValue, callback);

    const params = [
      'user_id=5',
      'count=200',
      'fields=domain,photo_100',
      'v=5.78',
      'access_token=919ba15b919ba15b919ba15bfe91ff71f19919b919ba15bcabf7c94072d7fcbb2167c4c',
      `callback=dropdownCallbacks.${requestId}`,
    ];

    const script = document.createElement('SCRIPT');
    script.src = `https://api.vk.com/method/friends.get?${params.join('&')}`;
    document.getElementsByTagName('head')[0].appendChild(script);
  }
}

export default ExtraItemsHelper;
