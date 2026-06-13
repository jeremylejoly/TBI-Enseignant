// Logic for the Fractions Équivalentes Widget

let placedCircles = [];
let placedTiles = [];
let fractionsActiveTab = 'circles';
let showLabelsCircles = true;
let showLabelsTiles = true;

// Active drag tracking
let draggedCircle = null;
let draggedTile = null;
let circleDragOffset = { x: 0, y: 0 };
let tileDragOffset = { x: 0, y: 0 };
let selectedShapeId = null;

const fractionColors = {
    1: { fill: '#fee2e2', stroke: '#ef4444', text: '#991b1b' },  // Red
    2: { fill: '#ffedd5', stroke: '#ea580c', text: '#c2410c' },  // Orange
    3: { fill: '#fef9c3', stroke: '#ca8a04', text: '#854d0e' },  // Yellow
    4: { fill: '#ecfccb', stroke: '#65a30d', text: '#3f6212' },  // Lime
    5: { fill: '#d1fae5', stroke: '#059669', text: '#065f46' },  // Emerald
    6: { fill: '#cffafe', stroke: '#0891b2', text: '#075985' },  // Cyan
    8: { fill: '#dbeafe', stroke: '#2563eb', text: '#1e40af' },  // Blue
    10: { fill: '#f3e8ff', stroke: '#9333ea', text: '#6b21a8' }, // Purple
    12: { fill: '#fce7f3', stroke: '#db2777', text: '#9d174d' }  // Pink
};

function initFractions() {
    // 1. Draw rails if needed
    const railsGroup = document.getElementById('bars-rails-group');
    if (railsGroup && railsGroup.children.length === 0) {
        const yCoords = [20, 50, 80, 110, 140, 170];
        yCoords.forEach((y) => {
            // Horizontal rail
            const rail = document.createElementNS('http://www.w3.org/2000/svg', 'line');
            rail.setAttribute('x1', '50');
            rail.setAttribute('y1', y.toString());
            rail.setAttribute('x2', '530');
            rail.setAttribute('y2', y.toString());
            rail.setAttribute('stroke', '#cbd5e1');
            rail.setAttribute('stroke-width', '2.5');
            rail.setAttribute('stroke-dasharray', '5,5');
            railsGroup.appendChild(rail);
            
            // Left limit marker
            const limitL = document.createElementNS('http://www.w3.org/2000/svg', 'line');
            limitL.setAttribute('x1', '50');
            limitL.setAttribute('y1', (y - 12).toString());
            limitL.setAttribute('x2', '50');
            limitL.setAttribute('y2', (y + 12).toString());
            limitL.setAttribute('stroke', '#475569');
            limitL.setAttribute('stroke-width', '2');
            railsGroup.appendChild(limitL);
            
            // Right limit marker
            const limitR = document.createElementNS('http://www.w3.org/2000/svg', 'line');
            limitR.setAttribute('x1', '530');
            limitR.setAttribute('y1', (y - 12).toString());
            limitR.setAttribute('x2', '530');
            limitR.setAttribute('y2', (y + 12).toString());
            limitR.setAttribute('stroke', '#475569');
            limitR.setAttribute('stroke-width', '2');
            railsGroup.appendChild(limitR);
        });
    }
    
    // 2. Setup global keyboard listener for deleting selected shapes
    if (!window.fractionsKeyboardInitialized) {
        window.addEventListener('keydown', (e) => {
            if (e.key === 'Backspace' || e.key === 'Delete') {
                if (selectedShapeId) {
                    deleteShape(selectedShapeId);
                    e.preventDefault();
                }
            }
        });
        window.fractionsKeyboardInitialized = true;
    }
    
    // 3. Register SVG drag move listeners
    setupFractionsDragListeners();
    
    // 4. Render initial shapes
    packAllCircles();
    packAllRails();
    renderCircles();
    renderTiles();
}

function switchFractionsTab(tabName) {
    fractionsActiveTab = tabName;
    
    const tabCirclesBtn = document.getElementById('frac-tab-circles');
    const tabBarsBtn = document.getElementById('frac-tab-bars');
    const circlesContent = document.getElementById('fractions-circles-content');
    const barsContent = document.getElementById('fractions-bars-content');
    
    if (tabName === 'circles') {
        if (tabCirclesBtn) {
            tabCirclesBtn.className = "px-3 py-1.5 text-xs font-bold border-2 border-neutral-900 rounded-xl bg-indigo-100 text-indigo-900 shadow-[2px_2px_0_rgba(0,0,0,1)] cursor-pointer";
        }
        if (tabBarsBtn) {
            tabBarsBtn.className = "px-3 py-1.5 text-xs font-bold border-2 border-neutral-900 rounded-xl bg-neutral-100 text-neutral-600 shadow-[2px_2px_0_rgba(0,0,0,1)] cursor-pointer";
        }
        if (circlesContent) circlesContent.classList.remove('hidden');
        if (barsContent) barsContent.classList.add('hidden');
    } else {
        if (tabCirclesBtn) {
            tabCirclesBtn.className = "px-3 py-1.5 text-xs font-bold border-2 border-neutral-900 rounded-xl bg-neutral-100 text-neutral-600 shadow-[2px_2px_0_rgba(0,0,0,1)] cursor-pointer";
        }
        if (tabBarsBtn) {
            tabBarsBtn.className = "px-3 py-1.5 text-xs font-bold border-2 border-neutral-900 rounded-xl bg-indigo-100 text-indigo-900 shadow-[2px_2px_0_rgba(0,0,0,1)] cursor-pointer";
        }
        if (circlesContent) circlesContent.classList.add('hidden');
        if (barsContent) barsContent.classList.remove('hidden');
    }
    
    // Deselect shape when switching tabs
    selectedShapeId = null;
    renderCircles();
    renderTiles();
    
    saveFractionsState();
}

function spawnFractionCircle(denom) {
    const span = 360 / denom;
    const piece = {
        id: 'circle-' + Date.now() + '-' + Math.floor(Math.random() * 1000),
        denom: denom,
        span: span,
        x: 310 + (Math.random() * 30 - 15),
        y: 70 + (Math.random() * 30 - 15),
        startAngle: 0,
        isSnapped: false
    };
    placedCircles.push(piece);
    selectedShapeId = piece.id;
    
    packAllCircles();
    renderCircles();
    saveFractionsState();
}

function spawnFractionTile(denom) {
    const width = 480 / denom;
    const tile = {
        id: 'tile-' + Date.now() + '-' + Math.floor(Math.random() * 1000),
        denom: denom,
        width: width,
        x: 50 + (Math.random() * 100),
        y: 5,
        isSnapped: false
    };
    placedTiles.push(tile);
    selectedShapeId = tile.id;
    
    packAllRails();
    renderTiles();
    saveFractionsState();
}

// --- PACKING FUNCTIONS (SNAP CONTIGUOUS) ---
function packAllCircles() {
    const snapped = placedCircles.filter(c => c.isSnapped);
    
    // Sort snapped slices by their center angle in the packed circle
    snapped.sort((a, b) => {
        let angleA = a.startAngle + a.span / 2;
        let angleB = b.startAngle + b.span / 2;
        
        if (draggedCircle && a.id === draggedCircle.id) {
            angleA = draggedCircle.pointerAngle !== undefined ? draggedCircle.pointerAngle : (a.startAngle + a.span / 2);
        }
        if (draggedCircle && b.id === draggedCircle.id) {
            angleB = draggedCircle.pointerAngle !== undefined ? draggedCircle.pointerAngle : (b.startAngle + b.span / 2);
        }
        
        return angleA - angleB;
    });
    
    // Pack them contiguously starting from 0 degrees (12 o'clock)
    let currentAngle = 0;
    snapped.forEach(c => {
        c.startAngle = currentAngle;
        currentAngle = (currentAngle + c.span) % 360;
    });
}

function packAllRails() {
    const railsY = [20, 50, 80, 110, 140, 170];
    railsY.forEach(ry => {
        const targetY = ry - 12;
        // Get all tiles snapped to this rail
        const railTiles = placedTiles.filter(t => t.isSnapped && t.y === targetY);
        
        // Sort snapped tiles by their center x coordinate
        railTiles.sort((a, b) => {
            let ax = a.x + a.width / 2;
            let bx = b.x + b.width / 2;
            if (draggedTile && a.id === draggedTile.id) ax = (draggedTile.rawX !== undefined ? draggedTile.rawX : a.x) + a.width / 2;
            if (draggedTile && b.id === draggedTile.id) bx = (draggedTile.rawX !== undefined ? draggedTile.rawX : b.x) + b.width / 2;
            return ax - bx;
        });
        
        // Pack them contiguously from left (x = 50)
        let currentX = 50;
        railTiles.forEach(t => {
            t.x = currentX;
            currentX += t.width;
        });
    });
}

function renderCircles() {
    const group = document.getElementById('placed-slices-group');
    if (!group) return;
    group.innerHTML = '';
    
    placedCircles.forEach(piece => {
        const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        g.setAttribute('class', 'cursor-move');
        g.dataset.id = piece.id;
        
        // Path sector
        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        const color = fractionColors[piece.denom] || { fill: '#e2e8f0', stroke: '#475569', text: '#0f172a' };
        
        const cx = piece.isSnapped ? 190 : piece.x;
        const cy = piece.isSnapped ? 130 : piece.y;
        const r = piece.isSnapped ? 90 : 75; // float is slightly smaller
        
        path.setAttribute('d', getSlicePath(cx, cy, r, piece.startAngle, piece.span));
        path.setAttribute('fill', color.fill);
        path.setAttribute('stroke', piece.id === selectedShapeId ? '#0f172a' : color.stroke);
        path.setAttribute('stroke-width', piece.id === selectedShapeId ? '4' : '2.5');
        
        g.appendChild(path);
        
        // Text label
        if (showLabelsCircles) {
            const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
            const angleText = piece.startAngle + piece.span / 2;
            const textRadius = r * 0.65;
            const rad = (angleText - 90) * Math.PI / 180;
            const tx = cx + textRadius * Math.cos(rad);
            const ty = cy + textRadius * Math.sin(rad);
            
            text.setAttribute('x', tx.toFixed(1));
            text.setAttribute('y', (ty + 3).toFixed(1)); // tiny vertical adjustment
            text.setAttribute('text-anchor', 'middle');
            text.setAttribute('font-family', 'Arial, sans-serif');
            text.setAttribute('font-weight', '900');
            text.setAttribute('font-size', piece.denom > 8 ? '9' : '11');
            text.setAttribute('fill', color.text);
            text.textContent = `1/${piece.denom}`;
            
            g.appendChild(text);
        }
        
        // Drag hooks
        g.addEventListener('pointerdown', (e) => {
            e.preventDefault();
            e.stopPropagation();
            
            selectedShapeId = piece.id;
            draggedCircle = piece;
            
            const svgEl = document.getElementById('fractions-circles-svg');
            svgEl.setPointerCapture(e.pointerId);
            
            const coords = getLocalSVGCoords(e, svgEl);
            circleDragOffset = { x: coords.x - piece.x, y: coords.y - piece.y };
            
            renderCircles();
        });
        
        g.addEventListener('dblclick', (e) => {
            e.preventDefault();
            e.stopPropagation();
            deleteShape(piece.id);
        });
        
        group.appendChild(g);
    });
}

function renderTiles() {
    const group = document.getElementById('placed-tiles-group');
    if (!group) return;
    group.innerHTML = '';
    
    placedTiles.forEach(tile => {
        const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        g.setAttribute('class', 'cursor-move');
        g.dataset.id = tile.id;
        
        const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        const color = fractionColors[tile.denom] || { fill: '#e2e8f0', stroke: '#475569', text: '#0f172a' };
        
        rect.setAttribute('x', tile.x.toString());
        rect.setAttribute('y', tile.y.toString());
        rect.setAttribute('width', tile.width.toString());
        rect.setAttribute('height', '24');
        rect.setAttribute('rx', '4');
        rect.setAttribute('fill', color.fill);
        rect.setAttribute('stroke', tile.id === selectedShapeId ? '#0f172a' : color.stroke);
        rect.setAttribute('stroke-width', tile.id === selectedShapeId ? '3.5' : '2');
        
        g.appendChild(rect);
        
        // Text label
        if (showLabelsTiles) {
            const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
            text.setAttribute('x', (tile.x + tile.width / 2).toString());
            text.setAttribute('y', (tile.y + 16).toString()); // center height
            text.setAttribute('text-anchor', 'middle');
            text.setAttribute('font-family', 'Arial, sans-serif');
            text.setAttribute('font-weight', '900');
            text.setAttribute('font-size', '10');
            text.setAttribute('fill', color.text);
            text.textContent = `1/${tile.denom}`;
            g.appendChild(text);
        }
        
        // Drag hooks
        g.addEventListener('pointerdown', (e) => {
            e.preventDefault();
            e.stopPropagation();
            
            selectedShapeId = tile.id;
            draggedTile = tile;
            
            const svgEl = document.getElementById('fractions-bars-svg');
            svgEl.setPointerCapture(e.pointerId);
            
            const coords = getLocalSVGCoords(e, svgEl);
            tileDragOffset = { x: coords.x - tile.x, y: coords.y - tile.y };
            
            renderTiles();
        });
        
        g.addEventListener('dblclick', (e) => {
            e.preventDefault();
            e.stopPropagation();
            deleteShape(tile.id);
        });
        
        group.appendChild(g);
    });
}

function setupFractionsDragListeners() {
    const svgCircles = document.getElementById('fractions-circles-svg');
    const svgBars = document.getElementById('fractions-bars-svg');
    
    if (svgCircles) {
        svgCircles.addEventListener('pointermove', (e) => {
            if (!draggedCircle) return;
            e.preventDefault();
            
            const coords = getLocalSVGCoords(e, svgCircles);
            const rawX = coords.x - circleDragOffset.x;
            const rawY = coords.y - circleDragOffset.y;
            
            const dist = Math.sqrt((rawX - 190) ** 2 + (rawY - 130) ** 2);
            
            if (dist < 60) {
                // Snap to target center circle
                draggedCircle.isSnapped = true;
                draggedCircle.x = 190;
                draggedCircle.y = 130;
                
                // Get pointer angle relative to center (0 to 360, where 0 is 12 o'clock)
                let pointerAngle = Math.atan2(coords.y - 130, coords.x - 190) * 180 / Math.PI + 90;
                if (pointerAngle < 0) pointerAngle += 360;
                
                draggedCircle.pointerAngle = pointerAngle;
            } else {
                // Float freely
                draggedCircle.isSnapped = false;
                draggedCircle.pointerAngle = undefined;
                draggedCircle.x = Math.max(10, Math.min(370, rawX));
                draggedCircle.y = Math.max(10, Math.min(250, rawY));
            }
            
            packAllCircles();
            renderCircles();
        });
        
        const stopCircleDrag = (e) => {
            if (!draggedCircle) return;
            try {
                svgCircles.releasePointerCapture(e.pointerId);
            } catch(err) {}
            
            draggedCircle.pointerAngle = undefined;
            packAllCircles();
            draggedCircle = null;
            
            saveFractionsState();
            renderCircles();
        };
        
        svgCircles.addEventListener('pointerup', stopCircleDrag);
        svgCircles.addEventListener('pointercancel', stopCircleDrag);
    }
    
    if (svgBars) {
        svgBars.addEventListener('pointermove', (e) => {
            if (!draggedTile) return;
            e.preventDefault();
            
            const coords = getLocalSVGCoords(e, svgBars);
            const rawX = coords.x - tileDragOffset.x;
            const rawY = coords.y - tileDragOffset.y;
            
            const tileCenterY = rawY + 12;
            const railsY = [20, 50, 80, 110, 140, 170];
            
            // Find nearest rail
            let nearestRailY = 20;
            let minDistY = 999;
            railsY.forEach(ry => {
                const dy = Math.abs(tileCenterY - ry);
                if (dy < minDistY) {
                    minDistY = dy;
                    nearestRailY = ry;
                }
            });
            
            if (minDistY < 18) {
                // Snap to rail
                draggedTile.isSnapped = true;
                draggedTile.y = nearestRailY - 12;
                draggedTile.rawX = rawX;
            } else {
                // Float freely
                draggedTile.isSnapped = false;
                draggedTile.rawX = undefined;
                draggedTile.x = Math.max(5, Math.min(575 - draggedTile.width, rawX));
                draggedTile.y = Math.max(5, Math.min(195 - 24, rawY));
            }
            
            packAllRails();
            renderTiles();
        });
        
        const stopTileDrag = (e) => {
            if (!draggedTile) return;
            try {
                svgBars.releasePointerCapture(e.pointerId);
            } catch(err) {}
            
            draggedTile.rawX = undefined;
            packAllRails();
            draggedTile = null;
            
            saveFractionsState();
            renderTiles();
        };
        
        svgBars.addEventListener('pointerup', stopTileDrag);
        svgBars.addEventListener('pointercancel', stopTileDrag);
    }
}

function getLocalSVGCoords(e, svgEl) {
    const pt = svgEl.createSVGPoint();
    pt.x = e.clientX;
    pt.y = e.clientY;
    const svgP = pt.matrixTransform(svgEl.getScreenCTM().inverse());
    return { x: svgP.x, y: svgP.y };
}

function getSlicePath(cx, cy, r, startAngle, angleSpan) {
    const startRad = (startAngle - 90) * Math.PI / 180;
    const endRad = (startAngle + angleSpan - 90) * Math.PI / 180;
    
    const x1 = cx + r * Math.cos(startRad);
    const y1 = cy + r * Math.sin(startRad);
    const x2 = cx + r * Math.cos(endRad);
    const y2 = cy + r * Math.sin(endRad);
    
    const largeArc = angleSpan > 180 ? 1 : 0;
    const sweep = 1;
    
    if (Math.abs(angleSpan - 360) < 0.01) {
        return `M ${cx} ${cy - r} A ${r} ${r} 0 1 1 ${cx - 0.01} ${cy - r} Z`;
    }
    
    return `M ${cx} ${cy} L ${x1.toFixed(2)} ${y1.toFixed(2)} A ${r} ${r} 0 ${largeArc} ${sweep} ${x2.toFixed(2)} ${y2.toFixed(2)} Z`;
}

function deleteShape(id) {
    if (id.startsWith('circle-')) {
        placedCircles = placedCircles.filter(c => c.id !== id);
        packAllCircles();
        renderCircles();
    } else {
        placedTiles = placedTiles.filter(t => t.id !== id);
        packAllRails();
        renderTiles();
    }
    if (selectedShapeId === id) selectedShapeId = null;
    
    saveFractionsState();
}

function clearFractionCircles() {
    placedCircles = [];
    selectedShapeId = null;
    renderCircles();
    saveFractionsState();
}

function clearFractionTiles() {
    placedTiles = [];
    selectedShapeId = null;
    renderTiles();
    saveFractionsState();
}

function toggleFractionLabels(show) {
    showLabelsCircles = !!show;
    renderCircles();
    
    // Sync checkbox
    const chk = document.getElementById('frac-show-labels');
    if (chk) chk.checked = showLabelsCircles;
    
    saveFractionsState();
}

function toggleFractionLabelsTile(show) {
    showLabelsTiles = !!show;
    renderTiles();
    
    // Sync checkbox
    const chk = document.getElementById('frac-show-labels-tile');
    if (chk) chk.checked = showLabelsTiles;
    
    saveFractionsState();
}

// state helpers
function getFractionsActiveTab() {
    return fractionsActiveTab;
}

function getFractionsData() {
    return {
        circles: placedCircles.map(c => ({
            denom: c.denom,
            span: c.span,
            x: c.x,
            y: c.y,
            startAngle: c.startAngle,
            isSnapped: c.isSnapped
        })),
        tiles: placedTiles.map(t => ({
            denom: t.denom,
            width: t.width,
            x: t.x,
            y: t.y,
            isSnapped: t.isSnapped
        })),
        showLabelsCircles,
        showLabelsTiles
    };
}

function setFractionsData(data) {
    if (!data) return;
    if (data.circles) placedCircles = data.circles.map((c, i) => ({ id: `circle-${Date.now()}-${i}`, ...c }));
    if (data.tiles) placedTiles = data.tiles.map((t, i) => ({ id: `tile-${Date.now()}-${i}`, ...t }));
    
    packAllCircles();
    packAllRails();
    
    if (data.showLabelsCircles !== undefined) {
        showLabelsCircles = data.showLabelsCircles;
        const chk = document.getElementById('frac-show-labels');
        if (chk) chk.checked = showLabelsCircles;
    }
    
    if (data.showLabelsTiles !== undefined) {
        showLabelsTiles = data.showLabelsTiles;
        const chk = document.getElementById('frac-show-labels-tile');
        if (chk) chk.checked = showLabelsTiles;
    }
    
    renderCircles();
    renderTiles();
}

function saveFractionsState() {
    if (typeof window.saveActiveTabState === 'function') {
        window.saveActiveTabState();
    }
}

// Publish globals
window.initFractions = initFractions;
window.switchFractionsTab = switchFractionsTab;
window.spawnFractionCircle = spawnFractionCircle;
window.spawnFractionTile = spawnFractionTile;
window.clearFractionCircles = clearFractionCircles;
window.clearFractionTiles = clearFractionTiles;
window.toggleFractionLabels = toggleFractionLabels;
window.toggleFractionLabelsTile = toggleFractionLabelsTile;
window.getFractionsActiveTab = getFractionsActiveTab;
window.getFractionsData = getFractionsData;
window.setFractionsData = setFractionsData;
