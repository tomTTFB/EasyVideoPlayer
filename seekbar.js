const canvas = document.getElementById("seek-canvas")
const ctx = canvas.getContext("2d");

const segments = 12;
const segmentLength = 10;
const gravity = 0.4;
const friction = 0.99;
const passes = 15;

let anchorX = 0;
let anchorY = 20;
let points = [];
let dot = null;
let dragging = false;
let downX = 0;
let downY = 0;
let respawned = false;

function resize() {
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;
}

function barY() {
    return canvas.height - 10;
}

function createRope() {
    points = [];
    for (let i = 0; i <= segments; i++) {
        const y = anchorY + i * segmentLength;
        points.push({ x: anchorX, y, oldX: anchorX, oldY: y });
    }
    dot = null;
}

function move(p) {
    const vx = (p.x - p.oldX) * friction;
    const vy = (p.y - p.oldY) * friction;
    p.oldX = p.x;
    p.oldY = p.y;
    p.x += vx;
    p.y += vy + gravity;
}

function constrain() {
    for (let i = 0; i < points.length - 1; i++) {
        const a = points[i];
        const b = points[i + 1];
        const dx = b.x - a.x;
        const dy = b.y - a.y;
        const dist = Math.hypot(dx, dy) || 0.001;
        const diff = (dist - segmentLength) / dist * 0.5;
        a.x += dx * diff;
        a.y += dy * diff;
        b.x -= dx * diff;
        b.y -= dy * diff;
    }
    points[0].x = anchorX;
    points[0].y = anchorY;
}

function drop() {
    const end = points[points.length - 1];
    dot = { x: end.x, y: end.y, oldX: end.oldX, oldY: end.oldY, landed: false };
}

function updateDot() {
    if (dot.landed) {
        if (video.duration)
            dot.x = video.currentTime / video.duration * canvas.width;
        return;
    }
    move(dot);
    if (dot.y >= barY()) {
        dot.y = barY();
        dot.x = Math.min(Math.max(dot.x, 0), canvas.width);
        dot.landed = true;
        seekTo(dot.x / canvas.width);
    }
}

function circle(x, y, r, colour) {
    ctx.fillStyle = colour;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const y = barY();
    ctx.lineWidth = 4;
    ctx.lineCap = "round";
    ctx.strokeStyle = "rgba(255, 255, 255, 0.3)";
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(canvas.width, y);
    ctx.stroke();

    if (video.duration) {
        ctx.strokeStyle = "#ff3b3b";
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(video.currentTime / video.duration * canvas.width, y);
        ctx.stroke();
    }

    ctx.lineWidth = 2;
    ctx.strokeStyle = "#ffffff";
    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);
    for (const p of points)
        ctx.lineTo(p.x, p.y);
    ctx.stroke();

    circle(anchorX, anchorY, 6, "#888888");

    const d = dot || points[points.length - 1];
    circle(d.x, d.y, 8, "#ffffff");
}

function loop() {
    for (let i = 1; i < points.length; i++)
        move(points[i]);
    for (let i = 0; i < passes; i++)
        constrain();
    if (dot)
        updateDot();
    draw();
    requestAnimationFrame(loop);
}

canvas.addEventListener("pointerdown", (e) => {
    downX = e.offsetX;
    downY = e.offsetY;
    respawned = false;
    if (Math.hypot(e.offsetX - anchorX, e.offsetY - anchorY) < 20) {
        dragging = true;
        if (dot) {
            dot = null;
            respawned = true;
        }
        canvas.setPointerCapture(e.pointerId);
    }
});

canvas.addEventListener("pointermove", (e) => {
    if (!dragging)
        return;
    anchorX = Math.min(Math.max(e.offsetX, 0), canvas.width);
    anchorY = Math.min(Math.max(e.offsetY, 0), canvas.height);
});

canvas.addEventListener("pointerup", (e) => {
    dragging = false;
    if (!respawned && Math.hypot(e.offsetX - downX, e.offsetY - downY) < 5) {
        if (dot)
            dot = null;
        else
            drop();
    }
});

window.addEventListener("keydown", (e) => {
    if (e.code !== "Space" || player.hidden)
        return;
    e.preventDefault();
    if (!dot)
        drop();
});

window.addEventListener("resize", resize);

function initSeekbar() {
    resize();
    anchorX = canvas.width / 2;
    createRope();
}

initSeekbar();
requestAnimationFrame(loop);
