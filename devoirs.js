// Logic for Devoirs / Semainier — devoirs.js

let tbiDevoirsWeeks = [];
let activeDevoirsWeekId = null;
let rawDevoirsZoom = parseFloat(localStorage.getItem('tbi_devoirs_zoom'));
let devoirsZoom = isNaN(rawDevoirsZoom) || rawDevoirsZoom <= 0 ? 1.0 : rawDevoirsZoom;

const DAYS_LIST = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi"];

// --- INITIALIZATION ---
function initDevoirsApp() {
    loadDevoirs();
    populateDevoirsWeekSelect();
    
    document.documentElement.style.setProperty('--devoirs-zoom', devoirsZoom);
    
    const label = document.getElementById('devoirs-zoom-label');
    if (label) {
        label.textContent = Math.round(devoirsZoom * 100) + '%';
    }
    
    const currentWeek = tbiDevoirsWeeks.find(w => w.id === activeDevoirsWeekId);
    if (currentWeek) {
        renderDevoirsTable(currentWeek);
    }
}

function zoomDevoirs(delta) {
    if (delta === 0) {
        devoirsZoom = 1.0;
    } else {
        devoirsZoom = Math.max(0.6, Math.min(2.0, devoirsZoom + delta));
    }
    devoirsZoom = parseFloat(devoirsZoom.toFixed(1));
    localStorage.setItem('tbi_devoirs_zoom', devoirsZoom);
    
    document.documentElement.style.setProperty('--devoirs-zoom', devoirsZoom);
    
    const label = document.getElementById('devoirs-zoom-label');
    if (label) {
        label.textContent = Math.round(devoirsZoom * 100) + '%';
    }
    
    // Auto-resize textareas as text box dimensions might change on zoom
    const container = document.getElementById('devoirs-table-container');
    if (container) {
        container.querySelectorAll('.devoirs-input-text').forEach(ta => autoResizeTextarea(ta));
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
                "Mardi": [{ text: "", color: "#1e293b" }],
                "Mercredi": [{ text: "", color: "#1e293b" }],
                "Jeudi": [{ text: "", color: "#1e293b" }],
                "Vendredi": [{ text: "", color: "#1e293b" }]
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
    
    // Normalize daysData and split any multiline items (or items starting with '*') into individual entries
    DAYS_LIST.forEach(day => {
        let items = week.daysData[day];
        if (Array.isArray(items)) {
            let expandedItems = [];
            items.forEach(it => {
                if (it && typeof it.text === 'string' && it.text.includes('\n')) {
                    const lines = it.text.split('\n');
                    lines.forEach(line => {
                        let cleanLine = line.trim();
                        if (cleanLine.startsWith('*')) {
                            cleanLine = cleanLine.replace(/^\*+\s*/, '');
                        }
                        if (cleanLine.length > 0 || lines.length === 1) {
                            expandedItems.push({ text: cleanLine, color: it.color || '#1e293b' });
                        }
                    });
                } else if (it) {
                    let cleanLine = (it.text || '');
                    if (cleanLine.trim().startsWith('*')) {
                        cleanLine = cleanLine.replace(/^\s*\*+\s*/, '');
                    }
                    expandedItems.push({ text: cleanLine, color: it.color || '#1e293b' });
                }
            });
            if (expandedItems.length === 0) {
                expandedItems.push({ text: "", color: '#1e293b' });
            }
            week.daysData[day] = expandedItems;
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
        const items = week.daysData[day] || [{ text: "", color: '#1e293b' }];
        
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
        `;
        
        items.forEach((item, index) => {
            const itemColor = item.color || '#1e293b';
            const showDelete = items.length > 1;
            
            html += `
                <div class="devoirs-item">
                    <span class="devoirs-bullet" style="color: ${itemColor};">•</span>
                    <textarea 
                        class="devoirs-input-text" 
                        style="color: ${itemColor};" 
                        data-day="${day}"
                        data-index="${index}"
                        oninput="updateDevoirsItemText('${day}', ${index}, this.value); autoResizeTextarea(this)"
                        placeholder="Écrire un devoir..."
                        rows="1"
                    >${escapeHtml(item.text)}</textarea>
                    <div class="devoirs-item-actions no-print">
                        <select 
                            class="devoirs-color-select" 
                            onchange="updateDevoirsItemColor('${day}', ${index}, this.value)"
                            style="color: ${itemColor}; border-color: ${itemColor};"
                        >
                            <option value="#1e293b" style="color: #1e293b; font-weight: bold;" ${itemColor === '#1e293b' ? 'selected' : ''}>Noir</option>
                            <option value="#3b82f6" style="color: #3b82f6; font-weight: bold;" ${itemColor === '#3b82f6' ? 'selected' : ''}>Bleu</option>
                            <option value="#ef4444" style="color: #ef4444; font-weight: bold;" ${itemColor === '#ef4444' ? 'selected' : ''}>Rouge</option>
                            <option value="#10b981" style="color: #10b981; font-weight: bold;" ${itemColor === '#10b981' ? 'selected' : ''}>Vert</option>
                            <option value="#f97316" style="color: #f97316; font-weight: bold;" ${itemColor === '#f97316' ? 'selected' : ''}>Orange</option>
                        </select>
                        ${showDelete ? `
                        <button 
                            class="devoirs-btn-delete" 
                            onclick="deleteDevoirsItem('${day}', ${index})" 
                            title="Supprimer cette ligne"
                        >
                            <i data-lucide="trash-2" class="w-3.5 h-3.5"></i>
                        </button>
                        ` : ''}
                    </div>
                </div>
            `;
        });
        
        html += `
                    </div>
                    <button 
                        class="devoirs-btn-add no-print" 
                        onclick="addDevoirsItem('${day}')"
                    >
                        <i data-lucide="plus-circle" class="w-4 h-4"></i> Ajouter une ligne
                    </button>
                </td>
            </tr>
        `;
    });
    
    html += `
            </tbody>
        </table>
    `;
    
    container.innerHTML = html;
    
    // Auto-resize all textareas to fit their content & listen for Enter key
    container.querySelectorAll('.devoirs-input-text').forEach(ta => {
        autoResizeTextarea(ta);
        ta.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                const day = ta.dataset.day;
                addDevoirsItem(day);
            }
        });
    });
    
    // Reinitialize Lucide Icons
    if (typeof lucide !== 'undefined' && typeof lucide.createIcons === 'function') {
        lucide.createIcons();
    }
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
        
        // Update textarea, bullet and select element styles directly to prevent full re-render
        const container = document.getElementById('devoirs-table-container');
        if (container) {
            const textarea = container.querySelector(`textarea[data-day="${day}"][data-index="${index}"]`);
            if (textarea) {
                textarea.style.color = color;
                
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
        if (week.daysData[day].length > 1) {
            week.daysData[day].splice(index, 1);
        } else {
            week.daysData[day][0] = { text: "", color: "#1e293b" };
        }
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
