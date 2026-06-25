// Whiteboard Controller — whiteboard.js

// --- CONFIGURATION ---
const maxHistorySteps = 30;

// --- STATE VARIABLES ---
let activeTool = 'select'; // 'pen', 'highlighter', 'eraser', 'text', 'shape', 'select'
let strokeColor = '#1e293b'; // Default slate
let strokeWidth = 1;
let eraserSize = parseInt(localStorage.getItem('tbi_eraser_size'), 10) || 15;
let shapeType = 'line'; // 'line', 'arrow', 'rect', 'circle'

// Configurations individuelles des outils
const toolConfigs = {
    pen1: { color: '#1e293b', width: 2 },         // Stylo Noir (Fin 2px par défaut)
    pen2: { color: '#3b82f6', width: 2 },         // Stylo Bleu (Fin 2px par défaut)
    pen3: { color: '#ef4444', width: 2 },         // Stylo Rouge (Fin 2px par défaut)
    highlighter: { color: '#eab308', width: 4.5 }, // Fluo Jaune (Fin 4.5px par défaut)
    line: { color: '#1e293b', width: 2 }            // Règle
};
let activePen = 'pen1';

// Formes & Remplissage
let fillShapes = false;

// Pointeur Laser transitoire
let laserStrokes = [];
let isDrawingLaser = false;
let activeLaserStroke = null;
let laserAnimFrame = null;

// Redimensionnement
let isResizing = false;
let resizeHandleIndex = -1;
let dragStartStrokeBox = null;

// Drawing/Interaction states
let isDrawing = false;
let startX = 0;
let startY = 0;
let currentDrawingElement = null;

// Selection states
let selectedElement = null;
let isDraggingElement = false;
let dragStartX = 0;
let dragStartY = 0;
let dragStartElementCopy = null;

// Zoom states
let zoomScale = 1.0;

// Textbox formatting states
let activeEditingTextbox = null;
let textboxBlurTimeout = null;

// Tabs management
let boardTabs = []; // Array of Tab objects
let activeTabId = null; // ID of active Tab

// Render task reference for PDF.js to avoid concurrent render collisions
let activeRenderTask = null;
let isThumbnailsPanelOpen = false;

// Compass states
let activeCompassStroke = null;
let lastCompassTime = 0;

// --- INITIALIZATION ---
window.addEventListener('DOMContentLoaded', () => {
    const drawingCanvas = document.getElementById('drawing-canvas');
    if (!drawingCanvas) return;
    
    // Set up pointer listeners for drawing
    drawingCanvas.addEventListener('pointerdown', handlePointerDown);
    drawingCanvas.addEventListener('pointermove', handlePointerMove);
    drawingCanvas.addEventListener('pointerup', handlePointerUp);
    
    // Initialize eraser cursor element
    initEraserCursor();
    
    // Hide eraser preview when leaving the canvas
    drawingCanvas.addEventListener('pointerleave', () => {
        const preview = document.getElementById('eraser-cursor-preview');
        if (preview) {
            preview.style.display = 'none';
        }
    });
    
    // Set up window resize listener
    window.addEventListener('resize', resizeCanvas);
    
    // Gestion du Drag & Drop de fichiers (PDF / Images) sur le viewport du tableau blanc
    const viewport = document.getElementById('whiteboard-viewport');
    if (viewport) {
        viewport.addEventListener('dragover', (e) => {
            e.preventDefault();
            e.stopPropagation();
            viewport.classList.add('drag-over-active');
        });
        
        viewport.addEventListener('dragenter', (e) => {
            e.preventDefault();
            e.stopPropagation();
            viewport.classList.add('drag-over-active');
        });
        
        viewport.addEventListener('dragleave', (e) => {
            e.preventDefault();
            e.stopPropagation();
            viewport.classList.remove('drag-over-active');
        });
        
        viewport.addEventListener('drop', (e) => {
            e.preventDefault();
            e.stopPropagation();
            viewport.classList.remove('drag-over-active');
            
            if (e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files.length > 0) {
                const file = e.dataTransfer.files[0];
                if (file.type === 'application/pdf') {
                    importPdfFile(file);
                } else if (file.type.startsWith('image/')) {
                    showImageImportModal(file);
                } else {
                    alert("Seuls les fichiers PDF et les images (PNG, JPG, GIF, WebP) sont supportés.");
                }
            }
        });
    }
    
    // Écouteurs de clics pour le modal d'importation d'image
    const btnNewTab = document.getElementById('img-modal-new-tab-btn');
    const btnBg = document.getElementById('img-modal-bg-btn');
    const btnMove = document.getElementById('img-modal-move-btn');
    const btnCancel = document.getElementById('img-modal-cancel-btn');
    
    if (btnNewTab) btnNewTab.addEventListener('click', () => {
        if (pendingImageFile) loadImageAsNewTab(pendingImageFile);
        closeImageImportModal();
    });
    if (btnBg) btnBg.addEventListener('click', () => {
        if (pendingImageFile) loadImageAsBackground(pendingImageFile);
        closeImageImportModal();
    });
    if (btnMove) btnMove.addEventListener('click', () => {
        if (pendingImageFile) loadImageAsMovable(pendingImageFile);
        closeImageImportModal();
    });
    if (btnCancel) btnCancel.addEventListener('click', closeImageImportModal);
    
    // Écouteur global pour le copier-coller (texte et images)
    window.addEventListener('paste', handleGlobalPaste);
    
    // Key listener for deleting selected vector elements
    window.addEventListener('keydown', (e) => {
        if ((e.key === 'Delete' || e.key === 'Backspace') && activeTool === 'select' && selectedElement) {
            // Prevent deleting inside input elements or contenteditable
            if (document.activeElement && (
                document.activeElement.contentEditable === 'true' || 
                document.activeElement.tagName === 'INPUT' || 
                document.activeElement.tagName === 'TEXTAREA'
            )) {
                return;
            }
            deleteElement(selectedElement);
            selectedElement = null;
            renderCurrentPage();
        }
    });
    
    // Click outside to close burger menu automatically
    window.addEventListener('click', (e) => {
        const menu = document.getElementById('burger-popup-menu');
        const btn = document.getElementById('burger-menu-btn');
        if (menu && btn && !menu.contains(e.target) && !btn.contains(e.target)) {
            menu.classList.add('hidden');
        }
    });
    
    // --- GESTION DU ZOOM ET PINCH-TO-ZOOM ---
    if (viewport) {
        // Bloquer le zoom de pincement global du navigateur
        document.addEventListener('gesturestart', (e) => e.preventDefault(), { passive: false });
        document.addEventListener('gesturechange', (e) => e.preventDefault(), { passive: false });
        
        // Bloquer le zoom molette global (Ctrl + Molette)
        document.addEventListener('wheel', (e) => {
            if (e.ctrlKey) {
                e.preventDefault();
            }
        }, { passive: false });

        // Zoom molette sur le viewport uniquement (centré sur le curseur)
        viewport.addEventListener('wheel', (e) => {
            if (e.ctrlKey) {
                e.preventDefault();
                // Facteur de zoom progressif et fluide
                const factor = 1 - e.deltaY * 0.0025;
                const newScale = zoomScale * factor;
                
                const rect = viewport.getBoundingClientRect();
                const viewportX = e.clientX - rect.left;
                const viewportY = e.clientY - rect.top;
                
                applyZoom(newScale, viewportX, viewportY);
            }
        }, { passive: false });

        // Zoom pincement tactile sur le viewport uniquement (centré sur le milieu des doigts)
        let touchStartDist = 0;
        let touchStartZoom = 1.0;
        
        viewport.addEventListener('touchstart', (e) => {
            if (e.touches.length === 2) {
                e.preventDefault();
                const dx = e.touches[0].clientX - e.touches[1].clientX;
                const dy = e.touches[0].clientY - e.touches[1].clientY;
                touchStartDist = Math.hypot(dx, dy);
                touchStartZoom = zoomScale;
            }
        }, { passive: false });

        viewport.addEventListener('touchmove', (e) => {
            if (e.touches.length === 2) {
                e.preventDefault();
                const dx = e.touches[0].clientX - e.touches[1].clientX;
                const dy = e.touches[0].clientY - e.touches[1].clientY;
                const dist = Math.hypot(dx, dy);
                if (touchStartDist > 0) {
                    const factor = dist / touchStartDist;
                    const newScale = touchStartZoom * factor;
                    
                    const rect = viewport.getBoundingClientRect();
                    const touch0X = e.touches[0].clientX - rect.left;
                    const touch0Y = e.touches[0].clientY - rect.top;
                    const touch1X = e.touches[1].clientX - rect.left;
                    const touch1Y = e.touches[1].clientY - rect.top;
                    const viewportX = (touch0X + touch1X) / 2;
                    const viewportY = (touch0Y + touch1Y) / 2;
                    
                    applyZoom(newScale, viewportX, viewportY);
                }
            }
        }, { passive: false });
    }
    
    // Initialize palette dots selection
    updatePaletteSelection();
    
    // Create first default tab
    if (boardTabs.length === 0) {
        addNewBlankTab();
    }
    
    // Set default active tool visually and logically
    setWhiteboardTool('select');
    
    // Perform initial canvas sizing
    setTimeout(resizeCanvas, 200);
});

// Configure canvas context properties
function setupDrawingContext(ctx) {
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
}

function resizeCanvas() {
    const container = document.getElementById('whiteboard-viewport');
    if (!container) return;
    
    // Original viewport dimensions
    const viewportW = container.clientWidth;
    const viewportH = container.clientHeight;
    
    const w = viewportW * zoomScale;
    const h = viewportH * zoomScale;
    const dpr = window.devicePixelRatio || 1;
    
    // Size the container wrapping all boards
    const boardContainer = document.getElementById('board-container');
    if (boardContainer) {
        boardContainer.style.width = w + 'px';
        boardContainer.style.height = h + 'px';
    }
    
    // Size the widgets container to prevent clipping when zoomed
    const widgetsContainer = document.getElementById('widgets-container');
    if (widgetsContainer) {
        widgetsContainer.style.width = w + 'px';
        widgetsContainer.style.height = h + 'px';
    }
    
    // Resize drawing canvas (physical pixel size)
    const drawingCanvas = document.getElementById('drawing-canvas');
    if (drawingCanvas) {
        const drawingCtx = drawingCanvas.getContext('2d');
        drawingCanvas.width = w * dpr;
        drawingCanvas.height = h * dpr;
        drawingCanvas.style.width = w + 'px';
        drawingCanvas.style.height = h + 'px';
        
        drawingCtx.setTransform(1, 0, 0, 1, 0, 0);
        // Scale context by dpr AND zoomScale so we draw in original 1x coordinate space
        drawingCtx.scale(dpr * zoomScale, dpr * zoomScale);
    }
    
    // Resize background canvas (physical pixel size)
    const bgCanvas = document.getElementById('bg-canvas');
    if (bgCanvas) {
        const bgCtx = bgCanvas.getContext('2d');
        bgCanvas.width = w * dpr;
        bgCanvas.height = h * dpr;
        bgCanvas.style.width = w + 'px';
        bgCanvas.style.height = h + 'px';
        
        bgCtx.setTransform(1, 0, 0, 1, 0, 0);
    }
    
    // Re-render whiteboard page contents
    renderCurrentPage();
}

// --- ZOOM CONTROLLER ---
function zoomIn() {
    if (zoomScale >= 4.0) return;
    const viewport = document.getElementById('whiteboard-viewport');
    if (viewport) {
        const viewportX = viewport.clientWidth / 2;
        const viewportY = viewport.clientHeight / 2;
        applyZoom(zoomScale + 0.1, viewportX, viewportY);
    } else {
        zoomScale = parseFloat((zoomScale + 0.1).toFixed(1));
        updateZoomUI();
    }
}

function zoomOut() {
    if (zoomScale <= 0.5) return;
    const viewport = document.getElementById('whiteboard-viewport');
    if (viewport) {
        const viewportX = viewport.clientWidth / 2;
        const viewportY = viewport.clientHeight / 2;
        applyZoom(zoomScale - 0.1, viewportX, viewportY);
    } else {
        zoomScale = parseFloat((zoomScale - 0.1).toFixed(1));
        updateZoomUI();
    }
}

function updateZoomUI() {
    const text = document.getElementById('zoom-level-text');
    if (text) {
        text.textContent = `${Math.round(zoomScale * 100)}%`;
    }
    resizeCanvas();
}

// --- TABS & STATE MANAGEMENT ---
function getActiveTab() {
    return boardTabs.find(t => t.id === activeTabId);
}

function addNewBlankTab(name) {
    saveActiveTabTextboxes();
    
    // Save widget states of current tab
    const currentTab = getActiveTab();
    if (currentTab && typeof window.saveWidgetStatesForTab === 'function') {
        window.saveWidgetStatesForTab(currentTab);
    }
    
    const tabId = 'tab-' + Date.now() + '-' + Math.floor(Math.random() * 1000);
    const tabName = name || `Tableau Blanc ${boardTabs.filter(t => t.type === 'whiteboard').length + 1}`;
    
    const newTab = {
        id: tabId,
        name: tabName,
        type: 'whiteboard',
        pdfDoc: null,
        currentPage: 1,
        totalPages: 1,
        pages: {
            1: {
                elements: [],
                textboxes: [],
                backgroundType: 'blank',
                undoStack: [],
                redoStack: []
            }
        }
    };
    
    boardTabs.push(newTab);
    activeTabId = tabId;
    selectedElement = null;
    zoomScale = 1.0; // Reset zoom when switching tabs
    updateZoomUI();
    
    // Restore widget states for the new tab (initially empty)
    if (typeof window.syncWidgetStatesForTab === 'function') {
        window.syncWidgetStatesForTab(newTab);
    }
    
    renderTabsUI();
    renderCurrentPage();
    
    if (isThumbnailsPanelOpen) {
        renderThumbnails();
    }
}

function switchWhiteboardTab(tabId) {
    if (tabId === activeTabId) return;
    
    saveActiveTabTextboxes();
    
    // Save widget states of current tab
    const currentTab = getActiveTab();
    if (currentTab && typeof window.saveWidgetStatesForTab === 'function') {
        window.saveWidgetStatesForTab(currentTab);
    }
    
    activeTabId = tabId;
    selectedElement = null;
    zoomScale = 1.0; // Reset zoom
    updateZoomUI();
    
    // Restore widget states for the new tab
    const newTab = getActiveTab();
    if (newTab && typeof window.syncWidgetStatesForTab === 'function') {
        window.syncWidgetStatesForTab(newTab);
    }
    
    renderTabsUI();
    renderCurrentPage();
    
    if (isThumbnailsPanelOpen) {
        renderThumbnails();
    }
}

function closeTab(tabId, e) {
    if (e) e.stopPropagation();
    
    const index = boardTabs.findIndex(t => t.id === tabId);
    if (index === -1) return;
    
    if (boardTabs.length === 1) {
        alert("Impossible de fermer le dernier onglet. Vous devez garder au moins un tableau ouvert.");
        return;
    }
    
    if (confirm(`Voulez-vous fermer l'onglet "${boardTabs[index].name}" ? Ses modifications seront perdues.`)) {
        boardTabs.splice(index, 1);
        
        if (activeTabId === tabId) {
            const newActiveIndex = Math.min(index, boardTabs.length - 1);
            const nextTab = boardTabs[newActiveIndex];
            activeTabId = nextTab.id;
            selectedElement = null;
            zoomScale = 1.0;
            updateZoomUI();
            
            // Restore widget states for the new tab
            if (nextTab && typeof window.syncWidgetStatesForTab === 'function') {
                window.syncWidgetStatesForTab(nextTab);
            }
        }
        
        renderTabsUI();
        renderCurrentPage();
        
        if (isThumbnailsPanelOpen) {
            renderThumbnails();
        }
    }
}

function renderTabsUI() {
    const container = document.getElementById('tabs-container');
    if (!container) return;
    
    container.innerHTML = '';
    
    boardTabs.forEach(tab => {
        const tabEl = document.createElement('div');
        tabEl.className = `whiteboard-tab ${tab.id === activeTabId ? 'active' : ''}`;
        tabEl.setAttribute('draggable', 'true');
        
        tabEl.addEventListener('click', () => switchWhiteboardTab(tab.id));
        
        // --- DRAG & DROP REORDERING LISTENERS ---
        tabEl.addEventListener('dragstart', (e) => {
            e.dataTransfer.setData('text/plain', tab.id);
            tabEl.classList.add('opacity-50');
            e.dataTransfer.effectAllowed = 'move';
        });
        
        tabEl.addEventListener('dragover', (e) => {
            e.preventDefault();
            e.dataTransfer.dropEffect = 'move';
            
            const rect = tabEl.getBoundingClientRect();
            const midpoint = rect.left + rect.width / 2;
            
            if (e.clientX < midpoint) {
                tabEl.style.borderLeft = '4px solid #4f46e5';
                tabEl.style.borderRight = '';
            } else {
                tabEl.style.borderRight = '4px solid #4f46e5';
                tabEl.style.borderLeft = '';
            }
        });
        
        tabEl.addEventListener('dragleave', () => {
            tabEl.style.borderLeft = '';
            tabEl.style.borderRight = '';
        });
        
        tabEl.addEventListener('drop', (e) => {
            e.preventDefault();
            tabEl.style.borderLeft = '';
            tabEl.style.borderRight = '';
            
            const draggedId = e.dataTransfer.getData('text/plain');
            if (draggedId === tab.id) return;
            
            const draggedIndex = boardTabs.findIndex(t => t.id === draggedId);
            const targetIndex = boardTabs.findIndex(t => t.id === tab.id);
            
            if (draggedIndex !== -1 && targetIndex !== -1) {
                const [draggedTab] = boardTabs.splice(draggedIndex, 1);
                
                const rect = tabEl.getBoundingClientRect();
                const midpoint = rect.left + rect.width / 2;
                const insertIndex = e.clientX < midpoint ? targetIndex : targetIndex + 1;
                
                let finalInsertIndex = insertIndex;
                if (draggedIndex < targetIndex) {
                    if (e.clientX >= midpoint) {
                        finalInsertIndex = targetIndex;
                    } else {
                        finalInsertIndex = targetIndex - 1;
                    }
                }
                
                boardTabs.splice(finalInsertIndex, 0, draggedTab);
                
                renderTabsUI();
                saveActiveTabTextboxes();
            }
        });
        
        tabEl.addEventListener('dragend', () => {
            tabEl.classList.remove('opacity-50');
            document.querySelectorAll('.whiteboard-tab').forEach(el => {
                el.style.borderLeft = '';
                el.style.borderRight = '';
            });
        });
        
        const nameSpan = document.createElement('span');
        nameSpan.textContent = tab.name;
        tabEl.appendChild(nameSpan);
        
        const closeBtn = document.createElement('button');
        closeBtn.className = 'ml-2 hover:text-rose-500 rounded transition font-bold text-xs p-0.5 leading-none';
        closeBtn.innerHTML = '✕';
        closeBtn.title = 'Fermer cet onglet';
        closeBtn.addEventListener('click', (e) => closeTab(tab.id, e));
        
        tabEl.appendChild(closeBtn);
        container.appendChild(tabEl);
    });
}

// --- TEXTBOX SYNC ---
function saveActiveTabTextboxes() {
    const activeTab = getActiveTab();
    if (!activeTab) return;
    
    const pageNum = activeTab.currentPage;
    let pageData = activeTab.pages[pageNum];
    if (!pageData) {
        pageData = { 
            elements: [], 
            textboxes: [], 
            backgroundType: 'blank',
            undoStack: [],
            redoStack: []
        };
        activeTab.pages[pageNum] = pageData;
    }
    
    pageData.textboxes = Array.from(document.querySelectorAll('.text-box')).map(el => {
        if (el.classList.contains('movable-image-box')) {
            return {
                type: 'image',
                src: el.dataset.src,
                x: parseFloat(el.dataset.x) || 0,
                y: parseFloat(el.dataset.y) || 0,
                w: parseFloat(el.dataset.w) || 100,
                h: parseFloat(el.dataset.h) || 100
            };
        }
        
        const textSpan = el.querySelector('.text-content-node');
        const text = textSpan ? textSpan.innerText : el.innerText.replace('✕', '').trim();
        return {
            type: 'text',
            text: text,
            x: parseFloat(el.dataset.x) || 0,
            y: parseFloat(el.dataset.y) || 0,
            fontSize: parseInt(el.dataset.fontSize) || 12,
            underline: el.dataset.underline === 'true',
            color: el.dataset.color || '#4f46e5',
            isPostIt: el.dataset.isPostIt === 'true'
        };
    });
}

function restoreActiveTabTextboxes() {
    const layer = document.getElementById('annotations-layer');
    if (!layer) return;
    
    layer.innerHTML = '';
    
    const activeTab = getActiveTab();
    if (!activeTab) return;
    
    const pageNum = activeTab.currentPage;
    const pageData = activeTab.pages[pageNum];
    if (pageData && pageData.textboxes) {
        pageData.textboxes.forEach(tb => {
            if (tb.type === 'image') {
                createMovableImage(tb.x, tb.y, tb.w, tb.h, tb.src);
            } else {
                createTextbox(tb.x, tb.y, tb.text, tb.fontSize, tb.underline, tb.color, tb.isPostIt === true);
            }
        });
    }
}

// --- PAGE NAVIGATION ---
function prevPdfPage() {
    const tab = getActiveTab();
    if (!tab) return;
    if (tab.currentPage <= 1) return;
    
    saveActiveTabTextboxes();
    tab.currentPage--;
    selectedElement = null;
    
    renderCurrentPage();
}

function nextPdfPage() {
    const tab = getActiveTab();
    if (!tab) return;
    
    if (tab.currentPage >= tab.totalPages) {
        if (tab.type === 'whiteboard') {
            addWhiteboardPage();
        }
        return;
    }
    
    saveActiveTabTextboxes();
    tab.currentPage++;
    selectedElement = null;
    
    renderCurrentPage();
}

function addWhiteboardPage() {
    const tab = getActiveTab();
    if (!tab || tab.type !== 'whiteboard') return;
    
    saveActiveTabTextboxes();
    
    tab.totalPages++;
    tab.currentPage = tab.totalPages;
    
    tab.pages[tab.currentPage] = {
        elements: [],
        textboxes: [],
        backgroundType: tab.backgroundType || 'blank',
        undoStack: [],
        redoStack: []
    };
    
    selectedElement = null;
    
    renderCurrentPage();
    if (isThumbnailsPanelOpen) {
        renderThumbnails();
    }
}

function updatePageNavigationUI() {
    const tab = getActiveTab();
    if (!tab) return;
    
    // Bottom panel navigation
    const nav = document.getElementById('pdf-navigation-bottom');
    if (nav) {
        nav.classList.remove('hidden');
        nav.classList.add('flex');
    }
    
    const pageIndicator = document.getElementById('pdf-page-num-bottom');
    if (pageIndicator) {
        pageIndicator.textContent = `${tab.currentPage} / ${tab.totalPages}`;
    }
    
    // Add page button visibility
    const addPageBtn = document.getElementById('add-page-btn');
    if (addPageBtn) {
        if (tab.type === 'whiteboard') {
            addPageBtn.classList.remove('hidden');
        } else {
            addPageBtn.classList.add('hidden');
        }
    }
}

// --- RENDER PAGE LOGIC ---
function renderCurrentPage() {
    const tab = getActiveTab();
    if (!tab) return;
    
    const pageNum = tab.currentPage;
    let pageData = tab.pages[pageNum];
    if (!pageData) {
        pageData = {
            elements: [],
            textboxes: [],
            backgroundType: 'blank',
            undoStack: [],
            redoStack: []
        };
        tab.pages[pageNum] = pageData;
    }
    
    // 1. Set Background style class on Viewport
    const viewport = document.getElementById('whiteboard-viewport');
    if (viewport) {
        viewport.classList.remove('board-bg-blank', 'board-bg-blackboard', 'board-bg-seyes', 'board-bg-grid', 'board-bg-music');
        viewport.classList.add(`board-bg-${pageData.backgroundType || 'blank'}`);
    }
    
    // Update background selection active buttons
    document.querySelectorAll('.bg-select-btn').forEach(btn => {
        if (btn.id === `bg-btn-${pageData.backgroundType || 'blank'}`) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
    
    // 2. Render background canvas (PDF or imported Image)
    const bgCanvas = document.getElementById('bg-canvas');
    if (bgCanvas) {
        const bgCtx = bgCanvas.getContext('2d');
        
        if (tab.type === 'pdf' && tab.pdfDoc) {
            renderPdfPage();
        } else {
            bgCtx.clearRect(0, 0, bgCanvas.width, bgCanvas.height);
            if (pageData.bgImage) {
                renderImageToBg(pageData.bgImage);
            }
        }
    }
    
    // 3. Render vector elements on drawing-canvas
    const drawingCanvas = document.getElementById('drawing-canvas');
    if (drawingCanvas) {
        const ctx = drawingCanvas.getContext('2d');
        const dpr = window.devicePixelRatio || 1;
        
        ctx.clearRect(0, 0, drawingCanvas.width / dpr, drawingCanvas.height / dpr);
        
        pageData.elements.forEach(el => {
            drawVectorElement(ctx, el);
        });
        
        if (activeTool === 'select' && selectedElement) {
            drawSelectionHighlight(ctx, selectedElement);
        }
        
        // Rendu des traces de pointeur laser par-dessus tout
        if (typeof laserStrokes !== 'undefined' && laserStrokes.length > 0) {
            laserStrokes.forEach(stroke => {
                drawLaserStroke(ctx, stroke);
            });
        }
    }
    
    // 4. Restore DOM Textboxes
    restoreActiveTabTextboxes();
    
    // 5. Update bottom page nav
    updatePageNavigationUI();
    
    // 6. Highlight active thumbnail card
    if (isThumbnailsPanelOpen) {
        updateActiveThumbnailHighlight();
    }
}

// Draw a single vector element on a canvas context
function drawVectorElement(ctx, el) {
    ctx.save();
    setupDrawingContext(ctx);
    
    if (el.type === 'stroke') {
        ctx.strokeStyle = el.color;
        ctx.lineWidth = el.width;
        if (el.tool === 'highlighter') {
            ctx.globalAlpha = 0.45;
            ctx.globalCompositeOperation = 'source-over';
        } else if (el.tool === 'eraser') {
            ctx.strokeStyle = 'rgba(0,0,0,1)';
            ctx.lineWidth = el.width || 45;
            ctx.globalAlpha = 1.0;
            ctx.globalCompositeOperation = 'destination-out';
        } else {
            ctx.globalAlpha = 1.0;
            ctx.globalCompositeOperation = 'source-over';
        }
        
        const pts = el.points;
        if (pts.length > 0) {
            if (pts.length === 1) {
                ctx.beginPath();
                ctx.moveTo(pts[0].x, pts[0].y);
                ctx.lineTo(pts[0].x + 0.1, pts[0].y);
                ctx.stroke();
            } else {
                ctx.beginPath();
                ctx.moveTo(pts[0].x, pts[0].y);
                for (let i = 1; i < pts.length - 1; i++) {
                    const xc = (pts[i].x + pts[i + 1].x) / 2;
                    const yc = (pts[i].y + pts[i + 1].y) / 2;
                    ctx.quadraticCurveTo(pts[i].x, pts[i].y, xc, yc);
                }
                ctx.lineTo(pts[pts.length - 1].x, pts[pts.length - 1].y);
                ctx.stroke();
            }
        }
    } else if (el.type === 'shape') {
        ctx.strokeStyle = el.color;
        ctx.lineWidth = el.width;
        ctx.globalAlpha = 1.0;
        ctx.globalCompositeOperation = 'source-over';
        
        const x1 = el.x1, y1 = el.y1, x2 = el.x2, y2 = el.y2;
        
        ctx.beginPath();
        if (el.shapeType === 'line') {
            ctx.moveTo(x1, y1);
            ctx.lineTo(x2, y2);
            ctx.stroke();
        } else if (el.shapeType === 'arrow') {
            ctx.moveTo(x1, y1);
            ctx.lineTo(x2, y2);
            ctx.stroke();
            
            // Arrowhead calculations
            const angle = Math.atan2(y2 - y1, x2 - x1);
            const headLength = Math.max(12, el.width * 2.5);
            
            const h1x = x2 - headLength * Math.cos(angle - Math.PI / 6);
            const h1y = y2 - headLength * Math.sin(angle - Math.PI / 6);
            const h2x = x2 - headLength * Math.cos(angle + Math.PI / 6);
            const h2y = y2 - headLength * Math.sin(angle + Math.PI / 6);
            
            ctx.beginPath();
            ctx.moveTo(x2, y2);
            ctx.lineTo(h1x, h1y);
            ctx.lineTo(h2x, h2y);
            ctx.closePath();
            ctx.fillStyle = el.color;
            ctx.fill();
        } else if (el.shapeType === 'rect') {
            ctx.rect(x1, y1, x2 - x1, y2 - y1);
            if (el.fill) {
                ctx.fillStyle = getRgbaColor(el.color, 0.3);
                ctx.fill();
            }
            ctx.stroke();
        } else if (el.shapeType === 'circle') {
            const r = Math.sqrt((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1));
            ctx.arc(x1, y1, r, 0, 2 * Math.PI);
            if (el.fill) {
                ctx.fillStyle = getRgbaColor(el.color, 0.3);
                ctx.fill();
            }
            ctx.stroke();
        }
    }
    
    ctx.restore();
}

// --- POINTER EVENT HANDLERS ---
function handlePointerDown(e) {
    if (e.button !== 0 && e.pointerType === 'mouse') return; // Left click only
    
    // Fermer le popover de réglage d'outils lors d'un clic sur la zone de dessin
    const popover = document.getElementById('tool-settings-popover');
    if (popover && !popover.classList.contains('hidden')) {
        popover.classList.add('hidden');
    }
    
    const canvas = document.getElementById('drawing-canvas');
    const rect = canvas.getBoundingClientRect();
    let rawX = e.clientX - rect.left;
    let rawY = e.clientY - rect.top;
    
    // Snap coordinates to Aristo square ruler if close by (in visual space coordinates)
    const snapped = (window.snapToAristo && activeTool !== 'eraser') ? window.snapToAristo(rawX, rawY) : null;
    if (snapped) {
        rawX = snapped.x;
        rawY = snapped.y;
    }
    
    // Convert visual/snapped coordinates to 1x space coordinates by dividing by zoomScale
    const x = rawX / zoomScale;
    const y = rawY / zoomScale;
    
    startX = x;
    startY = y;
    
    // 1. SELECT MODE
    if (activeTool === 'select') {
        if (selectedElement) {
            // Check if clicked delete button of currently selected element
            const box = getElementBoundingBox(selectedElement);
            if (box) {
                const pad = 6 / zoomScale;
                const delX = box.x + box.w + pad + 14 / zoomScale;
                const delY = box.y - pad - 14 / zoomScale;
                const dist = Math.sqrt((x - delX) ** 2 + (y - delY) ** 2);
                if (dist <= 36 / zoomScale) {
                    deleteElement(selectedElement);
                    selectedElement = null;
                    renderCurrentPage();
                    return;
                }
            }
            
            // Check if clicked near any resize handles of the selected element
            const handles = getResizeHandles(selectedElement);
            for (let i = 0; i < handles.length; i++) {
                const h = handles[i];
                const dist = Math.sqrt((x - h.x) ** 2 + (y - h.y) ** 2);
                if (dist <= 24 / zoomScale) { // 15px hit-test radius
                    isResizing = true;
                    resizeHandleIndex = i;
                    dragStartX = x;
                    dragStartY = y;
                    dragStartElementCopy = JSON.parse(JSON.stringify(selectedElement));
                    if (selectedElement.type === 'stroke') {
                        dragStartStrokeBox = getElementBoundingBox(selectedElement);
                    }
                    canvas.setPointerCapture(e.pointerId);
                    return;
                }
            }
        }
        
        // Find if clicked near any stroke or shape (calculated in 1x space)
        const clickedEl = findElementAt(x, y);
        if (clickedEl) {
            selectedElement = clickedEl;
            isDraggingElement = true;
            dragStartX = x;
            dragStartY = y;
            dragStartElementCopy = JSON.parse(JSON.stringify(selectedElement));
            canvas.setPointerCapture(e.pointerId);
            renderCurrentPage();
        } else {
            selectedElement = null;
            renderCurrentPage();
        }
        return;
    }
    
    // 2. TEXT MODE
    if (activeTool === 'text') {
        e.preventDefault();
        const defaultFontSize = 12;
        // Aligner précisément le curseur d'écriture avec le clic de l'utilisateur :
        // - Horizontalement : soustraire la bordure (2px) et le padding-left (12px) divisés par zoomScale = 14px
        // - Verticalement : soustraire la bordure + padding-top (8px) divisés par zoomScale, et la hauteur de la ligne (environ 80% de la taille de police = 9.6px) pour que la ligne d'écriture soit sur le clic
        createTextbox(x - 14 / zoomScale, y - 8 / zoomScale - 0.8 * defaultFontSize, "", defaultFontSize, false, '#4f46e5');
        return;
    }
    
    // 2b. SCISSORS MODE
    if (activeTool === 'scissors') {
        e.preventDefault();
        isDrawing = true;
        canvas.setPointerCapture(e.pointerId);
        currentDrawingElement = {
            type: 'scissors',
            x1: x, y1: y, x2: x, y2: y
        };
        return;
    }
    
    // 2c. LASER POINTER MODE
    if (activeTool === 'laser') {
        e.preventDefault();
        isDrawingLaser = true;
        activeLaserStroke = {
            id: Date.now(),
            points: [{ x, y, time: Date.now() }]
        };
        laserStrokes.push(activeLaserStroke);
        canvas.setPointerCapture(e.pointerId);
        startLaserAnimation();
        return;
    }
    
    // 3. DRAWING MODES (PEN, HIGHLIGHTER, ERASER, SHAPE)
    e.preventDefault();
    isDrawing = true;
    canvas.setPointerCapture(e.pointerId);
    
    saveStateToUndo();
    
    const tab = getActiveTab();
    if (tab) {
        const pageData = tab.pages[tab.currentPage];
        if (pageData) {
            if (activeTool === 'shape') {
                currentDrawingElement = {
                    type: 'shape',
                    shapeType: shapeType,
                    color: strokeColor,
                    width: strokeWidth,
                    fill: fillShapes,
                    x1: x, y1: y, x2: x, y2: y
                };
            } else {
                currentDrawingElement = {
                    type: 'stroke',
                    tool: activeTool,
                    color: strokeColor,
                    width: activeTool === 'eraser' ? eraserSize : strokeWidth,
                    points: [{ x, y }]
                };
            }
            pageData.elements.push(currentDrawingElement);
        }
    }
    
    renderCurrentPage();
}

function handlePointerMove(e) {
    // Eraser cursor preview positioning
    const preview = document.getElementById('eraser-cursor-preview');
    if (preview) {
        if (activeTool === 'eraser') {
            preview.style.display = 'block';
            const size = eraserSize * zoomScale;
            preview.style.width = size + 'px';
            preview.style.height = size + 'px';
            preview.style.left = e.clientX + 'px';
            preview.style.top = e.clientY + 'px';
        } else {
            preview.style.display = 'none';
        }
    }

    const canvas = document.getElementById('drawing-canvas');
    const rect = canvas.getBoundingClientRect();
    let rawX = e.clientX - rect.left;
    let rawY = e.clientY - rect.top;
    
    const snapped = (window.snapToAristo && activeTool !== 'eraser') ? window.snapToAristo(rawX, rawY) : null;
    if (snapped) {
        rawX = snapped.x;
        rawY = snapped.y;
    }
    
    const x = rawX / zoomScale;
    const y = rawY / zoomScale;
    
    // 1. SELECT MODE
    if (activeTool === 'select') {
        if (isResizing && selectedElement) {
            e.preventDefault();
            const dx = x - dragStartX;
            const dy = y - dragStartY;
            
            if (selectedElement.type === 'shape') {
                const shape = selectedElement;
                const orig = dragStartElementCopy;
                if (shape.shapeType === 'line' || shape.shapeType === 'arrow') {
                    if (resizeHandleIndex === 0) {
                        shape.x1 = orig.x1 + dx;
                        shape.y1 = orig.y1 + dy;
                    } else if (resizeHandleIndex === 1) {
                        shape.x2 = orig.x2 + dx;
                        shape.y2 = orig.y2 + dy;
                    }
                } else if (shape.shapeType === 'circle') {
                    if (resizeHandleIndex === 0) {
                        shape.x2 = orig.x2 + dx;
                        shape.y2 = orig.y2 + dy;
                    }
                } else if (shape.shapeType === 'rect') {
                    if (resizeHandleIndex === 0) { // TL
                        shape.x1 = orig.x1 + dx;
                        shape.y1 = orig.y1 + dy;
                    } else if (resizeHandleIndex === 1) { // TR
                        shape.x2 = orig.x2 + dx;
                        shape.y1 = orig.y1 + dy;
                    } else if (resizeHandleIndex === 2) { // BL
                        shape.x1 = orig.x1 + dx;
                        shape.y2 = orig.y2 + dy;
                    } else if (resizeHandleIndex === 3) { // BR
                        shape.x2 = orig.x2 + dx;
                        shape.y2 = orig.y2 + dy;
                    }
                }
            } else if (selectedElement.type === 'stroke') {
                const origBox = dragStartStrokeBox;
                if (origBox) {
                    let newX1 = origBox.x;
                    let newY1 = origBox.y;
                    let newX2 = origBox.x + origBox.w;
                    let newY2 = origBox.y + origBox.h;
                    
                    if (resizeHandleIndex === 0) { // TL
                        newX1 = origBox.x + dx;
                        newY1 = origBox.y + dy;
                    } else if (resizeHandleIndex === 1) { // TR
                        newX2 = origBox.x + origBox.w + dx;
                        newY1 = origBox.y + dy;
                    } else if (resizeHandleIndex === 2) { // BL
                        newX1 = origBox.x + dx;
                        newY2 = origBox.y + origBox.h + dy;
                    } else if (resizeHandleIndex === 3) { // BR
                        newX2 = origBox.x + origBox.w + dx;
                        newY2 = origBox.y + origBox.h + dy;
                    }
                    
                    const newW = newX2 - newX1;
                    const newH = newY2 - newY1;
                    
                    if (Math.abs(newW) > 5 && Math.abs(newH) > 5) {
                        const orig = dragStartElementCopy;
                        for (let i = 0; i < selectedElement.points.length; i++) {
                            const pctX = (orig.points[i].x - origBox.x) / origBox.w;
                            const pctY = (orig.points[i].y - origBox.y) / origBox.h;
                            selectedElement.points[i].x = newX1 + pctX * newW;
                            selectedElement.points[i].y = newY1 + pctY * newH;
                        }
                    }
                }
            }
            renderCurrentPage();
        } else if (isDraggingElement && selectedElement) {
            e.preventDefault();
            const dx = x - dragStartX;
            const dy = y - dragStartY;
            
            if (selectedElement.type === 'stroke') {
                for (let i = 0; i < selectedElement.points.length; i++) {
                    selectedElement.points[i].x = dragStartElementCopy.points[i].x + dx;
                    selectedElement.points[i].y = dragStartElementCopy.points[i].y + dy;
                }
            } else if (selectedElement.type === 'shape') {
                selectedElement.x1 = dragStartElementCopy.x1 + dx;
                selectedElement.y1 = dragStartElementCopy.y1 + dy;
                selectedElement.x2 = dragStartElementCopy.x2 + dx;
                selectedElement.y2 = dragStartElementCopy.y2 + dy;
            }
            renderCurrentPage();
        }
        return;
    }
    
    // 2. LASER POINTER MODE
    if (activeTool === 'laser') {
        if (isDrawingLaser && activeLaserStroke) {
            e.preventDefault();
            activeLaserStroke.points.push({ x, y, time: Date.now() });
            startLaserAnimation();
        }
        return;
    }
    
    if (activeTool === 'scissors') {
        if (isDrawing && currentDrawingElement) {
            e.preventDefault();
            currentDrawingElement.x2 = x;
            currentDrawingElement.y2 = y;
            
            renderCurrentPage();
            
            const drawingCanvas = document.getElementById('drawing-canvas');
            const ctx = drawingCanvas.getContext('2d');
            const dpr = window.devicePixelRatio || 1;
            
            ctx.save();
            ctx.strokeStyle = '#4f46e5';
            ctx.lineWidth = 2 / zoomScale;
            ctx.setLineDash([6 / zoomScale, 6 / zoomScale]);
            
            const rx = Math.min(currentDrawingElement.x1, currentDrawingElement.x2);
            const ry = Math.min(currentDrawingElement.y1, currentDrawingElement.y2);
            const rw = Math.abs(currentDrawingElement.x2 - currentDrawingElement.x1);
            const rh = Math.abs(currentDrawingElement.y2 - currentDrawingElement.y1);
            
            ctx.strokeRect(rx, ry, rw, rh);
            ctx.fillStyle = 'rgba(79, 70, 229, 0.15)';
            ctx.fillRect(rx, ry, rw, rh);
            ctx.restore();
        }
        return;
    }
    
    if (!isDrawing || !currentDrawingElement) return;
    e.preventDefault();
    
    if (currentDrawingElement.type === 'shape') {
        currentDrawingElement.x2 = x;
        currentDrawingElement.y2 = y;
    } else {
        currentDrawingElement.points.push({ x, y });
    }
    
    renderCurrentPage();
}

function handlePointerUp(e) {
    const canvas = document.getElementById('drawing-canvas');
    
    if (activeTool === 'laser') {
        isDrawingLaser = false;
        activeLaserStroke = null;
        if (canvas) canvas.releasePointerCapture(e.pointerId);
        return;
    }
    
    if (activeTool === 'scissors') {
        if (isDrawing && currentDrawingElement) {
            isDrawing = false;
            canvas.releasePointerCapture(e.pointerId);
            
            const x1 = currentDrawingElement.x1;
            const y1 = currentDrawingElement.y1;
            const x2 = currentDrawingElement.x2;
            const y2 = currentDrawingElement.y2;
            currentDrawingElement = null;
            
            // Clean the drawing canvas first (removes the dashed selection box) without re-rendering background
            const drawingCanvas = document.getElementById('drawing-canvas');
            if (drawingCanvas) {
                const ctx = drawingCanvas.getContext('2d');
                const dpr = window.devicePixelRatio || 1;
                ctx.clearRect(0, 0, drawingCanvas.width / dpr, drawingCanvas.height / dpr);
                const tab = getActiveTab();
                if (tab) {
                    const pageData = tab.pages[tab.currentPage];
                    if (pageData && pageData.elements) {
                        pageData.elements.forEach(el => {
                            drawVectorElement(ctx, el);
                        });
                    }
                }
            }
            
            cropWhiteboardArea(x1, y1, x2, y2);
        }
        return;
    }
    
    if (activeTool === 'select') {
        if (isResizing) {
            isResizing = false;
            resizeHandleIndex = -1;
            dragStartElementCopy = null;
            dragStartStrokeBox = null;
            if (canvas) canvas.releasePointerCapture(e.pointerId);
            renderCurrentPage();
            if (isThumbnailsPanelOpen) {
                renderThumbnails();
            }
        } else if (isDraggingElement) {
            isDraggingElement = false;
            dragStartElementCopy = null;
            if (canvas) canvas.releasePointerCapture(e.pointerId);
            
            if (isThumbnailsPanelOpen) {
                renderThumbnails();
            }
        }
        return;
    }
    
    if (!isDrawing) return;
    
    isDrawing = false;
    canvas.releasePointerCapture(e.pointerId);
    currentDrawingElement = null;
    
    renderCurrentPage();
    
    if (isThumbnailsPanelOpen) {
        renderThumbnails();
    }
}

// --- VECTOR MATH FUNCTIONS (SELECTION & BOUNDS) ---

// Distance from point (x,y) to segment (x1,y1)-(x2,y2)
function getDistanceToSegment(x, y, x1, y1, x2, y2) {
    const A = x - x1;
    const B = y - y1;
    const C = x2 - x1;
    const D = y2 - y1;
    
    const dot = A * C + B * D;
    const lenSq = C * C + D * D;
    let param = -1;
    if (lenSq !== 0) param = dot / lenSq;
    
    let xx, yy;
    if (param < 0) {
        xx = x1;
        yy = y1;
    } else if (param > 1) {
        xx = x2;
        yy = y2;
    } else {
        xx = x1 + param * C;
        yy = y1 + param * D;
    }
    
    const dx = x - xx;
    const dy = y - yy;
    return Math.sqrt(dx * dx + dy * dy);
}

// Distance from point (x,y) to a multi-point stroke
function getDistanceToStroke(x, y, stroke) {
    const pts = stroke.points;
    if (pts.length === 0) return Infinity;
    if (pts.length === 1) {
        const dx = x - pts[0].x;
        const dy = y - pts[0].y;
        return Math.sqrt(dx * dx + dy * dy);
    }
    let minD = Infinity;
    for (let i = 0; i < pts.length - 1; i++) {
        const d = getDistanceToSegment(x, y, pts[i].x, pts[i].y, pts[i+1].x, pts[i+1].y);
        if (d < minD) minD = d;
    }
    return minD;
}

// Calculate the visual bounding box of a vector element
function getElementBoundingBox(el) {
    if (el.type === 'stroke') {
        let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
        el.points.forEach(p => {
            if (p.x < minX) minX = p.x;
            if (p.x > maxX) maxX = p.x;
            if (p.y < minY) minY = p.y;
            if (p.y > maxY) maxY = p.y;
        });
        
        let w = maxX - minX;
        let h = maxY - minY;
        
        // Enforce a minimum size of 8 units (coordinates space) so that single-point dots are selectable and delete handle is visible
        if (w < 8) {
            const cx = minX + w / 2;
            minX = cx - 4;
            w = 8;
        }
        if (h < 8) {
            const cy = minY + h / 2;
            minY = cy - 4;
            h = 8;
        }
        
        return { x: minX, y: minY, w, h };
    } else if (el.type === 'shape') {
        if (el.shapeType === 'circle') {
            const r = Math.sqrt((el.x2 - el.x1) ** 2 + (el.y2 - el.y1) ** 2);
            return { x: el.x1 - r, y: el.y1 - r, w: 2 * r, h: 2 * r };
        } else {
            const minX = Math.min(el.x1, el.x2);
            const maxX = Math.max(el.x1, el.x2);
            const minY = Math.min(el.y1, el.y2);
            const maxY = Math.max(el.y1, el.y2);
            return { x: minX, y: minY, w: maxX - minX, h: maxY - minY };
        }
    }
    return null;
}

// Find topmost element under coordinates (x,y)
function findElementAt(x, y) {
    const tab = getActiveTab();
    if (!tab) return null;
    const pageData = tab.pages[tab.currentPage];
    if (!pageData || !pageData.elements) return null;
    
    const elements = pageData.elements;
    for (let i = elements.length - 1; i >= 0; i--) {
        const el = elements[i];
        if (el.type === 'stroke') {
            if (el.tool === 'eraser') continue;
            
            const dist = getDistanceToStroke(x, y, el);
            const tolerance = Math.max(10, el.width / 2 + 8);
            if (dist <= tolerance) return el;
        } else if (el.type === 'shape') {
            if (el.shapeType === 'line' || el.shapeType === 'arrow') {
                const dist = getDistanceToSegment(x, y, el.x1, el.y1, el.x2, el.y2);
                const tolerance = Math.max(10, el.width / 2 + 8);
                if (dist <= tolerance) return el;
            } else if (el.shapeType === 'rect') {
                const d1 = getDistanceToSegment(x, y, el.x1, el.y1, el.x2, el.y1);
                const d2 = getDistanceToSegment(x, y, el.x2, el.y1, el.x2, el.y2);
                const d3 = getDistanceToSegment(x, y, el.x2, el.y2, el.x1, el.y2);
                const d4 = getDistanceToSegment(x, y, el.x1, el.y2, el.x1, el.y1);
                const dist = Math.min(d1, d2, d3, d4);
                const tolerance = Math.max(10, el.width / 2 + 8);
                if (dist <= tolerance) return el;
                
                const minX = Math.min(el.x1, el.x2);
                const maxX = Math.max(el.x1, el.x2);
                const minY = Math.min(el.y1, el.y2);
                const maxY = Math.max(el.y1, el.y2);
                if (x >= minX && x <= maxX && y >= minY && y <= maxY) return el;
            } else if (el.shapeType === 'circle') {
                const r = Math.sqrt((el.x2 - el.x1) ** 2 + (el.y2 - el.y1) ** 2);
                const distToCenter = Math.sqrt((x - el.x1) ** 2 + (y - el.y1) ** 2);
                const distToBorder = Math.abs(distToCenter - r);
                const tolerance = Math.max(10, el.width / 2 + 8);
                if (distToBorder <= tolerance || distToCenter <= r) return el;
            }
        }
    }
    return null;
}

function deleteElement(el) {
    const tab = getActiveTab();
    if (!tab) return;
    const pageData = tab.pages[tab.currentPage];
    if (!pageData) return;
    
    saveStateToUndo();
    
    const index = pageData.elements.indexOf(el);
    if (index > -1) {
        pageData.elements.splice(index, 1);
    }
}

function getResizeHandles(el) {
    if (el.type === 'shape') {
        if (el.shapeType === 'line' || el.shapeType === 'arrow') {
            return [
                { x: el.x1, y: el.y1 },
                { x: el.x2, y: el.y2 }
            ];
        } else if (el.shapeType === 'circle') {
            // Circumference handle
            return [
                { x: el.x2, y: el.y2 }
            ];
        } else if (el.shapeType === 'rect') {
            return [
                { x: el.x1, y: el.y1 },
                { x: el.x2, y: el.y1 },
                { x: el.x1, y: el.y2 },
                { x: el.x2, y: el.y2 }
            ];
        }
    } else if (el.type === 'stroke') {
        const box = getElementBoundingBox(el);
        if (box) {
            return [
                { x: box.x, y: box.y },
                { x: box.x + box.w, y: box.y },
                { x: box.x, y: box.y + box.h },
                { x: box.x + box.w, y: box.y + box.h }
            ];
        }
    }
    return [];
}

// Draw bounding box dashed border with delete badge (scales with zoom)
function drawSelectionHighlight(ctx, el) {
    const box = getElementBoundingBox(el);
    if (!box) return;
    
    ctx.save();
    
    // We are inside scaled context, so scale down styling widths so they remain constant visually
    ctx.strokeStyle = '#4f46e5';
    ctx.lineWidth = 1.5 / zoomScale;
    ctx.setLineDash([4 / zoomScale, 4 / zoomScale]);
    const pad = 6 / zoomScale;
    ctx.strokeRect(box.x - pad, box.y - pad, box.w + 2 * pad, box.h + 2 * pad);
    
    ctx.fillStyle = '#ffffff';
    ctx.strokeStyle = '#4f46e5';
    ctx.lineWidth = 2 / zoomScale;
    ctx.setLineDash([]);
    const hs = 8 / zoomScale; // Slightly larger for TBI touch targets
    
    const handles = getResizeHandles(el);
    handles.forEach(h => {
        ctx.beginPath();
        ctx.arc(h.x, h.y, hs / 2, 0, 2 * Math.PI);
        ctx.fill();
        ctx.stroke();
    });
    
    const delX = box.x + box.w + pad + 14 / zoomScale;
    const delY = box.y - pad - 14 / zoomScale;
    const delR = 14 / zoomScale;
    
    ctx.beginPath();
    ctx.arc(delX, delY, delR, 0, 2 * Math.PI);
    ctx.fillStyle = '#ef4444';
    ctx.fill();
    
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2 / zoomScale;
    ctx.beginPath();
    ctx.moveTo(delX - 5 / zoomScale, delY - 5 / zoomScale);
    ctx.lineTo(delX + 5 / zoomScale, delY + 5 / zoomScale);
    ctx.moveTo(delX + 5 / zoomScale, delY - 5 / zoomScale);
    ctx.lineTo(delX - 5 / zoomScale, delY + 5 / zoomScale);
    ctx.stroke();
    
    ctx.restore();
}

// --- TOOL & COLOR SWITCHERS ---
function setWhiteboardTool(toolName) {
    saveActiveTabTextboxes();
    
    // Fermer le popover de réglage d'outils lors du changement d'outil
    const popover = document.getElementById('tool-settings-popover');
    
    let isClickingActive = false;
    if (toolName === 'pen1' || toolName === 'pen2' || toolName === 'pen3') {
        isClickingActive = (activeTool === 'pen' && activePen === toolName);
    } else if (toolName === 'highlighter') {
        isClickingActive = (activeTool === 'highlighter');
    } else if (toolName === 'line') {
        isClickingActive = (activeTool === 'shape' && shapeType === 'line');
    } else {
        isClickingActive = (activeTool === toolName);
    }
    
    if (isClickingActive) {
        // Si on clique sur l'outil déjà actif, on affiche/masque ses réglages
        if (toolName === 'pen1' || toolName === 'pen2' || toolName === 'pen3' || toolName === 'highlighter' || toolName === 'line' || toolName === 'eraser') {
            toggleToolSettingsPopover(toolName, `tool-btn-${toolName}`);
            return;
        }
    } else {
        if (popover) popover.classList.add('hidden');
    }
    
    let targetTool = toolName;
    if (toolName === 'pen1' || toolName === 'pen2' || toolName === 'pen3') {
        targetTool = 'pen';
        activePen = toolName;
        strokeColor = toolConfigs[toolName].color;
        strokeWidth = toolConfigs[toolName].width;
    } else if (toolName === 'line') {
        targetTool = 'shape';
        shapeType = 'line';
        strokeColor = toolConfigs.line.color;
        strokeWidth = toolConfigs.line.width;
    } else if (toolName === 'highlighter') {
        targetTool = 'highlighter';
        strokeColor = toolConfigs.highlighter.color;
        strokeWidth = toolConfigs.highlighter.width;
    } else if (toolName === 'laser') {
        targetTool = 'laser';
    }
    
    activeTool = targetTool;
    
    // Notify widgets that the active tool has changed
    if (typeof window.updateAbaqueDrawingCanvasState === 'function') {
        window.updateAbaqueDrawingCanvasState();
    }
    
    document.querySelectorAll('.tool-btn').forEach(btn => {
        if (btn.id === `tool-btn-${toolName}`) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
    
    updateToolButtonStyles();
    
    const eraserSizeSelect = document.getElementById('eraser-size-select');
    if (eraserSizeSelect) {
        if (toolName === 'eraser') {
            eraserSizeSelect.classList.remove('hidden');
        } else {
            eraserSizeSelect.classList.add('hidden');
        }
    }
    
    const shapeContainer = document.getElementById('shape-select-container');
    if (shapeContainer) {
        if (toolName === 'shape') {
            shapeContainer.classList.remove('hidden');
        } else {
            shapeContainer.classList.add('hidden');
        }
    }
    
    const preview = document.getElementById('eraser-cursor-preview');
    if (preview) {
        preview.style.display = 'none';
    }
    
    // Manage textbox dragging and styling modes
    const layer = document.getElementById('annotations-layer');
    if (layer) {
        layer.classList.remove('select-mode-active', 'text-mode-active');
        layer.style.pointerEvents = 'none'; // Set to none so clicks pass through to select drawings
        if (toolName === 'select') {
            layer.classList.add('select-mode-active');
        } else if (toolName === 'text') {
            layer.classList.add('text-mode-active');
        }
    }
    
    // Update cursor style on drawing canvas
    const canvas = document.getElementById('drawing-canvas');
    if (canvas) {
        canvas.className = 'absolute inset-0 z-10 touch-none';
        if (targetTool === 'pen') canvas.classList.add('canvas-cursor-pen');
        if (targetTool === 'highlighter') canvas.classList.add('canvas-cursor-highlighter');
        if (targetTool === 'eraser') canvas.classList.add('canvas-cursor-eraser');
        if (targetTool === 'laser') canvas.classList.add('canvas-cursor-laser');
        if (targetTool === 'text') canvas.style.cursor = 'text';
        if (targetTool === 'shape' || targetTool === 'scissors') canvas.style.cursor = 'crosshair';
        if (targetTool === 'select') canvas.style.cursor = 'default';
    }
    
    if (toolName !== 'select') {
        selectedElement = null;
    }
    
    renderCurrentPage();
}

// Logique pour le popover de réglage d'outil (couleurs & épaisseurs)
function toggleToolSettingsPopover(toolName, btnId) {
    const popover = document.getElementById('tool-settings-popover');
    if (!popover) return;
    
    const btn = document.getElementById(btnId);
    if (!btn) return;
    
    // Si le popover est déjà affiché pour cet outil, on le cache
    if (!popover.classList.contains('hidden') && popover.dataset.tool === toolName) {
        popover.classList.add('hidden');
        return;
    }
    
    popover.dataset.tool = toolName;
    popover.classList.remove('hidden');
    
    // Positionner le popover de manière centrée au-dessus du bouton
    const btnRect = btn.getBoundingClientRect();
    const bottomBarRect = document.getElementById('whiteboard-bottom-bar').getBoundingClientRect();
    
    const relativeLeft = btnRect.left - bottomBarRect.left + (btnRect.width / 2) - 144; // 144 est la moitié de la largeur w-72 (288px)
    popover.style.left = `${Math.max(10, Math.min(bottomBarRect.width - 298, relativeLeft))}px`;
    
    // Rendu dynamique de la grille de couleurs (12 options)
    const colorGrid = document.getElementById('popover-color-grid');
    if (colorGrid) {
        if (toolName === 'eraser') {
            colorGrid.parentElement.style.display = 'none';
        } else {
            colorGrid.parentElement.style.display = 'block';
        }
        
        colorGrid.innerHTML = '';
        const colors = [
            '#1e293b', // Ardoise / Noir
            '#3b82f6', // Bleu
            '#06b6d4', // Turquoise
            '#10b981', // Vert
            '#84cc16', // Vert clair
            '#eab308', // Jaune
            '#f97316', // Orange
            '#ef4444', // Rouge
            '#ec4899', // Rose
            '#8b5cf6', // Violet
            '#78350f', // Brun
            '#ffffff'  // Blanc
        ];
        
        const activeColor = toolConfigs[toolName] ? toolConfigs[toolName].color : '#1e293b';
        
        colors.forEach(c => {
            const dot = document.createElement('button');
            dot.className = `w-7 h-7 rounded-full border-2 transition active:scale-90 cursor-pointer flex items-center justify-center ${c === '#ffffff' ? 'border-neutral-300' : 'border-transparent'}`;
            dot.style.backgroundColor = c;
            if (c === activeColor) {
                dot.classList.add('border-indigo-600', 'ring-2', 'ring-indigo-300');
            }
            dot.addEventListener('click', () => {
                if (toolConfigs[toolName]) {
                    toolConfigs[toolName].color = c;
                }
                setStrokeColor(c);
                popover.classList.add('hidden'); // Ferme le popover
                updateToolButtonStyles();
            });
            colorGrid.appendChild(dot);
        });
    }
    
    // Rendu dynamique des épaisseurs de trait (5 niveaux)
    const widthRow = document.getElementById('popover-width-row');
    if (widthRow) {
        // Mettre à jour le titre de la section d'épaisseur
        const widthSection = widthRow.parentElement;
        const widthTitle = widthSection.querySelector('span');
        if (widthTitle) {
            widthTitle.textContent = toolName === 'eraser' ? 'Taille de la gomme' : 'Épaisseur du trait';
        }

        widthRow.innerHTML = '';
        const thicknesses = toolName === 'highlighter' ? [
            { value: 3, label: 'Très fin' },
            { value: 4.5, label: 'Fin' },
            { value: 8, label: 'Moyen' },
            { value: 12, label: 'Large' },
            { value: 20, label: 'Géant' }
        ] : toolName === 'eraser' ? [
            { value: 8, label: 'Très fin' },
            { value: 15, label: 'Fin' },
            { value: 35, label: 'Moyen' },
            { value: 60, label: 'Large' },
            { value: 1000, label: 'Géant' }
        ] : [
            { value: 1, label: 'Très fin' },
            { value: 2, label: 'Fin' },
            { value: 3, label: 'Moyen' },
            { value: 5, label: 'Large' },
            { value: 7, label: 'Géant' }
        ];
        
        const activeWidth = toolName === 'eraser' ? eraserSize : (toolConfigs[toolName] ? toolConfigs[toolName].width : 3);
        
        thicknesses.forEach(t => {
            const btnT = document.createElement('button');
            btnT.className = `px-2.5 py-1 text-[10px] font-bold border-2 rounded-lg transition active:scale-95 cursor-pointer ${t.value === activeWidth ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-neutral-100 text-neutral-600 border-neutral-300 hover:bg-neutral-200'}`;
            btnT.textContent = t.label;
            btnT.addEventListener('click', () => {
                if (toolName === 'eraser') {
                    eraserSize = t.value;
                    localStorage.setItem('tbi_eraser_size', eraserSize);
                } else if (toolConfigs[toolName]) {
                    toolConfigs[toolName].width = t.value;
                    setStrokeWidth(t.value);
                }
                popover.classList.add('hidden'); // Ferme le popover
            });
            widthRow.appendChild(btnT);
        });
    }
}

// Met à jour la couleur des icônes SVG des outils en fonction de leur configuration
function updateToolButtonStyles() {
    const pen1Btn = document.getElementById('tool-btn-pen1');
    const pen2Btn = document.getElementById('tool-btn-pen2');
    const pen3Btn = document.getElementById('tool-btn-pen3');
    const highlighterBtn = document.getElementById('tool-btn-highlighter');
    const lineBtn = document.getElementById('tool-btn-line');
    
    if (pen1Btn) {
        pen1Btn.style.color = toolConfigs.pen1.color;
        const svg = pen1Btn.querySelector('svg');
        if (svg) svg.style.color = toolConfigs.pen1.color;
    }
    if (pen2Btn) {
        pen2Btn.style.color = toolConfigs.pen2.color;
        const svg = pen2Btn.querySelector('svg');
        if (svg) svg.style.color = toolConfigs.pen2.color;
    }
    if (pen3Btn) {
        pen3Btn.style.color = toolConfigs.pen3.color;
        const svg = pen3Btn.querySelector('svg');
        if (svg) svg.style.color = toolConfigs.pen3.color;
    }
    if (highlighterBtn) {
        highlighterBtn.style.color = toolConfigs.highlighter.color;
        const svg = highlighterBtn.querySelector('svg');
        if (svg) svg.style.color = toolConfigs.highlighter.color;
    }
    if (lineBtn) {
        lineBtn.style.color = toolConfigs.line.color;
        const svg = lineBtn.querySelector('svg');
        if (svg) svg.style.color = toolConfigs.line.color;
    }
}

// Logique d'animation pour le pointeur laser
function startLaserAnimation() {
    if (!laserAnimFrame) {
        laserAnimFrame = requestAnimationFrame(animateLaser);
    }
}

function animateLaser() {
    const now = Date.now();
    let hasPoints = false;
    
    laserStrokes.forEach(stroke => {
        stroke.points = stroke.points.filter(p => now - p.time < 1000); // Durée de 1 seconde
        if (stroke.points.length > 0) hasPoints = true;
    });
    
    laserStrokes = laserStrokes.filter(stroke => stroke.points.length > 0);
    
    renderCurrentPage();
    
    if (hasPoints) {
        laserAnimFrame = requestAnimationFrame(animateLaser);
    } else {
        laserAnimFrame = null;
    }
}

function drawLaserStroke(ctx, stroke) {
    if (!stroke || stroke.points.length < 2) return;
    
    const now = Date.now();
    
    // Draw outer glow (thick red/rose trail)
    ctx.save();
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    
    for (let i = 1; i < stroke.points.length; i++) {
        const p1 = stroke.points[i - 1];
        const p2 = stroke.points[i];
        const age = now - p2.time;
        const opacity = Math.max(0, 1 - age / 1000);
        if (opacity <= 0) continue;
        
        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.strokeStyle = `rgba(255, 34, 85, ${opacity * 0.6})`;
        ctx.lineWidth = 14;
        ctx.stroke();
    }
    
    // Draw inner core (thin white line)
    for (let i = 1; i < stroke.points.length; i++) {
        const p1 = stroke.points[i - 1];
        const p2 = stroke.points[i];
        const age = now - p2.time;
        const opacity = Math.max(0, 1 - age / 1000);
        if (opacity <= 0) continue;
        
        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.strokeStyle = `rgba(255, 255, 255, ${opacity})`;
        ctx.lineWidth = 4;
        ctx.stroke();
    }
    
    // Leading glowing dot
    const lastPt = stroke.points[stroke.points.length - 1];
    const ageLast = now - lastPt.time;
    const opacityLast = Math.max(0, 1 - ageLast / 1000);
    if (opacityLast > 0) {
        ctx.beginPath();
        ctx.arc(lastPt.x, lastPt.y, 8, 0, 2 * Math.PI);
        ctx.fillStyle = `rgba(255, 255, 255, ${opacityLast})`;
        ctx.shadowColor = '#ff2255';
        ctx.shadowBlur = 10;
        ctx.fill();
    }
    
    ctx.restore();
}

function setStrokeColor(color) {
    strokeColor = color;
    updatePaletteSelection();
    
    if (activeTool === 'select' && selectedElement) {
        saveStateToUndo();
        selectedElement.color = color;
        renderCurrentPage();
    }
}

function updatePaletteSelection() {
    document.querySelectorAll('.color-dot').forEach(dot => {
        if (dot.getAttribute('data-color') === strokeColor) {
            dot.classList.add('active');
        } else {
            dot.classList.remove('active');
        }
    });
}

function setStrokeWidth(widthValue) {
    strokeWidth = parseFloat(widthValue);
    
    if (activeTool === 'select' && selectedElement) {
        saveStateToUndo();
        selectedElement.width = strokeWidth;
        renderCurrentPage();
    }
}

// --- SHAPE MANAGEMENT ---
function setShapeType(type) {
    shapeType = type;
    
    document.querySelectorAll('.shape-btn').forEach(btn => {
        if (btn.id === `shape-btn-${type}`) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
}

// --- BACKGROUND STYLING ---
function setBoardBackground(styleName) {
    const tab = getActiveTab();
    if (!tab) return;
    const pageNum = tab.currentPage;
    let pageData = tab.pages[pageNum];
    if (!pageData) {
        pageData = { 
            elements: [], 
            textboxes: [], 
            backgroundType: styleName,
            undoStack: [],
            redoStack: []
        };
        tab.pages[pageNum] = pageData;
    }
    
    saveStateToUndo();
    pageData.backgroundType = styleName;
    
    // Adapt drawing color for high contrast automatically
    if (styleName === 'blackboard') {
        if (strokeColor === '#1e293b') {
            setStrokeColor('#ffffff');
        }
    } else {
        if (strokeColor === '#ffffff') {
            setStrokeColor('#1e293b');
        }
    }
    
    renderCurrentPage();
}

// --- EDITABLE ARIAL TEXT ANNOTATIONS ---
function createTextbox(x, y, initialText = "", fontSize = 12, underline = false, color = '#4f46e5', isPostIt = false) {
    const layer = document.getElementById('annotations-layer');
    if (!layer) return;
    
    const textBox = document.createElement('div');
    textBox.className = 'text-box';
    if (isPostIt) {
        textBox.classList.add('post-it-box');
        textBox.dataset.isPostIt = 'true';
        if (!initialText && (fontSize === 8 || fontSize === 10 || fontSize === 12 || fontSize === 20)) {
            fontSize = 10;
        }
    }
    textBox.style.left = `${x * zoomScale}px`;
    textBox.style.top = `${y * zoomScale}px`;
    textBox.style.fontSize = `${fontSize * zoomScale}px`;
    textBox.style.color = color;
    textBox.style.textDecoration = underline ? 'underline' : 'none';
    
    // Save 1x attributes
    textBox.dataset.x = x;
    textBox.dataset.y = y;
    textBox.dataset.fontSize = fontSize;
    textBox.dataset.underline = underline;
    textBox.dataset.color = color;
    
    // Delete handle
    const deleteBtn = document.createElement('span');
    deleteBtn.className = 'text-box-delete';
    deleteBtn.innerHTML = '✕';
    deleteBtn.contentEditable = false;
    deleteBtn.title = 'Supprimer cette zone de texte';
    deleteBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        textBox.remove();
        hideTextboxToolbar();
        saveActiveTabTextboxes();
    });
    textBox.appendChild(deleteBtn);
    
    // Content editable text node
    const textSpan = document.createElement('span');
    textSpan.className = 'text-content-node outline-none';
    textSpan.contentEditable = true;
    textSpan.textContent = initialText || "Écrivez ici...";
    textBox.appendChild(textSpan);
    
    textSpan.addEventListener('focus', () => {
        clearTimeout(textboxBlurTimeout);
        if (textSpan.textContent === "Écrivez ici...") {
            textSpan.textContent = "";
        }
        showTextboxToolbar(textBox);
    });
    
    textSpan.addEventListener('blur', () => {
        textboxBlurTimeout = setTimeout(() => {
            if (textSpan.textContent.trim() === "") {
                textSpan.textContent = "Écrivez ici...";
            }
            hideTextboxToolbar();
            saveActiveTabTextboxes();
        }, 250);
    });
    
    textSpan.addEventListener('input', () => {
        saveActiveTabTextboxes();
    });
    
    textBox.addEventListener('pointerdown', (e) => {
        if (e.target === deleteBtn) return;
        if (activeTool === 'text' && e.target !== textSpan) {
            e.preventDefault();
            textSpan.focus();
        }
    });
    
    textBox.addEventListener('click', (e) => {
        if (e.target !== deleteBtn) {
            textSpan.focus();
        }
    });
    
    layer.appendChild(textBox);
    makeTextBoxDraggable(textBox);
    
    if (!initialText) {
        textSpan.focus();
        const range = document.createRange();
        range.selectNodeContents(textSpan);
        const sel = window.getSelection();
        sel.removeAllRanges();
        sel.addRange(range);
    }
}

function handleGlobalPaste(e) {
    // Ne gérer le coller que si le tableau blanc est actif
    if (typeof activeTab !== 'undefined' && activeTab !== 'whiteboard') return;
    
    const clipboardData = e.clipboardData || window.clipboardData;
    if (!clipboardData) return;
    
    const items = clipboardData.items;
    let imageFound = false;
    
    for (let i = 0; i < items.length; i++) {
        const item = items[i];
        if (item.type.indexOf('image') !== -1) {
            const file = item.getAsFile();
            const reader = new FileReader();
            reader.onload = function(event) {
                const src = event.target.result;
                
                const img = new Image();
                img.onload = function() {
                    const originalW = img.width;
                    const originalH = img.height;
                    
                    // Centrer l'image collée dans le viewport
                    const viewport = document.getElementById('whiteboard-viewport');
                    const scrollLeft = viewport ? viewport.scrollLeft : 0;
                    const scrollTop = viewport ? viewport.scrollTop : 0;
                    const clientWidth = viewport ? viewport.clientWidth : 800;
                    const clientHeight = viewport ? viewport.clientHeight : 600;
                    
                    let displayW = originalW;
                    let displayH = originalH;
                    
                    // Ajuster pour qu'elle tienne dans 80% du viewport au maximum au départ
                    const maxW = clientWidth * 0.8;
                    const maxH = clientHeight * 0.8;
                    if (displayW > maxW || displayH > maxH) {
                        const ratio = Math.min(maxW / displayW, maxH / displayH);
                        displayW = Math.round(displayW * ratio);
                        displayH = Math.round(displayH * ratio);
                    }
                    
                    const x = (scrollLeft + clientWidth / 2 - displayW / 2) / zoomScale;
                    const y = (scrollTop + clientHeight / 2 - displayH / 2) / zoomScale;
                    
                    createMovableImage(x, y, displayW, displayH, src);
                    saveActiveTabTextboxes();
                };
                img.src = src;
            };
            reader.readAsDataURL(file);
            imageFound = true;
            e.preventDefault();
            break;
        }
    }
    
    if (!imageFound) {
        const text = clipboardData.getData('text');
        if (text && text.trim() !== "") {
            // Si l'utilisateur est déjà en train de taper dans un champ, laisser faire le comportement par défaut
            if (document.activeElement && (
                document.activeElement.contentEditable === 'true' || 
                document.activeElement.tagName === 'INPUT' || 
                document.activeElement.tagName === 'TEXTAREA' ||
                document.activeElement.classList.contains('text-content-node')
            )) {
                return;
            }
            
            // Sinon, créer une nouvelle boîte de texte au centre de l'écran
            const viewport = document.getElementById('whiteboard-viewport');
            const scrollLeft = viewport ? viewport.scrollLeft : 0;
            const scrollTop = viewport ? viewport.scrollTop : 0;
            const clientWidth = viewport ? viewport.clientWidth : 800;
            const clientHeight = viewport ? viewport.clientHeight : 600;
            
            const x = (scrollLeft + clientWidth / 2 - 60) / zoomScale;
            const y = (scrollTop + clientHeight / 2 - 20) / zoomScale;
            
            createTextbox(x, y, text, 12, false, '#4f46e5');
            saveActiveTabTextboxes();
            e.preventDefault();
        }
    }
}

function makeTextBoxDraggable(el) {
    let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
    
    el.addEventListener('mousedown', dragMouseDown);
    el.addEventListener('touchstart', dragMouseDown, { passive: false });
    
    function dragMouseDown(e) {
        if (activeTool !== 'select') return;
        if (document.activeElement === el.querySelector('.text-content-node') || e.target.classList.contains('text-box-delete')) return;
        
        if (e.touches && e.touches.length > 0) {
            pos3 = e.touches[0].clientX;
            pos4 = e.touches[0].clientY;
        } else {
            pos3 = e.clientX;
            pos4 = e.clientY;
        }
        
        document.addEventListener('mouseup', closeDragElement);
        document.addEventListener('mousemove', elementDrag);
        document.addEventListener('touchend', closeDragElement);
        document.addEventListener('touchmove', elementDrag, { passive: false });
    }
    
    function elementDrag(e) {
        e.preventDefault();
        
        let clientX, clientY;
        if (e.touches && e.touches.length > 0) {
            clientX = e.touches[0].clientX;
            clientY = e.touches[0].clientY;
        } else {
            clientX = e.clientX;
            clientY = e.clientY;
        }
        
        pos1 = pos3 - clientX;
        pos2 = pos4 - clientY;
        pos3 = clientX;
        pos4 = clientY;
        
        el.style.top = (el.offsetTop - pos2) + "px";
        el.style.left = (el.offsetLeft - pos1) + "px";
    }
    
    function closeDragElement() {
        document.removeEventListener('mouseup', closeDragElement);
        document.removeEventListener('mousemove', elementDrag);
        document.removeEventListener('touchend', closeDragElement);
        document.removeEventListener('touchmove', elementDrag);
        
        // Convert dragged position back to 1x coordinates space
        el.dataset.x = el.offsetLeft / zoomScale;
        el.dataset.y = el.offsetTop / zoomScale;
        
        if (el.classList.contains('movable-image-box')) {
            el.dataset.w = el.offsetWidth / zoomScale;
            el.dataset.h = el.offsetHeight / zoomScale;
        }
        
        saveActiveTabTextboxes();
    }
}

// Formatting active textbox toolbar actions
function showTextboxToolbar(el) {
    activeEditingTextbox = el;
    const toolbar = document.getElementById('textbox-toolbar');
    if (!toolbar) return;
    
    toolbar.classList.remove('hidden');
    
    // Position toolbar above the focused text-box
    const top = el.offsetTop - 50;
    const left = el.offsetLeft + (el.offsetWidth - toolbar.offsetWidth) / 2;
    
    toolbar.style.top = `${Math.max(10, top)}px`;
    toolbar.style.left = `${Math.max(10, left)}px`;
    
    // Update toolbar indicator states
    const size = parseInt(el.dataset.fontSize) || 10;
    document.getElementById('textbox-size-display').textContent = `${size}px`;
    
    const underline = el.dataset.underline === 'true';
    const btnU = document.getElementById('btn-textbox-underline');
    if (btnU) {
        if (underline) {
            btnU.classList.add('bg-indigo-600', 'text-white');
        } else {
            btnU.classList.remove('bg-indigo-600', 'text-white');
        }
    }
}

function hideTextboxToolbar() {
    const toolbar = document.getElementById('textbox-toolbar');
    if (toolbar) {
        toolbar.classList.add('hidden');
    }
    activeEditingTextbox = null;
}

function changeActiveTextboxSize(delta) {
    if (!activeEditingTextbox) return;
    const currentSize = parseInt(activeEditingTextbox.dataset.fontSize) || 10;
    const newSize = Math.max(6, Math.min(72, currentSize + delta));
    
    activeEditingTextbox.dataset.fontSize = newSize;
    activeEditingTextbox.style.fontSize = `${newSize * zoomScale}px`;
    
    document.getElementById('textbox-size-display').textContent = `${newSize}px`;
    saveActiveTabTextboxes();
    
    showTextboxToolbar(activeEditingTextbox);
}

function toggleActiveTextboxUnderline() {
    if (!activeEditingTextbox) return;
    const isUnderline = activeEditingTextbox.dataset.underline === 'true';
    const newUnderline = !isUnderline;
    
    activeEditingTextbox.dataset.underline = newUnderline;
    activeEditingTextbox.style.textDecoration = newUnderline ? 'underline' : 'none';
    
    const btnU = document.getElementById('btn-textbox-underline');
    if (btnU) {
        if (newUnderline) {
            btnU.classList.add('bg-indigo-600', 'text-white');
        } else {
            btnU.classList.remove('bg-indigo-600', 'text-white');
        }
    }
    saveActiveTabTextboxes();
}

function changeActiveTextboxColor(color) {
    if (!activeEditingTextbox) return;
    activeEditingTextbox.dataset.color = color;
    activeEditingTextbox.style.color = color;
    saveActiveTabTextboxes();
}

// Hook called by Curriculum panel to insert items onto the whiteboard
window.addTextToWhiteboard = function(text) {
    const container = document.getElementById('whiteboard-viewport');
    const x = container ? container.clientWidth / 2 - 150 : 150;
    const y = container ? container.clientHeight / 2 - 30 : 150;
    
    const existing = document.querySelectorAll('.text-box').length;
    const offset = existing * 25;
    
    // Always insert text box at center mapped back to 1x coordinate space (fontsize 12 and color blue for curriculum items)
    createTextbox(x / zoomScale + offset, y / zoomScale + offset, text, 12, false, '#4f46e5');
    saveActiveTabTextboxes();
};

// --- PDF IMPORT AND RENDERING ---
function importPdfFile(file) {
    if (!file || file.type !== 'application/pdf') return;
    saveActiveTabTextboxes();
    
    const fileReader = new FileReader();
    fileReader.onload = function() {
        const typedarray = new Uint8Array(this.result);
        
        pdfjsLib.GlobalWorkerOptions.workerSrc = 'pdf.worker.min.js';
        
        pdfjsLib.getDocument(typedarray).promise.then(pdf => {
            saveActiveTabTextboxes();
            
            // Save widget states of current tab
            const currentTab = getActiveTab();
            if (currentTab && typeof window.saveWidgetStatesForTab === 'function') {
                window.saveWidgetStatesForTab(currentTab);
            }
            
            const tabId = 'tab-' + Date.now() + '-' + Math.floor(Math.random() * 1000);
            const tabName = file.name.replace(/\.[^/.]+$/, "");
            
            const newTab = {
                id: tabId,
                name: tabName,
                type: 'pdf',
                pdfDoc: pdf,
                pdfFile: file,
                currentPage: 1,
                totalPages: pdf.numPages,
                pages: {}
            };
            
            boardTabs.push(newTab);
            activeTabId = tabId;
            selectedElement = null;
            zoomScale = 1.0;
            updateZoomUI();
            
            // Restore widget states for the new tab (initially empty)
            if (typeof window.syncWidgetStatesForTab === 'function') {
                window.syncWidgetStatesForTab(newTab);
            }
            
            renderTabsUI();
            renderCurrentPage();
            
            // Open thumbnails panel automatically since a PDF was loaded
            const sidebar = document.getElementById('pdf-thumbnails-sidebar');
            if (sidebar) {
                isThumbnailsPanelOpen = true;
                sidebar.style.width = '240px';
                renderThumbnails();
            }
        }).catch(err => {
            console.error("PDF Loading Error:", err);
            alert("Erreur lors de la lecture du fichier PDF.");
        });
    };
    fileReader.readAsArrayBuffer(file);
}

function loadPdfFile(event) {
    const file = event.target.files[0];
    if (!file || file.type !== 'application/pdf') {
        alert("Veuillez charger un fichier PDF valide.");
        return;
    }
    importPdfFile(file);
    event.target.value = '';
}

function loadImportedFile(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    if (file.type === 'application/pdf') {
        importPdfFile(file);
    } else if (file.type.startsWith('image/')) {
        loadImageAsNewTab(file);
    } else {
        alert("Format de fichier non supporté. Veuillez choisir un PDF ou une image.");
    }
    event.target.value = '';
}

function loadImageAsNewTab(file) {
    saveActiveTabTextboxes();
    
    // Save widget states of current tab
    const currentTab = getActiveTab();
    if (currentTab && typeof window.saveWidgetStatesForTab === 'function') {
        window.saveWidgetStatesForTab(currentTab);
    }
    
    const img = new Image();
    img.onload = function() {
        const tabId = 'tab-' + Date.now() + '-' + Math.floor(Math.random() * 1000);
        const tabName = file.name.replace(/\.[^/.]+$/, "");
        
        const newTab = {
            id: tabId,
            name: tabName,
            type: 'whiteboard',
            currentPage: 1,
            totalPages: 1,
            pages: {
                1: {
                    elements: [],
                    textboxes: [],
                    backgroundType: 'blank',
                    bgImage: img,
                    imgScale: null,
                    imgXOffset: null,
                    imgYOffset: null,
                    undoStack: [],
                    redoStack: []
                }
            }
        };
        
        boardTabs.push(newTab);
        activeTabId = tabId;
        selectedElement = null;
        zoomScale = 1.0;
        updateZoomUI();
        
        if (typeof window.syncWidgetStatesForTab === 'function') {
            window.syncWidgetStatesForTab(newTab);
        }
        
        renderTabsUI();
        renderCurrentPage();
    };
    img.src = URL.createObjectURL(file);
}

// État temporaire du fichier image pour le modal d'importation
let pendingImageFile = null;

function showImageImportModal(file) {
    pendingImageFile = file;
    const modal = document.getElementById('image-import-modal');
    if (!modal) return;
    
    const tab = getActiveTab();
    
    // Configurer le bouton Arrière-plan
    const bgBtn = document.getElementById('img-modal-bg-btn');
    if (bgBtn) {
        if (!tab || tab.type === 'pdf') {
            bgBtn.disabled = true;
            bgBtn.classList.add('opacity-50', 'cursor-not-allowed');
            bgBtn.title = "Impossible sur un onglet PDF";
        } else {
            bgBtn.disabled = false;
            bgBtn.classList.remove('opacity-50', 'cursor-not-allowed');
            bgBtn.title = "";
        }
    }
    
    // Configurer le bouton Objet déplaçable
    const moveBtn = document.getElementById('img-modal-move-btn');
    if (moveBtn) {
        if (!tab) {
            moveBtn.disabled = true;
            moveBtn.classList.add('opacity-50', 'cursor-not-allowed');
        } else {
            moveBtn.disabled = false;
            moveBtn.classList.remove('opacity-50', 'cursor-not-allowed');
        }
    }
    
    modal.classList.remove('hidden');
}

function closeImageImportModal() {
    const modal = document.getElementById('image-import-modal');
    if (modal) {
        modal.classList.add('hidden');
    }
    pendingImageFile = null;
}

function loadImageAsBackground(file) {
    if (!file) return;
    const tab = getActiveTab();
    if (!tab || tab.type === 'pdf') return;
    
    const img = new Image();
    img.onload = function() {
        const pageNum = tab.currentPage;
        let pageData = tab.pages[pageNum];
        if (!pageData) {
            pageData = { 
                elements: [], 
                textboxes: [], 
                backgroundType: 'blank',
                undoStack: [],
                redoStack: []
            };
            tab.pages[pageNum] = pageData;
        }
        pageData.bgImage = img;
        pageData.imgScale = null;
        pageData.imgXOffset = null;
        pageData.imgYOffset = null;
        renderCurrentPage();
        if (isThumbnailsPanelOpen) {
            renderThumbnails();
        }
    };
    img.src = URL.createObjectURL(file);
}

function loadImageAsMovable(file) {
    if (!file) return;
    const tab = getActiveTab();
    if (!tab) return;
    
    const reader = new FileReader();
    reader.onload = function(event) {
        const src = event.target.result;
        const img = new Image();
        img.onload = function() {
            const originalW = img.width;
            const originalH = img.height;
            
            // Centrer l'image dans le viewport
            const viewport = document.getElementById('whiteboard-viewport');
            const scrollLeft = viewport ? viewport.scrollLeft : 0;
            const scrollTop = viewport ? viewport.scrollTop : 0;
            const clientWidth = viewport ? viewport.clientWidth : 800;
            const clientHeight = viewport ? viewport.clientHeight : 600;
            
            let displayW = originalW;
            let displayH = originalH;
            
            // Ajuster pour qu'elle tienne dans 80% du viewport au maximum au départ
            const maxW = clientWidth * 0.8;
            const maxH = clientHeight * 0.8;
            if (displayW > maxW || displayH > maxH) {
                const ratio = Math.min(maxW / displayW, maxH / displayH);
                displayW = Math.round(displayW * ratio);
                displayH = Math.round(displayH * ratio);
            }
            
            const x = (scrollLeft + clientWidth / 2 - displayW / 2) / zoomScale;
            const y = (scrollTop + clientHeight / 2 - displayH / 2) / zoomScale;
            
            createMovableImage(x, y, displayW, displayH, src);
            saveActiveTabTextboxes();
        };
        img.src = src;
    };
    reader.readAsDataURL(file);
}

function loadImageFile(event) {
    const file = event.target.files[0];
    if (!file || !file.type.startsWith('image/')) {
        alert("Veuillez insérer un fichier image valide.");
        return;
    }
    
    showImageImportModal(file);
    event.target.value = '';
}

function renderPdfPage() {
    const tab = getActiveTab();
    if (!tab || !tab.pdfDoc) return;
    
    const pageNum = tab.currentPage;
    
    // Cancel active render task to avoid conflicts
    if (activeRenderTask) {
        activeRenderTask.cancel();
        activeRenderTask = null;
    }
    
    tab.pdfDoc.getPage(pageNum).then(page => {
        const bgCanvas = document.getElementById('bg-canvas');
        if (!bgCanvas) return;
        const bgCtx = bgCanvas.getContext('2d');
        const container = document.getElementById('whiteboard-viewport');
        if (!container) return;
        
        let pageData = tab.pages[pageNum];
        if (!pageData) {
            pageData = {
                elements: [],
                textboxes: [],
                backgroundType: 'blank',
                undoStack: [],
                redoStack: []
            };
            tab.pages[pageNum] = pageData;
        }
        
        const dpr = window.devicePixelRatio || 1;
        const tempViewport = page.getViewport({ scale: 1.0 });
        
        // Lock scale and offsets based on first render to prevent misalignment on window resize (like HDMI plug/unplug)
        if (pageData.pdfScale === undefined || pageData.pdfScale === null) {
            const scaleX = container.clientWidth / tempViewport.width;
            const scaleY = container.clientHeight / tempViewport.height;
            pageData.pdfScale = Math.min(scaleX, scaleY) * 0.96;
            pageData.pdfXOffset = (container.clientWidth - tempViewport.width * pageData.pdfScale) / 2;
            pageData.pdfYOffset = (container.clientHeight - tempViewport.height * pageData.pdfScale) / 2;
        }
        
        const scale = pageData.pdfScale;
        
        // Render at Retina scale adjusted by zoomScale
        const viewport = page.getViewport({ scale: scale * zoomScale * dpr });
        
        bgCanvas.width = container.clientWidth * zoomScale * dpr;
        bgCanvas.height = container.clientHeight * zoomScale * dpr;
        bgCanvas.style.width = container.clientWidth * zoomScale + 'px';
        bgCanvas.style.height = container.clientHeight * zoomScale + 'px';
        
        const xOffset = pageData.pdfXOffset * zoomScale * dpr;
        const yOffset = pageData.pdfYOffset * zoomScale * dpr;
        
        bgCtx.clearRect(0, 0, bgCanvas.width, bgCanvas.height);
        
        const renderCtx = {
            canvasContext: bgCtx,
            viewport: viewport,
            transform: [1, 0, 0, 1, xOffset, yOffset]
        };
        
        const renderTask = page.render(renderCtx);
        activeRenderTask = renderTask;
        
        renderTask.promise.then(() => {
            if (activeRenderTask === renderTask) {
                activeRenderTask = null;
            }
            // Update bottom navigation page numbers
            const pageIndicator = document.getElementById('pdf-page-num-bottom');
            if (pageIndicator) {
                pageIndicator.textContent = `${pageNum} / ${tab.totalPages}`;
            }
        }).catch(err => {
            if (err.name === 'RenderingCancelledException') {
                // Do nothing
            } else {
                console.error("PDF render error:", err);
            }
        });
    });
}

function renderImageToBg(img) {
    const bgCanvas = document.getElementById('bg-canvas');
    if (!bgCanvas) return;
    const bgCtx = bgCanvas.getContext('2d');
    const container = document.getElementById('whiteboard-viewport');
    if (!container) return;
    
    const tab = getActiveTab();
    if (!tab) return;
    const pageNum = tab.currentPage;
    let pageData = tab.pages[pageNum];
    if (!pageData) {
        pageData = {
            elements: [],
            textboxes: [],
            backgroundType: 'blank',
            undoStack: [],
            redoStack: []
        };
        tab.pages[pageNum] = pageData;
    }
    
    const w = container.clientWidth;
    const h = container.clientHeight;
    const dpr = window.devicePixelRatio || 1;
    
    bgCanvas.width = w * zoomScale * dpr;
    bgCanvas.height = h * zoomScale * dpr;
    bgCanvas.style.width = w * zoomScale + 'px';
    bgCanvas.style.height = h * zoomScale + 'px';
    
    bgCtx.clearRect(0, 0, bgCanvas.width, bgCanvas.height);
    
    // Lock scale and offsets based on first render to prevent misalignment on window resize
    if (pageData.imgScale === undefined || pageData.imgScale === null) {
        const scaleX = w / img.width;
        const scaleY = h / img.height;
        pageData.imgScale = Math.min(scaleX, scaleY) * 0.96;
        pageData.imgXOffset = (w - img.width * pageData.imgScale) / 2;
        pageData.imgYOffset = (h - img.height * pageData.imgScale) / 2;
    }
    
    const imgW = img.width * pageData.imgScale * zoomScale * dpr;
    const imgH = img.height * pageData.imgScale * zoomScale * dpr;
    const x = pageData.imgXOffset * zoomScale * dpr;
    const y = pageData.imgYOffset * zoomScale * dpr;
    
    bgCtx.drawImage(img, x, y, imgW, imgH);
}

// --- THUMBNAILS PANEL CONTROLLER ---
function toggleThumbnailsPanel() {
    const sidebar = document.getElementById('pdf-thumbnails-sidebar');
    if (!sidebar) return;
    
    isThumbnailsPanelOpen = !isThumbnailsPanelOpen;
    
    if (isThumbnailsPanelOpen) {
        sidebar.style.width = '240px';
        renderThumbnails();
    } else {
        sidebar.style.width = '0px';
    }
    
    // Re-adjust canvas width after panel animation finishes
    setTimeout(resizeCanvas, 350);
}

function renderThumbnails() {
    const container = document.getElementById('pdf-thumbnails-container');
    if (!container) return;
    
    container.innerHTML = '';
    
    const tab = getActiveTab();
    if (!tab) return;
    
    for (let pageNum = 1; pageNum <= tab.totalPages; pageNum++) {
        const card = document.createElement('div');
        card.className = `pdf-thumbnail-card ${pageNum === tab.currentPage ? 'active' : ''}`;
        card.id = `thumbnail-card-${pageNum}`;
        card.addEventListener('click', () => {
            saveActiveTabTextboxes();
            tab.currentPage = pageNum;
            selectedElement = null;
            renderCurrentPage();
        });
        
        const canvas = document.createElement('canvas');
        card.appendChild(canvas);
        
        const label = document.createElement('span');
        label.className = 'text-[10px] font-mono font-bold text-neutral-500 mt-1';
        label.textContent = `Page ${pageNum}`;
        card.appendChild(label);
        
        container.appendChild(card);
        
        if (tab.type === 'pdf' && tab.pdfDoc) {
            renderPdfThumbnail(tab.pdfDoc, pageNum, canvas);
        } else {
            renderWhiteboardThumbnail(pageNum, canvas);
        }
    }
}

async function renderPdfThumbnail(pdf, pageNum, canvas) {
    try {
        const page = await pdf.getPage(pageNum);
        const ctx = canvas.getContext('2d');
        const viewport = page.getViewport({ scale: 0.18 });
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        canvas.style.width = '100%';
        canvas.style.height = 'auto';
        
        await page.render({ canvasContext: ctx, viewport: viewport }).promise;
    } catch (err) {
        console.error("Error rendering PDF thumbnail:", pageNum, err);
    }
}

function renderWhiteboardThumbnail(pageNum, canvas) {
    const ctx = canvas.getContext('2d');
    canvas.width = 120;
    canvas.height = 90;
    canvas.style.width = '100%';
    canvas.style.height = 'auto';
    
    const tab = getActiveTab();
    const pageData = tab.pages[pageNum];
    const bgType = pageData ? pageData.backgroundType : 'blank';
    
    if (bgType === 'blackboard') {
        ctx.fillStyle = '#1b2621';
    } else if (bgType === 'seyes' || bgType === 'grid') {
        ctx.fillStyle = '#f7fafc';
    } else {
        ctx.fillStyle = '#ffffff';
    }
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Dessiner l'image d'arrière-plan si présente
    if (pageData && pageData.bgImage) {
        const img = pageData.bgImage;
        const scaleX = canvas.width / img.width;
        const scaleY = canvas.height / img.height;
        const scale = Math.min(scaleX, scaleY);
        const imgW = img.width * scale;
        const imgH = img.height * scale;
        const x = (canvas.width - imgW) / 2;
        const y = (canvas.height - imgH) / 2;
        ctx.drawImage(img, x, y, imgW, imgH);
    }
    
    // Draw simple background guides
    if (bgType === 'grid') {
        ctx.strokeStyle = '#93c5fd';
        ctx.lineWidth = 0.5;
        for (let x = 0; x < canvas.width; x += 15) {
            ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, canvas.height); ctx.stroke();
        }
        for (let y = 0; y < canvas.height; y += 15) {
            ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(canvas.width, y); ctx.stroke();
        }
    } else if (bgType === 'seyes') {
        ctx.strokeStyle = '#bae6fd';
        ctx.lineWidth = 0.5;
        for (let y = 0; y < canvas.height; y += 5.4) {
            ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(canvas.width, y); ctx.stroke();
        }
    }
    
    // Draw elements
    if (pageData && pageData.elements) {
        ctx.save();
        const container = document.getElementById('whiteboard-viewport');
        const viewW = container ? container.clientWidth : 800;
        const scale = canvas.width / (viewW || 800);
        ctx.scale(scale, scale);
        
        pageData.elements.forEach(el => {
            ctx.beginPath();
            ctx.lineCap = 'round';
            ctx.lineJoin = 'round';
            
            if (el.type === 'stroke') {
                ctx.strokeStyle = el.color;
                ctx.lineWidth = el.width;
                if (el.tool === 'highlighter') {
                    ctx.globalAlpha = 0.45;
                } else if (el.tool === 'eraser') {
                    ctx.globalAlpha = 1.0;
                    ctx.strokeStyle = '#ffffff'; // render white for erase preview in thumbnail
                } else {
                    ctx.globalAlpha = 1.0;
                }
                const pts = el.points;
                if (pts.length > 0) {
                    ctx.moveTo(pts[0].x, pts[0].y);
                    for (let i = 1; i < pts.length; i++) {
                        ctx.lineTo(pts[i].x, pts[i].y);
                    }
                    ctx.stroke();
                }
            } else if (el.type === 'shape') {
                ctx.strokeStyle = el.color;
                ctx.lineWidth = el.width;
                ctx.globalAlpha = 1.0;
                
                if (el.shapeType === 'line') {
                    ctx.moveTo(el.x1, el.y1);
                    ctx.lineTo(el.x2, el.y2);
                    ctx.stroke();
                } else if (el.shapeType === 'rect') {
                    ctx.strokeRect(el.x1, el.y1, el.x2 - el.x1, el.y2 - el.y1);
                } else if (el.shapeType === 'circle') {
                    const r = Math.sqrt((el.x2 - el.x1) ** 2 + (el.y2 - el.y1) ** 2);
                    ctx.arc(el.x1, el.y1, r, 0, 2 * Math.PI);
                    ctx.stroke();
                }
            }
        });
        ctx.restore();
    }
}

function updateActiveThumbnailHighlight() {
    const tab = getActiveTab();
    if (!tab) return;
    
    document.querySelectorAll('.pdf-thumbnail-card').forEach(card => {
        const pageNum = parseInt(card.id.replace('thumbnail-card-', ''));
        if (pageNum === tab.currentPage) {
            card.classList.add('active');
            card.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        } else {
            card.classList.remove('active');
        }
    });
}

// --- UNDO / REDO HISTORY ---
function saveStateToUndo() {
    const tab = getActiveTab();
    if (!tab) return;
    const pageData = tab.pages[tab.currentPage];
    if (!pageData) return;
    
    if (!pageData.undoStack) pageData.undoStack = [];
    
    // Save deep cloned elements state
    const state = JSON.parse(JSON.stringify(pageData.elements));
    pageData.undoStack.push(state);
    
    if (pageData.undoStack.length > maxHistorySteps) {
        pageData.undoStack.shift();
    }
    
    // Clear redo history
    pageData.redoStack = [];
}

function undo() {
    const tab = getActiveTab();
    if (!tab) return;
    const pageData = tab.pages[tab.currentPage];
    if (!pageData || !pageData.undoStack || pageData.undoStack.length === 0) return;
    
    if (!pageData.redoStack) pageData.redoStack = [];
    
    pageData.redoStack.push(JSON.parse(JSON.stringify(pageData.elements)));
    pageData.elements = pageData.undoStack.pop();
    
    selectedElement = null;
    renderCurrentPage();
    
    if (isThumbnailsPanelOpen) {
        renderThumbnails();
    }
}

function redo() {
    const tab = getActiveTab();
    if (!tab) return;
    const pageData = tab.pages[tab.currentPage];
    if (!pageData || !pageData.redoStack || pageData.redoStack.length === 0) return;
    
    if (!pageData.undoStack) pageData.undoStack = [];
    
    pageData.undoStack.push(JSON.parse(JSON.stringify(pageData.elements)));
    pageData.elements = pageData.redoStack.pop();
    
    selectedElement = null;
    renderCurrentPage();
    
    if (isThumbnailsPanelOpen) {
        renderThumbnails();
    }
}

// --- BURGER MENU ACTIONS ---
function toggleBurgerMenu() {
    const menu = document.getElementById('burger-popup-menu');
    if (menu) {
        menu.classList.toggle('hidden');
    }
}

// Global click listener to close popups
window.addEventListener('click', (e) => {
    // Close shape select popup if click was outside tool-btn-shape
    const shapePopup = document.getElementById('shape-select-container');
    const shapeBtn = document.getElementById('tool-btn-shape');
    if (shapePopup && shapeBtn && !shapePopup.contains(e.target) && !shapeBtn.contains(e.target)) {
        shapePopup.classList.add('hidden');
    }
    
    // Close tools popup if click was outside tool-btn-tools
    const toolsPopup = document.getElementById('tools-menu-container');
    const toolsBtn = document.getElementById('tool-btn-tools');
    if (toolsPopup && toolsBtn && !toolsPopup.contains(e.target) && !toolsBtn.contains(e.target)) {
        toolsPopup.classList.add('hidden');
    }
});

function closeBurgerMenu() {
    const menu = document.getElementById('burger-popup-menu');
    if (menu) {
        menu.classList.add('hidden');
    }
}

function clearCurrentTab() {
    const tab = getActiveTab();
    if (!tab) return;
    
    if (confirm("Voulez-vous effacer tous vos tracés et textes sur cette page ?")) {
        saveStateToUndo();
        const pageData = tab.pages[tab.currentPage];
        if (pageData) {
            pageData.elements = [];
            pageData.textboxes = [];
        }
        
        const layer = document.getElementById('annotations-layer');
        if (layer) layer.innerHTML = '';
        
        selectedElement = null;
        renderCurrentPage();
        
        if (isThumbnailsPanelOpen) {
            renderThumbnails();
        }
    }
}

function exportCurrentTab() {
    const tab = getActiveTab();
    if (!tab) return;
    
    const dCanvas = document.getElementById('drawing-canvas');
    const bgCanvas = document.getElementById('bg-canvas');
    const container = document.getElementById('whiteboard-viewport');
    
    if (!dCanvas || !bgCanvas || !container) return;
    
    const w = container.clientWidth;
    const h = container.clientHeight;
    const dpr = window.devicePixelRatio || 1;
    
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = w * dpr;
    tempCanvas.height = h * dpr;
    const tempCtx = tempCanvas.getContext('2d');
    
    const pageNum = tab.currentPage;
    const pageData = tab.pages[pageNum];
    const bgType = pageData ? pageData.backgroundType : 'blank';
    
    // 1. Draw CSS Background Pattern (scaled by DPR only, no zoomScale)
    tempCtx.save();
    tempCtx.scale(dpr, dpr);
    
    if (bgType === 'blackboard') {
        tempCtx.fillStyle = '#1b2621';
        tempCtx.fillRect(0, 0, w, h);
        
        tempCtx.fillStyle = 'rgba(255,255,255,0.015)';
        for (let j = 0; j < h; j += 40) {
            for (let i = 0; i < w; i += 40) {
                tempCtx.fillRect(i, j, 40, 40);
            }
        }
    } else if (bgType === 'seyes') {
        tempCtx.fillStyle = '#f7fafc';
        tempCtx.fillRect(0, 0, w, h);
        
        tempCtx.lineWidth = 1;
        tempCtx.strokeStyle = '#ef4444';
        tempCtx.beginPath();
        tempCtx.moveTo(120, 0);
        tempCtx.lineTo(120, h);
        tempCtx.stroke();
        
        for (let y = 0; y < h; y += 13.5) {
            const isMajor = (Math.round(y * 10) % 540 === 0);
            tempCtx.strokeStyle = isMajor ? '#818cf8' : '#bae6fd';
            tempCtx.lineWidth = isMajor ? 2.0 : 0.8;
            tempCtx.beginPath();
            tempCtx.moveTo(0, y);
            tempCtx.lineTo(w, y);
            tempCtx.stroke();
        }
    } else if (bgType === 'grid') {
        tempCtx.fillStyle = '#fcfdfd';
        tempCtx.fillRect(0, 0, w, h);
        
        tempCtx.lineWidth = 2.0;
        tempCtx.strokeStyle = '#fca5a5';
        tempCtx.beginPath();
        tempCtx.moveTo(100, 0);
        tempCtx.lineTo(100, h);
        tempCtx.stroke();
        
        tempCtx.lineWidth = 1.0;
        tempCtx.strokeStyle = '#93c5fd';
        for (let x = 0; x < w; x += 40) {
            tempCtx.beginPath(); tempCtx.moveTo(x, 0); tempCtx.lineTo(x, h); tempCtx.stroke();
        }
        for (let y = 0; y < h; y += 40) {
            tempCtx.beginPath(); tempCtx.moveTo(0, y); tempCtx.lineTo(w, y); tempCtx.stroke();
        }
    } else if (bgType === 'music') {
        tempCtx.fillStyle = '#ffffff';
        tempCtx.fillRect(0, 0, w, h);
        
        tempCtx.lineWidth = 1.0;
        tempCtx.strokeStyle = '#334155';
        for (let offset = 0; offset < h; offset += 160) {
            for (let i = 0; i < 5; i++) {
                const y = offset + 40 + (i * 10);
                if (y < h) {
                    tempCtx.beginPath(); tempCtx.moveTo(0, y); tempCtx.lineTo(w, y); tempCtx.stroke();
                }
            }
        }
    } else {
        tempCtx.fillStyle = '#ffffff';
        tempCtx.fillRect(0, 0, w, h);
    }
    tempCtx.restore();
    
    // 2. Draw background canvas scaled down back to 1x
    tempCtx.drawImage(bgCanvas, 0, 0, bgCanvas.width, bgCanvas.height, 0, 0, w * dpr, h * dpr);
    
    // 3. Draw drawing canvas scaled down back to 1x
    tempCtx.drawImage(dCanvas, 0, 0, dCanvas.width, dCanvas.height, 0, 0, w * dpr, h * dpr);
    
    // 4. Draw textbox DOM layer at 1x scale
    tempCtx.save();
    tempCtx.scale(dpr, dpr);
    const textBoxes = document.querySelectorAll('.text-box');
    textBoxes.forEach(el => {
        const x = parseFloat(el.dataset.x) + 12;
        const y = parseFloat(el.dataset.y) + 28;
        const contentNode = el.querySelector('.text-content-node');
        const text = contentNode ? contentNode.innerText : el.innerText.replace('✕', '').trim();
        const fontSize = parseFloat(el.dataset.fontSize) || 12;
        const color = el.dataset.color || '#4f46e5';
        const underline = el.dataset.underline === 'true';
        
        if (text && text !== "Écrivez ici...") {
            const lines = text.split('\n');
            tempCtx.font = `bold ${fontSize}px Arial, sans-serif`;
            tempCtx.fillStyle = bgType === 'blackboard' ? '#ffffff' : color;
            
            lines.forEach((lineText, index) => {
                const lineY = y + index * (fontSize * 1.25);
                tempCtx.fillText(lineText, x, lineY);
                
                if (underline) {
                    const width = tempCtx.measureText(lineText).width;
                    tempCtx.strokeStyle = tempCtx.fillStyle;
                    tempCtx.lineWidth = Math.max(1, fontSize / 15);
                    tempCtx.beginPath();
                    tempCtx.moveTo(x, lineY + 4);
                    tempCtx.lineTo(x + width, lineY + 4);
                    tempCtx.stroke();
                }
            });
        }
    });
    tempCtx.restore();
    
    // Download trigger
    const link = document.createElement('a');
    link.download = `${tab.name}-page-${pageNum}-${new Date().toISOString().slice(0, 10)}.png`;
    link.href = tempCanvas.toDataURL('image/png');
    link.click();
}

// --- ARISTO / COMPASS DRAWING INTEGRATION ---
window.drawCompassArc = function(centerX, centerY, radius, startAngle, endAngle) {
    const tab = getActiveTab();
    if (!tab) return;
    const pageData = tab.pages[tab.currentPage];
    if (!pageData) return;
    
    // Convert circle coordinates and radius from visual space back to 1x coordinate space
    const xCenter = centerX / zoomScale;
    const yCenter = centerY / zoomScale;
    const r = radius / zoomScale;
    
    const now = Date.now();
    if (!activeCompassStroke || (now - lastCompassTime > 500)) {
        saveStateToUndo();
        activeCompassStroke = {
            type: 'stroke',
            tool: 'pen',
            color: strokeColor,
            width: 1.5,
            points: []
        };
        pageData.elements.push(activeCompassStroke);
    }
    
    lastCompassTime = now;
    
    // Interpolate points along the compass arc to construct a vector stroke
    const steps = Math.max(2, Math.ceil(Math.abs(endAngle - startAngle) * 180 / Math.PI / 2));
    const stepSize = (endAngle - startAngle) / steps;
    
    for (let i = 0; i <= steps; i++) {
        const theta = startAngle + i * stepSize;
        const x = xCenter + r * Math.cos(theta);
        const y = yCenter + r * Math.sin(theta);
        
        const pts = activeCompassStroke.points;
        if (pts.length === 0 || Math.hypot(x - pts[pts.length - 1].x, y - pts[pts.length - 1].y) > 0.5) {
            pts.push({ x, y });
        }
    }
    
    renderCurrentPage();
};

// Global exports for inline HTML onclick/onchange handlers
window.zoomIn = zoomIn;
window.zoomOut = zoomOut;
window.changeActiveTextboxSize = changeActiveTextboxSize;
window.toggleActiveTextboxUnderline = toggleActiveTextboxUnderline;
window.changeActiveTextboxColor = changeActiveTextboxColor;
window.addWhiteboardPage = addWhiteboardPage;
window.toggleToolsMenu = toggleToolsMenu;
window.triggerToolAction = triggerToolAction;

// --- DYNAMIC CROP AND IMAGE ANNOTATIONS ---
function createMovableImage(x, y, w, h, src) {
    const layer = document.getElementById('annotations-layer');
    if (!layer) return;
    
    const imgBox = document.createElement('div');
    imgBox.className = 'movable-image-box text-box';
    imgBox.style.left = `${x * zoomScale}px`;
    imgBox.style.top = `${y * zoomScale}px`;
    imgBox.style.width = `${w * zoomScale}px`;
    imgBox.style.height = `${h * zoomScale}px`;
    
    // Save 1x coordinates
    imgBox.dataset.x = x;
    imgBox.dataset.y = y;
    imgBox.dataset.w = w;
    imgBox.dataset.h = h;
    imgBox.dataset.src = src;
    imgBox.dataset.type = 'image';
    
    // Delete handle
    const deleteBtn = document.createElement('span');
    deleteBtn.className = 'text-box-delete';
    deleteBtn.innerHTML = '✕';
    deleteBtn.contentEditable = false;
    deleteBtn.title = 'Supprimer cette capture';
    deleteBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        imgBox.remove();
        saveActiveTabTextboxes();
    });
    imgBox.appendChild(deleteBtn);
    
    // Image element
    const img = document.createElement('img');
    img.src = src;
    img.className = 'w-full h-full object-contain pointer-events-none select-none';
    imgBox.appendChild(img);
    
    layer.appendChild(imgBox);
    makeTextBoxDraggable(imgBox);
    makeMovableImageResizable(imgBox);
}

function makeMovableImageResizable(imgBox) {
    if (imgBox.querySelector('.resize-handle')) return;
    
    const handle = document.createElement('div');
    handle.className = 'resize-handle';
    imgBox.appendChild(handle);
    
    let isResizing = false;
    let startWidth = 0;
    let startHeight = 0;
    let startX = 0;
    let startY = 0;
    
    handle.addEventListener('pointerdown', (e) => {
        e.preventDefault();
        e.stopPropagation();
        
        isResizing = true;
        startX = e.clientX;
        startY = e.clientY;
        startWidth = imgBox.offsetWidth;
        startHeight = imgBox.offsetHeight;
        
        handle.setPointerCapture(e.pointerId);
        
        document.addEventListener('pointermove', onPointerMove);
        document.addEventListener('pointerup', onPointerUp);
        document.addEventListener('pointercancel', onPointerUp);
    });
    
    function onPointerMove(e) {
        if (!isResizing) return;
        e.preventDefault();
        
        const dx = e.clientX - startX;
        const dy = e.clientY - startY;
        
        // Redimensionnement proportionnel (garder le ratio d'aspect)
        const newW = Math.max(30, startWidth + dx);
        const ratio = startHeight / startWidth;
        const newH = newW * ratio;
        
        imgBox.style.width = `${newW}px`;
        imgBox.style.height = `${newH}px`;
    }
    
    function onPointerUp(e) {
        if (!isResizing) return;
        isResizing = false;
        
        try {
            handle.releasePointerCapture(e.pointerId);
        } catch (err) {}
        
        document.removeEventListener('pointermove', onPointerMove);
        document.removeEventListener('pointerup', onPointerUp);
        document.removeEventListener('pointercancel', onPointerUp);
        
        // Enregistrer la nouvelle taille en coordonnées 1x
        imgBox.dataset.w = imgBox.offsetWidth / zoomScale;
        imgBox.dataset.h = imgBox.offsetHeight / zoomScale;
        
        saveActiveTabTextboxes();
    }
}

function cropWhiteboardArea(x1, y1, x2, y2) {
    const dpr = window.devicePixelRatio || 1;
    
    // Bounds in 1x space
    const rx = Math.min(x1, x2);
    const ry = Math.min(y1, y2);
    const rw = Math.abs(x2 - x1);
    const rh = Math.abs(y2 - y1);
    
    if (rw < 10 || rh < 10) return;
    
    const bgCanvas = document.getElementById('bg-canvas');
    const drawingCanvas = document.getElementById('drawing-canvas');
    
    // Determine canvas physical bounds
    const srcWidth = bgCanvas ? bgCanvas.width : (drawingCanvas ? drawingCanvas.width : 3000);
    const srcHeight = bgCanvas ? bgCanvas.height : (drawingCanvas ? drawingCanvas.height : 2000);
    
    // Scaled target bounds
    const sx = rx * zoomScale * dpr;
    const sy = ry * zoomScale * dpr;
    const sw = rw * zoomScale * dpr;
    const sh = rh * zoomScale * dpr;
    
    // Clamp coordinates to stay inside the source canvas boundaries (crucial for WebKit/Safari stability)
    const sLeft = Math.max(0, Math.min(srcWidth, sx));
    const sTop = Math.max(0, Math.min(srcHeight, sy));
    const sRight = Math.max(0, Math.min(srcWidth, sx + sw));
    const sBottom = Math.max(0, Math.min(srcHeight, sy + sh));
    
    const sWidth = sRight - sLeft;
    const sHeight = sBottom - sTop;
    
    if (sWidth <= 0 || sHeight <= 0) return;
    
    // Offset inside the cropped canvas (in case top/left was clamped)
    const dx = sLeft - sx;
    const dy = sTop - sy;
    
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = sw;
    tempCanvas.height = sh;
    const tempCtx = tempCanvas.getContext('2d');
    
    // Draw background layer (PDF)
    if (bgCanvas) {
        tempCtx.drawImage(bgCanvas, sLeft, sTop, sWidth, sHeight, dx, dy, sWidth, sHeight);
    }
    
    // Draw drawings layer
    if (drawingCanvas) {
        tempCtx.drawImage(drawingCanvas, sLeft, sTop, sWidth, sHeight, dx, dy, sWidth, sHeight);
    }
    
    const dataUrl = tempCanvas.toDataURL('image/png');
    createMovableImage(rx, ry, rw, rh, dataUrl);
    saveActiveTabTextboxes();
    
    // Switch tool to select so it can be dragged immediately
    setWhiteboardTool('select');
}

// --- TOOLS POP OVER MENU ACTIONS ---
function toggleToolsMenu(e) {
    if (e) e.stopPropagation();
    const menu = document.getElementById('tools-menu-container');
    if (menu) {
        menu.classList.toggle('hidden');
    }
    // Close other popups
    const shapeContainer = document.getElementById('shape-select-container');
    if (shapeContainer) {
        shapeContainer.classList.add('hidden');
    }
}

function triggerToolAction(actionName) {
    const menu = document.getElementById('tools-menu-container');
    if (menu) {
        menu.classList.add('hidden');
    }
    
    if (actionName === 'aristo' || actionName === 'compass' || actionName === 'timer' || actionName === 'fractions' || actionName === 'abaque' || actionName === 'horloge') {
        if (typeof toggleWidget === 'function') {
            toggleWidget(actionName);
        }
    } else if (actionName === 'scissors') {
        setWhiteboardTool('scissors');
    } else if (actionName === 'postit') {
        const viewport = document.getElementById('whiteboard-viewport');
        const scrollLeft = viewport ? viewport.scrollLeft : 0;
        const scrollTop = viewport ? viewport.scrollTop : 0;
        const clientWidth = viewport ? viewport.clientWidth : window.innerWidth;
        const clientHeight = viewport ? viewport.clientHeight : window.innerHeight;
        
        // Center the post-it notes in 1x coordinates relative to viewport
        const x = (scrollLeft + clientWidth / 2 - 70) / zoomScale;
        const y = (scrollTop + clientHeight / 2 - 50) / zoomScale;
        
        createTextbox(x, y, "", 10, false, '#1e293b', true);
        saveActiveTabTextboxes();
    }
}

// --- ZOOM & ERASER EXTRA HELPERS ---
function applyZoom(newScale, viewportX, viewportY) {
    const container = document.getElementById('whiteboard-viewport');
    if (!container) return;
    
    const oldScale = zoomScale;
    const targetScale = Math.max(0.5, Math.min(4.0, newScale));
    if (targetScale === oldScale) return;
    
    const scrollLeft = container.scrollLeft;
    const scrollTop = container.scrollTop;
    
    zoomScale = parseFloat(targetScale.toFixed(2));
    updateZoomUI();
    
    const newScrollLeft = (scrollLeft + viewportX) * (zoomScale / oldScale) - viewportX;
    const newScrollTop = (scrollTop + viewportY) * (zoomScale / oldScale) - viewportY;
    
    container.scrollLeft = newScrollLeft;
    container.scrollTop = newScrollTop;
}

function setEraserSize(val) {
    eraserSize = parseInt(val, 10) || 15;
    localStorage.setItem('tbi_eraser_size', eraserSize);
}

function initEraserCursor() {
    let preview = document.getElementById('eraser-cursor-preview');
    if (!preview) {
        preview = document.createElement('div');
        preview.id = 'eraser-cursor-preview';
        document.body.appendChild(preview);
    }
}

function getRgbaColor(hex, opacity) {
    if (!hex) return `rgba(0, 0, 0, ${opacity})`;
    let cleanHex = hex.replace('#', '');
    if (cleanHex.length === 3) {
        cleanHex = cleanHex[0] + cleanHex[0] + cleanHex[1] + cleanHex[1] + cleanHex[2] + cleanHex[2];
    }
    const r = parseInt(cleanHex.substring(0, 2), 16) || 0;
    const g = parseInt(cleanHex.substring(2, 4), 16) || 0;
    const b = parseInt(cleanHex.substring(4, 6), 16) || 0;
    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
}

function toggleFillShapes() {
    fillShapes = !fillShapes;
    const btn = document.getElementById('shape-fill-toggle-btn');
    if (btn) {
        if (fillShapes) {
            btn.classList.add('bg-indigo-100', 'text-indigo-600', 'border-indigo-300');
            btn.classList.remove('text-neutral-500');
        } else {
            btn.classList.remove('bg-indigo-100', 'text-indigo-600', 'border-indigo-300');
            btn.classList.add('text-neutral-500');
        }
    }
}
window.toggleFillShapes = toggleFillShapes;


