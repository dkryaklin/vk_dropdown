import Dropdown from './components/dropdown';
import mockUsers from './users.json';
import './css/index.scss';

const users = mockUsers.response.items.map((user) => {
  return {
    id: user.id,
    first_name: user.first_name,
    last_name: user.last_name,
    university_name: user.university_name || '',
    photo_100: user.photo_100,
  };
});

const dropdownEl = document.querySelector('#dropdown_container');
const dropdown = new Dropdown(dropdownEl, {
  items: users,
});
