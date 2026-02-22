import { v4 as uuidv4 } from "https://jspm.dev/uuid";
import { initialTodos, validationConfig } from "../utils/constants.js";
import Todo from "../components/Todo.js";
import FormValidator from "../components/FormValidator.js";
import Section from "../components/Section.js";
import PopupWithForm from "../components/PopupWithForm.js";
import TodoCounter from "../components/TodoCounter.js";

const addTodoButton = document.querySelector(".button_action_add");
const addTodoPopupEl = document.querySelector("#add-todo-popup");
const addTodoForm = addTodoPopupEl.querySelector(".popup__form");

const generateTodo = (data) => {
  const todo = new Todo({
    data: data,
    selector: "#todo-template",
    handleCheck: (boolean) => {
      todoCounter.updateCompleted(boolean);
    },
    handleTotal: (boolean) => {
      todoCounter.updateTotal(boolean);
    },
  });
  const todoElement = todo.getView();
  return todoElement;
};

const section = new Section({
  items: initialTodos,
  renderer: (item) => {
    const todo = generateTodo(item);
    section.addItem(todo);
  },
  containerSelector: ".todos__list",
});

section.renderItems();

const todoCounter = new TodoCounter({
  todos: initialTodos,
  selector: ".counter__text",
});

const addTodoPopup = new PopupWithForm({
  popupSelector: "#add-todo-popup",
  handleFormSubmit: (data) => {
    const name = data.name;

    // Create a date object and adjust for timezone
    const date = new Date(data.date);
    date.setMinutes(date.getMinutes() + date.getTimezoneOffset());

    const id = uuidv4();

    const values = { name, date, id };
    const todo = generateTodo(values);
    section.addItem(todo);

    newTodoValidator.resetValidation();
    todoCounter.updateTotal(true);
    addTodoPopup.close();
  },
});

addTodoPopup.setEventListeners();

addTodoButton.addEventListener("click", () => {
  addTodoPopup.open();
});

const newTodoValidator = new FormValidator(validationConfig, addTodoForm);
newTodoValidator.enableValidation();
