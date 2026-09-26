const video = document.getElementById("video");
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
video.addEventListener("paused", updateIcons)
video.addEventListener("ended", updateIcons)
updateIcons();

function seekTo(fraction) {
    video.currentTime = fraction * video.duration;
}

function setVolume(fraction) {
    video.volume = Math.min(Math.max(fraction, 0), 1);
}

document.getElementById("play-btn").addEventListener("click", togglePlay);
document.getElementById ("file-input").addEventListener("change", (e) => {
    const file = e.target.files[0];
    if (file)
        video.src = URL.createObjectURL(file)
});