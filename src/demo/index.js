import Dropdown from '../dropdown/dropdown';
import mockUsers from './users.json';
import './index.pcss';

const users = mockUsers.response.items.map(user => ({
  id: user.id,
  first_name: user.first_name,
  last_name: user.last_name,
  photo_100: user.photo_100,
}));

const dropdownEl = document.querySelector('#dropdown_container');
const dropdown = new Dropdown(dropdownEl, {
  multiselect: true,
  autocomplete: true,
  items: users,
  showPics: true,
  searchOnServer: true,
});
