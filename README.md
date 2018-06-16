# vk_dropdown

<a>https://dkryaklin.github.io/vk_dropdown/</a>

Были реализованы все запрашиваемые функции. Протестировано во всех современных браузерах + ie10/11, opera 12.16.

В качестве запроса на сервер выступает обычный запрос к вк апи. И поиск происходит на клиенте (небольшое упрошение), но вся логика работы с асинхронным запросом будет точно такая же.

В качестве демо использованы несколько примеров с разными параметрами.

Из внутренних фишек:
* Реализована подписка на изменение общего стора
* Кеширование элементов dom списков для более быстрого ререндера (внутреннее)
* Кеширование преобразованных строк при поиске (общее)
* Кеширование ответов от сервера (общее)
* Сборка в виде библиотеки

Из-за нехватки времени некоторые дополнительные функции были не сделаны:
* Поддержка горячих клавиш
* Автоматический фокус на поле вводе после клика
* Выделение искомой строки в элементах списка (при прямом совпадении)

Код поделен на две части: demo и dropdown
Сам dropdown поделен на несколько частей: dropdown, dropdown_list, selected_items, input_field
Для каждого элемента создан свой pcss файл со стилями.
Общий класс для стилей используется один.

Для генерации классов используется библеотека Aviasales - `clssnms`
Для транслитерации текста используется сторонняя библиотека - `translit-rus-eng`

В качестве входных параметров нужно передать элемент dom и можно указать дополнительные параметры:
```js
const DEFAULT_PROPS = {
  multiselect: true,
  autocomplete: true,
  showPics: true,
  items: [],
  placeholderLabel: 'Введите имя пользователя или domain',
  emptyListLabel: 'Пустой список :(',
  searchOnServer: true,
};
```

При инициализации нужно передать имеющийся список людей, по которым будет происходить первоначальный поиск.
Чтобы получить выбранные элементы можно вызвать `dropdown.getSelectedItems()`. Для выключения дропдауна можно использовать `destroy`;

Алгоритм работы:
* При инициализации происходит первый рендер всех видимых элементов в контейнер.
* Происходят подписки компонентов на общий стейт
* При изменении стейта происходит обновление только нужных элементов
* При рендере списков происходит кеширование элементов

Алгоритм поиска:
* Получаем на входе строку где искать и что искать
* Ищем без преобразований
* Если не найдено пытаемся изменить строку где искать в следующем порядке:
* Транслитерация
* Неправильная клавиатура
* Непрявильная клавиатура транслитерации
