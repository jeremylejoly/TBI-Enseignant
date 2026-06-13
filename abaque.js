// Logic for the Abaque de Numération Décimale

let abaqueIsDrawing = false;
let abaqueLastX = 0;
let abaqueLastY = 0;

function initAbaque() {
    const tbody = document.getElementById('abaque-rows');
    if (!tbody) return;
    
    // Only initialize once
    if (tbody.children.length > 0) {
        // If already initialized, just make sure canvas is correctly sized
        resizeAbaqueCanvasIfNeeded();
        return;
    }
    
    // Render 4 rows
    for (let r = 0; r < 4; r++) {
        const tr = document.createElement('tr');
        tr.className = 'border-b border-neutral-300';
        tr.dataset.rowIndex = r;
        
        // 12 columns for integers
        for (let c = 0; c < 12; c++) {
            const td = document.createElement('td');
            td.className = 'w-11 h-11 p-0 relative';
            const input = document.createElement('input');
            input.type = 'text';
            input.inputMode = 'numeric';
            input.pattern = '[0-9]*';
            input.maxLength = 1;
            input.className = 'abaque-input w-full h-full text-center';
            input.dataset.colIndex = c;
            
            // Attach event listeners
            setupAbaqueInputEvents(input, r, c);
            
            td.appendChild(input);
            tr.appendChild(td);
        }
        
        // Comma separator cell
        const commaTd = document.createElement('td');
        commaTd.className = 'w-4 abaque-comma-cell text-center';
        commaTd.textContent = ',';
        tr.appendChild(commaTd);
        
        // 3 columns for decimals
        for (let c = 12; c < 15; c++) {
            const td = document.createElement('td');
            td.className = 'w-11 h-11 p-0 relative';
            const input = document.createElement('input');
            input.type = 'text';
            input.inputMode = 'numeric';
            input.pattern = '[0-9]*';
            input.maxLength = 1;
            input.className = 'abaque-input w-full h-full text-center';
            input.dataset.colIndex = c;
            
            // Attach event listeners
            setupAbaqueInputEvents(input, r, c);
            
            td.appendChild(input);
            tr.appendChild(td);
        }
        
        // Clear row cell
        const clearTd = document.createElement('td');
        clearTd.className = 'w-6 text-center border-l-2 border-neutral-900';
        const clearBtn = document.createElement('button');
        clearBtn.className = 'abaque-row-clear-btn w-5 h-5 flex items-center justify-center bg-rose-100 hover:bg-rose-200 text-rose-800 rounded font-bold text-xs border border-neutral-400 cursor-pointer mx-auto';
        clearBtn.innerHTML = '✕';
        clearBtn.title = 'Effacer la ligne';
        clearBtn.onclick = () => clearAbaqueRow(r);
        clearTd.appendChild(clearBtn);
        tr.appendChild(clearTd);
        
        tbody.appendChild(tr);
    }
    
    // Initialize drawing canvas overlay
    initAbaqueDrawingCanvas();
}

function setupAbaqueInputEvents(input, rowIndex, colIndex) {
    // Restrict input to numbers only
    input.addEventListener('input', (e) => {
        const val = input.value;
        if (val.length > 0) {
            const lastChar = val.substring(val.length - 1);
            if (/\d/.test(lastChar)) {
                input.value = lastChar;
                focusAbaqueInput(rowIndex, colIndex + 1);
            } else {
                input.value = '';
            }
        }
        saveAbaqueState();
    });
    
    input.addEventListener('keydown', (e) => {
        if (e.key === 'Backspace') {
            if (input.value === '') {
                e.preventDefault();
                focusAbaqueInput(rowIndex, colIndex - 1, true);
            } else {
                input.value = '';
            }
            saveAbaqueState();
        } else if (e.key === 'ArrowRight') {
            focusAbaqueInput(rowIndex, colIndex + 1);
        } else if (e.key === 'ArrowLeft') {
            focusAbaqueInput(rowIndex, colIndex - 1);
        } else if (e.key === 'ArrowUp') {
            focusAbaqueInput(rowIndex - 1, colIndex);
        } else if (e.key === 'ArrowDown') {
            focusAbaqueInput(rowIndex + 1, colIndex);
        }
    });
}

function focusAbaqueInput(rowIndex, colIndex, andClear = false) {
    if (rowIndex < 0 || rowIndex >= 4 || colIndex < 0 || colIndex >= 15) return;
    
    const rows = document.getElementById('abaque-rows').children;
    const targetRow = rows[rowIndex];
    if (!targetRow) return;
    
    const inputs = targetRow.querySelectorAll('.abaque-input');
    const targetInput = inputs[colIndex];
    if (targetInput) {
        targetInput.focus();
        if (andClear) {
            targetInput.value = '';
        }
    }
}

function initAbaqueDrawingCanvas() {
    const canvas = document.getElementById('abaque-drawing-canvas');
    const widget = document.getElementById('floating-widget-abaque');
    if (!canvas || !widget) return;
    
    // Resize when shown
    setTimeout(() => {
        resizeAbaqueCanvasIfNeeded();
    }, 100);
    
    // Event listeners on widget hover to sync pointer-events
    widget.addEventListener('pointerenter', updateAbaqueDrawingCanvasState);
    widget.addEventListener('pointermove', updateAbaqueDrawingCanvasState);
    
    // Drawing events on canvas
    canvas.addEventListener('pointerdown', (e) => {
        const drawingTools = ['pen', 'highlighter', 'eraser', 'shape', 'laser'];
        const currentTool = (typeof activeTool !== 'undefined') ? activeTool : 'select';
        if (!drawingTools.includes(currentTool)) return;
        
        e.preventDefault();
        e.stopPropagation();
        
        abaqueIsDrawing = true;
        
        const rect = canvas.getBoundingClientRect();
        abaqueLastX = e.clientX - rect.left;
        abaqueLastY = e.clientY - rect.top;
        
        const ctx = canvas.getContext('2d');
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        
        if (currentTool === 'eraser') {
            ctx.globalCompositeOperation = 'destination-out';
            ctx.lineWidth = (typeof eraserSize !== 'undefined') ? eraserSize : 20;
            ctx.strokeStyle = 'rgba(0,0,0,1)';
        } else if (currentTool === 'highlighter') {
            ctx.globalCompositeOperation = 'source-over';
            const color = (typeof strokeColor !== 'undefined') ? strokeColor : '#f59e0b';
            ctx.strokeStyle = color + '80'; // 50% opacity
            ctx.lineWidth = ((typeof strokeWidth !== 'undefined') ? strokeWidth : 4) * 2;
        } else {
            ctx.globalCompositeOperation = 'source-over';
            ctx.strokeStyle = (typeof strokeColor !== 'undefined') ? strokeColor : '#1e293b';
            ctx.lineWidth = (typeof strokeWidth !== 'undefined') ? strokeWidth : 2.5;
        }
    });
    
    canvas.addEventListener('pointermove', (e) => {
        if (!abaqueIsDrawing) return;
        e.preventDefault();
        e.stopPropagation();
        
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const ctx = canvas.getContext('2d');
        ctx.beginPath();
        ctx.moveTo(abaqueLastX, abaqueLastY);
        ctx.lineTo(x, y);
        ctx.stroke();
        
        abaqueLastX = x;
        abaqueLastY = y;
    });
    
    const stopDrawing = (e) => {
        if (!abaqueIsDrawing) return;
        abaqueIsDrawing = false;
        saveAbaqueState();
    };
    
    canvas.addEventListener('pointerup', stopDrawing);
    canvas.addEventListener('pointercancel', stopDrawing);
    canvas.addEventListener('pointerleave', stopDrawing);
}

function resizeAbaqueCanvasIfNeeded() {
    const canvas = document.getElementById('abaque-drawing-canvas');
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    const targetWidth = Math.round(rect.width);
    const targetHeight = Math.round(rect.height);
    
    if (targetWidth === 0 || targetHeight === 0) return;
    
    const dpr = window.devicePixelRatio || 1;
    
    if (canvas.dataset.width !== String(targetWidth) || canvas.dataset.height !== String(targetHeight)) {
        let tempImg = null;
        if (canvas.width > 0 && canvas.height > 0) {
            tempImg = canvas.toDataURL();
        }
        
        canvas.width = targetWidth * dpr;
        canvas.height = targetHeight * dpr;
        canvas.style.width = targetWidth + 'px';
        canvas.style.height = targetHeight + 'px';
        
        const ctx = canvas.getContext('2d');
        ctx.scale(dpr, dpr);
        
        canvas.dataset.width = String(targetWidth);
        canvas.dataset.height = String(targetHeight);
        
        if (tempImg) {
            const img = new Image();
            img.onload = () => {
                ctx.drawImage(img, 0, 0, targetWidth, targetHeight);
            };
            img.src = tempImg;
        }
    }
}

function updateAbaqueDrawingCanvasState() {
    const canvas = document.getElementById('abaque-drawing-canvas');
    if (!canvas) return;
    
    resizeAbaqueCanvasIfNeeded();
    
    const drawingTools = ['pen', 'highlighter', 'eraser', 'shape', 'laser'];
    const currentTool = (typeof activeTool !== 'undefined') ? activeTool : 'select';
    const isDrawingTool = drawingTools.includes(currentTool);
    
    if (isDrawingTool) {
        canvas.style.pointerEvents = 'auto';
    } else {
        canvas.style.pointerEvents = 'none';
    }
}

function getAbaqueData() {
    const tbody = document.getElementById('abaque-rows');
    if (!tbody || tbody.children.length === 0) return null;
    
    const grid = [];
    for (let r = 0; r < 4; r++) {
        const rowData = [];
        const row = tbody.children[r];
        if (row) {
            const inputs = row.querySelectorAll('.abaque-input');
            inputs.forEach(input => {
                rowData.push(input.value || '');
            });
        }
        grid.push(rowData);
    }
    
    const canvas = document.getElementById('abaque-drawing-canvas');
    const drawing = canvas ? canvas.toDataURL() : null;
    
    return { grid, drawing };
}

function setAbaqueData(data) {
    if (!data) return;
    
    let grid = data;
    let drawing = null;
    
    if (data && data.grid) {
        grid = data.grid;
        drawing = data.drawing;
    }
    
    const tbody = document.getElementById('abaque-rows');
    if (!tbody) return;
    
    if (tbody.children.length === 0) {
        initAbaque();
    }
    
    // Set text values
    for (let r = 0; r < Math.min(4, grid.length); r++) {
        const row = tbody.children[r];
        if (row) {
            const inputs = row.querySelectorAll('.abaque-input');
            const rowData = grid[r];
            for (let c = 0; c < Math.min(15, rowData.length); c++) {
                if (inputs[c]) {
                    inputs[c].value = rowData[c] || '';
                }
            }
        }
    }
    
    // Set drawing
    const canvas = document.getElementById('abaque-drawing-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        const rect = canvas.getBoundingClientRect();
        
        if (rect.width > 0 && rect.height > 0) {
            ctx.clearRect(0, 0, rect.width, rect.height);
        }
        
        if (drawing) {
            resizeAbaqueCanvasIfNeeded();
            const img = new Image();
            img.onload = () => {
                const updatedRect = canvas.getBoundingClientRect();
                ctx.drawImage(img, 0, 0, updatedRect.width, updatedRect.height);
            };
            img.src = drawing;
        }
    }
}

// Clear all inputs and drawing
function clearAbaque() {
    const tbody = document.getElementById('abaque-rows');
    if (!tbody) return;
    
    const inputs = tbody.querySelectorAll('.abaque-input');
    inputs.forEach(input => {
        input.value = '';
    });
    
    const canvas = document.getElementById('abaque-drawing-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        const rect = canvas.getBoundingClientRect();
        ctx.clearRect(0, 0, rect.width, rect.height);
    }
    
    saveAbaqueState();
}

function clearAbaqueRow(rowIndex) {
    const tbody = document.getElementById('abaque-rows');
    if (!tbody) return;
    
    const row = tbody.children[rowIndex];
    if (row) {
        const inputs = row.querySelectorAll('.abaque-input');
        inputs.forEach(input => {
            input.value = '';
        });
        
        const canvas = document.getElementById('abaque-drawing-canvas');
        if (canvas) {
            const canvasRect = canvas.getBoundingClientRect();
            const rowRect = row.getBoundingClientRect();
            const localY = rowRect.top - canvasRect.top;
            const ctx = canvas.getContext('2d');
            ctx.clearRect(0, localY, canvasRect.width, rowRect.height);
        }
    }
    
    saveAbaqueState();
}

function saveAbaqueState() {
    if (typeof window.saveActiveTabState === 'function') {
        window.saveActiveTabState();
    }
}

// Publish globals
window.initAbaque = initAbaque;
window.getAbaqueData = getAbaqueData;
window.setAbaqueData = setAbaqueData;
window.clearAbaque = clearAbaque;
window.clearAbaqueRow = clearAbaqueRow;
window.updateAbaqueDrawingCanvasState = updateAbaqueDrawingCanvasState;
