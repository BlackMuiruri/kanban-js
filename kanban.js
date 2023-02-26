export default class Kanban {

    static getTasks(columnId) {
        const data = read().find(column => column.columnId == columnId)

        return data.tasks;
    }

    static insertTask(columnId, content) {
        const data = read();
        const column = data.find(column => column.columnId == columnId);
        const task = {
            taskId: Math.floor(Math.random() * 100000),
            content: content.trim()
        }

        column.tasks.push(task);
        save(data);

        return task;
    }

    static updateTask(taskId, { columnId, content }) {
        const data = read();

        function findColumnTask() {
            for (const column of data) {
                const task = Kanban.getTask(column, taskId);

                if (task) {
                    return [task, column];
                }
            }
        }
        const [task, currentColumn] = findColumnTask();

        const targetColumn = data.find(column => column.columnId == columnId);

        task.content = content;
        if (targetColumn != currentColumn) {
            currentColumn.tasks.splice(currentColumn.tasks.indexOf(task), 1);
            targetColumn.tasks.push(task);
        }

        save(data);
    }

    static deleteTask(taskId) {
        const data = read();

        for (const column of data) {
            const task = this.getTask(column, taskId);
            if (task) {
                column.tasks.splice(column.tasks.indexOf(task), 1);
            }
        }

        save(data);
    }

    static getAllTasks() {
        const data = read();
        columnCount();
        return [data[0].tasks, data[1].tasks, data[2].tasks];
    }

    static getTask(column, taskId) {
        return column.tasks.find(task => task.taskId == taskId)
    }
}

function read() {
    const data = localStorage.getItem("data");

    if (!data) {
        return [
            { columnId: 0, tasks: [] },
            { columnId: 1, tasks: [] },
            { columnId: 2, tasks: [] }
        ];
    }
    return JSON.parse(data);
}

function save(data) {
    localStorage.setItem("data", JSON.stringify(data))
    columnCount();
}

export function columnCount() {
    const data = read();
    const taskboxTitle = document.querySelectorAll(".taskbox .title span");
    data.forEach((column, index) => {
        taskboxTitle[index].textContent = column.tasks.length;
    });
}