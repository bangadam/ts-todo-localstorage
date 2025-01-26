// define todo interface
interface Todo {
	id: string;
	text: string;
	completed: boolean;
}

// DOM elements
const todoInput = document.getElementById("todoInput") as HTMLInputElement;
const addTodoBtn = document.getElementById("addTodo") as HTMLButtonElement;
const todoList = document.getElementById("todoList") as HTMLUListElement;

// load todos from local storage
let todos: Todo[] = JSON.parse(localStorage.getItem("todos") || "[]");

let currentFilter: "all" | "completed" | "active" = "all";

// render todos
renderTodos();

// add todo
addTodoBtn.addEventListener("click", () => {
	const text = todoInput.value.trim();
	if (!text) return;

	const newTodo: Todo = {
		id: new Date().getTime().toString(),
		text,
		completed: false,
	};

	todos.push(newTodo);
	saveTodos();
	renderTodos();
	todoInput.value = "";
});

// toggle todo completion
todoList.addEventListener("click", (e) => {
	const target = e.target as HTMLElement;
	if (target.classList.contains("toggle-btn")) {
		const id = target.dataset.id;
		todos = todos.map((todo) =>
			todo.id === id ? { ...todo, completed: !todo.completed } : todo
		);
		saveTodos();
		renderTodos();
	}
});

// Delete todo (event delegation)
todoList.addEventListener("click", (e) => {
	const target = e.target as HTMLElement;
	if (target.classList.contains("delete-btn")) {
		const id = target.dataset.id;
		todos = todos.filter((todo) => todo.id !== id);
		saveTodos();
		renderTodos();
	}
});

// add double click event to edit todo
todoList.addEventListener("dblclick", (e) => {
	const target = e.target as HTMLElement;
	if (target.classList.contains("todo-text")) {
		const todoItem = target.closest(".todo-item") as HTMLDivElement;
		const textSpan = todoItem.querySelector(".todo-text") as HTMLSpanElement;
		const editInput = todoItem.querySelector(".edit-input") as HTMLInputElement;

		textSpan.hidden = true;
		editInput.hidden = false;
		editInput.focus();

		// save on enter key or blur
		editInput.addEventListener("keypress", (e) => {
			if (e.key === "Enter") {
				saveEdit(todoItem, editInput.value);
			}
		});

		editInput.addEventListener("blur", () => {
			saveEdit(todoItem, editInput.value);
		});
	}
});

// filter buttons event listener
document.querySelector(".filters")!.addEventListener("click", (e) => {
	const target = e.target as HTMLElement;
	if (target.classList.contains("filter-btn")) {
		currentFilter = target.dataset.filter as any;
		document.querySelectorAll(".filter-btn").forEach((btn) => {
			btn.classList.remove("active");
		});

		target.classList.add("active");
		renderTodos();
	}
});

// save todos to local storage
function saveTodos(): void {
	localStorage.setItem("todos", JSON.stringify(todos));
}

// render todos
function renderTodos(): void {
	todoList.innerHTML = "";

	const filteredTodos = todos.filter((todo) => {
		if (currentFilter === "all") return true;
		if (currentFilter === "completed") return todo.completed;
		if (currentFilter === "active") return !todo.completed;
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

// save edited todo
function saveEdit(todoItem: HTMLDivElement, text: string): void {
	const id = todoItem.querySelector("button")!.dataset.id!;
	todos = todos.map((todo) => (todo.id === id ? { ...todo, text } : todo));
	saveTodos();
	renderTodos();
}
