// Controller principal - app.js

// --- VARIABLES D'ÉTAT ---
let activeTab = 'home';
const widgetStates = {
    timer: false,
    aristo: false,
    compass: false,
    fractions: false,
    abaque: false,
    horloge: false
};

// --- INITIALISATION DE L'APPLICATION ---
window.addEventListener('DOMContentLoaded', () => {
    // Initialiser les icônes Lucide
    lucide.createIcons();
    
    // Rendre les widgets flottants déplaçables
    makeElementDraggable(document.getElementById('floating-widget-timer'), document.querySelector('#floating-widget-timer .widget-header'));
    makeElementDraggable(document.getElementById('floating-widget-aristo'), document.getElementById('aristo-drag-handle'));
    makeElementDraggable(document.getElementById('floating-widget-compass'), document.getElementById('compass-head'));
    makeElementDraggable(document.getElementById('floating-widget-fractions'), document.getElementById('fractions-header'));
    makeElementDraggable(document.getElementById('floating-widget-abaque'), document.getElementById('abaque-header'));
    makeElementDraggable(document.getElementById('floating-widget-horloge'), document.getElementById('horloge-header'));
    
    // Gérer le passage au premier plan (z-index) lors du clic/toucher
    let maxZIndex = 50;
    document.querySelectorAll('.floating-widget').forEach(widget => {
        widget.addEventListener('pointerdown', () => {
            maxZIndex++;
            widget.style.zIndex = maxZIndex;
        }, { passive: true });
    });
    
    // Initialiser les écouteurs d'iframes
    initIframeSync();
    
    // Mettre à jour les couleurs des boutons d'outils initialement après lucide.createIcons()
    if (typeof updateToolButtonStyles === 'function') {
        updateToolButtonStyles();
    }
});

// --- GESTION DES ONGLETS (TABS) ---
function switchTab(tabId) {
    if (tabId === activeTab) return;
    
    // Sauvegarder les zones de texte actives du tableau blanc si on le quitte
    if (activeTab === 'whiteboard' && typeof saveActiveTabTextboxes === 'function') {
        saveActiveTabTextboxes();
    }
    
    // Désactiver l'ancien onglet
    const oldBtn = document.getElementById(`tab-btn-${activeTab}`);
    if (oldBtn) oldBtn.classList.remove('active');
    document.getElementById(`screen-${activeTab}`).classList.remove('active');
    
    // Activer le nouvel onglet
    const newBtn = document.getElementById(`tab-btn-${tabId}`);
    if (newBtn) newBtn.classList.add('active');
    document.getElementById(`screen-${tabId}`).classList.add('active');
    
    activeTab = tabId;
    
    // Gérer les cas particuliers d'activation
    if (tabId === 'whiteboard') {
        // Redessiner le tableau blanc pour s'assurer des bonnes dimensions
        if (typeof resizeCanvas === 'function') {
            resizeCanvas();
        }
    } else if (tabId === 'timer') {
        // Mettre à jour le Time Timer plein écran
        if (typeof initFullscreenTimer === 'function') {
            initFullscreenTimer();
        }
    } else if (tabId === 'devoirs') {
        // Initialiser/Rafraîchir les devoirs
        if (typeof initDevoirsApp === 'function') {
            initDevoirsApp();
        }
    } else if (tabId === 'roue') {
        // Initialiser/Rafraîchir la roue de la chance
        if (typeof initRoueApp === 'function') {
            initRoueApp();
        }
    } else if (tabId === 'cotes') {
        // Synchroniser les élèves et cotes du cahier
        const iframe = document.getElementById('cotes-fullscreen-iframe');
        if (iframe && iframe.contentWindow) {
            if (typeof iframe.contentWindow.loadStudents === 'function') {
                iframe.contentWindow.loadStudents();
            }
            if (typeof iframe.contentWindow.loadCotesData === 'function') {
                iframe.contentWindow.loadCotesData();
            }
            if (typeof iframe.contentWindow.renderTabHeaders === 'function') {
                iframe.contentWindow.renderTabHeaders();
            }
            if (typeof iframe.contentWindow.renderSheet === 'function') {
                iframe.contentWindow.renderSheet();
            }
        }
    } else if (tabId === 'globe') {
        // Forcer le redimensionnement du Globe 3D lors de l'activation
        const iframe = document.getElementById('globe-fullscreen-iframe');
        if (iframe && iframe.contentWindow) {
            iframe.contentWindow.dispatchEvent(new Event('resize'));
        }
    }
    
    // Synchroniser la progression des iframes
    syncCurriculumChecks();
}

function toggleWidget(name) {
    widgetStates[name] = !widgetStates[name];
    
    const widgetEl = document.getElementById(`floating-widget-${name}`);
    const btnEl = document.getElementById(`widget-btn-${name}`);
    
    if (widgetStates[name]) {
        widgetEl.classList.remove('hidden');
        centerWidget(widgetEl);
        if (btnEl) {
            btnEl.classList.add('active-widget');
            btnEl.classList.remove('bg-amber-50', 'text-neutral-600');
        }
        
        // Initialisations spécifiques par widget
        if (name === 'timer') {
            if (typeof initWidgetTimer === 'function') {
                initWidgetTimer();
            }
        } else if (name === 'aristo') {
            if (typeof initAristoSquare === 'function') {
                initAristoSquare();
            }
        } else if (name === 'compass') {
            if (typeof initCompass === 'function') {
                initCompass();
            }
        } else if (name === 'fractions') {
            if (typeof initFractions === 'function') {
                initFractions();
            }
        } else if (name === 'abaque') {
            if (typeof initAbaque === 'function') {
                initAbaque();
            }
        } else if (name === 'horloge') {
            if (typeof initHorloge === 'function') {
                initHorloge();
            }
        }
    } else {
        widgetEl.classList.add('hidden');
        if (btnEl) {
            btnEl.classList.remove('active-widget');
            
            // Restaurer les couleurs d'origine
            if (name === 'timer') {
                btnEl.classList.add('bg-amber-50');
            } else {
                btnEl.classList.add('text-neutral-600');
            }
        }
    }
}

// Minimiser / Maximiser le corps du widget Timer pour gagner de la place
function minimizeWidget(name) {
    const bodyEl = document.getElementById(`widget-${name}-body`);
    bodyEl.classList.toggle('hidden');
}

// --- RENDRE UN ÉLÉMENT ABSOLU DÉPLAÇABLE (DRAG & DROP) ---
function makeElementDraggable(el, dragHandle) {
    if (!el || !dragHandle) return;
    
    let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
    let isDragging = false;
    
    dragHandle.addEventListener('pointerdown', dragPointerDown);
    
    function dragPointerDown(e) {
        // Ignorer les clics sur les boutons enfants dans l'en-tête du widget
        if (e.target.closest('button') || e.target.closest('select')) return;
        
        e.preventDefault();
        isDragging = true;
        
        pos3 = e.clientX;
        pos4 = e.clientY;
        
        dragHandle.setPointerCapture(e.pointerId);
        
        dragHandle.addEventListener('pointermove', elementDrag);
        dragHandle.addEventListener('pointerup', closeDragElement);
        dragHandle.addEventListener('pointercancel', closeDragElement);
    }
    
    function elementDrag(e) {
        if (!isDragging) return;
        e.preventDefault();
        
        // Calculer la nouvelle position du curseur
        pos1 = pos3 - e.clientX;
        pos2 = pos4 - e.clientY;
        pos3 = e.clientX;
        pos4 = e.clientY;
        
        // Définir la nouvelle position de l'élément en limitant à la zone du tableau blanc
        const newTop = el.offsetTop - pos2;
        const newLeft = el.offsetLeft - pos1;
        
        const container = document.getElementById('whiteboard-viewport');
        const scrollWidth = container ? container.scrollWidth : window.innerWidth;
        const scrollHeight = container ? container.scrollHeight : window.innerHeight;
        
        // S'assurer que le widget ne sort pas complètement de la zone active
        if (newTop >= 0 && newTop < scrollHeight - 50) {
            el.style.top = newTop + "px";
        }
        if (newLeft >= -el.offsetWidth / 2 && newLeft < scrollWidth - 50) {
            el.style.left = newLeft + "px";
        }
    }
    
    function closeDragElement(e) {
        if (!isDragging) return;
        isDragging = false;
        
        try {
            dragHandle.releasePointerCapture(e.pointerId);
        } catch(err) {}
        
        dragHandle.removeEventListener('pointermove', elementDrag);
        dragHandle.removeEventListener('pointerup', closeDragElement);
        dragHandle.removeEventListener('pointercancel', closeDragElement);
    }
}

// --- SYNC & HOOKS DES IFRAMES (PROGRAMME P5-P6) ---
let isSidebarOpen = false;

function toggleSidebar() {
    const sidebar = document.getElementById('whiteboard-sidebar');
    const toggleBtn = document.getElementById('sidebar-toggle-btn');
    
    isSidebarOpen = !isSidebarOpen;
    
    if (isSidebarOpen) {
        sidebar.style.width = '420px';
        if (toggleBtn) toggleBtn.classList.add('bg-neutral-900', 'text-white');
        
        // Forcer le rechargement de l'état des checkbox dans l'iframe
        setTimeout(syncCurriculumChecks, 150);
    } else {
        sidebar.style.width = '0px';
        if (toggleBtn) toggleBtn.classList.remove('bg-neutral-900', 'text-white');
    }
    
    // Redimensionner le tableau blanc après transition de la barre latérale
    setTimeout(() => {
        if (typeof resizeCanvas === 'function') resizeCanvas();
    }, 350);
}

function initIframeSync() {
    const sidebarIframe = document.getElementById('curriculum-sidebar-iframe');
    const fullscreenIframe = document.getElementById('curriculum-fullscreen-iframe');
    
    // Injecter les écouteurs sur le chargement des iframes
    sidebarIframe.addEventListener('load', () => injectIframeHooks(sidebarIframe, true));
    fullscreenIframe.addEventListener('load', () => injectIframeHooks(fullscreenIframe, false));
}

function injectIframeHooks(iframe, isSidebar) {
    try {
        const iframeDoc = iframe.contentDocument || (iframe.contentWindow ? iframe.contentWindow.document : null);
        if (!iframeDoc) return;
        
        // 1. Injecter du CSS pour adapter le programme au mode d'affichage
        const style = iframeDoc.createElement('style');
        if (isSidebar) {
            // En mode sidebar, cacher le grand header du programme pour sauver de l'espace vertical
            style.textContent = `
                header { display: none !important; }
                .tabs { top: 0 !important; }
                .content { padding: 10px !important; }
                .reset-btn { font-size: 10px; padding: 2px 6px; }
                .item label { font-size: 12px; }
            `;
        } else {
            style.textContent = '';
        }
        iframeDoc.head.appendChild(style);
        
        // 2. Ajouter les boutons de copie 📋 à côté de chaque matière
        const items = iframeDoc.querySelectorAll('.item');
        items.forEach(item => {
            const label = item.querySelector('label');
            if (!label) return;
            
            // Ajouter un petit bouton de copie discret
            const copyBtn = iframeDoc.createElement('button');
            copyBtn.innerHTML = '📋';
            copyBtn.className = 'copy-to-board-btn ml-auto p-1 text-xs hover:bg-neutral-200 rounded transition shrink-0 cursor-pointer';
            copyBtn.title = 'Copier sur le tableau blanc';
            
            // Empêcher le clic de cocher la case d'exercice
            copyBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                e.preventDefault();
                
                // Envoyer le texte au tableau blanc
                const textToCopy = label.textContent.trim();
                if (window.addTextToWhiteboard) {
                    window.addTextToWhiteboard(textToCopy);
                    // Si on est dans le programme plein écran, basculer sur le tableau
                    if (!isSidebar) {
                        switchTab('whiteboard');
                    }
                }
            });
            
            item.appendChild(copyBtn);
        });
        
        // 3. Écouter les clics de checkboxes dans l'iframe pour synchroniser avec l'autre vue
        iframeDoc.addEventListener('click', (e) => {
            const itemClicked = e.target.closest('.item') || e.target.closest('.reset-btn');
            if (itemClicked) {
                // Un petit délai pour laisser l'iframe stocker le nouvel état dans localStorage
                setTimeout(syncCurriculumChecks, 50);
            }
        });
    } catch (err) {
        console.warn("L'accès à l'iframe du programme est bloqué par la politique de sécurité du navigateur (normal en protocole local file://) :", err);
    }
}

// Fonction de synchronisation globale des checkbox
function syncCurriculumChecks() {
    try {
        const sidebarIframe = document.getElementById('curriculum-sidebar-iframe');
        const fullscreenIframe = document.getElementById('curriculum-fullscreen-iframe');
        
        // Demander aux deux iframes de recharger l'état du localStorage
        if (sidebarIframe && sidebarIframe.contentWindow && typeof sidebarIframe.contentWindow.loadState === 'function') {
            sidebarIframe.contentWindow.loadState();
            if (typeof sidebarIframe.contentWindow.updateAll === 'function') sidebarIframe.contentWindow.updateAll();
        }
        if (fullscreenIframe && fullscreenIframe.contentWindow && typeof fullscreenIframe.contentWindow.loadState === 'function') {
            fullscreenIframe.contentWindow.loadState();
            if (typeof fullscreenIframe.contentWindow.updateAll === 'function') fullscreenIframe.contentWindow.updateAll();
        }
    } catch (err) {
        console.warn("La synchronisation de l'iframe du programme est restreinte par la politique de sécurité du navigateur (normal en protocole local file://) :", err);
    }
}

// Center a floating widget in the visible scrollable viewport area
function centerWidget(widgetEl) {
    const viewport = document.getElementById('whiteboard-viewport');
    if (!viewport || !widgetEl) return;
    
    const scrollLeft = viewport.scrollLeft;
    const scrollTop = viewport.scrollTop;
    const clientWidth = viewport.clientWidth;
    const clientHeight = viewport.clientHeight;
    
    const widgetWidth = parseInt(widgetEl.style.width) || widgetEl.offsetWidth || 250;
    const widgetHeight = parseInt(widgetEl.style.height) || widgetEl.offsetHeight || 190;
    
    const left = scrollLeft + (clientWidth - widgetWidth) / 2;
    const top = scrollTop + (clientHeight - widgetHeight) / 2;
    
    widgetEl.style.left = Math.max(0, left) + 'px';
    widgetEl.style.top = Math.max(0, top) + 'px';
}

// Save all geometric and visibility states of widgets for the current tab
function saveWidgetStatesForTab(tab) {
    if (!tab) return;
    
    const timerEl = document.getElementById('floating-widget-timer');
    const aristoEl = document.getElementById('floating-widget-aristo');
    const compassEl = document.getElementById('floating-widget-compass');
    const fractionsEl = document.getElementById('floating-widget-fractions');
    const abaqueEl = document.getElementById('floating-widget-abaque');
    const horlogeEl = document.getElementById('floating-widget-horloge');
    
    tab.widgetStates = {
        timer: {
            visible: !!widgetStates.timer,
            left: timerEl ? timerEl.style.left : '',
            top: timerEl ? timerEl.style.top : ''
        },
        aristo: {
            visible: !!widgetStates.aristo,
            left: aristoEl ? aristoEl.style.left : '',
            top: aristoEl ? aristoEl.style.top : '',
            angle: (typeof window.getAristoAngle === 'function') ? window.getAristoAngle() : 0,
            width: aristoEl ? aristoEl.style.width : ''
        },
        compass: {
            visible: !!widgetStates.compass,
            left: compassEl ? compassEl.style.left : '',
            top: compassEl ? compassEl.style.top : '',
            angle: (typeof window.getCompassAngle === 'function') ? window.getCompassAngle() : 0,
            rOffset: (typeof window.getCompassROffset === 'function') ? window.getCompassROffset() : 40,
            width: compassEl ? compassEl.style.width : ''
        },
        fractions: {
            visible: !!widgetStates.fractions,
            left: fractionsEl ? fractionsEl.style.left : '',
            top: fractionsEl ? fractionsEl.style.top : '',
            activeTab: (typeof window.getFractionsActiveTab === 'function') ? window.getFractionsActiveTab() : 'circles',
            data: (typeof window.getFractionsData === 'function') ? window.getFractionsData() : null
        },
        abaque: {
            visible: !!widgetStates.abaque,
            left: abaqueEl ? abaqueEl.style.left : '',
            top: abaqueEl ? abaqueEl.style.top : '',
            data: (typeof window.getAbaqueData === 'function') ? window.getAbaqueData() : null
        },
        horloge: {
            visible: !!widgetStates.horloge,
            left: horlogeEl ? horlogeEl.style.left : '',
            top: horlogeEl ? horlogeEl.style.top : '',
            time: (typeof window.getClockTime === 'function') ? window.getClockTime() : null,
            freeMode: (typeof window.getClockFreeMode === 'function') ? window.getClockFreeMode() : false,
            digitalVisible: (typeof window.getClockDigitalVisible === 'function') ? window.getClockDigitalVisible() : true
        }
    };
}

// Sync the visibility of widgets based on the saved state for a specific tab
function syncWidgetStatesForTab(newTab) {
    if (!newTab) return;
    
    // Default initial states if none exist
    if (!newTab.widgetStates) {
        newTab.widgetStates = {
            timer: { visible: false },
            aristo: { visible: false },
            compass: { visible: false },
            fractions: { visible: false },
            abaque: { visible: false },
            horloge: { visible: false }
        };
    }
    
    const newStates = newTab.widgetStates;
    const widgets = ['timer', 'aristo', 'compass', 'fractions', 'abaque', 'horloge'];
    
    widgets.forEach(name => {
        const state = newStates[name] || { visible: false };
        const widgetEl = document.getElementById(`floating-widget-${name}`);
        const btnEl = document.getElementById(`widget-btn-${name}`);
        
        if (!widgetEl) return;
        
        const targetVisible = !!state.visible;
        
        // Update global state tracking
        widgetStates[name] = targetVisible;
        
        if (targetVisible) {
            widgetEl.classList.remove('hidden');
            if (btnEl) {
                btnEl.classList.add('active-widget');
                btnEl.classList.remove('bg-amber-50', 'text-neutral-600');
            }
            
            // Restore positions
            if (state.left !== undefined && state.left !== '') {
                widgetEl.style.left = state.left;
            }
            if (state.top !== undefined && state.top !== '') {
                widgetEl.style.top = state.top;
            }
            
            // Restore widget specific parameters
            if (name === 'timer') {
                if (typeof initWidgetTimer === 'function') {
                    initWidgetTimer();
                }
            } else if (name === 'aristo') {
                if (state.width) {
                    widgetEl.style.width = state.width;
                    widgetEl.style.height = (parseFloat(state.width) / 2) + 'px';
                    const slider = widgetEl.querySelector('input[type="range"]');
                    if (slider) slider.value = parseFloat(state.width);
                }
                if (state.angle !== undefined && typeof window.setAristoAngle === 'function') {
                    window.setAristoAngle(state.angle);
                }
                if (typeof initAristoSquare === 'function') {
                    initAristoSquare();
                }
            } else if (name === 'compass') {
                if (state.width) {
                    widgetEl.style.width = state.width;
                    widgetEl.style.height = (parseFloat(state.width) * 1.3) + 'px';
                    const slider = widgetEl.querySelector('input[type="range"]');
                    if (slider) slider.value = parseFloat(state.width);
                }
                if (state.angle !== undefined && typeof window.setCompassAngle === 'function') {
                    window.setCompassAngle(state.angle);
                }
                if (state.rOffset !== undefined && typeof window.setCompassROffset === 'function') {
                    window.setCompassROffset(state.rOffset);
                }
                if (typeof initCompass === 'function') {
                    initCompass();
                }
            } else if (name === 'fractions') {
                if (state.activeTab && typeof window.switchFractionsTab === 'function') {
                    window.switchFractionsTab(state.activeTab);
                }
                if (typeof initFractions === 'function') {
                    initFractions();
                }
                if (state.data && typeof window.setFractionsData === 'function') {
                    window.setFractionsData(state.data);
                }
            } else if (name === 'abaque') {
                if (typeof initAbaque === 'function') {
                    initAbaque();
                }
                if (state.data && typeof window.setAbaqueData === 'function') {
                    window.setAbaqueData(state.data);
                }
            } else if (name === 'horloge') {
                if (typeof initHorloge === 'function') {
                    initHorloge();
                }
                if (state.time && typeof window.setClockTime === 'function') {
                    window.setClockTime(state.time);
                }
                if (state.freeMode !== undefined && typeof window.setClockFreeMode === 'function') {
                    window.setClockFreeMode(state.freeMode);
                    const freeModeCheckbox = document.getElementById('clock-free-mode');
                    if (freeModeCheckbox) freeModeCheckbox.checked = state.freeMode;
                }
                if (state.digitalVisible !== undefined && typeof window.setClockDigitalVisible === 'function') {
                    window.setClockDigitalVisible(state.digitalVisible);
                }
            }
        } else {
            widgetEl.classList.add('hidden');
            if (btnEl) {
                btnEl.classList.remove('active-widget');
                if (name === 'timer') {
                    btnEl.classList.add('bg-amber-50');
                } else {
                    btnEl.classList.add('text-neutral-600');
                }
            }
        }
    });
}

window.saveWidgetStatesForTab = saveWidgetStatesForTab;
window.syncWidgetStatesForTab = syncWidgetStatesForTab;
window.widgetStates = widgetStates;

// --- GESTION DE LA SAUVEGARDE & RESTAURATION ---
function exportClassData() {
    const data = {};
    const keysToBackup = [
        'tbi_weeks',
        'tbi_active_week_id',
        'tbi_devoirs_weeks',
        'tbi_active_devoirs_week_id',
        'tbi_roue_students',
        'p5p6v4',
        'tbi_eraser_size'
    ];
    
    keysToBackup.forEach(key => {
        const val = localStorage.getItem(key);
        if (val !== null) {
            data[key] = val;
        }
    });
    
    const jsonStr = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    const dateStr = new Date().toISOString().split('T')[0];
    a.href = url;
    a.download = `console-tbi-sauvegarde-${dateStr}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

function importClassData(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const data = JSON.parse(e.target.result);
            
            // Validate that it contains some of our keys
            const hasTbiKeys = Object.keys(data).some(key => key.startsWith('tbi_') || key === 'p5p6v4');
            if (!hasTbiKeys) {
                alert("Le fichier sélectionné ne semble pas être une sauvegarde valide de la Console TBI.");
                return;
            }
            
            if (confirm("Voulez-vous restaurer ces données ? Cela remplacera votre emploi du temps, devoirs et élèves actuels.")) {
                Object.keys(data).forEach(key => {
                    localStorage.setItem(key, data[key]);
                });
                alert("Données restaurées avec succès ! L'application va se recharger.");
                window.location.reload();
            }
        } catch(err) {
            alert("Erreur lors de la lecture du fichier de sauvegarde : " + err.message);
        }
    };
    reader.readAsText(file);
}

function exportYearlyArchive() {
    const weeksRaw = localStorage.getItem('tbi_weeks');
    const devoirsWeeksRaw = localStorage.getItem('tbi_devoirs_weeks');
    
    let weeks = [];
    let devoirsWeeks = [];
    
    try {
        if (weeksRaw) weeks = JSON.parse(weeksRaw);
    } catch(e) { console.error("Erreur lors de la lecture des semainiers:", e); }
    
    try {
        if (devoirsWeeksRaw) devoirsWeeks = JSON.parse(devoirsWeeksRaw);
    } catch(e) { console.error("Erreur lors de la lecture des devoirs:", e); }
    
    if (weeks.length === 0 && devoirsWeeks.length === 0) {
        alert("Aucune donnée de semainier ou de devoirs à exporter.");
        return;
    }
    
    // Échapper le HTML pour éviter les failles XSS
    const escapeHtml = (text) => {
        if (!text) return '';
        return String(text)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    };

    let html = `<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <title>Archive de l'Année Scolaire</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&family=Fredoka:wght@300..700&display=swap" rel="stylesheet">
    <style>
        :root {
            --neutral-900: #0f172a;
            --neutral-100: #f1f5f9;
            --neutral-300: #cbd5e1;
            --bg-page: #FDFBF7;
        }
        * {
            box-sizing: border-box;
        }
        body {
            font-family: 'Outfit', sans-serif;
            background-color: var(--bg-page);
            color: #1e293b;
            margin: 0;
            padding: 0;
        }
        .no-print-bar {
            background-color: #ffffff;
            border-bottom: 3px solid var(--neutral-900);
            padding: 20px;
            text-align: center;
            position: sticky;
            top: 0;
            z-index: 100;
            box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);
        }
        .no-print-bar h1 {
            margin: 0 0 8px 0;
            font-family: 'Fredoka', sans-serif;
            font-weight: 800;
            font-size: 24px;
            color: var(--neutral-900);
        }
        .no-print-bar p {
            margin: 0 0 15px 0;
            font-size: 13px;
            color: #475569;
            font-weight: 500;
        }
        .btn-print {
            padding: 10px 22px;
            background-color: #4f46e5;
            color: white;
            border: 2px solid var(--neutral-900);
            font-family: 'Fredoka', sans-serif;
            font-weight: bold;
            font-size: 13px;
            border-radius: 12px;
            box-shadow: 3px 3px 0px rgba(0, 0, 0, 1);
            cursor: pointer;
            transition: all 0.1s;
            display: inline-flex;
            align-items: center;
            gap: 6px;
        }
        .btn-print:hover {
            transform: translate(-1px, -1px);
            box-shadow: 4px 4px 0px rgba(0, 0, 0, 1);
        }
        .btn-print:active {
            transform: translate(0, 0);
            box-shadow: 1px 1px 0px rgba(0, 0, 0, 1);
        }
        .container {
            max-width: 1000px;
            margin: 0 auto;
            padding: 40px 20px;
        }
        .section-title {
            font-family: 'Fredoka', sans-serif;
            font-size: 26px;
            border-bottom: 4px solid var(--neutral-900);
            padding-bottom: 6px;
            margin-top: 40px;
            margin-bottom: 24px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            color: var(--neutral-900);
        }
        .week-card {
            background-color: #ffffff;
            border: 3px solid var(--neutral-900);
            border-radius: 24px;
            padding: 24px;
            margin-bottom: 40px;
            box-shadow: 4px 4px 0px rgba(0, 0, 0, 1);
            page-break-inside: avoid;
            break-inside: avoid;
        }
        .week-title {
            font-family: 'Fredoka', sans-serif;
            font-size: 20px;
            margin-top: 0;
            margin-bottom: 20px;
            color: var(--neutral-900);
            border-bottom: 2px dashed var(--neutral-300);
            padding-bottom: 8px;
        }
        
        /* Table Styles */
        table {
            width: 100%;
            border-collapse: collapse;
            border: 3px solid var(--neutral-900);
            background-color: #ffffff;
            margin-bottom: 5px;
            table-layout: fixed;
        }
        th, td {
            border: 2px solid var(--neutral-900);
            padding: 10px;
            text-align: center;
            vertical-align: middle;
            font-weight: 600;
            font-size: 13px;
            word-wrap: break-word;
            word-break: break-word;
        }
        th {
            background-color: #f1f5f9;
            font-family: 'Fredoka', sans-serif;
            font-weight: 800;
            color: var(--neutral-900);
            text-transform: uppercase;
            font-size: 12px;
            letter-spacing: 0.5px;
        }
        .time-col {
            width: 85px;
            background-color: #f8fafc;
            font-size: 11px;
            font-family: 'Fredoka', sans-serif;
            color: #475569;
            font-weight: bold;
        }
        .course-cell {
            min-height: 48px;
            white-space: pre-line;
        }
        .recreation-cell {
            background-color: #f8fafc;
            font-family: 'Fredoka', sans-serif;
            font-weight: 900;
            letter-spacing: 2px;
            color: var(--neutral-900);
        }
        .midi-cell {
            background-color: #f8fafc;
            font-family: 'Fredoka', sans-serif;
            font-weight: 950;
            letter-spacing: 4px;
            color: var(--neutral-900);
        }
        .disabled-cell {
            background-color: #e2e8f0;
            background-image: repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(148, 163, 184, 0.1) 10px, rgba(148, 163, 184, 0.1) 20px);
        }
        
        /* Devoirs specific table styles */
        .devoirs-table th, .devoirs-table td {
            text-align: left;
            vertical-align: top;
            padding: 14px;
        }
        .devoirs-table th {
            text-align: center;
            font-size: 14px;
        }
        .devoirs-day-cell {
            width: 100px;
            font-family: 'Fredoka', sans-serif;
            font-weight: 900;
            font-size: 18px;
            text-align: center;
            vertical-align: middle;
            background-color: #f8fafc;
            color: var(--neutral-900);
        }
        .devoirs-date-cell {
            width: 110px;
            font-weight: 700;
            font-size: 14px;
            text-align: center;
            vertical-align: middle;
            background-color: #f8fafc;
            color: #475569;
        }
        .devoirs-text-cell {
            background-color: #ffffff;
            white-space: pre-wrap;
            font-size: 15px;
            font-family: Arial, sans-serif;
            line-height: 1.4;
            font-weight: 600;
        }
        
        @media print {
            .no-print-bar {
                display: none !important;
            }
            body {
                background-color: #ffffff;
                color: #000000;
            }
            .container {
                width: 100%;
                max-width: 100%;
                padding: 0;
            }
            .section-title {
                margin-top: 30px;
                font-size: 20px;
            }
            .week-card {
                border: 2px solid var(--neutral-900);
                box-shadow: none;
                padding: 15px;
                margin-bottom: 25px;
                page-break-after: always;
                break-after: page;
                border-radius: 12px;
            }
            table {
                border-width: 2px !important;
            }
            th, td {
                padding: 6px;
                font-size: 11px;
                border-width: 1px !important;
            }
            .devoirs-table th, .devoirs-table td {
                padding: 8px;
            }
            .devoirs-day-cell {
                font-size: 13px;
                width: 75px;
            }
            .devoirs-date-cell {
                font-size: 11px;
                width: 80px;
            }
            .devoirs-text-cell {
                font-size: 12px;
            }
        }
    </style>
</head>
<body>
    <div class="no-print-bar">
        <h1>Archive de l'Année Scolaire</h1>
        <p>Ce document est une copie conforme de votre semainier et de vos devoirs de l'année. Vous pouvez le conserver, faire une recherche textuelle, ou l'enregistrer en PDF via les options d'impression du navigateur.</p>
        <button class="btn-print" onclick="window.print()">
            🖨️ Imprimer ou Enregistrer en PDF
        </button>
    </div>
    
    <div class="container">
`;

    // Section 1 : Semainiers
    if (weeks.length > 0) {
        html += `<h2 class="section-title">📅 Semainier (Emploi du temps)</h2>`;
        
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
        
        weeks.forEach(week => {
            html += `
            <div class="week-card">
                <h3 class="week-title">${escapeHtml(week.name)}</h3>
                <table>
                    <thead>
                        <tr>
                            <th class="time-col">HEURES</th>
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
                html += `<td class="time-col">${slot.time}</td>`;
                
                for (let colIndex = 0; colIndex < 5; colIndex++) {
                    const rowKey = `row-${rowIndex}`;
                    const cellValue = week.gridData[rowKey] ? week.gridData[rowKey][colIndex] : "";
                    
                    if (cellValue === "Disabled") {
                        html += `<td class="disabled-cell"></td>`;
                    } else {
                        let cellClass = "course-cell";
                        if (slot.type === "recreation") {
                            cellClass += " recreation-cell";
                        } else if (slot.type === "midi") {
                            cellClass += " midi-cell";
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
                        
                        html += `<td class="${cellClass}" ${styleAttr}>${escapeHtml(text)}</td>`;
                    }
                }
                html += `</tr>`;
            });
            
            html += `
                    </tbody>
                </table>
            </div>
            `;
        });
    }

    // Section 2 : Devoirs
    if (devoirsWeeks.length > 0) {
        html += `<h2 class="section-title">📝 Carnet de Devoirs</h2>`;
        
        const DAYS_LIST = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi"];
        
        devoirsWeeks.forEach(week => {
            html += `
            <div class="week-card">
                <h3 class="week-title">${escapeHtml(week.name)}</h3>
                <table class="devoirs-table">
                    <thead>
                        <tr>
                            <th style="width: 100px;">JOUR</th>
                            <th style="width: 110px;">DATE</th>
                            <th>DEVOIRS</th>
                        </tr>
                    </thead>
                    <tbody>
            `;
            
            DAYS_LIST.forEach(day => {
                const dateVal = week.dates ? (week.dates[day] || "") : "";
                const items = week.daysData ? week.daysData[day] : [];
                
                let text = "";
                let itemColor = "#1e293b";
                
                if (Array.isArray(items) && items.length > 0) {
                    text = items[0].text || "";
                    itemColor = items[0].color || "#1e293b";
                }
                
                html += `
                <tr>
                    <td class="devoirs-day-cell">${day.toUpperCase()}</td>
                    <td class="devoirs-date-cell">${escapeHtml(dateVal)}</td>
                    <td class="devoirs-text-cell" style="color: ${itemColor};">${escapeHtml(text)}</td>
                </tr>
                `;
            });
            
            html += `
                    </tbody>
                </table>
            </div>
            `;
        });
    }

    html += `
    </div>
</body>
</html>
`;

    const today = new Date();
    const dateStr = today.toLocaleDateString('fr-FR').replace(/\//g, '-');
    const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `Archive_Annee_Scolaire_${dateStr}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

function resetYearlyData() {
    const conf1 = confirm("⚠️ ATTENTION ! Cette action va supprimer définitivement tous vos semainiers et tous vos devoirs enregistrés pour repartir sur une nouvelle année.\n\nSouhaitez-vous continuer ?");
    if (!conf1) return;
    
    const conf2 = confirm("Pour des raisons de sécurité, nous allons d'abord télécharger une copie de sauvegarde de vos données actuelles (HTML) dans vos téléchargements. \n\nCliquez sur OK pour télécharger la sauvegarde et réinitialiser l'application.");
    if (!conf2) return;
    
    // Auto-trigger export first
    exportYearlyArchive();
    
    // Clear stored items
    localStorage.removeItem('tbi_weeks');
    localStorage.removeItem('tbi_active_week_id');
    localStorage.removeItem('tbi_devoirs_weeks');
    localStorage.removeItem('tbi_active_devoirs_week_id');
    
    alert("Application réinitialisée avec succès ! Reprise à zéro.");
    window.location.reload();
}

window.exportClassData = exportClassData;
window.importClassData = importClassData;
window.exportYearlyArchive = exportYearlyArchive;
window.resetYearlyData = resetYearlyData;

