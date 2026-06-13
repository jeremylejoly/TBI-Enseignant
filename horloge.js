// Logic for the Interactive Clock Widget

let clockTime = { hours: 10, minutes: 0, seconds: 0 };
let clockFreeMode = false;
let clockDigitalVisible = true;

// Drag state
let activeHand = null;
let initialPointerAngle = 0;
let initialTimeInSeconds = 0;
let initialHandAngles = { hour: 0, minute: 0, second: 0 };
let currentHandAngles = { hour: 300, minute: 0, second: 0 }; // 10:00:00 default

function initHorloge() {
    const svgEl = document.getElementById('horloge-svg');
    if (!svgEl) return;
    
    // 1. Generate SVG ticks and numbers if not already generated
    generateClockTicks();
    generateClockNumbers();
    
    // 2. Initialize hands rotation angles from clockTime
    syncAnglesFromTime();
    updateClockHandsUI();
    
    // 3. Attach pointer events for dragging hands
    setupHandDragEvents();
}

function generateClockTicks() {
    const ticksGroup = document.getElementById('clock-ticks');
    if (!ticksGroup || ticksGroup.children.length > 0) return;
    
    for (let i = 0; i < 60; i++) {
        const angle = i * 6;
        const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        const isHour = (i % 5 === 0);
        
        line.setAttribute('x1', '100');
        line.setAttribute('y1', '5');
        line.setAttribute('x2', '100');
        line.setAttribute('y2', isHour ? '15' : '10');
        line.setAttribute('stroke', isHour ? '#0f172a' : '#94a3b8');
        line.setAttribute('stroke-width', isHour ? '2.5' : '1.2');
        line.setAttribute('transform', `rotate(${angle}, 100, 100)`);
        ticksGroup.appendChild(line);
    }
}

function generateClockNumbers() {
    const numbersGroup = document.getElementById('clock-numbers');
    const numbersGroup24 = document.getElementById('clock-numbers-24');
    
    if (numbersGroup && numbersGroup.children.length === 0) {
        for (let i = 1; i <= 12; i++) {
            const angle = (i * 30 - 90) * Math.PI / 180;
            const r = 75; // Radius for main numbers
            const x = 100 + r * Math.cos(angle);
            const y = 100 + r * Math.sin(angle);
            
            const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
            text.setAttribute('x', x.toFixed(1));
            text.setAttribute('y', (y + 1).toFixed(1)); // tiny vertical adjustments for alignment
            text.textContent = i.toString();
            numbersGroup.appendChild(text);
        }
    }
    
    if (numbersGroup24 && numbersGroup24.children.length === 0) {
        for (let i = 1; i <= 12; i++) {
            const angle = (i * 30 - 90) * Math.PI / 180;
            const r = 56; // Radius for afternoon numbers
            const x = 100 + r * Math.cos(angle);
            const y = 100 + r * Math.sin(angle);
            
            const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
            text.setAttribute('x', x.toFixed(1));
            text.setAttribute('y', (y + 1).toFixed(1));
            text.textContent = (i + 12).toString();
            numbersGroup24.appendChild(text);
        }
    }
}

function syncAnglesFromTime() {
    const h = clockTime.hours;
    const m = clockTime.minutes;
    const s = clockTime.seconds;
    
    if (clockFreeMode) {
        currentHandAngles.hour = (h % 12) * 30;
        currentHandAngles.minute = m * 6;
        currentHandAngles.second = s * 6;
    } else {
        currentHandAngles.second = s * 6;
        currentHandAngles.minute = m * 6 + s * 0.1;
        currentHandAngles.hour = (h % 12) * 30 + m * 0.5 + s * (0.5 / 60);
    }
}

function updateClockHandsUI() {
    const hHand = document.getElementById('hour-hand');
    const hTarget = document.getElementById('hour-hand-target');
    const mHand = document.getElementById('minute-hand');
    const mTarget = document.getElementById('minute-hand-target');
    const sHand = document.getElementById('second-hand');
    const sTarget = document.getElementById('second-hand-target');
    
    if (hHand) {
        hHand.setAttribute('transform', `rotate(${currentHandAngles.hour}, 100, 100)`);
        if (hTarget) hTarget.setAttribute('transform', `rotate(${currentHandAngles.hour}, 100, 100)`);
    }
    if (mHand) {
        mHand.setAttribute('transform', `rotate(${currentHandAngles.minute}, 100, 100)`);
        if (mTarget) mTarget.setAttribute('transform', `rotate(${currentHandAngles.minute}, 100, 100)`);
    }
    if (sHand) {
        sHand.setAttribute('transform', `rotate(${currentHandAngles.second}, 100, 100)`);
        if (sTarget) sTarget.setAttribute('transform', `rotate(${currentHandAngles.second}, 100, 100)`);
    }
    
    // Update digital display
    const digitalDisplay = document.getElementById('digital-clock-display');
    if (digitalDisplay) {
        const hh = String(clockTime.hours).padStart(2, '0');
        const mm = String(clockTime.minutes).padStart(2, '0');
        const ss = String(clockTime.seconds).padStart(2, '0');
        digitalDisplay.textContent = `${hh}:${mm}:${ss}`;
    }
}

function setupHandDragEvents() {
    const svgEl = document.getElementById('horloge-svg');
    if (!svgEl) return;
    
    const dragTargets = [
        { id: 'hour-hand', name: 'hour' },
        { id: 'hour-hand-target', name: 'hour' },
        { id: 'minute-hand', name: 'minute' },
        { id: 'minute-hand-target', name: 'minute' },
        { id: 'second-hand', name: 'second' },
        { id: 'second-hand-target', name: 'second' }
    ];
    
    dragTargets.forEach(target => {
        const el = document.getElementById(target.id);
        if (!el) return;
        
        el.addEventListener('pointerdown', (e) => {
            e.preventDefault();
            e.stopPropagation();
            
            activeHand = target.name;
            svgEl.setPointerCapture(e.pointerId);
            
            const coords = getLocalSVGCoords(e, svgEl);
            const dx = coords.x - 100;
            const dy = coords.y - 100;
            initialPointerAngle = Math.atan2(dy, dx) * 180 / Math.PI + 90;
            if (initialPointerAngle < 0) initialPointerAngle += 360;
            
            initialTimeInSeconds = clockTime.hours * 3600 + clockTime.minutes * 60 + clockTime.seconds;
            initialHandAngles = { ...currentHandAngles };
        });
    });
    
    svgEl.addEventListener('pointermove', (e) => {
        if (!activeHand) return;
        e.preventDefault();
        
        const coords = getLocalSVGCoords(e, svgEl);
        const dx = coords.x - 100;
        const dy = coords.y - 100;
        let currentPointerAngle = Math.atan2(dy, dx) * 180 / Math.PI + 90;
        if (currentPointerAngle < 0) currentPointerAngle += 360;
        
        let deltaAngle = currentPointerAngle - initialPointerAngle;
        if (deltaAngle > 180) deltaAngle -= 360;
        if (deltaAngle < -180) deltaAngle += 360;
        
        if (clockFreeMode) {
            // Free mode: rotate only the active hand and snap values
            if (activeHand === 'second') {
                let newAngle = (initialHandAngles.second + deltaAngle + 3600) % 360;
                currentHandAngles.second = newAngle;
                clockTime.seconds = Math.round(newAngle / 6) % 60;
            } else if (activeHand === 'minute') {
                let newAngle = (initialHandAngles.minute + deltaAngle + 3600) % 360;
                currentHandAngles.minute = newAngle;
                clockTime.minutes = Math.round(newAngle / 6) % 60;
            } else if (activeHand === 'hour') {
                let newAngle = (initialHandAngles.hour + deltaAngle + 3600) % 360;
                currentHandAngles.hour = newAngle;
                let hour12 = Math.round(newAngle / 30) % 12;
                
                // Keep afternoon context if initial hour was PM
                let wasPm = clockTime.hours >= 12;
                clockTime.hours = wasPm ? (hour12 + 12) : hour12;
            }
        } else {
            // Linked mode: updates all hands based on active hand's gears
            if (activeHand === 'second') {
                let deltaSeconds = deltaAngle / 6;
                let newTimeSecs = Math.round(initialTimeInSeconds + deltaSeconds);
                newTimeSecs = (newTimeSecs % 86400 + 86400) % 86400;
                setTimeFromSeconds(newTimeSecs);
            } else if (activeHand === 'minute') {
                let deltaMinutes = deltaAngle / 6;
                let newTimeSecs = Math.round(initialTimeInSeconds + deltaMinutes * 60);
                newTimeSecs = (newTimeSecs % 86400 + 86400) % 86400;
                setTimeFromSeconds(newTimeSecs);
            } else if (activeHand === 'hour') {
                let deltaHours = deltaAngle / 30;
                let newTimeSecs = Math.round(initialTimeInSeconds + deltaHours * 3600);
                newTimeSecs = (newTimeSecs % 86400 + 86400) % 86400;
                setTimeFromSeconds(newTimeSecs);
            }
        }
        
        updateClockHandsUI();
        
        // Save state
        if (typeof window.saveActiveTabState === 'function') {
            window.saveActiveTabState();
        }
    });
    
    const stopDrag = (e) => {
        if (!activeHand) return;
        try {
            svgEl.releasePointerCapture(e.pointerId);
        } catch(err) {}
        activeHand = null;
    };
    
    svgEl.addEventListener('pointerup', stopDrag);
    svgEl.addEventListener('pointercancel', stopDrag);
}

function getLocalSVGCoords(e, svgEl) {
    const pt = svgEl.createSVGPoint();
    pt.x = e.clientX;
    pt.y = e.clientY;
    const svgP = pt.matrixTransform(svgEl.getScreenCTM().inverse());
    return { x: svgP.x, y: svgP.y };
}

function setTimeFromSeconds(totalSecs) {
    const h = Math.floor(totalSecs / 3600) % 24;
    const m = Math.floor((totalSecs % 3600) / 60);
    const s = totalSecs % 60;
    
    clockTime.hours = h;
    clockTime.minutes = m;
    clockTime.seconds = s;
    
    syncAnglesFromTime();
}

function setClockTime(time) {
    if (!time) return;
    clockTime.hours = time.hours !== undefined ? time.hours : 10;
    clockTime.minutes = time.minutes !== undefined ? time.minutes : 0;
    clockTime.seconds = time.seconds !== undefined ? time.seconds : 0;
    syncAnglesFromTime();
    updateClockHandsUI();
}

function getClockTime() {
    return { ...clockTime };
}

function adjustClockTime(minutesDelta) {
    let currentSecs = clockTime.hours * 3600 + clockTime.minutes * 60 + clockTime.seconds;
    let newSecs = currentSecs + minutesDelta * 60;
    newSecs = (newSecs % 86400 + 86400) % 86400;
    setTimeFromSeconds(newSecs);
    updateClockHandsUI();
    
    // Save state
    if (typeof window.saveActiveTabState === 'function') {
        window.saveActiveTabState();
    }
}

function setClockFreeMode(free) {
    clockFreeMode = !!free;
    // Sync angles from time to avoid visual snaps when going linked -> free or free -> linked
    syncAnglesFromTime();
    updateClockHandsUI();
    
    // Save state
    if (typeof window.saveActiveTabState === 'function') {
        window.saveActiveTabState();
    }
}

function getClockFreeMode() {
    return clockFreeMode;
}

function toggleDigitalDisplay() {
    setClockDigitalVisible(!clockDigitalVisible);
    
    // Save state
    if (typeof window.saveActiveTabState === 'function') {
        window.saveActiveTabState();
    }
}

function setClockDigitalVisible(visible) {
    clockDigitalVisible = !!visible;
    const displayEl = document.getElementById('digital-clock-display');
    const eyeIcon = document.getElementById('digital-eye-icon');
    const btnEl = document.getElementById('btn-toggle-digital');
    
    if (displayEl) {
        if (clockDigitalVisible) {
            displayEl.classList.remove('invisible');
            displayEl.style.opacity = '1';
        } else {
            // Keep layout but hide content to avoid resizing of the widget
            displayEl.classList.add('invisible');
            displayEl.style.opacity = '0';
        }
    }
    
    if (eyeIcon) {
        if (clockDigitalVisible) {
            eyeIcon.setAttribute('data-lucide', 'eye');
        } else {
            eyeIcon.setAttribute('data-lucide', 'eye-off');
        }
        if (typeof lucide !== 'undefined' && typeof lucide.createIcons === 'function') {
            lucide.createIcons();
        }
    }
    
    if (btnEl) {
        if (clockDigitalVisible) {
            btnEl.classList.remove('bg-indigo-100', 'text-indigo-900');
            btnEl.classList.add('bg-neutral-100');
        } else {
            btnEl.classList.add('bg-indigo-100', 'text-indigo-900');
            btnEl.classList.remove('bg-neutral-100');
        }
    }
}

function getClockDigitalVisible() {
    return clockDigitalVisible;
}

// Publish globals
window.initHorloge = initHorloge;
window.getClockTime = getClockTime;
window.setClockTime = setClockTime;
window.adjustClockTime = adjustClockTime;
window.setClockFreeMode = setClockFreeMode;
window.getClockFreeMode = getClockFreeMode;
window.toggleDigitalDisplay = toggleDigitalDisplay;
window.setClockDigitalVisible = setClockDigitalVisible;
window.getClockDigitalVisible = getClockDigitalVisible;
