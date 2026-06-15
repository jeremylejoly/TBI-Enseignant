// Logic for Devoirs / Semainier — devoirs.js

let tbiDevoirsWeeks = [];
let activeDevoirsWeekId = null;

const DAYS_LIST = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi"];

// --- INITIALIZATION ---
function initDevoirsApp() {
    loadDevoirs();
    populateDevoirsWeekSelect();
    
    const currentWeek = tbiDevoirsWeeks.find(w => w.id === activeDevoirsWeekId);
    if (currentWeek) {
        renderDevoirsTable(currentWeek);
    }
}

// Ensure it registers on DOMContentLoaded
window.addEventListener('DOMContentLoaded', () => {
    initDevoirsApp();
});

// --- DATE HELPERS ---
function getMonday(d) {
    d = new Date(d);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1);
    return new Date(d.setDate(diff));
}

function formatDateString(d) {
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = String(d.getFullYear()).slice(-2);
    return `${day}/${month}/${year}`;
}

function getWeekDates(startDate = new Date()) {
    const monday = getMonday(startDate);
    const dates = {};
    for (let i = 0; i < 5; i++) {
        const d = new Date(monday);
        d.setDate(monday.getDate() + i);
        dates[DAYS_LIST[i]] = formatDateString(d);
    }
    return dates;
}

// --- STORAGE MANAGEMENT ---
function loadDevoirs() {
    const stored = localStorage.getItem('tbi_devoirs_weeks');
    if (stored) {
        try {
            tbiDevoirsWeeks = JSON.parse(stored);
        } catch(e) {
            tbiDevoirsWeeks = [];
        }
    }
    
    const storedActiveId = localStorage.getItem('tbi_active_devoirs_week_id');
    if (storedActiveId) {
        activeDevoirsWeekId = storedActiveId;
    }
    
    if (tbiDevoirsWeeks.length === 0) {
        // Initialize with default current week
        const defaultWeek = {
            id: 'devoirs-week-' + Date.now(),
            name: "Semaine du " + formatDateString(getMonday(new Date())),
            dates: getWeekDates(new Date()),
            daysData: {
                "Lundi": [
                    { text: "Copier la leçon d'orthographe", color: "#1e293b" }
                ],
                "Mardi": [],
                "Mercredi": [],
                "Jeudi": [],
                "Vendredi": []
            }
        };
        tbiDevoirsWeeks.push(defaultWeek);
        activeDevoirsWeekId = defaultWeek.id;
        saveDevoirs();
    }
    
    // Validate activeDevoirsWeekId
    if (!tbiDevoirsWeeks.find(w => w.id === activeDevoirsWeekId)) {
        activeDevoirsWeekId = tbiDevoirsWeeks[0].id;
        localStorage.setItem('tbi_active_devoirs_week_id', activeDevoirsWeekId);
    }
}

function saveDevoirs() {
    localStorage.setItem('tbi_devoirs_weeks', JSON.stringify(tbiDevoirsWeeks));
    localStorage.setItem('tbi_active_devoirs_week_id', activeDevoirsWeekId);
}

function renderDevoirsTable(week) {
    const container = document.getElementById('devoirs-table-container');
    if (!container) return;
    
    // Normalize daysData to always have exactly one item per day (merging multiple if they exist)
    DAYS_LIST.forEach(day => {
        let items = week.daysData[day];
        if (Array.isArray(items)) {
            if (items.length > 1) {
                const mergedText = items.map(it => it.text).join('\n');
                const primaryColor = items[0].color || '#1e293b';
                week.daysData[day] = [{ text: mergedText, color: primaryColor }];
            } else if (items.length === 0) {
                week.daysData[day] = [{ text: "", color: '#1e293b' }];
            }
        } else {
            week.daysData[day] = [{ text: "", color: '#1e293b' }];
        }
    });
    saveDevoirs();
    
    let html = `
        <table class="devoirs-table animate-fadeIn">
            <thead>
                <tr>
                    <th style="width: 110px;">JOUR</th>
                    <th style="width: 110px;">DATE</th>
                    <th>DEVOIRS</th>
                </tr>
            </thead>
            <tbody>
    `;
    
    DAYS_LIST.forEach(day => {
        const dateVal = week.dates[day] || "";
        const item = week.daysData[day][0];
        const itemColor = item.color || '#1e293b';
        
        html += `
            <tr>
                <td class="devoirs-day-col">${day.toUpperCase()}</td>
                <td class="devoirs-date-col">
                    <input 
                        type="text" 
                        class="devoirs-date-input" 
                        value="${escapeHtml(dateVal)}" 
                        data-day="${day}" 
                        onchange="updateDevoirsDate('${day}', this.value)"
                        placeholder="date..."
                    />
                </td>
                <td class="devoirs-content-col">
                    <div class="devoirs-list" id="devoirs-list-${day}">
                        <div class="devoirs-item">
                            <textarea 
                                class="devoirs-input-text" 
                                style="color: ${itemColor};" 
                                data-day="${day}"
                                data-index="0"
                                oninput="updateDevoirsItemText('${day}', 0, this.value); autoResizeTextarea(this)"
                                placeholder="Écrire les devoirs..."
                                rows="1"
                            >${escapeHtml(item.text)}</textarea>
                            <div class="devoirs-item-actions no-print">
                                <select 
                                    class="devoirs-color-select" 
                                    onchange="updateDevoirsItemColor('${day}', 0, this.value)"
                                    style="color: ${itemColor}; border-color: ${itemColor};"
                                >
                                    <option value="#1e293b" style="color: #1e293b; font-weight: bold;" ${itemColor === '#1e293b' ? 'selected' : ''}>Noir</option>
                                    <option value="#3b82f6" style="color: #3b82f6; font-weight: bold;" ${itemColor === '#3b82f6' ? 'selected' : ''}>Bleu</option>
                                    <option value="#ef4444" style="color: #ef4444; font-weight: bold;" ${itemColor === '#ef4444' ? 'selected' : ''}>Rouge</option>
                                    <option value="#10b981" style="color: #10b981; font-weight: bold;" ${itemColor === '#10b981' ? 'selected' : ''}>Vert</option>
                                    <option value="#f97316" style="color: #f97316; font-weight: bold;" ${itemColor === '#f97316' ? 'selected' : ''}>Orange</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </td>
            </tr>
        `;
    });
    
    html += `
            </tbody>
        </table>
    `;
    
    container.innerHTML = html;
    
    // Auto-resize all textareas to fit their content
    container.querySelectorAll('.devoirs-input-text').forEach(ta => autoResizeTextarea(ta));
}


// --- AUTO-RESIZE TEXTAREA HELPER ---
function autoResizeTextarea(el) {
    el.style.height = 'auto';
    el.style.height = el.scrollHeight + 'px';
}

// --- VALUE CHANGED CALLBACKS ---
function updateDevoirsDate(day, value) {
    const week = tbiDevoirsWeeks.find(w => w.id === activeDevoirsWeekId);
    if (week) {
        week.dates[day] = value;
        saveDevoirs();
    }
}

function updateDevoirsItemText(day, index, text) {
    const week = tbiDevoirsWeeks.find(w => w.id === activeDevoirsWeekId);
    if (week && week.daysData[day] && week.daysData[day][index]) {
        week.daysData[day][index].text = text;
        saveDevoirs();
    }
}

function updateDevoirsItemColor(day, index, color) {
    const week = tbiDevoirsWeeks.find(w => w.id === activeDevoirsWeekId);
    if (week && week.daysData[day] && week.daysData[day][index]) {
        week.daysData[day][index].color = color;
        saveDevoirs();
        
        // Update textarea element style directly to prevent full re-render
        const container = document.getElementById('devoirs-table-container');
        if (container) {
            const textarea = container.querySelector(`textarea[data-day="${day}"][data-index="${index}"]`);
            if (textarea) {
                textarea.style.color = color;
                
                // Update bullet color
                const itemContainer = textarea.closest('.devoirs-item');
                if (itemContainer) {
                    const bullet = itemContainer.querySelector('.devoirs-bullet');
                    if (bullet) bullet.style.color = color;
                    
                    const select = itemContainer.querySelector('.devoirs-color-select');
                    if (select) {
                        select.style.color = color;
                        select.style.borderColor = color;
                    }
                }
            }
        }
    }
}

function addDevoirsItem(day) {
    const week = tbiDevoirsWeeks.find(w => w.id === activeDevoirsWeekId);
    if (week && week.daysData[day]) {
        week.daysData[day].push({ text: "", color: "#1e293b" });
        saveDevoirs();
        renderDevoirsTable(week);
        
        // Focus the new textarea
        const container = document.getElementById('devoirs-table-container');
        if (container) {
            const textareas = container.querySelectorAll(`textarea[data-day="${day}"][data-index]`);
            if (textareas.length > 0) {
                textareas[textareas.length - 1].focus();
            }
        }
    }
}

function deleteDevoirsItem(day, index) {
    const week = tbiDevoirsWeeks.find(w => w.id === activeDevoirsWeekId);
    if (week && week.daysData[day]) {
        week.daysData[day].splice(index, 1);
        saveDevoirs();
        renderDevoirsTable(week);
    }
}

// --- WEEKS ACTIONS ---
function selectDevoirsWeek(weekId) {
    activeDevoirsWeekId = weekId;
    saveDevoirs();
    const week = tbiDevoirsWeeks.find(w => w.id === activeDevoirsWeekId);
    if (week) {
        renderDevoirsTable(week);
    }
}

function handleAddNewDevoirsWeek() {
    let latestMonday = null;
    
    tbiDevoirsWeeks.forEach(w => {
        if (w.dates && w.dates["Lundi"]) {
            const parts = w.dates["Lundi"].split('/');
            if (parts.length >= 3) {
                const day = parseInt(parts[0], 10);
                const month = parseInt(parts[1], 10) - 1;
                let year = parseInt(parts[2], 10);
                if (year < 100) year += 2000;
                
                const monday = new Date(year, month, day);
                if (!isNaN(monday.getTime())) {
                    if (!latestMonday || monday > latestMonday) {
                        latestMonday = monday;
                    }
                }
            }
        }
    });

    let newMonday;
    if (latestMonday) {
        newMonday = new Date(latestMonday);
        newMonday.setDate(latestMonday.getDate() + 7);
    } else {
        const today = new Date();
        const dayOfWeek = today.getDay();
        const daysUntilNextMonday = (8 - dayOfWeek) % 7 || 7;
        newMonday = new Date(today);
        newMonday.setDate(today.getDate() + daysUntilNextMonday);
    }
    
    const name = "Semaine du " + formatDateString(newMonday);
    const dates = getWeekDates(newMonday);
    const daysData = {
        "Lundi": [],
        "Mardi": [],
        "Mercredi": [],
        "Jeudi": [],
        "Vendredi": []
    };
    
    const newWeek = {
        id: 'devoirs-week-' + Date.now(),
        name: name,
        dates: dates,
        daysData: daysData
    };
    
    tbiDevoirsWeeks.push(newWeek);
    activeDevoirsWeekId = newWeek.id;
    saveDevoirs();
    
    populateDevoirsWeekSelect();
    selectDevoirsWeek(activeDevoirsWeekId);
}

function handleDuplicateDevoirsWeek() {
    const currentWeek = tbiDevoirsWeeks.find(w => w.id === activeDevoirsWeekId);
    if (!currentWeek) return;
    
    const name = prompt("Nom du semainier dupliqué :", currentWeek.name + " (Copie)");
    if (!name || name.trim() === "") return;
    
    const newWeek = {
        id: 'devoirs-week-' + Date.now(),
        name: name.trim(),
        dates: JSON.parse(JSON.stringify(currentWeek.dates)),
        daysData: JSON.parse(JSON.stringify(currentWeek.daysData))
    };
    
    tbiDevoirsWeeks.push(newWeek);
    activeDevoirsWeekId = newWeek.id;
    saveDevoirs();
    
    populateDevoirsWeekSelect();
    selectDevoirsWeek(activeDevoirsWeekId);
}

function handleRenameDevoirsWeek() {
    const currentWeek = tbiDevoirsWeeks.find(w => w.id === activeDevoirsWeekId);
    if (!currentWeek) return;
    
    const name = prompt("Nouveau nom de la semaine :", currentWeek.name);
    if (!name || name.trim() === "") return;
    
    currentWeek.name = name.trim();
    saveDevoirs();
    
    populateDevoirsWeekSelect();
}

function handleDeleteDevoirsWeek() {
    if (tbiDevoirsWeeks.length <= 1) {
        alert("Impossible de supprimer la seule semaine restante. Il doit y avoir au moins un semainier de devoirs.");
        return;
    }
    
    const currentWeek = tbiDevoirsWeeks.find(w => w.id === activeDevoirsWeekId);
    if (!currentWeek) return;
    
    if (confirm(`Voulez-vous vraiment supprimer définitivement le semainier de devoirs "${currentWeek.name}" ?`)) {
        tbiDevoirsWeeks = tbiDevoirsWeeks.filter(w => w.id !== activeDevoirsWeekId);
        activeDevoirsWeekId = tbiDevoirsWeeks[0].id;
        saveDevoirs();
        
        populateDevoirsWeekSelect();
        selectDevoirsWeek(activeDevoirsWeekId);
    }
}

function populateDevoirsWeekSelect() {
    const select = document.getElementById('devoirs-week-select');
    if (!select) return;
    
    select.innerHTML = '';
    tbiDevoirsWeeks.forEach(week => {
        const opt = document.createElement('option');
        opt.value = week.id;
        opt.textContent = week.name;
        opt.selected = (week.id === activeDevoirsWeekId);
        select.appendChild(opt);
    });
}

function escapeHtml(text) {
    if (!text) return '';
    return text
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}
