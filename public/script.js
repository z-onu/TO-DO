// Todoist Clone JavaScript

// State Management
class TodoistApp {
    constructor() {
        this.tasks = [];
        this.projects = [
            { id: 'home', name: 'Home 🏠', color: 'orange', taskCount: 0 }
        ];
        this.selectedView = 'inbox';
        this.selectedProject = null;
        this.editingTaskId = null;
        this.searchQuery = '';
        this.intervalRefs = {};
        
        this.init();
    }

    init() {
        this.loadData();
        this.bindEvents();
        this.render();
        this.updateCounts();
    }

    // Data persistence
    saveData() {
        localStorage.setItem('todoist_tasks', JSON.stringify(this.tasks));
        localStorage.setItem('todoist_projects', JSON.stringify(this.projects));
    }

    loadData() {
        const savedTasks = localStorage.getItem('todoist_tasks');
        const savedProjects = localStorage.getItem('todoist_projects');
        
        if (savedTasks) {
            this.tasks = JSON.parse(savedTasks);
        }
        
        if (savedProjects) {
            this.projects = JSON.parse(savedProjects);
        }
    }

    // Event bindings
    bindEvents() {
        // Navigation
        document.querySelectorAll('.nav-item').forEach(item => {
            item.addEventListener('click', (e) => {
                const view = e.currentTarget.dataset.view;
                this.selectView(view);
            });
        });

        // Search
        document.getElementById('search-input').addEventListener('input', (e) => {
            this.searchQuery = e.target.value;
            this.render();
        });

        // Task input
        document.getElementById('main-task-input').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.addTask();
            }
        });

        // Projects toggle
        document.querySelector('.projects-toggle').addEventListener('click', () => {
            this.toggleProjects();
        });

        // Add project form
        document.getElementById('new-project-input').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.addProject();
            } else if (e.key === 'Escape') {
                this.hideAddProjectForm();
            }
        });

        // Modal close
        document.getElementById('modal-overlay').addEventListener('click', (e) => {
            if (e.target === e.currentTarget) {
                this.closeTaskModal();
            }
        });
    }

    // Task management
    addTask() {
        const input = document.getElementById('main-task-input');
        const text = input.value.trim();
        
        if (!text) return;

        const task = {
            id: Date.now(),
            text,
            completed: false,
            date: new Date().toISOString().split('T')[0],
            project: this.selectedProject || 'home',
            priority: 'normal',
            createdAt: new Date().toLocaleTimeString(),
            timer: {
                mode: 'stopwatch',
                isRunning: false,
                time: 0,
                targetTime: 300,
                showSettings: false
            },
            notes: {
                content: '',
                showNotes: false
            },
            subtasks: [],
            comments: [],
            labels: [],
            location: '',
            reminders: [],
            showDetails: false
        };

        this.tasks.push(task);
        input.value = '';
        this.saveData();
        this.render();
        this.updateCounts();
    }

    toggleTask(taskId) {
        const task = this.tasks.find(t => t.id === taskId);
        if (task) {
            task.completed = !task.completed;
            this.saveData();
            this.render();
            this.updateCounts();
        }
    }

    deleteTask(taskId) {
        // Clear any running timer
        if (this.intervalRefs[taskId]) {
            clearInterval(this.intervalRefs[taskId]);
            delete this.intervalRefs[taskId];
        }

        this.tasks = this.tasks.filter(t => t.id !== taskId);
        this.saveData();
        this.render();
        this.updateCounts();
    }

    editTask(taskId) {
        this.editingTaskId = taskId;
        this.render();
        
        // Focus on edit input
        setTimeout(() => {
            const editInput = document.querySelector('.task-edit input');
            if (editInput) {
                editInput.focus();
                editInput.select();
            }
        }, 10);
    }

    saveTaskEdit(taskId, newText) {
        if (!newText.trim()) return;
        
        const task = this.tasks.find(t => t.id === taskId);
        if (task) {
            task.text = newText.trim();
            this.editingTaskId = null;
            this.saveData();
            this.render();
        }
    }

    cancelTaskEdit() {
        this.editingTaskId = null;
        this.render();
    }

    toggleTaskDetails(taskId) {
        const task = this.tasks.find(t => t.id === taskId);
        if (task) {
            task.showDetails = !task.showDetails;
            this.render();
        }
    }

    // Subtask management
    addSubtask(taskId, subtaskText) {
        if (!subtaskText.trim()) return;

        const task = this.tasks.find(t => t.id === taskId);
        if (task) {
            const subtask = {
                id: Date.now(),
                text: subtaskText.trim(),
                completed: false
            };
            task.subtasks.push(subtask);
            this.saveData();
            this.render();
        }
    }

    toggleSubtask(taskId, subtaskId) {
        const task = this.tasks.find(t => t.id === taskId);
        if (task) {
            const subtask = task.subtasks.find(st => st.id === subtaskId);
            if (subtask) {
                subtask.completed = !subtask.completed;
                this.saveData();
                this.render();
            }
        }
    }

    deleteSubtask(taskId, subtaskId) {
        const task = this.tasks.find(t => t.id === taskId);
        if (task) {
            task.subtasks = task.subtasks.filter(st => st.id !== subtaskId);
            this.saveData();
            this.render();
        }
    }

    // Comments
    addComment(taskId, commentText) {
        if (!commentText.trim()) return;

        const task = this.tasks.find(t => t.id === taskId);
        if (task) {
            const comment = {
                id: Date.now(),
                text: commentText.trim(),
                timestamp: new Date().toLocaleString(),
                author: 'MR'
            };
            task.comments.push(comment);
            this.saveData();
            this.render();
        }
    }

    // Task properties
    updateTaskPriority(taskId, priority) {
        const task = this.tasks.find(t => t.id === taskId);
        if (task) {
            task.priority = priority;
            this.saveData();
            this.render();
        }
    }

    updateTaskDate(taskId, date) {
        const task = this.tasks.find(t => t.id === taskId);
        if (task) {
            task.date = date;
            this.saveData();
            this.render();
        }
    }

    updateLocation(taskId, location) {
        const task = this.tasks.find(t => t.id === taskId);
        if (task) {
            task.location = location;
            this.saveData();
        }
    }

    addLabel(taskId, label) {
        if (!label.trim()) return;

        const task = this.tasks.find(t => t.id === taskId);
        if (task && !task.labels.includes(label.trim())) {
            task.labels.push(label.trim());
            this.saveData();
            this.render();
        }
    }

    removeLabel(taskId, labelToRemove) {
        const task = this.tasks.find(t => t.id === taskId);
        if (task) {
            task.labels = task.labels.filter(label => label !== labelToRemove);
            this.saveData();
            this.render();
        }
    }

    addReminder(taskId, reminderDate) {
        if (!reminderDate) return;

        const task = this.tasks.find(t => t.id === taskId);
        if (task) {
            task.reminders.push(reminderDate);
            this.saveData();
            this.render();
        }
    }

    // Notes
    updateNotes(taskId, content) {
        const task = this.tasks.find(t => t.id === taskId);
        if (task) {
            task.notes.content = content;
            this.saveData();
        }
    }

    toggleNotes(taskId) {
        const task = this.tasks.find(t => t.id === taskId);
        if (task) {
            task.notes.showNotes = !task.notes.showNotes;
            this.render();
        }
    }

    // Timer functions
    toggleTimer(taskId) {
        const task = this.tasks.find(t => t.id === taskId);
        if (!task) return;

        const newIsRunning = !task.timer.isRunning;
        task.timer.isRunning = newIsRunning;

        if (newIsRunning) {
            this.intervalRefs[taskId] = setInterval(() => {
                if (task.timer.mode === 'stopwatch') {
                    task.timer.time++;
                } else {
                    task.timer.time = Math.max(0, task.timer.time - 1);
                    
                    if (task.timer.time === 0 && task.timer.mode === 'timer') {
                        this.showTimerAlert(task.text);
                        task.timer.isRunning = false;
                        clearInterval(this.intervalRefs[taskId]);
                        delete this.intervalRefs[taskId];
                    }
                }
                this.updateTimerDisplay(taskId);
            }, 1000);
        } else {
            if (this.intervalRefs[taskId]) {
                clearInterval(this.intervalRefs[taskId]);
                delete this.intervalRefs[taskId];
            }
        }

        this.render();
    }

    resetTimer(taskId) {
        const task = this.tasks.find(t => t.id === taskId);
        if (!task) return;

        if (this.intervalRefs[taskId]) {
            clearInterval(this.intervalRefs[taskId]);
            delete this.intervalRefs[taskId];
        }

        task.timer.time = task.timer.mode === 'timer' ? task.timer.targetTime : 0;
        task.timer.isRunning = false;
        this.render();
    }

    updateTimerDisplay(taskId) {
        const timerDisplay = document.querySelector(`[data-task-id="${taskId}"] .timer-display`);
        if (timerDisplay) {
            const task = this.tasks.find(t => t.id === taskId);
            if (task) {
                timerDisplay.textContent = this.formatTime(task.timer.time);
                
                // Add warning class for timer mode when time is low
                if (task.timer.mode === 'timer' && task.timer.time <= 10 && task.timer.time > 0) {
                    timerDisplay.classList.add('warning');
                } else {
                    timerDisplay.classList.remove('warning');
                }
            }
        }
    }

    showTimerAlert(taskText) {
        // Play alert sound
        const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+LyvmIbAjih2/LMeSQFjMrr2QAAABcAAADfCAAAAgAAAA==');
        audio.play().catch(e => console.log('Audio play failed:', e));
        
        // Show browser notification if permission granted
        if (Notification.permission === 'granted') {
            new Notification('Timer Finished!', {
                body: `Timer for "${taskText}" has finished!`,
                icon: '⏰'
            });
        }
        
        // Fallback alert
        alert(`⏰ Timer finished for: "${taskText}"`);
    }

    formatTime(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }

    // Project management
    addProject() {
        const input = document.getElementById('new-project-input');
        const name = input.value.trim();
        
        if (!name) return;

        const project = {
            id: Date.now().toString(),
            name,
            color: 'blue',
            taskCount: 0
        };

        this.projects.push(project);
        input.value = '';
        this.hideAddProjectForm();
        this.saveData();
        this.renderProjects();
    }

    selectProject(projectId) {
        this.selectedProject = projectId;
        this.selectedView = '';
        this.updateNavigation();
        this.render();
    }

    // View management
    selectView(view) {
        this.selectedView = view;
        this.selectedProject = null;
        this.updateNavigation();
        this.render();
    }

    updateNavigation() {
        // Update nav items
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.remove('active');
            if (item.dataset.view === this.selectedView && !this.selectedProject) {
                item.classList.add('active');
            }
        });

        // Update project items
        document.querySelectorAll('.project-item').forEach(item => {
            item.classList.remove('active');
            if (item.dataset.project === this.selectedProject) {
                item.classList.add('active');
            }
        });

        // Update view title
        this.updateViewTitle();
    }

    updateViewTitle() {
        const titleEl = document.getElementById('view-title');
        
        if (this.selectedProject) {
            const project = this.projects.find(p => p.id === this.selectedProject);
            titleEl.textContent = project ? project.name : 'Project';
        } else {
            switch (this.selectedView) {
                case 'today':
                    titleEl.textContent = 'Today';
                    break;
                case 'upcoming':
                    titleEl.textContent = 'Upcoming';
                    break;
                case 'inbox':
                    titleEl.textContent = 'Inbox';
                    break;
                case 'completed':
                    titleEl.textContent = 'Completed';
                    break;
                default:
                    titleEl.textContent = 'Tasks';
            }
        }
    }

    // Filtering
    getFilteredTasks() {
        let filtered = this.tasks;
        const today = new Date().toISOString().split('T')[0];

        // Filter by view
        if (this.selectedView === 'today') {
            filtered = filtered.filter(task => task.date === today);
        } else if (this.selectedView === 'upcoming') {
            filtered = filtered.filter(task => task.date >= today);
        } else if (this.selectedView === 'inbox') {
            filtered = filtered.filter(task => !task.completed);
        } else if (this.selectedView === 'completed') {
            filtered = filtered.filter(task => task.completed);
        }

        // Filter by project
        if (this.selectedProject) {
            filtered = filtered.filter(task => task.project === this.selectedProject);
        }

        // Filter by search
        if (this.searchQuery) {
            filtered = filtered.filter(task => 
                task.text.toLowerCase().includes(this.searchQuery.toLowerCase())
            );
        }

        return filtered;
    }

    // UI Updates
    updateCounts() {
        const today = new Date().toISOString().split('T')[0];
        
        // Update nav counts
        document.getElementById('inbox-count').textContent = 
            this.tasks.filter(t => !t.completed).length;
        document.getElementById('today-count').textContent = 
            this.tasks.filter(t => t.date === today && !t.completed).length;
        document.getElementById('completed-count').textContent = 
            this.tasks.filter(t => t.completed).length;

        // Update project counts
        this.projects.forEach(project => {
            project.taskCount = this.tasks.filter(t => t.project === project.id && !t.completed).length;
        });

        // Update task summary
        const filteredTasks = this.getFilteredTasks();
        const activeTasks = filteredTasks.filter(task => !task.completed);
        document.getElementById('task-summary').textContent = 
            `${activeTasks.length} task${activeTasks.length !== 1 ? 's' : ''}`;
    }

    // Rendering
    render() {
        this.renderTasks();
        this.updateCounts();
    }

    renderTasks() {
        const tasksContainer = document.getElementById('tasks-list');
        const emptyState = document.getElementById('empty-state');
        const filteredTasks = this.getFilteredTasks();

        if (filteredTasks.length === 0) {
            emptyState.classList.remove('hidden');
            tasksContainer.classList.remove('visible');
            return;
        }

        emptyState.classList.add('hidden');
        tasksContainer.classList.add('visible');
        tasksContainer.innerHTML = '';

        filteredTasks.forEach(task => {
            const taskEl = this.createTaskElement(task);
            tasksContainer.appendChild(taskEl);
        });
    }

    createTaskElement(task) {
        const div = document.createElement('div');
        div.className = `task-item ${task.completed ? 'completed' : ''}`;
        div.dataset.taskId = task.id;

        const isEditing = this.editingTaskId === task.id;
        const project = this.projects.find(p => p.id === task.project);

        div.innerHTML = `
            <div class="task-main">
                <i class="task-checkbox ${task.completed ? 'fas fa-check-circle completed' : 'far fa-circle'}" 
                   onclick="app.toggleTask(${task.id})"></i>
                
                <div class="task-content">
                    ${isEditing ? this.createTaskEditHTML(task) : this.createTaskContentHTML(task, project)}
                </div>

                ${!isEditing ? this.createTaskActionsHTML(task) : ''}
            </div>

            ${task.showDetails ? this.createTaskDetailsHTML(task) : ''}
            ${this.createTimerSectionHTML(task)}
        `;

        return div;
    }

    createTaskEditHTML(task) {
        return `
            <div class="task-edit">
                <input type="text" value="${task.text}" onkeydown="handleTaskEditKeydown(event, ${task.id})">
                <div class="task-edit-actions">
                    <button class="task-edit-btn save" onclick="app.saveTaskEdit(${task.id}, this.parentElement.parentElement.querySelector('input').value)">
                        <i class="fas fa-check"></i>
                    </button>
                    <button class="task-edit-btn cancel" onclick="app.cancelTaskEdit()">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
            </div>
        `;
    }

    createTaskContentHTML(task, project) {
        const completedSubtasks = task.subtasks.filter(st => st.completed).length;
        const totalSubtasks = task.subtasks.length;

        return `
            <div class="task-text ${task.completed ? 'completed' : ''}" 
                 onclick="app.editTask(${task.id})">${task.text}</div>
            <div class="task-meta">
                <span>${task.date}</span>
                <span>#${project?.name || 'Inbox'}</span>
                <span class="task-priority ${task.priority}">
                    <i class="fas fa-flag"></i> ${task.priority}
                </span>
                <span>Added at ${task.createdAt}</span>
                ${totalSubtasks > 0 ? `<span class="task-subtasks">${completedSubtasks}/${totalSubtasks} subtasks</span>` : ''}
                ${task.labels.length > 0 ? `<div class="task-labels">${task.labels.map(label => `<span class="task-label">${label}</span>`).join('')}</div>` : ''}
            </div>
        `;
    }

    createTaskActionsHTML(task) {
        return `
            <div class="task-actions">
                <button class="task-action-btn ${task.showDetails ? 'active' : ''}" 
                        onclick="app.toggleTaskDetails(${task.id})" title="Task Details">
                    <i class="fas fa-chevron-down ${task.showDetails ? 'fa-rotate-180' : ''}"></i>
                </button>
                <button class="task-action-btn" onclick="app.editTask(${task.id})" title="Edit">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="task-action-btn delete" onclick="app.deleteTask(${task.id})" title="Delete">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;
    }

    createTaskDetailsHTML(task) {
        return `
            <div class="task-details">
                ${this.createSubtasksHTML(task)}
                ${this.createTaskSettingsHTML(task)}
                ${this.createCommentsHTML(task)}
            </div>
        `;
    }

    createSubtasksHTML(task) {
        const completedCount = task.subtasks.filter(st => st.completed).length;
        
        return `
            <div class="detail-section">
                <div class="section-header">
                    <i class="fas fa-check-circle"></i>
                    <span>Subtasks (${completedCount}/${task.subtasks.length})</span>
                </div>
                
                <div class="subtask-list">
                    ${task.subtasks.map(subtask => `
                        <div class="subtask-item">
                            <i class="subtask-checkbox ${subtask.completed ? 'fas fa-check-circle completed' : 'far fa-circle'}"
                               onclick="app.toggleSubtask(${task.id}, ${subtask.id})"></i>
                            <span class="subtask-text ${subtask.completed ? 'completed' : ''}">${subtask.text}</span>
                            <button class="subtask-delete" onclick="app.deleteSubtask(${task.id}, ${subtask.id})">
                                <i class="fas fa-times"></i>
                            </button>
                        </div>
                    `).join('')}
                </div>
                
                <div class="input-form">
                    <input type="text" placeholder="Add subtask..." onkeypress="handleSubtaskInput(event, ${task.id})">
                    <button onclick="addSubtaskFromInput(${task.id})">
                        <i class="fas fa-plus"></i>
                    </button>
                </div>
            </div>
        `;
    }

    createTaskSettingsHTML(task) {
        return `
            <div class="detail-section">
                <div class="section-header">
                    <i class="fas fa-cog"></i>
                    <span>Task Settings</span>
                </div>
                
                <div class="settings-grid">
                    <div class="setting-group">
                        <label>Priority</label>
                        <select onchange="app.updateTaskPriority(${task.id}, this.value)">
                            <option value="normal" ${task.priority === 'normal' ? 'selected' : ''}>Normal</option>
                            <option value="medium" ${task.priority === 'medium' ? 'selected' : ''}>Medium</option>
                            <option value="urgent" ${task.priority === 'urgent' ? 'selected' : ''}>Urgent</option>
                        </select>
                    </div>
                    
                    <div class="setting-group">
                        <label>Due Date</label>
                        <input type="date" value="${task.date}" onchange="app.updateTaskDate(${task.id}, this.value)">
                    </div>
                </div>

                <div class="setting-group">
                    <label>Location</label>
                    <div class="location-input">
                        <i class="fas fa-map-marker-alt"></i>
                        <input type="text" placeholder="Add location..." value="${task.location || ''}" 
                               onchange="app.updateLocation(${task.id}, this.value)">
                    </div>
                </div>

                <div class="setting-group">
                    <label>Labels</label>
                    <div class="labels-container">
                        ${task.labels.map(label => `
                            <span class="label-tag">
                                <i class="fas fa-tag"></i>
                                ${label}
                                <button class="label-remove" onclick="app.removeLabel(${task.id}, '${label}')">
                                    <i class="fas fa-times"></i>
                                </button>
                            </span>
                        `).join('')}
                    </div>
                    <div class="input-form">
                        <input type="text" placeholder="Add label..." onkeypress="handleLabelInput(event, ${task.id})">
                        <button onclick="addLabelFromInput(${task.id})">
                            <i class="fas fa-tag"></i>
                        </button>
                    </div>
                </div>

                <div class="setting-group">
                    <label>Reminders</label>
                    <div class="reminders-list">
                        ${task.reminders.map(reminder => `
                            <div class="reminder-item">
                                <i class="fas fa-bell"></i>
                                <span>${new Date(reminder).toLocaleString()}</span>
                            </div>
                        `).join('')}
                    </div>
                    <input type="datetime-local" onchange="if(this.value) app.addReminder(${task.id}, this.value)">
                </div>
            </div>
        `;
    }

    createCommentsHTML(task) {
        return `
            <div class="detail-section">
                <div class="section-header">
                    <i class="fas fa-comment"></i>
                    <span>Comments (${task.comments.length})</span>
                </div>
                
                <div class="comments-list">
                    ${task.comments.map(comment => `
                        <div class="comment-item">
                            <div class="comment-header">
                                <div class="comment-avatar">${comment.author}</div>
                                <span class="comment-timestamp">${comment.timestamp}</span>
                            </div>
                            <div class="comment-text">${comment.text}</div>
                        </div>
                    `).join('')}
                </div>
                
                <div class="input-form">
                    <input type="text" placeholder="Add comment..." onkeypress="handleCommentInput(event, ${task.id})">
                    <button onclick="addCommentFromInput(${task.id})">
                        <i class="fas fa-comment"></i>
                    </button>
                </div>
            </div>
        `;
    }

    createTimerSectionHTML(task) {
        return `
            <div class="timer-section">
                <div class="timer-header">
                    <div class="timer-info">
                        <i class="fas ${task.timer.mode === 'timer' ? 'fa-hourglass-half' : 'fa-clock'}"></i>
                        <span>${task.timer.mode === 'timer' ? 'Timer' : 'Stopwatch'}</span>
                        <span class="timer-display ${task.timer.mode === 'timer' && task.timer.time <= 10 && task.timer.time > 0 ? 'warning' : ''}">
                            ${this.formatTime(task.timer.time)}
                        </span>
                    </div>
                    <div class="timer-options">
                        <button class="task-action-btn ${task.notes.showNotes ? 'active' : ''}" 
                                onclick="app.toggleNotes(${task.id})" title="Toggle Notes">
                            <i class="fas fa-sticky-note"></i>
                        </button>
                    </div>
                </div>

                ${task.notes.showNotes ? this.createNotesHTML(task) : ''}

                <div class="timer-controls">
                    <button class="timer-btn ${task.timer.isRunning ? 'pause' : 'start'}" 
                            onclick="app.toggleTimer(${task.id})">
                        <i class="fas ${task.timer.isRunning ? 'fa-pause' : 'fa-play'}"></i>
                        ${task.timer.isRunning ? 'Pause' : 'Start'}
                    </button>
                    <button class="timer-btn reset" onclick="app.resetTimer(${task.id})">
                        <i class="fas fa-stop"></i>
                        Reset
                    </button>
                </div>
            </div>
        `;
    }

    createNotesHTML(task) {
        return `
            <div class="notes-section">
                <div class="notes-header">
                    <i class="fas fa-sticky-note"></i>
                    <span>Task Notes</span>
                </div>
                <textarea class="notes-textarea" 
                          placeholder="Write your notes, progress updates, thoughts, or reminders here..."
                          oninput="app.updateNotes(${task.id}, this.value)">${task.notes.content}</textarea>
                <div class="notes-footer">
                    <span class="notes-counter">${task.notes.content.length} characters</span>
                    <div class="notes-autosave">
                        <i class="fas fa-save"></i>
                        <span>Auto-saved</span>
                    </div>
                </div>
            </div>
        `;
    }

    renderProjects() {
        const projectsList = document.getElementById('projects-list');
        const projectItems = projectsList.querySelectorAll('.project-item');
        
        // Remove existing project items (keep add button and form)
        projectItems.forEach(item => item.remove());
        
        // Add projects
        this.projects.forEach(project => {
            const button = document.createElement('button');
            button.className = `project-item ${this.selectedProject === project.id ? 'active' : ''}`;
            button.dataset.project = project.id;
            button.innerHTML = `
                <div class="project-color ${project.color}"></div>
                <span>${project.name}</span>
                <span class="task-count">${project.taskCount}</span>
            `;
            button.addEventListener('click', () => this.selectProject(project.id));
            
            // Insert before add button
            const addButton = projectsList.querySelector('.add-project-btn');
            projectsList.insertBefore(button, addButton);
        });
    }

    toggleProjects() {
        const projectsList = document.querySelector('.projects-list');
        const chevron = document.querySelector('.projects-toggle i');
        
        projectsList.style.display = projectsList.style.display === 'none' ? 'block' : 'none';
        chevron.classList.toggle('fa-chevron-right');
        chevron.classList.toggle('fa-chevron-down');
    }

    // Modal functions
    openTaskModal(taskId) {
        const task = this.tasks.find(t => t.id === taskId);
        if (!task) return;

        const modal = document.getElementById('task-modal');
        const overlay = document.getElementById('modal-overlay');
        const content = document.getElementById('modal-content');

        content.innerHTML = `
            <div class="modal-task-content">
                <h3>${task.text}</h3>
                ${this.createTaskDetailsHTML(task)}
            </div>
        `;

        overlay.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    }

    closeTaskModal() {
        const overlay = document.getElementById('modal-overlay');
        overlay.style.display = 'none';
        document.body.style.overflow = 'auto';
    }

    // UI Helper functions
    showAddProjectForm() {
        const form = document.getElementById('add-project-form');
        const input = document.getElementById('new-project-input');
        form.style.display = 'block';
        input.focus();
    }

    hideAddProjectForm() {
        const form = document.getElementById('add-project-form');
        form.style.display = 'none';
    }
}

// Global helper functions for event handling
function handleTaskEditKeydown(event, taskId) {
    if (event.key === 'Enter') {
        app.saveTaskEdit(taskId, event.target.value);
    } else if (event.key === 'Escape') {
        app.cancelTaskEdit();
    }
}

function handleSubtaskInput(event, taskId) {
    if (event.key === 'Enter') {
        addSubtaskFromInput(taskId);
    }
}

function addSubtaskFromInput(taskId) {
    const input = event.target.closest('.input-form').querySelector('input');
    if (input.value.trim()) {
        app.addSubtask(taskId, input.value.trim());
        input.value = '';
    }
}

function handleCommentInput(event, taskId) {
    if (event.key === 'Enter') {
        addCommentFromInput(taskId);
    }
}

function addCommentFromInput(taskId) {
    const input = event.target.closest('.input-form').querySelector('input');
    if (input.value.trim()) {
        app.addComment(taskId, input.value.trim());
        input.value = '';
    }
}

function handleLabelInput(event, taskId) {
    if (event.key === 'Enter') {
        addLabelFromInput(taskId);
    }
}

function addLabelFromInput(taskId) {
    const input = event.target.closest('.input-form').querySelector('input');
    if (input.value.trim()) {
        app.addLabel(taskId, input.value.trim());
        input.value = '';
    }
}

function focusTaskInput() {
    document.getElementById('main-task-input').focus();
}

function addTask() {
    app.addTask();
}

function showAddProjectForm() {
    app.showAddProjectForm();
}

function closeTaskModal() {
    app.closeTaskModal();
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Request notification permission
    if ('Notification' in window && Notification.permission === 'default') {
        Notification.requestPermission();
    }

    // Initialize the app
    window.app = new TodoistApp();
});

// Service Worker for PWA (optional)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('SW registered: ', registration);
            })
            .catch(registrationError => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}