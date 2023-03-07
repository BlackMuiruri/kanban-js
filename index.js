import Kanban from "./kanban.js";

const taskbox = document.querySelectorAll(".taskbox .cards");
const addForm = document.querySelectorAll(".taskbox form.add");

const [todo, pending, completed] = taskbox;

function generateCard(taskId, columnId, content) {
    const element = document.createElement("form");
    element.removeAttribute("action")
    element.dataset.id = taskId;
    element.className = "card";
    element.draggable = true;
    element.innerHTML = `
        <input type="text" name="task" autocomplete="off" value="${content}" disabled="disabled">
        <div>
            <span class="task-id">#${taskId}</span>
            <span>
                <button class="bi bi-pencil edit" data-id="${taskId}"></button>
                <button class="bi bi-check-lg update hide" data-id="${taskId}" data-column="${columnId}"></button>
                <button class="bi bi-trash3 delete" data-id="${taskId}"></button>
            </span>
        </div>
    `
    return element
}

function addTaskCard(task, index) {
    const card = generateCard(task.taskId, index, task.content);
    taskbox[index].appendChild(card);

}

Kanban.getAllTasks().forEach((column, index) => {
    column.forEach(task => {
        addTaskCard(task, index);
    });
});

addForm.forEach(form => {
    form.addEventListener("submit", event => {
        event.preventDefault();
        let value = form.task.value.trim();
        if (value) {
            let columnId = form.submit.dataset.id;
            const task = Kanban.insertTask(columnId, value)
            addTaskCard(task, columnId);
            form.reset();
        } else {
            form.task.focus();
        }
    });
});

taskbox.forEach(column => {
    column.addEventListener("click", event => {
        event.preventDefault();
        const formInput = event.target.parentElement.parentElement.previousElementSibling;

        if(event.target.classList.contains("edit")) {
            formInput.removeAttribute("disabled");
            event.target.classList.add("hide");
            event.target.nextElementSibling.classList.remove("hide");
        }

        if(event.target.classList.contains("update")) {
            const content = formInput.value.trim();
            if (content) {
                formInput.disabled="disabled";
                event.target.classList.add("hide");
                event.target.previousElementSibling.classList.remove("hide");

                const taskId = event.target.dataset.id;
                const columnId = event.target.dataset.column;
                Kanban.updateTask(taskId, {columnId, content})
            } else {
                formInput.focus();
            }
        }

        if (event.target.classList.contains("delete")) {
            Kanban.deleteTask(event.target.dataset.id);
            formInput.parentElement.remove();
        }
    });

    column.addEventListener("dragstart", event => {
        if (event.target.classList.contains("card")){
            event.target.classList.add("dragging");
        }
    });

    column.addEventListener("dragover", event => {
        const card = document.querySelector(".dragging");
        column.appendChild(card);
    });

    column.addEventListener("dragend", event => {
        if (event.target.classList.contains("card")){
            event.target.classList.remove("dragging");
            
            const taskId = event.target.dataset.id;
            const columnId = event.target.parentElement.dataset.id;
            const content = event.target.task.value;

            Kanban.updateTask(taskId, {columnId, content});
        }
        
    });
    
});
