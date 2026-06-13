// Logic for La roue de la chance — roue.js

let roueStudents = [];
let roueDrawnStudentIds = [];
let roueIsSpinning = false;
let roueCurrentRotation = 0;
let roueAudioCtx = null;

const ROUE_COLORS = [
    "#4f46e5", // Indigo
    "#059669", // Emerald
    "#db2777", // Rose
    "#d97706", // Amber
    "#7c3aed", // Violet
    "#0d9488", // Teal
    "#dc2626", // Crimson
    "#0891b2", // Cyan
    "#ea580c", // Orange
    "#2563eb"  // Blue
];

// --- INITIALIZATION ---
function initRoueApp() {
    loadRoueStudents();
    renderRoueStudentList();
    drawRoueWheel();
    
    // Bind buttons and inputs
    const addInput = document.getElementById("roue-student-input");
    const addBtn = document.getElementById("roue-add-btn");
    
    if (addInput && addBtn) {
        // Remove old listeners to avoid duplicates
        const newAddBtn = addBtn.cloneNode(true);
        addBtn.parentNode.replaceChild(newAddBtn, addBtn);
        
        newAddBtn.addEventListener("click", () => {
            handleAddStudent();
        });
        
        addInput.onkeydown = (e) => {
            if (e.key === "Enter") {
                handleAddStudent();
            }
        };
    }
}

// Bind DOMContentLoaded to initialize
window.addEventListener('DOMContentLoaded', () => {
    // If roue tab is currently active (though normally home is active initially)
    if (document.getElementById("screen-roue") && document.getElementById("screen-roue").classList.contains("active")) {
        initRoueApp();
    }
});

// --- STORAGE MANAGEMENT ---
function loadRoueStudents() {
    const stored = localStorage.getItem('tbi_roue_students');
    if (stored) {
        try {
            roueStudents = JSON.parse(stored);
        } catch(e) {
            roueStudents = [];
        }
    } else {
        // Initial defaults for previewing
        roueStudents = [
            { id: "st-" + Date.now() + "-1", name: "Lucas", active: true },
            { id: "st-" + Date.now() + "-2", name: "Emma", active: true },
            { id: "st-" + Date.now() + "-3", name: "Mathis", active: true },
            { id: "st-" + Date.now() + "-4", name: "Léa", active: true },
            { id: "st-" + Date.now() + "-5", name: "Nathan", active: true },
            { id: "st-" + Date.now() + "-6", name: "Chloé", active: true },
            { id: "st-" + Date.now() + "-7", name: "Thomas", active: true },
            { id: "st-" + Date.now() + "-8", name: "Sarah", active: true }
        ];
        saveRoueStudents();
    }
    
    // Load active session drawn state
    const storedDrawn = sessionStorage.getItem('tbi_roue_drawn_ids');
    if (storedDrawn) {
        try {
            roueDrawnStudentIds = JSON.parse(storedDrawn);
        } catch(e) {
            roueDrawnStudentIds = [];
        }
    }
}

function saveRoueStudents() {
    localStorage.setItem('tbi_roue_students', JSON.stringify(roueStudents));
}

function saveRoueDrawnSession() {
    sessionStorage.setItem('tbi_roue_drawn_ids', JSON.stringify(roueDrawnStudentIds));
}

// --- STUDENT MANAGEMENT ---
function handleAddStudent() {
    const input = document.getElementById("roue-student-input");
    if (!input) return;
    
    const name = input.value.trim();
    if (!name) return;
    
    const newStudent = {
        id: "st-" + Date.now() + "-" + Math.floor(Math.random() * 1000),
        name: name,
        active: true
    };
    
    roueStudents.push(newStudent);
    saveRoueStudents();
    
    input.value = "";
    input.focus();
    
    renderRoueStudentList();
    drawRoueWheel();
}

function deleteRoueStudent(id) {
    roueStudents = roueStudents.filter(s => s.id !== id);
    roueDrawnStudentIds = roueDrawnStudentIds.filter(drawnId => drawnId !== id);
    
    saveRoueStudents();
    saveRoueDrawnSession();
    
    renderRoueStudentList();
    drawRoueWheel();
}

function toggleRoueStudentActive(id, active) {
    const student = roueStudents.find(s => s.id === id);
    if (student) {
        student.active = active;
        // If deactivated, ensure they are not marked as drawn
        if (!active) {
            roueDrawnStudentIds = roueDrawnStudentIds.filter(drawnId => drawnId !== id);
        }
        saveRoueStudents();
        saveRoueDrawnSession();
        
        renderRoueStudentList();
        drawRoueWheel();
    }
}

function toggleAllRoueStudents(active) {
    roueStudents.forEach(s => s.active = active);
    if (!active) {
        roueDrawnStudentIds = [];
    }
    saveRoueStudents();
    saveRoueDrawnSession();
    
    renderRoueStudentList();
    drawRoueWheel();
}

function clearAllRoueStudents() {
    if (confirm("Voulez-vous vraiment vider toute la liste des élèves ?")) {
        roueStudents = [];
        roueDrawnStudentIds = [];
        saveRoueStudents();
        saveRoueDrawnSession();
        
        renderRoueStudentList();
        drawRoueWheel();
    }
}

function resetRoueTirage() {
    roueDrawnStudentIds = [];
    saveRoueDrawnSession();
    
    renderRoueStudentList();
    drawRoueWheel();
}

// --- RENDER SIDEBAR LIST ---
function renderRoueStudentList() {
    const container = document.getElementById("roue-students-list");
    if (!container) return;
    
    container.innerHTML = "";
    
    if (roueStudents.length === 0) {
        container.innerHTML = `
            <div class="text-center py-6 text-neutral-400 font-sans font-semibold text-xs">
                Aucun élève encodé.<br>Saisissez des prénoms ci-dessus.
            </div>
        `;
        return;
    }
    
    // Sort by name
    const sorted = [...roueStudents].sort((a, b) => a.name.localeCompare(b.name));
    
    sorted.forEach(student => {
        const isDrawn = roueDrawnStudentIds.includes(student.id);
        
        const row = document.createElement("div");
        row.className = `flex items-center justify-between p-2 rounded-xl border-2 transition-all duration-150 ${
            isDrawn 
                ? "bg-neutral-100/70 border-neutral-200 opacity-60" 
                : student.active 
                    ? "bg-white border-neutral-900 shadow-[2px_2px_0_rgba(0,0,0,1)]" 
                    : "bg-neutral-50 border-neutral-300"
        }`;
        
        row.innerHTML = `
            <div class="flex items-center gap-2.5 min-w-0 flex-1 cursor-pointer select-none">
                <input type="checkbox" id="chk-${student.id}" ${student.active ? "checked" : ""} 
                    class="w-5 h-5 accent-indigo-600 rounded cursor-pointer border-2 border-neutral-950"
                    onclick="event.stopPropagation(); toggleRoueStudentActive('${student.id}', this.checked)" />
                <label for="chk-${student.id}" class="font-sans font-bold text-sm text-neutral-800 truncate cursor-pointer flex-1 ${isDrawn ? 'line-through text-neutral-400' : ''}">
                    ${student.name}
                    ${isDrawn ? '<span class="ml-1 text-[10px] bg-neutral-200 text-neutral-600 px-1.5 py-0.5 rounded font-mono uppercase">Tiré</span>' : ''}
                </label>
            </div>
            <button onclick="deleteRoueStudent('${student.id}')" 
                class="p-1 hover:bg-rose-50 text-rose-500 rounded-lg border border-transparent hover:border-rose-200 transition shrink-0 ml-2" 
                title="Supprimer">
                <i data-lucide="trash-2" class="w-4 h-4"></i>
            </button>
        `;
        
        // Let clicking the row label/blank area toggle checkbox
        row.querySelector(".flex").addEventListener("click", (e) => {
            if (e.target.tagName !== "INPUT") {
                const chk = row.querySelector("input");
                chk.checked = !chk.checked;
                toggleRoueStudentActive(student.id, chk.checked);
            }
        });
        
        container.appendChild(row);
    });
    
    // Re-trigger Lucide icons render
    if (window.lucide && typeof window.lucide.createIcons === 'function') {
        window.lucide.createIcons();
    }
}

// --- SVG HELPERS ---
function getRoueSlicePath(cx, cy, r, startAngleDegrees, endAngleDegrees) {
    const startRad = (startAngleDegrees * Math.PI) / 180;
    const endRad = (endAngleDegrees * Math.PI) / 180;
    
    const x1 = cx + r * Math.cos(startRad);
    const y1 = cy + r * Math.sin(startRad);
    const x2 = cx + r * Math.cos(endRad);
    const y2 = cy + r * Math.sin(endRad);
    
    const largeArcFlag = (endAngleDegrees - startAngleDegrees) > 180 ? 1 : 0;
    
    return `M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 ${largeArcFlag} 1 ${x2} ${y2} Z`;
}

// --- DRAW WHEEL ---
function getRoueActiveStudents() {
    // Checked and not drawn yet
    return roueStudents.filter(s => s.active && !roueDrawnStudentIds.includes(s.id));
}

function drawRoueWheel() {
    const wheelGroup = document.getElementById("roue-wheel-group");
    const container = document.getElementById("roue-wheel-container");
    const spinBtn = document.getElementById("roue-spin-btn");
    
    if (!wheelGroup || !container) return;
    
    // Clear wheel group
    wheelGroup.innerHTML = "";
    
    const activeStudents = getRoueActiveStudents();
    const N = activeStudents.length;
    
    // Enable/disable spin button
    if (spinBtn) {
        if (N === 0 || roueIsSpinning) {
            spinBtn.disabled = true;
            spinBtn.classList.add("opacity-50", "cursor-not-allowed");
        } else {
            spinBtn.disabled = false;
            spinBtn.classList.remove("opacity-50", "cursor-not-allowed");
        }
    }
    
    // Reset rotation style
    wheelGroup.setAttribute("transform", `rotate(${roueCurrentRotation}, 250, 250)`);
    
    if (N === 0) {
        // Show status message inside the wheel area
        const totalChecked = roueStudents.filter(s => s.active).length;
        let message = "Cochez des élèves à gauche pour commencer.";
        if (totalChecked > 0) {
            message = "Tous les élèves ont été tirés ! Cliquez sur 'Réinitialiser la roue'.";
        }
        
        wheelGroup.innerHTML = `
            <circle cx="250" cy="250" r="230" fill="#f5f5f5" stroke="#999" stroke-width="3" stroke-dasharray="8,8" />
            <text x="250" y="240" text-anchor="middle" dominant-baseline="middle" class="fill-neutral-400 font-sans font-bold text-sm">
                ${message.split(" ! ")[0]}
            </text>
            <text x="250" y="265" text-anchor="middle" dominant-baseline="middle" class="fill-neutral-400 font-sans font-bold text-xs">
                ${message.includes(" !") ? message.split(" ! ")[1] : ""}
            </text>
        `;
        return;
    }
    
    if (N === 1) {
        const student = activeStudents[0];
        const color = ROUE_COLORS[0];
        
        // Full circle
        const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        circle.setAttribute("cx", "250");
        circle.setAttribute("cy", "250");
        circle.setAttribute("r", "230");
        circle.setAttribute("fill", color);
        circle.setAttribute("stroke", "#171717");
        circle.setAttribute("stroke-width", "4");
        wheelGroup.appendChild(circle);
        
        // Single name in middle
        const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
        text.setAttribute("x", "250");
        text.setAttribute("y", "250");
        text.setAttribute("text-anchor", "middle");
        text.setAttribute("dominant-baseline", "middle");
        text.setAttribute("class", "fill-white font-display font-black text-2xl select-none");
        text.textContent = student.name;
        wheelGroup.appendChild(text);
        return;
    }
    
    const angleSpan = 360 / N;
    
    for (let i = 0; i < N; i++) {
        const student = activeStudents[i];
        const color = ROUE_COLORS[i % ROUE_COLORS.length];
        
        const startAngle = i * angleSpan;
        const endAngle = (i + 1) * angleSpan;
        const midAngle = startAngle + angleSpan / 2;
        
        // Slice Path
        const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
        const d = getRoueSlicePath(250, 250, 230, startAngle, endAngle);
        path.setAttribute("d", d);
        path.setAttribute("fill", color);
        path.setAttribute("stroke", "#171717");
        path.setAttribute("stroke-width", "3");
        wheelGroup.appendChild(path);
        
        // Radial text label
        const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
        text.setAttribute("x", "455"); // Placed near outer border (250 center + 230 radius = 480 outer edge)
        text.setAttribute("y", "250");
        text.setAttribute("transform", `rotate(${midAngle}, 250, 250)`);
        text.setAttribute("text-anchor", "end");
        text.setAttribute("dominant-baseline", "middle");
        text.setAttribute("class", "fill-white font-display font-black select-none pointer-events-none");
        
        // Adjust font size based on slice count for readability
        let fontSize = "16px";
        if (N > 15) fontSize = "11px";
        else if (N > 10) fontSize = "13px";
        else if (N > 6) fontSize = "15px";
        
        text.style.fontSize = fontSize;
        text.style.textShadow = "1px 1px 2px rgba(0,0,0,0.6)";
        
        // Limit length to avoid overlapping at center
        const maxLen = N > 12 ? 10 : 15;
        const displayName = student.name.length > maxLen ? student.name.substring(0, maxLen - 2) + ".." : student.name;
        text.textContent = displayName;
        
        wheelGroup.appendChild(text);
    }
}

// --- SOUND EFFECTS (WEB AUDIO) ---
function playRoueTickSound() {
    try {
        if (!roueAudioCtx) {
            roueAudioCtx = new (window.AudioContext || window.webkitAudioContext)();
        }
        if (roueAudioCtx.state === 'suspended') {
            roueAudioCtx.resume();
        }
        
        const osc = roueAudioCtx.createOscillator();
        const gain = roueAudioCtx.createGain();
        
        osc.connect(gain);
        gain.connect(roueAudioCtx.destination);
        
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(650, roueAudioCtx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(120, roueAudioCtx.currentTime + 0.04);
        
        gain.gain.setValueAtTime(0.12, roueAudioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, roueAudioCtx.currentTime + 0.04);
        
        osc.start();
        osc.stop(roueAudioCtx.currentTime + 0.04);
    } catch (e) {
        console.error("Web Audio ticking error", e);
    }
}

function playRoueVictorySound() {
    try {
        if (!roueAudioCtx) {
            roueAudioCtx = new (window.AudioContext || window.webkitAudioContext)();
        }
        if (roueAudioCtx.state === 'suspended') {
            roueAudioCtx.resume();
        }
        
        const now = roueAudioCtx.currentTime;
        const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
        
        notes.forEach((freq, idx) => {
            const osc = roueAudioCtx.createOscillator();
            const gain = roueAudioCtx.createGain();
            
            osc.connect(gain);
            gain.connect(roueAudioCtx.destination);
            
            osc.type = 'sine';
            osc.frequency.setValueAtTime(freq, now + idx * 0.12);
            
            gain.gain.setValueAtTime(0.15, now + idx * 0.12);
            gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.12 + 0.35);
            
            osc.start(now + idx * 0.12);
            osc.stop(now + idx * 0.12 + 0.45);
        });
    } catch (e) {
        console.error("Web Audio victory error", e);
    }
}

// --- SPIN LOGIC ---
function spinRoue() {
    if (roueIsSpinning) return;
    
    const activeStudents = getRoueActiveStudents();
    const N = activeStudents.length;
    if (N === 0) return;
    
    // Prepare Web Audio Context
    if (!roueAudioCtx) {
        roueAudioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (roueAudioCtx.state === 'suspended') {
        roueAudioCtx.resume();
    }
    
    roueIsSpinning = true;
    
    // Disable inputs and buttons during spin
    const spinBtn = document.getElementById("roue-spin-btn");
    if (spinBtn) {
        spinBtn.disabled = true;
        spinBtn.classList.add("opacity-50", "cursor-not-allowed");
    }
    document.querySelectorAll(".horaire-controls button, #roue-add-btn").forEach(btn => {
        btn.disabled = true;
    });
    
    // Select winner
    const winnerIdx = Math.floor(Math.random() * N);
    const winner = activeStudents[winnerIdx];
    
    // Spin physics
    const duration = 4000; // 4 seconds
    const startAngle = roueCurrentRotation % 360;
    
    // Calculate final angle to make the winner slice stop at the pointer (top = 270 degrees)
    // The relative midpoint of the winner slice is (winnerIdx + 0.5) * (360/N)
    const targetRelative = (winnerIdx + 0.5) * (360 / N);
    
    // finalAngle satisfies: (270 - finalAngle) = targetRelative mod 360
    // so finalAngle = 270 - targetRelative mod 360
    // Plus a few full spins (e.g. 6 full spins = 2160 degrees)
    const extraSpins = 360 * 6;
    const finalAngle = 270 - targetRelative + extraSpins;
    
    const startTime = performance.now();
    let lastTickAngle = startAngle;
    const anglePerTick = 360 / N;
    
    // Track tick index relative to rotation to play tick sounds precisely
    let lastTickIdx = Math.floor(((270 - startAngle) % 360 + 360) % 360 / anglePerTick);
    
    function animate(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing curve (ease-out cubic)
        const ease = 1 - Math.pow(1 - progress, 3);
        const currentAngle = startAngle + (finalAngle - startAngle) * ease;
        
        roueCurrentRotation = currentAngle;
        
        // Rotate SVG group
        const wheelGroup = document.getElementById("roue-wheel-group");
        if (wheelGroup) {
            wheelGroup.setAttribute("transform", `rotate(${currentAngle}, 250, 250)`);
        }
        
        // Ticking audio detection
        const currentTickIdx = Math.floor(((270 - currentAngle) % 360 + 360) % 360 / anglePerTick);
        if (currentTickIdx !== lastTickIdx && progress < 0.98) {
            playRoueTickSound();
            lastTickIdx = currentTickIdx;
        }
        
        if (progress < 1) {
            requestAnimationFrame(animate);
        } else {
            // Spin finished!
            roueIsSpinning = false;
            roueCurrentRotation = currentAngle % 360;
            
            // Keep it clean
            if (wheelGroup) {
                wheelGroup.setAttribute("transform", `rotate(${roueCurrentRotation}, 250, 250)`);
            }
            
            // Play victory sound and launch congratulations modal
            playRoueVictorySound();
            showRoueCongrats(winner);
        }
    }
    
    requestAnimationFrame(animate);
}

// --- CONGRATS OVERLAY & CONFETTI ---
let confettiAnimationId = null;

function showRoueCongrats(winner) {
    const overlay = document.getElementById("roue-congrats-overlay");
    const winnerNameEl = document.getElementById("roue-winner-name");
    
    if (!overlay || !winnerNameEl) return;
    
    winnerNameEl.textContent = winner.name;
    overlay.classList.remove("hidden", "opacity-0");
    overlay.classList.add("flex", "opacity-100");
    
    // Start confetti
    startRoueConfetti();
    
    // Setup close button handler
    const closeBtn = document.getElementById("roue-congrats-close");
    if (closeBtn) {
        closeBtn.onclick = () => {
            // Stop confetti
            stopRoueConfetti();
            
            // Hide overlay
            overlay.classList.add("hidden", "opacity-0");
            overlay.classList.remove("flex", "opacity-100");
            
            // Add winner to drawn list
            roueDrawnStudentIds.push(winner.id);
            saveRoueDrawnSession();
            
            // Re-render and redraw (winner disappears)
            renderRoueStudentList();
            drawRoueWheel();
            
            // Re-enable dashboard/wheel buttons
            const spinBtn = document.getElementById("roue-spin-btn");
            if (spinBtn) {
                spinBtn.disabled = false;
                spinBtn.classList.remove("opacity-50", "cursor-not-allowed");
            }
            document.querySelectorAll(".horaire-controls button, #roue-add-btn").forEach(btn => {
                btn.disabled = false;
            });
        };
    }
}

// Confetti Particle System
function startRoueConfetti() {
    const canvas = document.getElementById("roue-confetti-canvas");
    if (!canvas) return;
    
    const ctx = canvas.getContext("2d");
    
    // Resize canvas to cover window/screen
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);
    
    const colors = ["#f43f5e", "#3b82f6", "#10b981", "#eab308", "#8b5cf6", "#f97316", "#06b6d4"];
    const particles = [];
    const count = 120;
    
    for (let i = 0; i < count; i++) {
        particles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height - canvas.height,
            r: Math.random() * 6 + 4,
            d: Math.random() * count,
            color: colors[Math.floor(Math.random() * colors.length)],
            tilt: Math.random() * 10 - 5,
            tiltAngleIncremental: Math.random() * 0.07 + 0.02,
            tiltAngle: 0
        });
    }
    
    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        particles.forEach((p, idx) => {
            p.tiltAngle += p.tiltAngleIncremental;
            p.y += (Math.cos(p.d) + 3 + p.r / 2) / 2;
            p.x += Math.sin(p.tiltAngle);
            p.tilt = Math.sin(p.tiltAngle - idx / 3) * 15;
            
            // Draw piece of confetti
            ctx.beginPath();
            ctx.lineWidth = p.r;
            ctx.strokeStyle = p.color;
            ctx.moveTo(p.x + p.tilt + p.r / 2, p.y);
            ctx.lineTo(p.x + p.tilt, p.y + p.tilt + p.r / 2);
            ctx.stroke();
            
            // Reset piece if it goes off bottom
            if (p.y > canvas.height) {
                particles[idx] = {
                    x: Math.random() * canvas.width,
                    y: -20,
                    r: p.r,
                    d: p.d,
                    color: p.color,
                    tilt: p.tilt,
                    tiltAngleIncremental: p.tiltAngleIncremental,
                    tiltAngle: p.tiltAngle
                };
            }
        });
        
        confettiAnimationId = requestAnimationFrame(draw);
    }
    
    draw();
}

function stopRoueConfetti() {
    if (confettiAnimationId) {
        cancelAnimationFrame(confettiAnimationId);
        confettiAnimationId = null;
    }
    const canvas = document.getElementById("roue-confetti-canvas");
    if (canvas) {
        const ctx = canvas.getContext("2d");
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
}
