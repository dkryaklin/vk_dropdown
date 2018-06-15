import Dropdown from '../dropdown/dropdown';
import mockUsers from './users.json';
import './index.pcss';

const users = mockUsers.response.items.map(user => ({
  id: user.id,
  first_name: user.first_name,
  last_name: user.last_name,
  university_name: user.university_name || '',
  photo_100: user.photo_100,
}));

const dropdownEl = document.querySelector('#dropdown_container');
const dropdown = new Dropdown(dropdownEl, {
  multiselect: false,
  autocomplete: true,
  items: users,
});
