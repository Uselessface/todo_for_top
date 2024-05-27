//Находим элементы на странице
const form = document.querySelector('#form');
const taskInput = form.querySelector('#taskInput');
const tasksList = document.querySelector('#tasksList');

// Создаем массив для записи в локал сторедж
let tasksArray = [];

if (localStorage.getItem('tasks')) {
  tasksArray = JSON.parse(localStorage.getItem('tasks'))
  tasksArray.forEach(task => renderHtml(task))
}

const checkEmptyList = () => {
  if (tasksArray.length === 0) {
    const emptyList = `
                                <li id="emptyList" class="list-group-item empty-list">
                                    <img src="./img/leaf.svg" alt="Empty" width="48" class="mt-3">
                                    <div class="empty-list__title">Список дел пуст</div>
                                </li>
                                `
    tasksList.insertAdjacentHTML("afterbegin", emptyList)
  }
  if (tasksArray.length > 0) {
    const isEmptyList = document.querySelector('#emptyList')
    isEmptyList ? isEmptyList.remove() : null
  }
}
checkEmptyList()

//Добавление задачи
const addTask = (event) => {
  //отменяем стандартную отправку формы
  event.preventDefault()
  // достаем текст из поля ввода задачи
  const taskValue = taskInput.value
  // Создаем объект для новой задачи
  const newTask = {
    id: Date.now(),
    title: taskValue,
    isDone: false,
  };
  // Пушим новую задачу в массив
  tasksArray.push(newTask)
  setLocalStorage()
  renderHtml(newTask)
  // обнуление полей формы и постановка фокуса на инпут
  form.reset()
  taskInput.focus()
  // проверка на присутствие задач и отображение заглушки
  checkEmptyList()
}
form.addEventListener('submit', addTask)
//Удаление задачи
const deleteTask = (event) => {
  //Проверяем клик по кнопке Delete
  // если нет то закрываем функцию
  if (event.target.dataset.action !== 'delete') {
    return
  }
  const taskItem = event.target.closest('li');

  //Определяем id задачи
  const taskId = Number(taskItem.id)

  //Фильтруем массив
  tasksArray = tasksArray.filter((el) => el.id !== taskId)

  taskItem.remove();
  setLocalStorage()
  // возвращаем заглушку если задач нет
  checkEmptyList()
}
tasksList.addEventListener('click', deleteTask)
//Завершение задачи
const doneTask = (event) => {
  //Проверяем клик по кнопке Done
  // если нет то закрываем функцию
  if (event.target.dataset.action === 'done') {
    return
  }
  const taskItem = event.target.closest('li');

  const itemId = Number(taskItem.id);

  const task = tasksArray.find(task => task.id === itemId)

  task.isDone = !task.isDone

  taskItem.querySelector('span').classList.toggle('task-title--done');

  setLocalStorage()
}
tasksList.addEventListener('click', doneTask)

function setLocalStorage() {
  localStorage.setItem('tasks', JSON.stringify(tasksArray))
}

function renderHtml(task) {
  const doneTask = task.isDone ? 'task-title task-title--done' : 'task-title';
  // формируем разметку для новой задачи
  const taskHtml = `
                        <li id="${task.id}" class="list-group-item d-flex justify-content-between task-item">
                            <span class="${doneTask}">${task.title}</span>
                                <div class="task-item__buttons">
                                    <button type="button" data-action="done" class="btn-action">
                                        <img src="./img/tick.svg" alt="Done" width="18" height="18">
                                    </button>
                                    <button type="button" data-action="delete" class="btn-action">
                                        <img src="./img/cross.svg" alt="Done" width="18" height="18">
                                    </button>
                                </div>
                        </li>
  `
  tasksList.insertAdjacentHTML("beforeend", taskHtml)
}
