// Time Timer Logic — timer.js

// --- STATE MANAGEMENT ---
let timerDuration = 900; // Default: 15 minutes (in seconds)
let timerRemaining = 900;
let timerIntervalId = null;
let timerIsRunning = false;
let timerIsMuted = false;
let timerVolume = 0.5;
let timerActiveMode = 'silence'; // 'silence', 'chuchotement', 'groupe', 'presentation'

// Mode details (colors and styling)
const timerModes = {
    silence: { color: '#8b5cf6', name: 'Silence individuel', emoji: '🤫' },
    chuchotement: { color: '#10b981', name: 'Chuchotement (binôme)', emoji: '💬' },
    groupe: { color: '#f59e0b', name: 'Travail en groupe', emoji: '👥' },
    presentation: { color: '#ef4444', name: 'Écoute active (exposé)', emoji: '📢' }
};

// Web Audio API context for alarm sounds
let audioCtx = null;

// --- INITIALIZATION ---
function initWidgetTimer() {
    renderDial('widget-dial-ticks', 'widget-dial-labels');
    updateTimerUI();
    setupDragHandlers('widget-timer-svg');
}

function initFullscreenTimer() {
    renderDial('fullscreen-dial-ticks', 'fullscreen-dial-labels');
    updateTimerUI();
    setupDragHandlers('fullscreen-timer-svg');
}

// Generate the clock dial face (ticks and numbers)
function renderDial(ticksContainerId, labelsContainerId) {
    const ticksContainer = document.getElementById(ticksContainerId);
    const labelsContainer = document.getElementById(labelsContainerId);
    
    if (!ticksContainer || !labelsContainer || ticksContainer.children.length > 0) return;
    
    ticksContainer.innerHTML = '';
    labelsContainer.innerHTML = '';
    
    const rOuter = 225;
    
    // Draw 60 ticks
    for (let i = 0; i <= 60; i++) {
        // TBI Timer increases counter-clockwise, 0/60 at the top
        const angleDeg = - (i / 60) * 360;
        const rad = angleDeg * Math.PI / 180;
        
        const isMajor = (i % 5 === 0);
        const rInner = isMajor ? 202 : 214;
        
        const x1 = rOuter * Math.sin(rad);
        const y1 = -rOuter * Math.cos(rad);
        const x2 = rInner * Math.sin(rad);
        const y2 = -rInner * Math.cos(rad);
        
        // Tick Line
        const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        line.setAttribute('x1', x1.toFixed(1));
        line.setAttribute('y1', y1.toFixed(1));
        line.setAttribute('x2', x2.toFixed(1));
        line.setAttribute('y2', y2.toFixed(1));
        line.setAttribute('stroke', isMajor ? '#1e293b' : '#94a3b8');
        line.setAttribute('stroke-width', isMajor ? '3.5' : '1.5');
        ticksContainer.appendChild(line);
        
        // Numbers for 5, 10, 15... up to 60
        if (isMajor && i > 0) {
            const rText = 180;
            const xt = rText * Math.sin(rad);
            const yt = -rText * Math.cos(rad);
            
            const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
            text.setAttribute('x', xt.toFixed(1));
            text.setAttribute('y', yt.toFixed(1));
            text.setAttribute('text-anchor', 'middle');
            text.setAttribute('dominant-baseline', 'central');
            text.setAttribute('font-family', 'Fredoka, sans-serif');
            text.setAttribute('font-weight', 'bold');
            text.setAttribute('font-size', '28');
            text.setAttribute('fill', '#334155');
            text.textContent = i.toString();
            labelsContainer.appendChild(text);
        }
    }
}

// --- DRAG TO SET TIME LOGIC ---
function setupDragHandlers(svgId) {
    const svg = document.getElementById(svgId);
    if (!svg) return;
    
    let isDragging = false;
    
    function handleStart(e) {
        // Only drag with left click
        if (e.type === 'mousedown' && e.button !== 0) return;
        isDragging = true;
        initAudioContext(); // Ensure AudioContext is ready after interaction
        handleDrag(e);
        
        document.addEventListener('mousemove', handleMove);
        document.addEventListener('mouseup', handleEnd);
        document.addEventListener('touchmove', handleMove, { passive: false });
        document.addEventListener('touchend', handleEnd);
    }
    
    function handleMove(e) {
        if (!isDragging) return;
        e.preventDefault();
        handleDrag(e);
    }
    
    function handleEnd() {
        isDragging = false;
        document.removeEventListener('mousemove', handleMove);
        document.removeEventListener('mouseup', handleEnd);
        document.removeEventListener('touchmove', handleMove);
        document.removeEventListener('touchend', handleEnd);
    }
    
    function handleDrag(e) {
        const rect = svg.getBoundingClientRect();
        
        let clientX, clientY;
        if (e.touches && e.touches.length > 0) {
            clientX = e.touches[0].clientX;
            clientY = e.touches[0].clientY;
        } else {
            clientX = e.clientX;
            clientY = e.clientY;
        }
        
        // Center of the SVG dial
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        const dx = clientX - centerX;
        const dy = clientY - centerY;
        
        // Calculate angle. 12 o'clock is 0, clockwise is positive.
        // Math.atan2(dy, dx) returns angle starting from positive x-axis (3 o'clock).
        let angleRad = Math.atan2(dy, dx);
        let angleDeg = angleRad * 180 / Math.PI;
        
        // Convert to clockwise angle starting from 12 o'clock (0 to 360)
        let angle = (angleDeg + 90 + 360) % 360;
        
        // The Timer decreases counter-clockwise, meaning dragging counter-clockwise INCREASES time.
        // To set time, the angle measured clockwise represents the empty portion. 
        // The remaining portion (red wedge) starts at 12 o'clock and extends counter-clockwise.
        // So: 15 mins (9 o'clock) is 270 deg. (360 - 270) = 90 deg. 90/360 = 15/60.
        // Let's compute minutes based on counter-clockwise angle from top.
        let ccwAngle = (360 - angle) % 360;
        
        // Snap to nearest 30 seconds (0.5 minute)
        let minutes = Math.round((ccwAngle / 360 * 60) * 2) / 2;
        
        // Limit to 60 minutes, and don't allow 0 unless dragged close
        if (minutes > 60) minutes = 60;
        if (minutes < 0) minutes = 0;
        
        // Avoid snapping instantly from 0 to 60 or vice versa during close drag
        const distFromCenter = Math.sqrt(dx*dx + dy*dy);
        if (distFromCenter < 20) return; // ignore center clicks
        
        setTimerSeconds(minutes * 60);
    }
    
    // Add event listeners (remove old ones if re-initializing)
    svg.removeEventListener('mousedown', handleStart);
    svg.removeEventListener('touchstart', handleStart);
    
    svg.addEventListener('mousedown', handleStart);
    svg.addEventListener('touchstart', handleStart, { passive: true });
}

// --- UPDATE TIMER STATE ---
function setTimerSeconds(seconds) {
    if (timerIsRunning) {
        pauseTimerState();
    }
    
    timerDuration = seconds;
    timerRemaining = seconds;
    updateTimerUI();
}

function updateTimerUI() {
    // 1. Calculate wedge path
    // Wedge covers the remaining time. Max 60 minutes = 360 degrees.
    const minutes = timerRemaining / 60;
    const angleRad = - (minutes / 60) * 2 * Math.PI;
    
    const r = 210; // Wedge radius
    const x = r * Math.sin(angleRad);
    const y = -r * Math.cos(angleRad);
    
    // Large arc flag: 1 if angle is larger than 180 degrees (30 minutes)
    const largeArcFlag = minutes > 30 ? 1 : 0;
    
    // SVG Path: Move to center (0,0), line to top (0,-r), arc counter-clockwise to (x,y), close path
    const pathD = minutes <= 0 ? 'M 0 0 Z' : `M 0 0 L 0 -${r} A ${r} ${r} 0 ${largeArcFlag} 0 ${x.toFixed(1)} ${y.toFixed(1)} Z`;
    
    // Get active wedge color
    const activeColor = timerModes[timerActiveMode].color;
    
    // Update SVG Wedges
    const widgetWedge = document.getElementById('widget-timer-wedge');
    const fullscreenWedge = document.getElementById('fullscreen-timer-wedge');
    if (widgetWedge) {
        widgetWedge.setAttribute('d', pathD);
        widgetWedge.style.fill = activeColor;
    }
    if (fullscreenWedge) {
        fullscreenWedge.setAttribute('d', pathD);
        fullscreenWedge.style.fill = activeColor;
    }
    
    // Update needles
    const widgetNeedle = document.getElementById('widget-timer-needle');
    const fullscreenNeedle = document.getElementById('fullscreen-timer-needle');
    
    // Needle position matches the current set time
    const needleAngle = - (minutes / 60) * 360;
    if (widgetNeedle) widgetNeedle.setAttribute('transform', `rotate(${needleAngle.toFixed(1)})`);
    if (fullscreenNeedle) fullscreenNeedle.setAttribute('transform', `rotate(${needleAngle.toFixed(1)})`);
    
    // 2. Update digital displays
    const minPart = Math.floor(timerRemaining / 60);
    const secPart = Math.floor(timerRemaining % 60);
    const timeString = `${minPart.toString().padStart(2, '0')}:${secPart.toString().padStart(2, '0')}`;
    
    const widgetDigital = document.getElementById('widget-timer-digital');
    const fullscreenDigital = document.getElementById('fullscreen-timer-digital');
    if (widgetDigital) widgetDigital.textContent = timeString;
    if (fullscreenDigital) fullscreenDigital.textContent = timeString;
}

// --- CONTROL ACTIONS ---
function startTimerState() {
    if (timerRemaining <= 0) return;
    if (timerIsRunning) return;
    
    timerIsRunning = true;
    initAudioContext();
    
    // Toggle play/pause buttons
    toggleControlButtons(true);
    
    // Start interval
    timerIntervalId = setInterval(() => {
        timerRemaining--;
        
        if (timerRemaining <= 0) {
            timerRemaining = 0;
            updateTimerUI();
            triggerAlarm();
            pauseTimerState();
        } else {
            updateTimerUI();
        }
    }, 1000);
}

function pauseTimerState() {
    timerIsRunning = false;
    if (timerIntervalId) {
        clearInterval(timerIntervalId);
        timerIntervalId = null;
    }
    toggleControlButtons(false);
}

function resetTimerState() {
    pauseTimerState();
    timerRemaining = timerDuration;
    updateTimerUI();
}

function toggleControlButtons(isRunning) {
    const wPlay = document.getElementById('btn-widget-play');
    const wPause = document.getElementById('btn-widget-pause');
    const fPlay = document.getElementById('btn-fullscreen-play');
    const fPause = document.getElementById('btn-fullscreen-pause');
    
    if (isRunning) {
        if (wPlay) wPlay.classList.add('hidden');
        if (wPause) wPause.classList.remove('hidden');
        if (fPlay) fPlay.classList.add('hidden');
        if (fPause) fPause.classList.remove('hidden');
    } else {
        if (wPlay) wPlay.classList.remove('hidden');
        if (wPause) wPause.classList.add('hidden');
        if (fPlay) fPlay.classList.remove('hidden');
        if (fPause) fPause.classList.add('hidden');
    }
}

// --- WIDGET EXPOSED API ---
function startWidgetTimer() { startTimerState(); }
function pauseWidgetTimer() { pauseTimerState(); }
function resetWidgetTimer() { resetTimerState(); }
function setWidgetPreset(minutes) { setTimerSeconds(minutes * 60); }

// --- FULLSCREEN EXPOSED API ---
function startFullscreenTimer() { startTimerState(); }
function pauseFullscreenTimer() { pauseTimerState(); }
function resetFullscreenTimer() { resetTimerState(); }
function setFullscreenPreset(minutes) { setTimerSeconds(minutes * 60); }

function showCustomFullscreenTimePrompt() {
    const res = prompt("Entrez la durée souhaitée en minutes (1 à 60) :", Math.round(timerDuration / 60));
    if (res !== null) {
        const val = parseFloat(res);
        if (!isNaN(val) && val > 0 && val <= 60) {
            setTimerSeconds(Math.round(val * 60));
        } else {
            alert("Veuillez entrer une valeur valide entre 1 et 60.");
        }
    }
}

// --- WORK MODE SELECTION ---
function setWorkMode(mode) {
    if (!timerModes[mode]) return;
    timerActiveMode = mode;
    
    // Update active class on buttons
    document.querySelectorAll('.mode-btn').forEach(btn => {
        if (btn.getAttribute('data-mode') === mode) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
    
    // Update the color of the wedge immediately
    updateTimerUI();
    
    // Update the page title container or background border color to reinforce the rule visually
    const screenTimer = document.getElementById('screen-timer');
    if (screenTimer) {
        // Apply a thick border or soft glow based on mode
        screenTimer.style.borderColor = timerModes[mode].color;
        // We can add a class or soft background matching the active mode
        const rgb = hexToRgb(timerModes[mode].color);
        screenTimer.style.backgroundColor = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.02)`;
    }
}

function hexToRgb(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : { r: 253, g: 251, b: 247 };
}

// --- SOUND AND VOLUME ---
function initAudioContext() {
    if (audioCtx === null) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (audioCtx.state === 'suspended') {
        audioCtx.resume();
    }
}

function toggleMute() {
    timerIsMuted = !timerIsMuted;
    
    const iconEl = document.getElementById('sound-icon-element');
    const btnEl = document.getElementById('sound-btn');
    
    if (timerIsMuted) {
        if (iconEl) iconEl.setAttribute('data-lucide', 'volume-x');
        if (btnEl) btnEl.classList.add('bg-rose-100', 'text-rose-700', 'border-rose-300');
    } else {
        if (iconEl) iconEl.setAttribute('data-lucide', 'volume-2');
        if (btnEl) btnEl.classList.remove('bg-rose-100', 'text-rose-700', 'border-rose-300');
        // Play a soft test chime
        triggerChime(523.25, 0.15, 0.15); // C5
    }
    
    if (typeof lucide !== 'undefined') lucide.createIcons();
}

function setVolume(val) {
    timerVolume = parseFloat(val);
    if (timerVolume > 0 && timerIsMuted) {
        toggleMute(); // unmute if user adjusts volume slider
    }
}

function triggerChime(freq, duration, volumeFactor) {
    if (timerIsMuted || !audioCtx) return;
    
    try {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
        
        // Beautiful volume envelope
        gain.gain.setValueAtTime(0, audioCtx.currentTime);
        gain.gain.linearRampToValueAtTime(timerVolume * volumeFactor, audioCtx.currentTime + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + duration);
        
        osc.start(audioCtx.currentTime);
        osc.stop(audioCtx.currentTime + duration);
    } catch (e) {
        console.error("Audio Synthesis error:", e);
    }
}

function triggerAlarm() {
    if (timerIsMuted) return;
    
    initAudioContext();
    
    // Make a beautiful triple retro school bell chime (C5 -> E5 -> G5)
    setTimeout(() => triggerChime(523.25, 1.2, 0.8), 0);    // C5
    setTimeout(() => triggerChime(659.25, 1.2, 0.8), 250);  // E5
    setTimeout(() => triggerChime(783.99, 1.6, 0.8), 500);  // G5
    
    // Play a secondary lower chime chord 1.2 seconds later
    setTimeout(() => {
        triggerChime(523.25, 1.5, 0.6); // C5
        triggerChime(783.99, 2.0, 0.6); // G5
    }, 1200);
}

// Auto init when script loads (for tabs checks)
window.addEventListener('load', () => {
    // Initialize defaults on timers
    setTimeout(() => {
        initWidgetTimer();
        initFullscreenTimer();
    }, 100);
});
