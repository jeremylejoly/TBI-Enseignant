// Compass Widget Logic — compass.js

// --- STATE VARIABLES ---
let compassAngle = 0; // Current rotation angle of the compass in degrees
let compassROffset = 40; // Default arm spread (corresponds to radius of 80 SVG units)
let compassIsDrawing = false;
let lastDrawnAngle = 0;

// --- INITIALIZATION ---
function initCompass() {
    clearCompassHeadListeners();
    renderCompassState();
    setupCompassMovement();
    setupCompassWidthAdjuster();
    setupCompassDrawHandler();
}

// Clone the head node to clear the default drag-to-move listener from app.js
function clearCompassHeadListeners() {
    const head = document.getElementById('compass-head');
    if (head) {
        const newHead = head.cloneNode(true);
        head.parentNode.replaceChild(newHead, head);
    }
}

// Update the SVG coordinates of the compass based on compassROffset and compassAngle
function renderCompassState() {
    const needleLeg = document.getElementById('compass-needle-leg');
    const pencilLeg = document.getElementById('compass-pencil-leg');
    const needlePoint = document.getElementById('compass-needle-point');
    const widthScrew = document.getElementById('compass-width-screw');
    const pencilGroup = document.getElementById('compass-pencil');
    const compassSvg = document.getElementById('compass-svg');
    
    if (!needleLeg || !pencilLeg || !needlePoint || !pencilGroup || !compassSvg) return;
    
    // Needle point is now FIXED at x = 60, y = 220
    const needleX = 60;
    needleLeg.setAttribute('x2', needleX.toString());
    needlePoint.setAttribute('cx', needleX.toString());
    
    // Pencil point shifts right: x = 60 + 2 * rOffset
    const pencilX = 60 + 2 * compassROffset;
    pencilLeg.setAttribute('x2', pencilX.toString());
    
    // Translate the pencil group (designed for x = 140, which is offset 40)
    pencilGroup.setAttribute('transform', `translate(${2 * compassROffset - 80}, 0)`);
    
    // Connect and center the width adjustment screw
    const screwLine = document.querySelector('#compass-svg line[class="stroke-amber-600"]');
    if (screwLine && widthScrew) {
        const leg1X = 85;
        const leg2X = 100 + 0.375 * (pencilX - 100);
        screwLine.setAttribute('x1', leg1X.toString());
        screwLine.setAttribute('x2', leg2X.toString());
        widthScrew.setAttribute('cx', ((leg1X + leg2X) / 2).toString());
    }
    
    // Apply CSS rotation around the needle point pivot (60, 220)
    compassSvg.style.transformOrigin = `${needleX / 2}% 84.61538%`;
    compassSvg.style.transform = `rotate(${compassAngle}deg)`;
    
    // Update the dashed preview circle
    const previewCircle = document.getElementById('compass-preview-circle');
    if (previewCircle) {
        const radiusSvg = 2 * compassROffset;
        previewCircle.setAttribute('cx', needleX.toString());
        previewCircle.setAttribute('r', radiusSvg.toString());
    }
    
    // Update the live centimeter radius label
    updateCompassRadiusLabel();
    
    // Update the custom floating info card values
    const cardRadius = document.getElementById('compass-card-radius');
    const cardAngle = document.getElementById('compass-card-angle');
    
    if (cardRadius || cardAngle) {
        const widget = document.getElementById('floating-widget-compass');
        let cm = "1.6";
        if (widget) {
            const widgetRect = widget.getBoundingClientRect();
            const scale = widgetRect.width / 200;
            const canvasRadius = (2 * compassROffset) * scale;
            cm = (canvasRadius / 40).toFixed(1);
        }
        if (cardRadius) cardRadius.textContent = cm;
        if (cardAngle) cardAngle.textContent = `${Math.round(compassAngle)}°`;
    }
}

// Calculates and updates the printed radius in centimeters (40px = 1cm matching the whiteboard grid blocks)
function updateCompassRadiusLabel() {
    const widget = document.getElementById('floating-widget-compass');
    const label = document.getElementById('compass-radius-label');
    if (!widget || !label) return;
    
    const widgetRect = widget.getBoundingClientRect();
    const scale = widgetRect.width / 200; // SVG space is 200px wide
    
    // Calculate the drawing canvas radius
    const canvasRadius = (2 * compassROffset) * scale;
    
    // Convert pixels to cm (40 pixels = 1 cm)
    const cm = (canvasRadius / 40).toFixed(1);
    
    label.textContent = `${cm} cm`;
}

// --- DRAG TO POSITION WIDGET ---
function setupCompassMovement() {
    const needlePoint = document.getElementById('compass-needle-point');
    const needleLeg = document.getElementById('compass-needle-leg');
    const widget = document.getElementById('floating-widget-compass');
    
    if (!needlePoint || !needleLeg || !widget) return;
    
    let isMoving = false;
    let startX = 0, startY = 0;
    let startLeft = 0, startTop = 0;
    
    function onStart(e) {
        e.preventDefault();
        e.stopPropagation();
        
        isMoving = true;
        
        let clientX, clientY;
        if (e.touches && e.touches.length > 0) {
            clientX = e.touches[0].clientX;
            clientY = e.touches[0].clientY;
        } else {
            clientX = e.clientX;
            clientY = e.clientY;
        }
        
        startX = clientX;
        startY = clientY;
        startLeft = widget.offsetLeft;
        startTop = widget.offsetTop;
        
        document.addEventListener('mousemove', onMove);
        document.addEventListener('mouseup', onEnd);
        document.addEventListener('touchmove', onMove, { passive: false });
        document.addEventListener('touchend', onEnd);
    }
    
    function onMove(e) {
        if (!isMoving) return;
        e.preventDefault();
        
        let clientX, clientY;
        if (e.touches && e.touches.length > 0) {
            clientX = e.touches[0].clientX;
            clientY = e.touches[0].clientY;
        } else {
            clientX = e.clientX;
            clientY = e.clientY;
        }
        
        const dx = clientX - startX;
        const dy = clientY - startY;
        
        widget.style.left = (startLeft + dx) + 'px';
        widget.style.top = (startTop + dy) + 'px';
    }
    
    function onEnd() {
        isMoving = false;
        document.removeEventListener('mousemove', onMove);
        document.removeEventListener('mouseup', onEnd);
        document.removeEventListener('touchmove', onMove);
        document.removeEventListener('touchend', onEnd);
    }
    
    needlePoint.removeEventListener('mousedown', onStart);
    needlePoint.removeEventListener('touchstart', onStart);
    needleLeg.removeEventListener('mousedown', onStart);
    needleLeg.removeEventListener('touchstart', onStart);
    
    needlePoint.addEventListener('mousedown', onStart);
    needlePoint.addEventListener('touchstart', onStart, { passive: false });
    needleLeg.addEventListener('mousedown', onStart);
    needleLeg.addEventListener('touchstart', onStart, { passive: false });
}

// --- WIDTH ADJUSTMENT (RADIUS) ---
function setupCompassWidthAdjuster() {
    const screw = document.getElementById('compass-width-screw');
    const widget = document.getElementById('floating-widget-compass');
    
    if (!screw || !widget) return;
    
    let isAdjusting = false;
    let startX = 0;
    let startROffset = 0;
    
    function onStart(e) {
        e.preventDefault();
        e.stopPropagation();
        
        isAdjusting = true;
        
        let clientX;
        if (e.touches && e.touches.length > 0) {
            clientX = e.touches[0].clientX;
        } else {
            clientX = e.clientX;
        }
        
        startX = clientX;
        startROffset = compassROffset;
        
        document.addEventListener('mousemove', onMove);
        document.addEventListener('mouseup', onEnd);
        document.addEventListener('touchmove', onMove, { passive: false });
        document.addEventListener('touchend', onEnd);
    }
    
    function onMove(e) {
        if (!isAdjusting) return;
        e.preventDefault();
        
        let clientX;
        if (e.touches && e.touches.length > 0) {
            clientX = e.touches[0].clientX;
        } else {
            clientX = e.clientX;
        }
        
        const widgetRect = widget.getBoundingClientRect();
        const scale = widgetRect.width / 200;
        
        const dxSvg = (clientX - startX) / scale;
        
        compassROffset = Math.round(startROffset + dxSvg / 2);
        compassROffset = Math.max(15, Math.min(90, compassROffset));
        
        renderCompassState();
    }
    
    function onEnd() {
        isAdjusting = false;
        document.removeEventListener('mousemove', onMove);
        document.removeEventListener('mouseup', onEnd);
        document.removeEventListener('touchmove', onMove);
        document.removeEventListener('touchend', onEnd);
    }
    
    screw.removeEventListener('mousedown', onStart);
    screw.removeEventListener('touchstart', onStart);
    screw.addEventListener('mousedown', onStart);
    screw.addEventListener('touchstart', onStart, { passive: false });
}

// --- ROTATE & DRAW ---
function setupCompassDrawHandler() {
    const head = document.getElementById('compass-head');
    const pencil = document.getElementById('compass-pencil');
    const pencilLeg = document.getElementById('compass-pencil-leg');
    const widget = document.getElementById('floating-widget-compass');
    const canvas = document.getElementById('drawing-canvas');
    
    if (!widget || !canvas) return;
    
    let isRotating = false;
    let startDragAngle = 0;
    let startCompassAngle = 0;
    let pivotX = 0;
    let pivotY = 0;
    let scale = 1;
    
    function onStart(e) {
        e.preventDefault();
        e.stopPropagation();
        
        isRotating = true;
        
        const viewport = document.getElementById('whiteboard-viewport');
        const viewportRect = viewport ? viewport.getBoundingClientRect() : { left: 0, top: 0 };
        
        const widgetLeft = parseFloat(widget.style.left) || 0;
        const widgetTop = parseFloat(widget.style.top) || 0;
        
        const widgetClientLeft = widgetLeft + viewportRect.left - (viewport ? viewport.scrollLeft : 0);
        const widgetClientTop = widgetTop + viewportRect.top - (viewport ? viewport.scrollTop : 0);
        
        const width = parseFloat(widget.style.width) || widget.offsetWidth || 130;
        scale = width / 200;
        
        // Coordinates of the needle tip (pivot center of circle)
        pivotX = widgetClientLeft + 60 * scale;
        pivotY = widgetClientTop + 220 * scale;
        
        const dx = e.clientX - pivotX;
        const dy = e.clientY - pivotY;
        startDragAngle = Math.atan2(dy, dx) * 180 / Math.PI;
        startCompassAngle = compassAngle;
        
        lastDrawnAngle = compassAngle;
        
        document.addEventListener('pointermove', onMove);
        document.addEventListener('pointerup', onEnd);
        document.addEventListener('pointercancel', onEnd);
    }
    
    function onMove(e) {
        if (!isRotating) return;
        e.preventDefault();
        
        const canvasRect = canvas.getBoundingClientRect();
        
        const dx = e.clientX - pivotX;
        const dy = e.clientY - pivotY;
        const currentDragAngle = Math.atan2(dy, dx) * 180 / Math.PI;
        
        const delta = currentDragAngle - startDragAngle;
        compassAngle = (startCompassAngle + delta + 360) % 360;
        
        renderCompassState();
        
        const canvasCenterX = pivotX - canvasRect.left;
        const canvasCenterY = pivotY - canvasRect.top;
        
        // Radius of pencil is exactly 2 * compassROffset
        const canvasRadius = (2 * compassROffset) * scale;
        
        let diff = compassAngle - lastDrawnAngle;
        if (diff > 180) diff -= 360;
        if (diff < -180) diff += 360;
        
        // Base starting offset angle in radians is now 0 since pencil point is at y=220
        const startRad = (lastDrawnAngle * Math.PI / 180);
        const endRad = startRad + (diff * Math.PI / 180);
        
        if (window.drawCompassArc) {
            window.drawCompassArc(canvasCenterX, canvasCenterY, canvasRadius, startRad, endRad);
        }
        
        lastDrawnAngle = compassAngle;
    }
    
    function onEnd(e) {
        if (!isRotating) return;
        isRotating = false;
        
        document.removeEventListener('pointermove', onMove);
        document.removeEventListener('pointerup', onEnd);
        document.removeEventListener('pointercancel', onEnd);
    }
    
    // Attach listeners to both head and pencil parts to trigger drawing
    if (head) {
        head.removeEventListener('pointerdown', onStart);
        head.addEventListener('pointerdown', onStart);
    }
    if (pencil) {
        pencil.removeEventListener('pointerdown', onStart);
        pencil.addEventListener('pointerdown', onStart);
    }
    if (pencilLeg) {
        pencilLeg.removeEventListener('pointerdown', onStart);
        pencilLeg.addEventListener('pointerdown', onStart);
    }
}

// Resize the Compass widget dynamically from the UI slider
function resizeCompassWidget(width) {
    const el = document.getElementById('floating-widget-compass');
    if (el) {
        el.style.width = width + 'px';
        el.style.height = (width * 1.3) + 'px'; // Maintain aspect ratio 200:260
        renderCompassState(); // Update label instantly based on new widget width scale
    }
}

// Accessors for saving/restoring tab state
window.getCompassAngle = () => compassAngle;
window.setCompassAngle = (val) => {
    compassAngle = val;
    renderCompassState();
};
window.getCompassROffset = () => compassROffset;
window.setCompassROffset = (val) => {
    compassROffset = val;
    renderCompassState();
};
