// Logic for Horaire / Semainier — horaire.js

let tbiWeeks = [];
let activeWeekId = null;

const TIME_SLOTS = [
    { time: "8h30 - 9h20", type: "course" },
    { time: "9h20 - 10h10", type: "course" },
    { time: "10h10 - 10h25", type: "recreation" },
    { time: "10h25 - 11h15", type: "course" },
    { time: "11h15 - 12h05", type: "course" },
    { time: "12h05 - 13h20", type: "midi" },
    { time: "13h20 - 14h05", type: "course" },
    { time: "14h05 - 14h50", type: "course" },
    { time: "14h50 - 15h05", type: "recreation" },
    { time: "15h05 - 15h50", type: "course" }
];

const DEFAULT_GRID_DATA = {
    "row-0": ["GYM (1/2)", "", "", "", "GYM"],
    "row-1": ["GYM (1/2)", "Philippe en AP", "", "Cours philosophiques", "GYM"],
    "row-2": ["R   E", "C   R", "E   A", "T   I", "O   N"],
    "row-3": ["Allemand\nAP chez Philippe", "Philippe en AP", "", "", "Allemand"],
    "row-4": ["Allemand\nAP chez Philippe", "", "", "", ""],
    "row-5": ["M", "I", "11h50", "D", "I"],
    "row-6": ["", "Allemand", "Disabled", "", ""],
    "row-7": ["", "Allemand\nAP chez Hélène", "Disabled", "EPC", ""],
    "row-8": ["R   E", "C   R   E", "Disabled", "A   T   I", "O   N"],
    "row-9": ["", "", "Disabled", "", "Conseil de classe - Temps libre"]
};

const BLANK_GRID_DATA = {
    "row-0": ["", "", "", "", ""],
    "row-1": ["", "", "", "", ""],
    "row-2": ["R   E", "C   R", "E   A", "T   I", "O   N"],
    "row-3": ["", "", "", "", ""],
    "row-4": ["", "", "", "", ""],
    "row-5": ["M", "I", "11h50", "D", "I"],
    "row-6": ["", "", "Disabled", "", ""],
    "row-7": ["", "", "Disabled", "", ""],
    "row-8": ["R   E", "C   R   E", "Disabled", "A   T   I", "O   N"],
    "row-9": ["", "", "Disabled", "", ""]
};

// --- INITIALIZATION ---
window.addEventListener('DOMContentLoaded', () => {
    initHoraireApp();
});

function initHoraireApp() {
    loadWeeks();
    populateWeekSelect();
    
    const currentWeek = tbiWeeks.find(w => w.id === activeWeekId);
    if (currentWeek) {
        renderScheduleTable(currentWeek);
    }
}

// --- STORAGE MANAGEMENT ---
function loadWeeks() {
    const stored = localStorage.getItem('tbi_weeks');
    if (stored) {
        try {
            tbiWeeks = JSON.parse(stored);
        } catch(e) {
            tbiWeeks = [];
        }
    }
    
    const storedActiveId = localStorage.getItem('tbi_active_week_id');
    if (storedActiveId) {
        activeWeekId = storedActiveId;
    }
    
    if (tbiWeeks.length === 0) {
        // Initialize with default template week
        const defaultWeek = {
            id: 'week-' + Date.now(),
            name: "Grille Modèle (Par défaut)",
            gridData: JSON.parse(JSON.stringify(DEFAULT_GRID_DATA))
        };
        tbiWeeks.push(defaultWeek);
        activeWeekId = defaultWeek.id;
        saveWeeks();
    }
    
    // Validate activeWeekId
    if (!tbiWeeks.find(w => w.id === activeWeekId)) {
        activeWeekId = tbiWeeks[0].id;
        localStorage.setItem('tbi_active_week_id', activeWeekId);
    }
}

function saveWeeks() {
    localStorage.setItem('tbi_weeks', JSON.stringify(tbiWeeks));
    localStorage.setItem('tbi_active_week_id', activeWeekId);
}

// --- RENDER TABLE ---
let activeCell = null;

function renderScheduleTable(week) {
    const container = document.getElementById('schedule-table-container');
    if (!container) return;
    
    // Position relative pour aligner correctement la barre de formatage
    container.style.position = 'relative';
    
    let html = `
        <table class="schedule-table">
            <thead>
                <tr>
                    <th class="time-col-header">HEURES</th>
                    <th>LUNDI</th>
                    <th>MARDI</th>
                    <th>MERCREDI</th>
                    <th>JEUDI</th>
                    <th>VENDREDI</th>
                </tr>
            </thead>
            <tbody>
    `;
    
    TIME_SLOTS.forEach((slot, rowIndex) => {
        html += `<tr>`;
        
        // Hour Column
        html += `<td class="schedule-time-cell">${slot.time}</td>`;
        
        // 5 Days Columns
        for (let colIndex = 0; colIndex < 5; colIndex++) {
            const cellValue = week.gridData[`row-${rowIndex}`][colIndex];
            
            if (cellValue === "Disabled") {
                html += `<td class="disabled-cell"></td>`;
            } else {
                let cellClass = "schedule-course-cell";
                let isEditable = true;
                
                if (slot.type === "recreation") {
                    cellClass += " recreation-row-cell";
                } else if (slot.type === "midi") {
                    cellClass += " midi-row-cell";
                }
                
                let text = "";
                let styleAttr = "";
                
                if (typeof cellValue === 'object' && cellValue !== null) {
                    text = cellValue.text || "";
                    const styles = [];
                    if (cellValue.bg) styles.push(`background-color: ${cellValue.bg}`);
                    if (cellValue.color) styles.push(`color: ${cellValue.color}`);
                    if (styles.length > 0) {
                        styleAttr = `style="${styles.join('; ')}"`;
                    }
                } else {
                    text = cellValue || "";
                }
                
                html += `
                    <td 
                        class="${cellClass}" 
                        contenteditable="${isEditable}" 
                        data-row="${rowIndex}" 
                        data-col="${colIndex}"
                        ${styleAttr}
                    >${escapeHtml(text)}</td>
                `;
            }
        }
        
        html += `</tr>`;
    });
    
    html += `
            </tbody>
        </table>
    `;
    
    container.innerHTML = html;
    
    // Listen to changes in cells
    const cells = container.querySelectorAll('.schedule-course-cell[contenteditable="true"]');
    cells.forEach(cell => {
        const saveHandler = (e) => {
            const row = e.target.dataset.row;
            const col = parseInt(e.target.dataset.col);
            const text = e.target.innerText; // innerText preserves newlines!
            updateCellData(row, col, text);
        };
        cell.addEventListener('blur', saveHandler);
        cell.addEventListener('input', saveHandler);
        
        // Afficher la barre de formatage lors du focus
        cell.addEventListener('focus', () => {
            showCellFormatToolbar(cell, container);
        });
    });
}

function updateCellData(rowKey, colIndex, text) {
    const week = tbiWeeks.find(w => w.id === activeWeekId);
    if (week) {
        const row = `row-${rowKey}`;
        const currentVal = week.gridData[row][colIndex];
        
        if (typeof currentVal === 'object' && currentVal !== null) {
            week.gridData[row][colIndex] = {
                text: text,
                color: currentVal.color || "",
                bg: currentVal.bg || ""
            };
        } else {
            week.gridData[row][colIndex] = text;
        }
        saveWeeks();
    }
}

function updateCellStylesAndText(rowKey, colIndex, text, color, bg) {
    const week = tbiWeeks.find(w => w.id === activeWeekId);
    if (week) {
        const row = `row-${rowKey}`;
        if (color || bg) {
            week.gridData[row][colIndex] = {
                text: text,
                color: color || "",
                bg: bg || ""
            };
        } else {
            week.gridData[row][colIndex] = text;
        }
        saveWeeks();
    }
}

// --- BARRE FLOTTANTE DE FORMATAGE DES CELLULES ---
function showCellFormatToolbar(cell, container) {
    activeCell = cell;
    let toolbar = document.getElementById('horaire-format-toolbar');
    if (!toolbar) {
        toolbar = document.createElement('div');
        toolbar.id = 'horaire-format-toolbar';
        toolbar.className = 'absolute bg-white border-2 border-neutral-900 p-2.5 rounded-2xl shadow-[4px_4px_0_rgba(0,0,0,1)] z-50 flex flex-col gap-2 no-print transition-all duration-150';
        container.appendChild(toolbar);
    }
    
    // Remplissage du contenu de la palette
    toolbar.innerHTML = `
        <div class="flex flex-col gap-1 select-none">
            <span class="text-[9px] font-display font-black text-neutral-400 uppercase tracking-wider text-left">Couleur de fond</span>
            <div class="flex gap-1">
                <button data-bg="" class="w-6 h-6 rounded-full border border-neutral-300 bg-white flex items-center justify-center text-[10px] font-bold text-neutral-500 hover:scale-110 active:scale-95 transition cursor-pointer" title="Aucun">✕</button>
                <button data-bg="#E0E7FF" class="w-6 h-6 rounded-full border-2 border-neutral-900 hover:scale-110 active:scale-95 transition cursor-pointer" style="background-color: #E0E7FF" title="Bleu pastel"></button>
                <button data-bg="#D1FAE5" class="w-6 h-6 rounded-full border-2 border-neutral-900 hover:scale-110 active:scale-95 transition cursor-pointer" style="background-color: #D1FAE5" title="Vert pastel"></button>
                <button data-bg="#FEF3C7" class="w-6 h-6 rounded-full border-2 border-neutral-900 hover:scale-110 active:scale-95 transition cursor-pointer" style="background-color: #FEF3C7" title="Jaune pastel"></button>
                <button data-bg="#FFE4E6" class="w-6 h-6 rounded-full border-2 border-neutral-900 hover:scale-110 active:scale-95 transition cursor-pointer" style="background-color: #FFE4E6" title="Rouge pastel"></button>
                <button data-bg="#F5F3FF" class="w-6 h-6 rounded-full border-2 border-neutral-900 hover:scale-110 active:scale-95 transition cursor-pointer" style="background-color: #F5F3FF" title="Violet pastel"></button>
                <button data-bg="#CFFAFE" class="w-6 h-6 rounded-full border-2 border-neutral-900 hover:scale-110 active:scale-95 transition cursor-pointer" style="background-color: #CFFAFE" title="Cyan pastel"></button>
            </div>
        </div>
        <div class="flex flex-col gap-1 select-none">
            <span class="text-[9px] font-display font-black text-neutral-400 uppercase tracking-wider text-left">Couleur du texte</span>
            <div class="flex gap-1">
                <button data-color="#1E293B" class="w-6 h-6 rounded-full border-2 border-neutral-900 hover:scale-110 active:scale-95 transition flex items-center justify-center bg-[#1E293B] cursor-pointer" title="Défaut"></button>
                <button data-color="#312E81" class="w-6 h-6 rounded-full border-2 border-neutral-900 hover:scale-110 active:scale-95 transition bg-[#312E81] cursor-pointer" title="Bleu foncé"></button>
                <button data-color="#064E3B" class="w-6 h-6 rounded-full border-2 border-neutral-900 hover:scale-110 active:scale-95 transition bg-[#064E3B] cursor-pointer" title="Vert foncé"></button>
                <button data-color="#78350F" class="w-6 h-6 rounded-full border-2 border-neutral-900 hover:scale-110 active:scale-95 transition bg-[#78350F] cursor-pointer" title="Orange/Marron"></button>
                <button data-color="#881337" class="w-6 h-6 rounded-full border-2 border-neutral-900 hover:scale-110 active:scale-95 transition bg-[#881337] cursor-pointer" title="Rouge foncé"></button>
                <button data-color="#4C1D95" class="w-6 h-6 rounded-full border-2 border-neutral-900 hover:scale-110 active:scale-95 transition bg-[#4C1D95] cursor-pointer" title="Violet foncé"></button>
                <button data-color="#FFFFFF" class="w-6 h-6 rounded-full border border-neutral-300 hover:scale-110 active:scale-95 transition bg-white flex items-center justify-center cursor-pointer" title="Blanc">
                    <span class="text-[10px] text-neutral-800 font-bold">W</span>
                </button>
            </div>
        </div>
    `;
    
    // Liaisons des actions au clic
    toolbar.querySelectorAll('button[data-bg]').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            applyCellBg(btn.dataset.bg);
        });
    });
    
    toolbar.querySelectorAll('button[data-color]').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            applyCellColor(btn.dataset.color);
        });
    });
    
    // Rendre la palette visible avant de mesurer ses dimensions
    toolbar.classList.remove('hidden');
    
    // Positionnement de la palette flottante au-dessus/au-dessous de la cellule
    const rect = cell.getBoundingClientRect();
    const containerRect = container.getBoundingClientRect();
    
    const toolbarHeight = toolbar.offsetHeight || 110;
    const toolbarWidth = toolbar.offsetWidth || 210;
    
    let top = rect.top - containerRect.top + container.scrollTop - toolbarHeight - 10;
    let left = rect.left - containerRect.left + container.scrollLeft + (rect.width - toolbarWidth) / 2;
    
    // Si la palette dépasse en haut, l'afficher en dessous de la cellule
    if (rect.top - containerRect.top - toolbarHeight - 10 < 0) {
        top = rect.bottom - containerRect.top + container.scrollTop + 10;
    }
    
    // Limites de débordement
    if (left < 5) left = 5;
    if (left + toolbarWidth > container.scrollWidth - 5) {
        left = container.scrollWidth - toolbarWidth - 5;
    }
    
    toolbar.style.top = `${top}px`;
    toolbar.style.left = `${left}px`;
    toolbar.style.position = 'absolute';
}

function hideCellFormatToolbar() {
    const toolbar = document.getElementById('horaire-format-toolbar');
    if (toolbar) {
        toolbar.classList.add('hidden');
    }
    activeCell = null;
}

function applyCellBg(bg) {
    if (!activeCell) return;
    activeCell.style.backgroundColor = bg;
    
    const row = activeCell.dataset.row;
    const col = parseInt(activeCell.dataset.col);
    const text = activeCell.innerText;
    
    updateCellStylesAndText(row, col, text, activeCell.style.color, bg);
}

function applyCellColor(color) {
    if (!activeCell) return;
    activeCell.style.color = color;
    
    const row = activeCell.dataset.row;
    const col = parseInt(activeCell.dataset.col);
    const text = activeCell.innerText;
    
    updateCellStylesAndText(row, col, text, color, activeCell.style.backgroundColor);
}

// Cacher la barre de formatage en cliquant à l'extérieur
document.addEventListener('pointerdown', (e) => {
    const toolbar = document.getElementById('horaire-format-toolbar');
    if (toolbar && !toolbar.classList.contains('hidden')) {
        if (activeCell && !activeCell.contains(e.target) && !toolbar.contains(e.target)) {
            hideCellFormatToolbar();
        }
    }
});

// --- WEEKS ACTIONS ---
function selectWeek(weekId) {
    activeWeekId = weekId;
    saveWeeks();
    const week = tbiWeeks.find(w => w.id === activeWeekId);
    if (week) {
        renderScheduleTable(week);
    }
}

function formatDateString(d) {
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = String(d.getFullYear()).slice(-2);
    return `${day}/${month}/${year}`;
}

function handleAddNewWeek() {
    let latestMonday = null;
    
    tbiWeeks.forEach(w => {
        if (w.name && w.name.startsWith("Semaine du ")) {
            const dateStr = w.name.substring("Semaine du ".length).trim();
            const parts = dateStr.split('/');
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
    
    let gridData;
    if (typeof DEFAULT_GRID_DATA !== 'undefined') {
        gridData = JSON.parse(JSON.stringify(DEFAULT_GRID_DATA));
    } else {
        gridData = JSON.parse(JSON.stringify(BLANK_GRID_DATA));
    }
    
    const newWeek = {
        id: 'week-' + Date.now(),
        name: name,
        gridData: gridData
    };
    
    tbiWeeks.push(newWeek);
    activeWeekId = newWeek.id;
    saveWeeks();
    
    populateWeekSelect();
    selectWeek(activeWeekId);
}

function handleDuplicateWeek() {
    const currentWeek = tbiWeeks.find(w => w.id === activeWeekId);
    if (!currentWeek) return;
    
    const name = prompt("Nom du semainier dupliqué :", currentWeek.name + " (Copie)");
    if (!name || name.trim() === "") return;
    
    const newWeek = {
        id: 'week-' + Date.now(),
        name: name.trim(),
        gridData: JSON.parse(JSON.stringify(currentWeek.gridData))
    };
    
    tbiWeeks.push(newWeek);
    activeWeekId = newWeek.id;
    saveWeeks();
    
    populateWeekSelect();
    selectWeek(activeWeekId);
}

function handleRenameWeek() {
    const currentWeek = tbiWeeks.find(w => w.id === activeWeekId);
    if (!currentWeek) return;
    
    const name = prompt("Nouveau nom de la semaine :", currentWeek.name);
    if (!name || name.trim() === "") return;
    
    currentWeek.name = name.trim();
    saveWeeks();
    
    populateWeekSelect();
}

function handleDeleteWeek() {
    if (tbiWeeks.length <= 1) {
        alert("Impossible de supprimer la seule semaine restante. Il doit y avoir au moins un semainier dans l'horaire.");
        return;
    }
    
    const currentWeek = tbiWeeks.find(w => w.id === activeWeekId);
    if (!currentWeek) return;
    
    if (confirm(`Voulez-vous vraiment supprimer définitivement le semainier "${currentWeek.name}" ?`)) {
        tbiWeeks = tbiWeeks.filter(w => w.id !== activeWeekId);
        activeWeekId = tbiWeeks[0].id;
        saveWeeks();
        
        populateWeekSelect();
        selectWeek(activeWeekId);
    }
}

function populateWeekSelect() {
    const select = document.getElementById('week-select');
    if (!select) return;
    
    select.innerHTML = '';
    tbiWeeks.forEach(week => {
        const opt = document.createElement('option');
        opt.value = week.id;
        opt.textContent = week.name;
        opt.selected = (week.id === activeWeekId);
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
