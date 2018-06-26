import Dropdown from '../dropdown/dropdown';
import mockUsers from './users.json';
import './index.pcss';

const users = mockUsers.response.items.filter(user => !user.deactivated);

const dropdownEl1 = document.querySelector('#dropdown_container1');
const dropdown1 = new Dropdown(dropdownEl1, {
  multiselect: false,
  items: users,
});


const dropdownEl2 = document.querySelector('#dropdown_container2');
const dropdown2 = new Dropdown(dropdownEl2, {
  autocomplete: false,
  items: users,
});


const dropdownEl3 = document.querySelector('#dropdown_container3');
const dropdown3 = new Dropdown(dropdownEl3, {
  showPics: false,
  items: users,
});


const dropdownEl4 = document.querySelector('#dropdown_container4');
const dropdown4 = new Dropdown(dropdownEl4, {
  searchOnServer: false,
  items: users,
});

const dropdownEl5 = document.querySelector('#dropdown_container5');
const dropdown5 = new Dropdown(dropdownEl5, {
  placeholderLabel: 'Custom placeholder label',
  emptyListLabel: 'Custom empty list label',
  searchOnServer: false,
  items: users,
});
