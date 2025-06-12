// Get references to the audio element and the music toggle container
const backgroundMusic = document.getElementById('backgroundMusic'); // Assumes an <audio id="backgroundMusic"> element exists elsewhere
const musicToggleContainer = document.querySelector('.music-toggle'); // Select the div with class 'music-toggle'
const musicIcon = musicToggleContainer ? musicToggleContainer.querySelector('i') : null; // Get the <i> element inside it

/**
 * Toggles the playback state of the background music and updates the button icon.
 * @param {string} newState - 'play' to play music, 'pause' to pause music.
 */
const musicFiles = [
    ''

];

/**
 * Selects a random song from the list and plays it.
 */
function playRandomMusic() {
    if (musicFiles.length === 0) {
        console.warn("No music files available to play.");
        return;
    }
    const randomIndex = Math.floor(Math.random() * musicFiles.length);
    const randomSong = musicFiles[randomIndex];
    backgroundMusic.src = randomSong; // Set the new source
    backgroundMusic.load(); // Load the new song
    backgroundMusic.play().then(() => {
        musicIcon.className = "gg-play-pause-o"; // Ensure icon is 'pause'
        musicToggleContainer.classList.add('active-music');
        console.log("Now playing:", randomSong);
    }).catch(error => {
        console.warn("Autoplay prevented for random song:", error);
        musicIcon.className = "gg-play-button-o"; // Ensure icon is 'play'
        musicToggleContainer.classList.remove('active-music');
    });
}

/**
 * Toggles the playback state of the background music and updates the button icon.
 * This function will now also ensure random playback is initiated or paused.
 * @param {string} newState - 'play' to play music, 'pause' to pause music.
 */
function toggleMusic(newState) {
    if (!backgroundMusic || !musicIcon || !musicToggleContainer) {
        console.error("Missing audio element or music toggle elements. Cannot toggle music.");
        return;
    }

    if (newState === "play") {
        if (backgroundMusic.src === "") { // If no song is loaded yet, play a random one
            playRandomMusic();
        } else {
            backgroundMusic.play().then(() => {
                musicIcon.className = "gg-play-pause-o";
                musicToggleContainer.classList.add('active-music');
                console.log("Music playing.");
            }).catch(error => {
                console.warn("Autoplay was prevented:", error);
                musicIcon.className = "gg-play-button-o";
                musicToggleContainer.classList.remove('active-music');
            });
        }
    } else if (newState === "pause") {
        backgroundMusic.pause();
        musicIcon.className = "gg-play-button-o";
        musicToggleContainer.classList.remove('active-music');
        console.log("Music paused.");
    }
}

document.addEventListener('DOMContentLoaded', () => {
    if (musicToggleContainer) {
        musicToggleContainer.addEventListener("click", function () {
            if (!backgroundMusic.paused || backgroundMusic.ended) { // If playing or ended, pause
                toggleMusic("pause");
            } else { // If paused, play
                toggleMusic("play");
            }
        }, false);

        // Add the 'ended' event listener for continuous random play
        backgroundMusic.addEventListener('ended', playRandomMusic);

    } else {
        console.error("Music toggle container element with class 'music-toggle' not found.");
    }

    // Initialize the button icon based on whether music will play on click,
    // assuming it starts paused.
    musicIcon.className = "gg-play-button-o";
});
