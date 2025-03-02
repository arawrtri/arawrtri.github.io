const seasons = ['Spring', 'Summer', 'Fall', 'Winter'];
let currentYear = 1;
let currentSeasonIndex = 0;
let tasks = JSON.parse(localStorage.getItem('stardewTasks')) || {};
let selectedDay = null;

const seasonalEvents = {
    Spring: [
        { day: 4, type: 'birthday', character: 'kent' },
        { day: 7, type: 'birthday', character: 'lewis' },
        { day: 10, type: 'birthday', character: 'vincent' },
        { day: 13, type: 'event', name: 'Egg Festival' },
        { day: 14, type: 'birthday', character: 'haley' },
        { day: 15, type: 'event', name: 'Desert Festival' },
        { day: 16, type: 'event', name: 'Desert Festival' },
        { day: 17, type: 'event', name: 'Desert Festival' },
        { day: 18, type: 'birthday', character: 'pam' },
        { day: 20, type: 'birthday', character: 'shane' },
        { day: 24, type: 'event', name: 'Flower Dance' },
        { day: 26, type: 'birthday', character: 'pierre' },
        { day: 27, type: 'birthday', character: 'emily' }
    ],
    Summer: [
        { day: 4, type: 'birthday', character: 'jas' },
        { day: 8, type: 'birthday', character: 'gus' },
        { day: 10, type: 'birthday', character: 'maru' },
        { day: 11, type: 'event', name: 'Luau' },
        { day: 13, type: 'birthday', character: 'alex' },
        { day: 17, type: 'birthday', character: 'sam' },
        { day: 19, type: 'birthday', character: 'demetrius' },
        { day: 20, type: 'event', name: 'Trout Derby' },
        { day: 21, type: 'event', name: 'Trout Derby' },
        { day: 24, type: 'birthday', character: 'willy' },
        { day: 28, type: 'event', name: 'Moonlight Jellies' }
    ],
    Fall: [
        { day: 2, type: 'birthday', character: 'penny' },
        { day: 5, type: 'birthday', character: 'elliot' },
        { day: 11, type: 'birthday', character: 'jodi' },
        { day: 13, type: 'birthday', character: 'abigail' },
        { day: 15, type: 'birthday', character: 'sandy' },
        { day: 16, type: 'event', name: 'Stardew Valley Fair' },
        { day: 18, type: 'birthday', character: 'marnie' },
        { day: 21, type: 'birthday', character: 'robin' },
        { day: 24, type: 'birthday', character: 'george' },
        { day: 27, type: 'event', name: "Spirit's Eve" }
    ],
    Winter: [
        { day: 3, type: 'birthday', character: 'linus' },
        { day: 7, type: 'birthday', character: 'caroline' },
        { day: 8, type: 'event', name: 'Festival of Ice' },
        { day: 10, type: 'birthday', character: 'sebastian' },
        { day: 12, type: 'event', name: 'SquidFest' },
        { day: 13, type: 'event', name: 'SquidFest' },
        { day: 14, type: 'birthday', character: 'harvey' },
        { day: 15, type: 'event', name: 'Night Market' },
        { day: 16, type: 'event', name: 'Night Market' },
        { day: 17, type: 'event', name: 'Night Market' },
        { day: 17, type: 'birthday', character: 'wizard' },
        { day: 20, type: 'birthday', character: 'evelyn' },
        { day: 23, type: 'birthday', character: 'leah' },
        { day: 25, type: 'event', name: 'Feast of Winter Star' },
        { day: 26, type: 'birthday', character: 'clint' }
    ]
};

const seasonSelect = document.getElementById('seasonSelect');
seasonSelect.addEventListener('change', function() {
    currentSeasonIndex = parseInt(this.value);
    this.setAttribute('data-season', this.value);
    updateSeasonColor(this.value);
    generateCalendar();
});

function updateSeasonColor(seasonValue) {
    const colors = {
        '0': { bg: '#B1D8B7', text: '#2F4F4F' },
        '1': { bg: '#F4A896', text: '#5E2C1A' },
        '2': { bg: '#D97B29', text: '#3C1F00' },
        '3': { bg: '#A3C1DA', text: '#1E2F40' }
    };
    seasonSelect.style.backgroundColor = colors[seasonValue].bg;
    seasonSelect.style.color = colors[seasonValue].text;
}

updateSeasonColor('0');

function generateCalendar() {
    const calendar = document.getElementById('calendar');
    calendar.innerHTML = '';
    
    const currentSeason = seasons[currentSeasonIndex];
    const events = seasonalEvents[currentSeason];

    for (let day = 1; day <= 28; day++) {
        const dayElement = document.createElement('div');
        dayElement.className = 'day';
        dayElement.innerHTML = `<div class="day-number">${day}</div>`;
        dayElement.onclick = () => showTaskModal(day);

        const event = events.find(e => e.day === day);
        if (event) {
            const icon = document.createElement('img');
            icon.className = 'event-icon';
            
            if (event.type === 'birthday') {
                icon.src = `people/${event.character}.png`;
                icon.className += ' birthday-icon';
                icon.alt = `${event.character}'s birthday`;
            } else {
                icon.src = 'flag.gif';
                icon.className += ' event-clickable';
                icon.alt = event.name;
                icon.addEventListener('click', (e) => {
                    e.stopPropagation();
                    showEventPopup(event.name);
                });
            }
            
            dayElement.appendChild(icon);
        }

        const seasonKey = `${currentSeason}-${day}-${currentYear}`;
        if (tasks[seasonKey]) {
            tasks[seasonKey].forEach((task, index) => {
                const taskElement = createTaskElement(task, seasonKey, index);
                dayElement.appendChild(taskElement);
            });
        }

        calendar.appendChild(dayElement);
    }
}

function createTaskElement(task, seasonKey, index) {
    const taskElement = document.createElement('div');
    taskElement.className = 'task';
    taskElement.innerHTML = `
        <div class="task-name">${task.name}</div>
        ${task.desc ? '<div class="task-desc-indicator">ℹ️</div>' : ''}
    `;
    taskElement.style.backgroundColor = task.color;
    taskElement.style.borderLeftColor = task.color;
    
    taskElement.addEventListener('click', (e) => {
        e.stopPropagation();
        showTaskDetail(task);
    });

    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'delete-task';
    deleteBtn.innerHTML = '×';
    deleteBtn.onclick = (e) => {
        e.stopPropagation();
        if (confirm('Delete this task?')) {
            tasks[seasonKey].splice(index, 1);
            if (tasks[seasonKey].length === 0) delete tasks[seasonKey];
            localStorage.setItem('stardewTasks', JSON.stringify(tasks));
            generateCalendar();
        }
    };
    
    taskElement.appendChild(deleteBtn);
    return taskElement;
}

function showTaskModal(day) {
    selectedDay = day;
    document.getElementById('selectedDay').textContent = day;
    document.getElementById('taskModal').style.display = 'block';
    document.getElementById('taskName').value = '';
    document.getElementById('taskDesc').value = '';
    document.getElementById('taskColor').selectedIndex = 0;
}

function closeModal() {
    document.getElementById('taskModal').style.display = 'none';
    selectedDay = null;
}

function addTask() {
    if (!selectedDay) return;

    const taskName = document.getElementById('taskName').value.trim();
    const taskDesc = document.getElementById('taskDesc').value.trim();
    const taskColor = document.getElementById('taskColor').value;

    if (!taskName) return;

    const seasonKey = `${seasons[currentSeasonIndex]}-${selectedDay}-${currentYear}`;
    if (!tasks[seasonKey]) tasks[seasonKey] = [];
    
    tasks[seasonKey].push({
        name: taskName,
        desc: taskDesc,
        color: taskColor
    });

    localStorage.setItem('stardewTasks', JSON.stringify(tasks));
    closeModal();
    generateCalendar();
}

function changeYear(amount) {
    currentYear = Math.max(1, currentYear + amount);
    document.getElementById('currentYear').textContent = currentYear;
    generateCalendar();
}

function showEventPopup(eventName) {
    const modal = document.createElement('div');
    modal.className = 'event-popup';
    modal.innerHTML = `
        <div class="event-popup-content">
            <h3>${eventName}</h3>
        </div>
    `;
    document.body.appendChild(modal);
    
    setTimeout(() => modal.remove(), 2000);
}

function showTaskDetail(task) {
    document.getElementById('taskDetailName').textContent = task.name;
    document.getElementById('taskDetailDesc').textContent = task.desc || "No description";
    document.getElementById('taskDetailColor').style.backgroundColor = task.color;
    document.getElementById('taskDetailModal').style.display = 'block';
}

function closeDetailModal() {
    document.getElementById('taskDetailModal').style.display = 'none';
}

window.onclick = function(event) {
    const taskModal = document.getElementById('taskModal');
    const detailModal = document.getElementById('taskDetailModal');
    
    if (event.target === taskModal) closeModal();
    if (event.target === detailModal) closeDetailModal();
}

document.addEventListener('DOMContentLoaded', generateCalendar);