// Aristo Set Square Logic — aristo.js

// --- STATE VARIABLES ---
let aristoAngle = 0; // Current rotation angle in degrees
let aristoIsActive = false;

// --- INITIALIZATION ---
function initAristoSquare() {
    aristoIsActive = true;
    
    // Clear marks container to prevent duplicates or overlapping ticks
    const marksContainer = document.getElementById('aristo-rulers-marks');
    if (marksContainer) {
        marksContainer.innerHTML = '';
    }
    
    renderAristoRulerTicks();
    renderAristoProtractorTicks();
    setupAristoRotation();
}

// Generate the graduation marks on the base line dynamically (now at y = 0, extending downwards)
function renderAristoRulerTicks() {
    const marksContainer = document.getElementById('aristo-rulers-marks');
    if (!marksContainer) return;
    
    marksContainer.innerHTML = '';
    
    const centerY = 0; // base y coordinate is now at the top
    const centerOffset = 150; // 0cm is at the middle (x = 150)
    
    // Draw millimeter and centimeter graduations
    for (let x = 10; x <= 290; x += 2) {
        const distFromCenter = x - centerOffset;
        const isCm = distFromCenter % 20 === 0;
        const isHalfCm = distFromCenter % 10 === 0 && !isCm;
        
        let tickHeight = 4; // minor tick
        if (isCm) tickHeight = 10;
        else if (isHalfCm) tickHeight = 7;
        
        // Tick Line (extends downwards from base y=0)
        const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        line.setAttribute('x1', x.toString());
        line.setAttribute('y1', centerY.toString());
        line.setAttribute('x2', x.toString());
        line.setAttribute('y2', (centerY + tickHeight).toString());
        line.setAttribute('stroke', '#1e293b');
        line.setAttribute('stroke-width', isCm ? '1' : '0.5');
        marksContainer.appendChild(line);
        
        // Centimeter numbers
        if (isCm) {
            const cmValue = Math.abs(distFromCenter / 20);
            if (cmValue > 0) {
                const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
                text.setAttribute('x', x.toString());
                text.setAttribute('y', (centerY + 16).toString());
                text.setAttribute('text-anchor', 'middle');
                text.setAttribute('font-size', '6.5');
                text.setAttribute('font-weight', 'bold');
                text.setAttribute('fill', '#0f172a');
                text.textContent = cmValue.toString();
                marksContainer.appendChild(text);
            }
        }
    }
}

// Generate the degree graduations on the yellow protractor arc dynamically
function renderAristoProtractorTicks() {
    const marksContainer = document.getElementById('aristo-rulers-marks');
    if (!marksContainer) return;
    
    const centerX = 150;
    const centerY = 0;
    
    // Draw degrees from 10 to 170
    for (let a = 10; a <= 170; a++) {
        const isMajor = (a % 10 === 0);
        const isMedium = (a % 5 === 0) && !isMajor;
        
        let r1 = 92;
        let r2 = 98;
        if (isMajor) {
            r1 = 88;
            r2 = 102;
        } else if (isMedium) {
            r1 = 90;
            r2 = 100;
        }
        
        // Convert angle (0 is right, 180 is left, curving downwards in SVG space)
        // 10 degrees is on the left, corresponding to standard angle 170
        const alphaRad = (180 - a) * Math.PI / 180;
        
        const x1 = centerX + r1 * Math.cos(alphaRad);
        const y1 = centerY + r1 * Math.sin(alphaRad);
        const x2 = centerX + r2 * Math.cos(alphaRad);
        const y2 = centerY + r2 * Math.sin(alphaRad);
        
        // Degree Tick Line
        const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        line.setAttribute('x1', x1.toFixed(1));
        line.setAttribute('y1', y1.toFixed(1));
        line.setAttribute('x2', x2.toFixed(1));
        line.setAttribute('y2', y2.toFixed(1));
        line.setAttribute('stroke', '#1e293b');
        line.setAttribute('stroke-width', isMajor ? '0.8' : '0.4');
        marksContainer.appendChild(line);
        
        // Degree labels (e.g. 10, 20... 90... 170)
        if (isMajor) {
            const rt = 109; // Position text just outside the yellow band
            const xt = centerX + rt * Math.cos(alphaRad);
            const yt = centerY + rt * Math.sin(alphaRad);
            
            const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
            text.setAttribute('x', xt.toFixed(1));
            text.setAttribute('y', yt.toFixed(1));
            text.setAttribute('text-anchor', 'middle');
            text.setAttribute('dominant-baseline', 'central');
            text.setAttribute('font-size', '5');
            text.setAttribute('font-weight', '900');
            text.setAttribute('fill', '#334155');
            text.textContent = a.toString();
            marksContainer.appendChild(text);
        }
    }
}

// --- ROTATION HANDLER ---
function setupAristoRotation() {
    const rotateHandle = document.getElementById('aristo-rotate-handle');
    const aristoSvg = document.getElementById('aristo-svg');
    const widgetEl = document.getElementById('floating-widget-aristo');
    
    if (!rotateHandle || !aristoSvg || !widgetEl) return;
    
    let isRotating = false;
    
    function startRotate(e) {
        e.preventDefault();
        e.stopPropagation();
        isRotating = true;
        
        if (e.target && typeof e.target.setPointerCapture === 'function') {
            try {
                e.target.setPointerCapture(e.pointerId);
            } catch (err) {
                console.warn("Could not set pointer capture:", err);
            }
        }
        
        document.addEventListener('pointermove', rotateMove);
        document.addEventListener('pointerup', endRotate);
        document.addEventListener('pointercancel', endRotate);
    }
    
    function rotateMove(e) {
        if (!isRotating) return;
        e.preventDefault();
        
        const rect = widgetEl.getBoundingClientRect();
        
        // The rotation pivot is the center of the base (x = 150, y = 0 in SVG space)
        // In client space, this is the center-top of the widget
        const pivotX = rect.left + rect.width / 2;
        const pivotY = rect.top; // Top edge of the widget
        
        const dx = e.clientX - pivotX;
        const dy = e.clientY - pivotY;
        
        // Calculate raw angle (3 o'clock is 0)
        const rad = Math.atan2(dy, dx);
        let deg = rad * 180 / Math.PI;
        
        // Map so that dragging straight down (dy > 0, dx = 0) which is 90 deg, corresponds to 0 deg rotation
        let angle = deg - 90;
        
        // Snap to nearest 1 degree
        aristoAngle = Math.round(angle);
        
        // Apply CSS rotation transform directly on the SVG triangle
        // The transform-origin must be "50% 0%" (the center-top pivot point)
        aristoSvg.style.transformOrigin = '50% 0%';
        aristoSvg.style.transform = `rotate(${aristoAngle}deg)`;
    }
    
    function endRotate(e) {
        if (!isRotating) return;
        isRotating = false;
        
        if (e.target && typeof e.target.releasePointerCapture === 'function') {
            try {
                e.target.releasePointerCapture(e.pointerId);
            } catch (err) {}
        }
        
        document.removeEventListener('pointermove', rotateMove);
        document.removeEventListener('pointerup', endRotate);
        document.removeEventListener('pointercancel', endRotate);
    }
    
    rotateHandle.addEventListener('pointerdown', startRotate);
}

// --- MAGNETIC PEN SNAPPING ---
// Snaps drawing coordinate (x, y) relative to drawing canvas onto the ruler base if close
window.snapToAristo = function(canvasX, canvasY) {
    const widgetEl = document.getElementById('floating-widget-aristo');
    const aristoSvg = document.getElementById('aristo-svg');
    const canvas = document.getElementById('drawing-canvas');
    
    // Check if widget is visible and active
    if (!widgetEl || widgetEl.classList.contains('hidden') || !canvas) {
        return null;
    }
    
    const canvasRect = canvas.getBoundingClientRect();
    const viewport = document.getElementById('whiteboard-viewport');
    const viewportRect = viewport ? viewport.getBoundingClientRect() : { left: 0, top: 0 };
    
    const widgetLeft = parseFloat(widgetEl.style.left) || 0;
    const widgetTop = parseFloat(widgetEl.style.top) || 0;
    
    const widgetClientLeft = widgetLeft + viewportRect.left - (viewport ? viewport.scrollLeft : 0);
    const widgetClientTop = widgetTop + viewportRect.top - (viewport ? viewport.scrollTop : 0);
    
    const width = parseFloat(widgetEl.style.width) || widgetEl.offsetWidth || 250;
    
    // Client coordinates of the snap line pivot (center top of set square)
    const pivotClientX = widgetClientLeft + width / 2;
    const pivotClientY = widgetClientTop; // Top edge of the triangle
    
    // Half length of the base in client pixels
    const halfLength = width / 2;
    
    // Angle in radians
    const rad = aristoAngle * Math.PI / 180;
    
    // Direction vector of the base ruler line (horizontal when rotation = 0)
    // At 0 rotation, the vector is (+1, 0) in client space
    const dirX = Math.cos(rad);
    const dirY = Math.sin(rad);
    
    // Define ruler line segment in client space
    const xStart = pivotClientX - halfLength * dirX;
    const yStart = pivotClientY - halfLength * dirY;
    const xEnd = pivotClientX + halfLength * dirX;
    const yEnd = pivotClientY + halfLength * dirY;
    
    // Convert canvas coordinates to client space
    const px = canvasX + canvasRect.left;
    const py = canvasY + canvasRect.top;
    
    // Compute distance from point to segment AB
    const abX = xEnd - xStart;
    const abY = yEnd - yStart;
    const apX = px - xStart;
    const apY = py - yStart;
    
    const abLenSq = abX * abX + abY * abY;
    if (abLenSq === 0) return null;
    
    // Projection factor bounded between 0 and 1
    let t = (apX * abX + apY * abY) / abLenSq;
    t = Math.max(0, Math.min(1, t));
    
    // Nearest point on segment
    const snapClientX = xStart + t * abX;
    const snapClientY = yStart + t * abY;
    
    // Distance in pixels
    const dist = Math.sqrt((px - snapClientX) ** 2 + (py - snapClientY) ** 2);
    
    // Snap threshold: 22 pixels
    if (dist < 22) {
        // Add magnetic glow to the SVG outline to notify user
        aristoSvg.classList.add('aristo-snap-active');
        
        // Return snapped coordinates relative to canvas
        return {
            x: snapClientX - canvasRect.left,
            y: snapClientY - canvasRect.top
        };
    } else {
        // Remove glow
        aristoSvg.classList.remove('aristo-snap-active');
        return null;
    }
};

// Resize the Aristo Set Square widget dynamically from the UI slider
function resizeAristoWidget(width) {
    const el = document.getElementById('floating-widget-aristo');
    if (el) {
        el.style.width = width + 'px';
        el.style.height = (width / 2) + 'px';
    }
}

// Accessors for saving/restoring tab state
window.getAristoAngle = () => aristoAngle;
window.setAristoAngle = (val) => {
    aristoAngle = val;
    const aristoSvg = document.getElementById('aristo-svg');
    if (aristoSvg) {
        aristoSvg.style.transformOrigin = '50% 0%';
        aristoSvg.style.transform = `rotate(${aristoAngle}deg)`;
    }
};

