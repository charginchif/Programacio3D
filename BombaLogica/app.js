/**
 * =============================================
 * TaskFlow Pro — Aplicación "Legítima"
 * Un gestor de tareas funcional y atractivo.
 * =============================================
 * NOTA EDUCATIVA: Esta es la parte "inocente" del software.
 * En un escenario real, el usuario no sospecharía nada.
 */

const TaskApp = (() => {
    let tasks = [];
    let currentFilter = 'all';

    // DOM elements
    const els = {
        taskList: document.getElementById('task-list'),
        emptyState: document.getElementById('empty-state'),
        totalTasks: document.getElementById('total-tasks'),
        pendingTasks: document.getElementById('pending-tasks'),
        completedTasks: document.getElementById('completed-tasks'),
        productivityRate: document.getElementById('productivity-rate'),
        btnNewTask: document.getElementById('btn-new-task'),
        modalOverlay: document.getElementById('modal-overlay'),
        modalClose: document.getElementById('modal-close'),
        btnCancel: document.getElementById('btn-cancel'),
        taskForm: document.getElementById('task-form'),
        taskTitle: document.getElementById('task-title'),
        taskDesc: document.getElementById('task-desc'),
        taskPriority: document.getElementById('task-priority'),
        taskDate: document.getElementById('task-date'),
        filterTabs: document.querySelectorAll('.filter-tab'),
    };

    function init() {
        els.btnNewTask.addEventListener('click', openModal);
        els.modalClose.addEventListener('click', closeModal);
        els.btnCancel.addEventListener('click', closeModal);
        els.modalOverlay.addEventListener('click', (e) => {
            if (e.target === els.modalOverlay) closeModal();
        });
        els.taskForm.addEventListener('submit', handleSubmit);
        els.filterTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                els.filterTabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                currentFilter = tab.dataset.filter;
                renderTasks();
            });
        });
        updateStats();
    }

    function openModal() {
        els.modalOverlay.classList.remove('hidden');
        els.taskTitle.focus();
    }

    function closeModal() {
        els.modalOverlay.classList.add('hidden');
        els.taskForm.reset();
    }

    function handleSubmit(e) {
        e.preventDefault();
        const task = {
            id: Date.now(),
            title: els.taskTitle.value.trim(),
            description: els.taskDesc.value.trim(),
            priority: els.taskPriority.value,
            dueDate: els.taskDate.value,
            completed: false,
            createdAt: new Date().toISOString(),
        };

        tasks.unshift(task);
        closeModal();
        renderTasks();
        updateStats();

        // *** PUNTO DE ENGANCHE PARA LA BOMBA LÓGICA ***
        // Notificar al módulo de bomba (si está cargado) sobre la nueva tarea
        if (window.__onTaskCreated) {
            window.__onTaskCreated(task, tasks.length);
        }
    }

    function toggleTask(id) {
        const task = tasks.find(t => t.id === id);
        if (task) {
            task.completed = !task.completed;
            renderTasks();
            updateStats();
        }
    }

    function deleteTask(id) {
        tasks = tasks.filter(t => t.id !== id);
        renderTasks();
        updateStats();
    }

    function renderTasks() {
        const filtered = tasks.filter(t => {
            if (currentFilter === 'pending') return !t.completed;
            if (currentFilter === 'completed') return t.completed;
            return true;
        });

        if (filtered.length === 0) {
            els.taskList.innerHTML = '';
            els.taskList.appendChild(els.emptyState);
            els.emptyState.style.display = 'block';
            return;
        }

        els.emptyState.style.display = 'none';
        els.taskList.innerHTML = filtered.map(task => `
            <div class="task-item" data-id="${task.id}">
                <div class="task-checkbox ${task.completed ? 'checked' : ''}" 
                     onclick="TaskApp.toggleTask(${task.id})">
                    ${task.completed ? '✓' : ''}
                </div>
                <div class="task-content">
                    <h4 class="${task.completed ? 'completed-text' : ''}">${escapeHtml(task.title)}</h4>
                    <p>${task.description ? escapeHtml(task.description) : ''}${task.dueDate ? ' 📅 ' + task.dueDate : ''}</p>
                </div>
                <span class="task-priority priority-${task.priority}">
                    ${task.priority === 'high' ? 'Alta' : task.priority === 'medium' ? 'Media' : 'Baja'}
                </span>
                <button class="task-delete" onclick="TaskApp.deleteTask(${task.id})">🗑️</button>
            </div>
        `).join('');
    }

    function updateStats() {
        const total = tasks.length;
        const completed = tasks.filter(t => t.completed).length;
        const pending = total - completed;
        const rate = total > 0 ? Math.round((completed / total) * 100) : 0;

        animateNumber(els.totalTasks, total);
        animateNumber(els.pendingTasks, pending);
        animateNumber(els.completedTasks, completed);
        els.productivityRate.textContent = rate + '%';
    }

    function animateNumber(el, target) {
        const current = parseInt(el.textContent) || 0;
        if (current === target) return;
        const step = target > current ? 1 : -1;
        let val = current;
        const interval = setInterval(() => {
            val += step;
            el.textContent = val;
            if (val === target) clearInterval(interval);
        }, 50);
    }

    function escapeHtml(str) {
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    }

    function getTaskCount() {
        return tasks.length;
    }

    function getLastTaskTitle() {
        return tasks.length > 0 ? tasks[0].title : '';
    }

    return { init, toggleTask, deleteTask, getTaskCount, getLastTaskTitle };
})();

document.addEventListener('DOMContentLoaded', TaskApp.init);
