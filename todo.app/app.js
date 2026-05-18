const addTodoBtn = document.getElementById("addTodoBtn")
const inputTag = document.getElementById("todoInput")
const todoListUl = document.getElementById("todoList")
const remaining = document.getElementById("remaining-count")
const clearCompletedBtn = document.getElementById("clearCompletedBtn")
const filterButtons = document.querySelectorAll(".filter-btn")

let todoText;
let todos = []
let currentFilter = "all"
const todosString = localStorage.getItem("todos")

const saveTodos = () => {
    localStorage.setItem("todos", JSON.stringify(todos))
}

const removeTodosByTitle = (titles) => {
    const titleSet = new Set(titles.map((title) => title.trim().toLowerCase()))
    const originalLength = todos.length
    todos = todos.filter(
        (todo) => !titleSet.has(todo.title.trim().toLowerCase())
    )
    if (todos.length !== originalLength) {
        saveTodos()
    }
}

if (todosString) {
    todos = JSON.parse(todosString)
    removeTodosByTitle(["PD", "Ram", "SBGI", "XNXXX"])
}

const updateRemainingCount = () => {
    const count = todos.filter((item) => !item.isCompleted).length
    remaining.innerHTML = `${count} item${count === 1 ? "" : "s"} left`
}

const getVisibleTodos = () => {
    if (currentFilter === "active") {
        return todos.filter((todo) => !todo.isCompleted)
    }
    if (currentFilter === "completed") {
        return todos.filter((todo) => todo.isCompleted)
    }
    return todos
}

const setFilter = (filter) => {
    currentFilter = filter
    filterButtons.forEach((btn) => {
        btn.classList.toggle("active", btn.dataset.filter === filter)
    })
    populateTodos()
}

const toggleTodoCompletion = (todoId, isCompleted) => {
    todos = todos.map((todo) =>
        todo.id === todoId ? { ...todo, isCompleted } : todo
    )
    saveTodos()
    updateRemainingCount()
    populateTodos()
}

const deleteTodo = (todoId) => {
    todos = todos.filter((todo) => todo.id !== todoId)
    saveTodos()
    populateTodos()
}

const populateTodos = () => {
    const visibleTodos = getVisibleTodos()
    let string = ""

    for (const todo of visibleTodos) {
        string += `<li id="${todo.id}" class="todo-item ${todo.isCompleted ? "completed" : ""}">
            <input type="checkbox" class="todo-checkbox" ${todo.isCompleted ? "checked" : ""}>
            <span class="todo-text">${todo.title}</span>
            <button class="delete-btn">×</button>
        </li>`
    }

    todoListUl.innerHTML = string
    updateRemainingCount()

    const todoCheckboxes = todoListUl.querySelectorAll(".todo-checkbox")
    todoCheckboxes.forEach((checkbox) => {
        checkbox.addEventListener("change", (e) => {
            const todoId = e.target.closest("li").id
            toggleTodoCompletion(todoId, e.target.checked)
        })
    })

    const deleteBtns = todoListUl.querySelectorAll(".delete-btn")
    deleteBtns.forEach((button) => {
        button.addEventListener("click", (e) => {
            const todoId = e.target.closest("li").id
            const confirmation = confirm("Do you want to delete this todo?")
            if (confirmation) {
                deleteTodo(todoId)
            }
        })
    })
}

filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
        setFilter(button.dataset.filter)
    })
})

clearCompletedBtn.addEventListener("click", () => {
    todos = todos.filter((todo) => !todo.isCompleted)
    saveTodos()
    populateTodos()
})

addTodoBtn.addEventListener("click", () => {
    todoText = inputTag.value.trim()
    if (todoText.length < 4) {
        alert("You cannot add a todo that small!")
        return
    }

    todos.push({
        id: "todo-" + Date.now(),
        title: todoText,
        isCompleted: false,
    })
    inputTag.value = ""
    saveTodos()
    populateTodos()
})

inputTag.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
        addTodoBtn.click()
    }
})

setFilter(currentFilter)

