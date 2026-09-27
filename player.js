const video = document.getElementById("video");
const player = document.getElementById("player");
const volumeText = document.getElementById("volume-text");
const uploadScreen = document.getElementById("upload-screen");
const playBtn = document.getElementById("play-btn");

function togglePlay() {
    if (video.paused) {
        video.play();
    } 
    else {
        video.pause();
    }
}

function updateIcons() {
    playBtn.classList.toggle("playing", !video.paused);
}

video.addEventListener("play", updateIcons)
video.addEventListener("pause", updateIcons)
video.addEventListener("ended", updateIcons)
updateIcons();

function seekTo(fraction) {
    video.currentTime = fraction * video.duration;
}

function setVolume(fraction) {
    video.volume = Math.min(Math.max(fraction, 0), 1);
}

function showVolume() {
    volumeText.textContent = `${Math.round(video.volume * 100)}%`
}

document.getElementById("play-btn").addEventListener("click", togglePlay);
document.getElementById ("file-input").addEventListener("change", (e) => {
    const file = e.target.files[0];
    if (!file)
        return;
    video.src = URL.createObjectURL(file)
    uploadScreen.hidden = true;
    player.hidden = false;
    initSeekbar();
});