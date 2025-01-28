// Simple Task Management System
class TaskManager {
    constructor() {
        this.tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        this.setupEventListeners();
        this.updateUI();
    }

    setupEventListeners() {
        // Add task
        document.getElementById('addTask').addEventListener('click', () => this.addTask());
        document.getElementById('taskInput').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.addTask();
        });

        // Filter buttons
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                this.filterTasks(e.target.dataset.filter);
            });
        });
    }

    addTask() {
        const input = document.getElementById('taskInput');
        const priority = document.getElementById('taskPriority');
        
        if (input.value.trim() === '') {
            alert('Please enter a task!');
            return;
        }

        const task = {
            id: Date.now(),
            text: input.value.trim(),
            completed: false,
            priority: priority.value
        };

        this.tasks.unshift(task);
        this.saveTasks();
        this.updateUI();

        input.value = '';
        priority.value = 'low';
    }

    toggleTask(id) {
        const task = this.tasks.find(t => t.id === id);
        if (task) {
            task.completed = !task.completed;
            this.saveTasks();
            this.updateUI();
        }
    }

    deleteTask(id) {
        const taskIndex = this.tasks.findIndex(t => t.id === id);
        if (taskIndex > -1) {
            this.tasks.splice(taskIndex, 1);
            this.saveTasks();
            this.updateUI();
        }
    }

    editTask(id) {
        const task = this.tasks.find(t => t.id === id);
        if (task) {
            const newText = prompt('Edit task:', task.text);
            if (newText !== null && newText.trim() !== '') {
                task.text = newText.trim();
                this.saveTasks();
                this.updateUI();
            }
        }
    }

    filterTasks(filter) {
        const taskElements = document.querySelectorAll('.task-item');
        taskElements.forEach(element => {
            const isCompleted = element.classList.contains('completed');
            if (filter === 'all') {
                element.style.display = 'flex';
            } else if (filter === 'active' && !isCompleted) {
                element.style.display = 'flex';
            } else if (filter === 'completed' && isCompleted) {
                element.style.display = 'flex';
            } else {
                element.style.display = 'none';
            }
        });
    }

    updateUI() {
        const taskList = document.getElementById('taskList');
        taskList.innerHTML = '';

        this.tasks.forEach(task => {
            const taskElement = this.createTaskElement(task);
            taskList.appendChild(taskElement);
        });

        this.updateStats();
    }

    createTaskElement(task) {
        const taskElement = document.createElement('div');
        taskElement.className = `task-item ${task.completed ? 'completed' : ''}`;
        taskElement.dataset.id = task.id;

        taskElement.innerHTML = `
            <div class="task-content">
                <div class="task-checkbox ${task.completed ? 'checked' : ''}"
                     onclick="taskManager.toggleTask(${task.id})"></div>
                <span class="task-text ${task.completed ? 'completed' : ''}">${task.text}</span>
            </div>
            <div class="task-meta">
                <span class="task-priority ${task.priority}">${task.priority}</span>
            </div>
            <div class="task-actions">
                <button class="task-button edit" onclick="taskManager.editTask(${task.id})">Edit</button>
                <button class="task-button delete" onclick="taskManager.deleteTask(${task.id})">Delete</button>
            </div>
        `;

        return taskElement;
    }

    updateStats() {
        document.getElementById('totalTasks').textContent = this.tasks.length;
        document.getElementById('completedTasks').textContent = this.tasks.filter(t => t.completed).length;
        document.getElementById('pendingTasks').textContent = this.tasks.filter(t => !t.completed).length;
    }

    saveTasks() {
        localStorage.setItem('tasks', JSON.stringify(this.tasks));
    }
}

// Initialize Task Manager
const taskManager = new TaskManager();