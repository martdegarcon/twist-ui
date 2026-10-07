/* generated: every flow and component in Twist UI */
window.REGISTRY = {
 "flows": [
  {
   "slug": "password-weight",
   "name": "Password Weight",
   "step": "Регистрация",
   "desc": "Надёжность пароля — это насыщенность шрифта: слабый — Medium, надёжный — ExtraBold.",
   "group": "Account Flow",
   "android": true,
   "ios": true,
   "keys": [
    "← →",
    "Enter",
    "Space",
    "Tab"
   ]
  },
  {
   "slug": "otp",
   "name": "OTP",
   "step": "Подтверждение почты",
   "desc": "Цифры кода крутятся, как барабаны. Неверный код откатывается, верный сплавляется в одну плашку.",
   "group": "Account Flow",
   "android": true,
   "ios": false,
   "keys": []
  },
  {
   "slug": "resend",
   "name": "Resend",
   "step": "Код не пришёл",
   "desc": "Без таймера: «Выслать код» проявляется буква за буквой, пока идёт ожидание.",
   "group": "Account Flow",
   "android": true,
   "ios": true,
   "keys": []
  },
  {
   "slug": "copy-key",
   "name": "Copy Key",
   "step": "Резервный ключ",
   "desc": "Скопированный текст отрывается и влетает в иконку кнопки — видно, куда он делся.",
   "group": "Account Flow",
   "android": true,
   "ios": true,
   "keys": []
  },
  {
   "slug": "upload",
   "name": "Upload",
   "step": "Фото профиля",
   "desc": "Без прогресс-бара: имя файла заполняется слева направо по мере загрузки.",
   "group": "Account Flow",
   "android": true,
   "ios": false,
   "keys": []
  },
  {
   "slug": "limit",
   "name": "Limit",
   "step": "О себе",
   "desc": "У лимита символов текст сжимает трекинг, а лишнее растворяется.",
   "group": "Account Flow",
   "android": true,
   "ios": true,
   "keys": []
  },
  {
   "slug": "strike",
   "name": "Strike",
   "step": "Устройства",
   "desc": "Свайп рисует зачёркивание под пальцем, и строка сворачивается. «Отменить» возвращает её.",
   "group": "Account Flow",
   "android": true,
   "ios": true,
   "keys": [
    "Delete"
   ]
  }
 ],
 "components": [
  {
   "slug": "accordion",
   "name": "Accordion",
   "step": "Раскрытие",
   "desc": "Открытый ответ получает вес, закрытые вопросы становятся тоньше и отходят назад.",
   "group": "Раскладка",
   "android": true,
   "ios": false,
   "keys": []
  },
  {
   "slug": "alert",
   "name": "Alert",
   "step": "Статус",
   "desc": "Важность — это вес шрифта; закрытое уведомление сворачивается в точку.",
   "group": "Обратная связь",
   "android": true,
   "ios": false,
   "keys": []
  },
  {
   "slug": "alert-dialog",
   "name": "Alert Dialog",
   "step": "Опасное действие",
   "desc": "Удержание вместо двойного клика. Кнопка называет то, что удалит.",
   "group": "Оверлеи",
   "android": true,
   "ios": false,
   "keys": [
    "Esc",
    "Enter",
    "Space"
   ]
  },
  {
   "slug": "aspect-ratio",
   "name": "Aspect Ratio",
   "step": "Медиа",
   "desc": "Кадр перекадрируется вокруг объекта, подпись пропорции прокручивается.",
   "group": "Раскладка",
   "android": true,
   "ios": false,
   "keys": []
  },
  {
   "slug": "attachment",
   "name": "Attachment",
   "step": "Файлы",
   "desc": "Файл приземляется страницей и сжимается в чип.",
   "group": "Формы",
   "android": true,
   "ios": false,
   "keys": []
  },
  {
   "slug": "avatar",
   "name": "Avatar",
   "step": "Люди",
   "desc": "Стопка раскрывается веером, как карты в руке; +N прокручивается.",
   "group": "Данные",
   "android": true,
   "ios": false,
   "keys": [
    "Enter",
    "Space"
   ]
  },
  {
   "slug": "badge",
   "name": "Badge",
   "step": "Счётчики",
   "desc": "Каждая цифра на своём барабане; бейдж растёт на разряд, когда нужно.",
   "group": "Данные",
   "android": true,
   "ios": false,
   "keys": []
  },
  {
   "slug": "breadcrumb",
   "name": "Breadcrumb",
   "step": "Навигация",
   "desc": "При сжатии сначала уплотняется трекинг, потом середина сворачивается в «…».",
   "group": "Навигация",
   "android": true,
   "ios": false,
   "keys": []
  },
  {
   "slug": "bubble",
   "name": "Bubble",
   "step": "Чат",
   "desc": "Набранный текст сам становится пузырём; галочки дорисовывают «Отправлено → Прочитано».",
   "group": "Чат",
   "android": true,
   "ios": false,
   "keys": []
  },
  {
   "slug": "button-group",
   "name": "Button Group",
   "step": "Сегменты",
   "desc": "Жидкое выделение тянется к новой кнопке и отпускает старую.",
   "group": "Формы",
   "android": true,
   "ios": false,
   "keys": []
  },
  {
   "slug": "calendar",
   "name": "Calendar",
   "step": "Даты",
   "desc": "При смене месяца дни заезжают по диагонали; выбранный период набирает вес.",
   "group": "Формы",
   "android": true,
   "ios": false,
   "keys": []
  },
  {
   "slug": "card",
   "name": "Card",
   "step": "Контент",
   "desc": "Верхний слой приподнимается и открывает детали, напечатанные под ним.",
   "group": "Раскладка",
   "android": true,
   "ios": false,
   "keys": [
    "Enter",
    "Space"
   ]
  },
  {
   "slug": "carousel",
   "name": "Carousel",
   "step": "Просмотр",
   "desc": "Колода карт: верхняя уходит и подкладывается вниз колоды.",
   "group": "Раскладка",
   "android": true,
   "ios": false,
   "keys": [
    "← →"
   ]
  },
  {
   "slug": "chart",
   "name": "Chart",
   "step": "Данные",
   "desc": "Подпись каждого значения настолько жирная, насколько велико значение.",
   "group": "Данные",
   "android": true,
   "ios": false,
   "keys": []
  },
  {
   "slug": "checkbox",
   "name": "Checkbox",
   "step": "Задачи",
   "desc": "Галочка рисуется росчерком пера; выполненные задачи истончаются и отходят назад.",
   "group": "Формы",
   "android": true,
   "ios": true,
   "keys": []
  },
  {
   "slug": "collapsible",
   "name": "Collapsible",
   "step": "Группировка",
   "desc": "Лежит стопкой уведомлений и раскладывается, как карты.",
   "group": "Раскладка",
   "android": true,
   "ios": false,
   "keys": []
  },
  {
   "slug": "combobox",
   "name": "Combobox",
   "step": "Поиск и выбор",
   "desc": "Набранные буквы становятся жирными в каждом совпадении; варианты плавно пересортировываются.",
   "group": "Формы",
   "android": true,
   "ios": false,
   "keys": [
    "↑ ↓",
    "Enter"
   ]
  },
  {
   "slug": "command",
   "name": "Command",
   "step": "⌘K",
   "desc": "Подсветка скользит между результатами, а результаты — на новые места.",
   "group": "Оверлеи",
   "android": true,
   "ios": false,
   "keys": [
    "↑ ↓",
    "Esc",
    "Enter",
    "⌘K"
   ]
  },
  {
   "slug": "data-table",
   "name": "Data Table",
   "step": "Сортировка",
   "desc": "Сортировка физически переносит строки на новые места. Ничего не прыгает.",
   "group": "Данные",
   "android": true,
   "ios": false,
   "keys": []
  },
  {
   "slug": "date-picker",
   "name": "Date Picker",
   "step": "Ввод",
   "desc": "День, месяц и год — отдельные барабаны: крутите, тяните или жмите стрелки.",
   "group": "Формы",
   "android": true,
   "ios": false,
   "keys": [
    "↑ ↓"
   ]
  },
  {
   "slug": "dialog",
   "name": "Dialog",
   "step": "Окно",
   "desc": "Окно вырастает из кнопки, которая его открыла, и сворачивается обратно в неё.",
   "group": "Оверлеи",
   "android": true,
   "ios": false,
   "keys": [
    "Esc"
   ]
  },
  {
   "slug": "drawer",
   "name": "Drawer",
   "step": "Шторка",
   "desc": "Страница уменьшается и темнеет ровно настолько, насколько вытянута шторка.",
   "group": "Оверлеи",
   "android": true,
   "ios": false,
   "keys": [
    "Esc"
   ]
  },
  {
   "slug": "dropdown-menu",
   "name": "Dropdown Menu",
   "step": "Действия",
   "desc": "Подсветка следует за курсором и добавляет вес пункту под ним.",
   "group": "Оверлеи",
   "android": true,
   "ios": false,
   "keys": [
    "↑ ↓",
    "Esc",
    "Enter"
   ]
  },
  {
   "slug": "empty",
   "name": "Empty",
   "step": "Первый запуск",
   "desc": "Контуры будущего контента. «Создать» заполняет первый контур, и появляется новый.",
   "group": "Обратная связь",
   "android": true,
   "ios": false,
   "keys": []
  },
  {
   "slug": "field",
   "name": "Field",
   "step": "Валидация",
   "desc": "Подсказка не заменяется ошибкой — она переписывает себя слово за словом.",
   "group": "Формы",
   "android": true,
   "ios": false,
   "keys": []
  },
  {
   "slug": "hover-card",
   "name": "Hover Card",
   "step": "Превью",
   "desc": "Карточка вырастает из @упоминания, и упоминание становится её заголовком.",
   "group": "Оверлеи",
   "android": true,
   "ios": false,
   "keys": []
  },
  {
   "slug": "input-group",
   "name": "Input Group",
   "step": "Аддоны",
   "desc": "Вставленный https:// уезжает в префикс, домен становится чипом-суффиксом.",
   "group": "Формы",
   "android": true,
   "ios": false,
   "keys": [
    "Tab"
   ]
  },
  {
   "slug": "item",
   "name": "Item",
   "step": "Чек-листы",
   "desc": "Выполненные пункты уезжают вниз в «Готово»; счётчик прокручивается.",
   "group": "Данные",
   "android": true,
   "ios": false,
   "keys": [
    "Enter",
    "Space"
   ]
  },
  {
   "slug": "kbd",
   "name": "Kbd",
   "step": "Сочетания клавиш",
   "desc": "Клавиши на экране нажимаются, когда вы жмёте настоящие.",
   "group": "Данные",
   "android": true,
   "ios": false,
   "keys": [
    "← →",
    "Esc",
    "⌘ ⇧ ⌥"
   ]
  },
  {
   "slug": "marker",
   "name": "Marker",
   "step": "Пометки",
   "desc": "Выделите слова — маркер прорисует их строка за строкой.",
   "group": "Данные",
   "android": true,
   "ios": false,
   "keys": []
  },
  {
   "slug": "menubar",
   "name": "Menubar",
   "step": "Команды",
   "desc": "Зажмите ⌘, ⇧ или ⌥ — меню отфильтруется, подходящие сочетания станут жирными.",
   "group": "Оверлеи",
   "android": true,
   "ios": false,
   "keys": [
    "Esc",
    "⌘ ⇧ ⌥"
   ]
  },
  {
   "slug": "message",
   "name": "Message",
   "step": "ИИ-чат",
   "desc": "Слова приходят тонкими и набирают вес, пока «высыхают чернила».",
   "group": "Чат",
   "android": true,
   "ios": false,
   "keys": []
  },
  {
   "slug": "message-scroller",
   "name": "Message Scroller",
   "step": "Переписка",
   "desc": "Новые сообщения прокручивают счётчик, а при переходе к ним — подсвечиваются.",
   "group": "Чат",
   "android": true,
   "ios": false,
   "keys": []
  },
  {
   "slug": "navigation-menu",
   "name": "Navigation Menu",
   "step": "Меню сайта",
   "desc": "Одна панель переезжает между пунктами и меняет размер; контент входит с вашей стороны.",
   "group": "Навигация",
   "android": true,
   "ios": false,
   "keys": []
  },
  {
   "slug": "pagination",
   "name": "Pagination",
   "step": "Страницы",
   "desc": "Номера раздвигаются, освобождая место; счётчик страниц крутится на барабане.",
   "group": "Навигация",
   "android": true,
   "ios": false,
   "keys": [
    "← →"
   ]
  },
  {
   "slug": "popover",
   "name": "Popover",
   "step": "Детали",
   "desc": "Вырастает ровно из точки клика и сворачивается в неё же.",
   "group": "Оверлеи",
   "android": true,
   "ios": false,
   "keys": [
    "Esc"
   ]
  },
  {
   "slug": "questionnaire",
   "name": "Questionnaire",
   "step": "Онбординг",
   "desc": "Форма, которая становится чатом: выбранный вариант перелетает и становится вашим ответом.",
   "group": "Чат",
   "android": true,
   "ios": false,
   "keys": []
  },
  {
   "slug": "radio-group",
   "name": "Radio Group",
   "step": "Выбор",
   "desc": "Точка выбора перетекает каплей от варианта к варианту.",
   "group": "Формы",
   "android": true,
   "ios": false,
   "keys": []
  },
  {
   "slug": "resizable",
   "name": "Resizable",
   "step": "Панели",
   "desc": "Меняйте ширину панели — текст меняет ширину букв, а не переносится.",
   "group": "Раскладка",
   "android": true,
   "ios": false,
   "keys": [
    "← →"
   ]
  },
  {
   "slug": "scroll-area",
   "name": "Scroll Area",
   "step": "Длинный контент",
   "desc": "Пока вы скроллите, ползунок раскрывается в название текущего раздела.",
   "group": "Навигация",
   "android": true,
   "ios": false,
   "keys": []
  },
  {
   "slug": "select",
   "name": "Select",
   "step": "Выбор",
   "desc": "Открывается вокруг текущего значения; новое падает в поле.",
   "group": "Формы",
   "android": true,
   "ios": false,
   "keys": [
    "↑ ↓",
    "Esc",
    "Enter"
   ]
  },
  {
   "slug": "sheet",
   "name": "Sheet",
   "step": "Боковая панель",
   "desc": "Отодвигает страницу вместо того, чтобы закрыть её; сетка перестраивается.",
   "group": "Оверлеи",
   "android": true,
   "ios": true,
   "keys": [
    "Esc"
   ]
  },
  {
   "slug": "sidebar",
   "name": "Sidebar",
   "step": "Раскладка",
   "desc": "При сворачивании подписи сжимают трекинг и уходят в иконки.",
   "group": "Навигация",
   "android": true,
   "ios": false,
   "keys": []
  },
  {
   "slug": "skeleton",
   "name": "Skeleton",
   "step": "Загрузка",
   "desc": "Текст пишется поверх плашек, съедая их буква за буквой.",
   "group": "Обратная связь",
   "android": true,
   "ios": false,
   "keys": []
  },
  {
   "slug": "slider",
   "name": "Slider",
   "step": "Значение",
   "desc": "Насыщенность шрифта числа и есть значение. От Thin до Black.",
   "group": "Формы",
   "android": true,
   "ios": false,
   "keys": []
  },
  {
   "slug": "spinner",
   "name": "Spinner",
   "step": "Ожидание",
   "desc": "Без кружка: по слову пробегает волна веса и затихает.",
   "group": "Обратная связь",
   "android": true,
   "ios": false,
   "keys": []
  },
  {
   "slug": "switch",
   "name": "Switch",
   "step": "Вкл / выкл",
   "desc": "Ручка тянется на ходу, подпись набирает вес, «Выкл» перетекает во «Вкл».",
   "group": "Формы",
   "android": true,
   "ios": true,
   "keys": []
  },
  {
   "slug": "table",
   "name": "Table",
   "step": "Числа",
   "desc": "Наведите на сумму — колонка перевзвешивается относительно неё.",
   "group": "Данные",
   "android": true,
   "ios": false,
   "keys": []
  },
  {
   "slug": "tabs",
   "name": "Tabs",
   "step": "Вкладки",
   "desc": "Плашка перетекает к вкладке, контент въезжает с той стороны, куда вы двинулись.",
   "group": "Навигация",
   "android": true,
   "ios": false,
   "keys": [
    "← →"
   ]
  },
  {
   "slug": "toggle",
   "name": "Toggle",
   "step": "Форматирование",
   "desc": "Ж становится жирной, К наклоняется, Ч и З рисуют свои линии — сначала на самой кнопке.",
   "group": "Формы",
   "android": true,
   "ios": false,
   "keys": []
  },
  {
   "slug": "toggle-group",
   "name": "Toggle Group",
   "step": "Выравнивание",
   "desc": "Строки по очереди переезжают к новому выравниванию.",
   "group": "Формы",
   "android": true,
   "ios": false,
   "keys": []
  },
  {
   "slug": "tooltip",
   "name": "Tooltip",
   "step": "Подсказки",
   "desc": "Одна подсказка переезжает между кнопками и переписывает свой текст.",
   "group": "Оверлеи",
   "android": true,
   "ios": false,
   "keys": []
  }
 ],
 "groups": [
  "Формы",
  "Оверлеи",
  "Навигация",
  "Раскладка",
  "Данные",
  "Обратная связь",
  "Чат"
 ]
};
