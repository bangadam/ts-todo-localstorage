// src/app.ts
var todoInput = document.getElementById("todoInput");
var addTodoBtn = document.getElementById("addTodo");
var todoList = document.getElementById("todoList");
var todos = JSON.parse(localStorage.getItem("todos") || "[]");
var currentFilter = "all";
renderTodos();
addTodoBtn.addEventListener("click", () => {
  const text = todoInput.value.trim();
  if (!text)
    return;
  const newTodo = {
    id: new Date().getTime().toString(),
    text,
    completed: false
  };
  todos.push(newTodo);
  saveTodos();
  renderTodos();
  todoInput.value = "";
});
todoList.addEventListener("click", (e) => {
  const target = e.target;
  if (target.classList.contains("toggle-btn")) {
    const id = target.dataset.id;
    todos = todos.map((todo) => todo.id === id ? { ...todo, completed: !todo.completed } : todo);
    saveTodos();
    renderTodos();
  }
});
todoList.addEventListener("click", (e) => {
  const target = e.target;
  if (target.classList.contains("delete-btn")) {
    const id = target.dataset.id;
    todos = todos.filter((todo) => todo.id !== id);
    saveTodos();
    renderTodos();
  }
});
todoList.addEventListener("dblclick", (e) => {
  const target = e.target;
  if (target.classList.contains("todo-text")) {
    const todoItem = target.closest(".todo-item");
    const textSpan = todoItem.querySelector(".todo-text");
    const editInput = todoItem.querySelector(".edit-input");
    textSpan.hidden = true;
    editInput.hidden = false;
    editInput.focus();
    editInput.addEventListener("keypress", (e2) => {
      if (e2.key === "Enter") {
        saveEdit(todoItem, editInput.value);
      }
    });
    editInput.addEventListener("blur", () => {
      saveEdit(todoItem, editInput.value);
    });
  }
});
function handleFilterClick(event) {
  const target = event.target;
  if (!target.classList.contains("filter-btn"))
    return;
  document.querySelectorAll(".filter-btn").forEach((btn) => {
    btn.classList.remove("active");
  });
  target.classList.add("active");
  const filter = target.dataset.filter;
  filterTodos(filter);
}
document.querySelector(".flex.justify-center.gap-2")?.addEventListener("click", handleFilterClick);
function filterTodos(filter = "all") {
  const todos2 = document.querySelectorAll(".todo-item");
  todos2.forEach((todo) => {
    switch (filter) {
      case "active":
        todo.classList.toggle("hidden", todo.classList.contains("completed"));
        break;
      case "completed":
        todo.classList.toggle("hidden", !todo.classList.contains("completed"));
        break;
      default:
        todo.classList.remove("hidden");
    }
  });
}
function saveTodos() {
  localStorage.setItem("todos", JSON.stringify(todos));
}
function renderTodos() {
  todoList.innerHTML = "";
  const filteredTodos = todos.filter((todo) => {
    if (currentFilter === "all")
      return true;
    if (currentFilter === "completed")
      return todo.completed;
    if (currentFilter === "active")
      return !todo.completed;
  });
  filteredTodos.forEach((todo) => {
    const todoDiv = document.createElement("div");
    todoDiv.className = `todo-item ${todo.completed ? "completed" : ""}`;
    todoDiv.innerHTML = `
            <span class="todo-text">${todo.text}</span>
            <input type="text" class="edit-input" value="${todo.text}" hidden />
            <div>
            <button class="toggle-btn" data-id="${todo.id}">Toggle</button>
            <button class="delete-btn" data-id="${todo.id}">Delete</button>
            </div>
        `;
    todoList.appendChild(todoDiv);
  });
}
function saveEdit(todoItem, text) {
  const id = todoItem.querySelector("button").dataset.id;
  todos = todos.map((todo) => todo.id === id ? { ...todo, text } : todo);
  saveTodos();
  renderTodos();
}
