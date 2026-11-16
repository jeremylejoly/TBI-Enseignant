// =============================================================
// Calendrier des devoirs de l'écran d'accueil
// Lit les devoirs encodés dans l'app Devoirs (localStorage 'tbi_devoirs_weeks')
// et affiche ceux du jour sélectionné et du jour d'école suivant.
// =============================================================

const HOME_CAL_DAYS = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi"];
const HOME_CAL_MONTHS = ["janvier", "février", "mars", "avril", "mai", "juin", "juillet", "août", "septembre", "octobre", "novembre", "décembre"];

let homeCalSelected = null; // Date sélectionnée (jour d'école)

function homeCalStartOfDay(d) {
    const x = new Date(d);
    x.setHours(0, 0, 0, 0);
    return x;
}

// Ramène un samedi/dimanche au lundi suivant
function homeCalSchoolDay(d) {
    const x = homeCalStartOfDay(d);
    if (x.getDay() === 6) x.setDate(x.getDate() + 2);
    if (x.getDay() === 0) x.setDate(x.getDate() + 1);
    return x;
}

function homeCalNextSchoolDay(d) {
    const x = homeCalStartOfDay(d);
    x.setDate(x.getDate() + 1);
    return homeCalSchoolDay(x);
}

function homeCalMonday(d) {
    const x = homeCalStartOfDay(d);
    const day = x.getDay();
    x.setDate(x.getDate() - day + (day === 0 ? -6 : 1));
    return x;
}

function homeCalSameDay(a, b) {
    return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

function homeCalWeekNumber(d) {
    const x = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
    const dayNum = x.getUTCDay() || 7;
    x.setUTCDate(x.getUTCDate() + 4 - dayNum);
    const yearStart = new Date(Date.UTC(x.getUTCFullYear(), 0, 1));
    return Math.ceil(((x - yearStart) / 86400000 + 1) / 7);
}

// Clé "j/m/aaaa" tolérante aux formats saisis à la main (16/11/26, 16/11/2026, 16-11-26...)
function homeCalKeyFromString(str) {
    if (!str) return null;
    const m = String(str).trim().match(/^(\d{1,2})\s*[\/.\-]\s*(\d{1,2})\s*[\/.\-]\s*(\d{2,4})$/);
    if (!m) return null;
    let y = parseInt(m[3], 10);
    if (y < 100) y += 2000;
    return `${parseInt(m[1], 10)}/${parseInt(m[2], 10)}/${y}`;
}

function homeCalKeyFromDate(d) {
    return `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`;
}

// Construit un index { "j/m/aaaa": [ {text, color}, ... ] } à partir de toutes les semaines de devoirs
function homeCalBuildIndex() {
    const index = {};
    let weeks = [];
    try {
        weeks = JSON.parse(localStorage.getItem('tbi_devoirs_weeks') || '[]');
    } catch (e) {
        weeks = [];
    }
    weeks.forEach(week => {
        if (!week || !week.dates || !week.daysData) return;
        HOME_CAL_DAYS.forEach(day => {
            const key = homeCalKeyFromString(week.dates[day]);
            if (!key) return;
            const items = Array.isArray(week.daysData[day]) ? week.daysData[day] : [];
            items.forEach(it => {
                if (!it || typeof it.text !== 'string') return;
                it.text.split('\n').forEach(line => {
                    if (line.trim().length === 0) return;
                    (index[key] = index[key] || []).push({ text: line.trim(), color: it.color || '#1e293b' });
                });
            });
        });
    });
    return index;
}

function homeCalEscape(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function homeCalLongLabel(d) {
    return `${HOME_CAL_DAYS[d.getDay() - 1]} ${d.getDate()} ${HOME_CAL_MONTHS[d.getMonth()]}`;
}

function homeCalSection(title, icon, theme, items) {
    const list = items.length
        ? items.map(it => `
            <li class="flex items-start gap-2.5 py-2 border-b border-dashed border-neutral-300/70 last:border-0">
                <span class="mt-2 w-2 h-2 rounded-full shrink-0" style="background:${homeCalEscape(it.color)}"></span>
                <span class="text-base font-medium leading-snug" style="color:${homeCalEscape(it.color)}">${homeCalEscape(it.text)}</span>
            </li>`).join('')
        : `<li class="py-2 text-sm font-medium text-neutral-400 italic">Aucun devoir encodé.</li>`;
    return `
        <div onclick="switchTab('devoirs')" class="${theme.bg} border-2 border-neutral-900 rounded-2xl p-3.5 cursor-pointer hover:brightness-[0.98] transition" title="Ouvrir les devoirs">
            <div class="font-display font-bold text-base ${theme.text} flex items-center gap-1.5 mb-1">
                <i data-lucide="${icon}" class="w-4 h-4"></i> ${title}
                <span class="ml-auto text-xs bg-white border-2 border-neutral-900 rounded-full px-2 text-neutral-800">${items.length}</span>
            </div>
            <ul>${list}</ul>
        </div>`;
}

function renderHomeCalendar() {
    const box = document.getElementById('home-calendar');
    if (!box) return;

    const today = homeCalStartOfDay(new Date());
    const todaySchool = homeCalSchoolDay(today);
    if (!homeCalSelected) homeCalSelected = todaySchool;

    const index = homeCalBuildIndex();
    const selected = homeCalSelected;
    const next = homeCalNextSchoolDay(selected);
    const monday = homeCalMonday(selected);

    // Bande de la semaine (lundi -> vendredi)
    let week = '';
    for (let i = 0; i < 5; i++) {
        const d = new Date(monday);
        d.setDate(monday.getDate() + i);
        const isSel = homeCalSameDay(d, selected);
        const isNext = homeCalSameDay(d, next);
        const isToday = homeCalSameDay(d, today);
        const has = (index[homeCalKeyFromDate(d)] || []).length > 0;
        let cls = 'border-transparent text-neutral-500 hover:bg-neutral-50';
        if (isSel) cls = 'bg-indigo-600 text-white border-neutral-900 shadow-[2px_2px_0_rgba(0,0,0,1)]';
        else if (isNext) cls = 'bg-amber-50 border-neutral-900 text-neutral-800';
        week += `
            <button onclick="homeCalSelect(${d.getTime()})" class="flex flex-col items-center gap-1 py-2 rounded-xl border-2 ${cls} cursor-pointer transition">
                <span class="text-[11px] font-bold ${isToday && !isSel ? 'text-indigo-600' : ''}">${HOME_CAL_DAYS[i].charAt(0)}</span>
                <span class="font-display font-black text-lg leading-none">${d.getDate()}</span>
                <span class="w-1.5 h-1.5 rounded-full ${has ? 'bg-rose-500' : ''}"></span>
            </button>`;
    }

    const selIsToday = homeCalSameDay(selected, today);
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    const nextIsTomorrow = selIsToday && homeCalSameDay(next, tomorrow);
    const titleSel = selIsToday ? "Devoirs du jour" : `Devoirs du ${HOME_CAL_DAYS[selected.getDay() - 1].toLowerCase()} ${selected.getDate()}`;
    const titleNext = nextIsTomorrow
        ? `Pour demain · ${HOME_CAL_DAYS[next.getDay() - 1].toLowerCase()} ${next.getDate()}`
        : `Pour ${HOME_CAL_DAYS[next.getDay() - 1].toLowerCase()} ${next.getDate()}`;

    const navBtn = 'p-1.5 border-2 border-neutral-900 rounded-lg bg-white shadow-[2px_2px_0_rgba(0,0,0,1)] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none cursor-pointer';

    box.innerHTML = `
        <div class="flex items-center justify-between gap-3">
            <div class="min-w-0">
                <div class="text-xs font-bold uppercase tracking-wider text-neutral-400">Semaine ${homeCalWeekNumber(selected)}</div>
                <div class="font-display font-black text-2xl text-neutral-800 truncate">${homeCalLongLabel(selected)}</div>
            </div>
            <div class="flex gap-1.5 shrink-0">
                ${!homeCalSameDay(selected, todaySchool) ? `<button onclick="homeCalSelect(null)" class="${navBtn} px-2.5 font-display font-bold text-xs">Aujourd'hui</button>` : ''}
                <button onclick="homeCalShiftWeek(-1)" class="${navBtn}" title="Semaine précédente"><i data-lucide="chevron-left" class="w-4 h-4"></i></button>
                <button onclick="homeCalShiftWeek(1)" class="${navBtn}" title="Semaine suivante"><i data-lucide="chevron-right" class="w-4 h-4"></i></button>
            </div>
        </div>
        <div class="grid grid-cols-5 gap-2">${week}</div>
        ${homeCalSection(titleSel, 'calendar-check', { bg: 'bg-indigo-50', text: 'text-indigo-700' }, index[homeCalKeyFromDate(selected)] || [])}
        ${homeCalSection(titleNext, 'calendar-clock', { bg: 'bg-amber-50', text: 'text-amber-700' }, index[homeCalKeyFromDate(next)] || [])}
        <button onclick="switchTab('devoirs')" class="mt-auto self-start px-3 py-2 bg-white text-neutral-800 border-2 border-neutral-900 font-display font-bold text-sm rounded-xl shadow-[2px_2px_0_rgba(0,0,0,1)] flex items-center gap-1.5 active:translate-x-0.5 active:translate-y-0.5 active:shadow-none cursor-pointer">
            <i data-lucide="plus" class="w-4 h-4"></i> Ajouter un devoir
        </button>`;

    if (window.lucide) lucide.createIcons();
}

function homeCalSelect(time) {
    homeCalSelected = time === null ? null : homeCalStartOfDay(new Date(time));
    renderHomeCalendar();
}

function homeCalShiftWeek(dir) {
    const base = homeCalSelected || homeCalSchoolDay(new Date());
    const d = new Date(base);
    d.setDate(d.getDate() + 7 * dir);
    homeCalSelected = homeCalStartOfDay(d);
    renderHomeCalendar();
}

window.addEventListener('DOMContentLoaded', renderHomeCalendar);
