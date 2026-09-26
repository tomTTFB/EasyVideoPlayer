const volumeBtn = document.getElementById("volume-btn");
const volumeLabel = document.getElementById("volume-label");
const clickTarget = document.getElementById("click-target");
const timerLabel = document.getElementById("volume-timer");
const popup = document.getElementById("volume-popup");

const duration = 10000;
let clicks = 0;
let counting = false;

function showVolume() {
    volumeBtn.textContent = `Volume: ${Math.round(video.volume * 100)}`;
}
video.addEventListener("volumechange", showVolume);
showVolume();

volumeBtn.addEventListener("click", () => {
    if (counting)
        return;
    popup.hidden = false;
    clicks = 0;
    counting = true;
    volumeLabel.textContent = "0 Clicks";
    const start = Date.now();

    const tick = setInterval(() => {
        const left = Math.max(0, duration - (Date.now() - start));
        timerLabel.textContent = `${(left / 1000).toFixed(1)}s`;
    }, 100);

    setTimeout(() => {
        clearInterval(tick);
        counting = false;
        const percent = Math.min(clicks, 100);
        setVolume(percent / 100);
        timerLabel.textContent = `Volume set to ${percent}%. Easy!`;
        setTimeout(() => popup.hidden = true, 1500);
    }, duration);
});

clickTarget.addEventListener("click", () => {
    if (!counting)
        return;
    clicks++;
    volumeLabel.textContent = `${clicks} clicks...`;
});