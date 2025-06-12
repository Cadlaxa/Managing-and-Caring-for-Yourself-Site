// Get references to the audio element and the music toggle container
const backgroundMusic = document.getElementById('backgroundMusic'); // Assumes an <audio id="backgroundMusic"> element exists elsewhere
const musicToggleContainer = document.querySelector('.music-toggle'); // Select the div with class 'music-toggle'
const musicIcon = musicToggleContainer ? musicToggleContainer.querySelector('i') : null; // Get the <i> element inside it

/**
 * Toggles the playback state of the background music and updates the button icon.
 * @param {string} newState - 'play' to play music, 'pause' to pause music.
 */
const musicFiles = [
    'https://t4.bcbits.com/stream/a6bcd1018c0f9934a56416c93de8ba81/mp3-128/3563446242?p=0&ts=1749789518&t=09efb78988755e6fa2eb77b76df3719d4780c18b&token=1749789518_ac6462f28780132c730ff70c17103730a7c89895',
    'https://t4.bcbits.com/stream/414f8f32e5a577461dc912b6781edb21/mp3-128/3937674236?p=0&ts=1749789305&t=a2321d5a969b6e785113a86512176f4012774da9&token=1749789305_e69bb55ebfdc7f41100234ca42565f9aab48dc92',
    'https://t4.bcbits.com/stream/e1cd40751c009de8f23cd1c1832de090/mp3-128/252656254?p=0&ts=1749789472&t=ed4d606f157005d70f8fc0bb2d14d3736b73b879&token=1749789472_05c680be2c60dc9c80387a486177847a69144949',
    'https://t4.bcbits.com/stream/f00b69aba2e9f045736c582a12d618cc/mp3-128/1445891977?p=0&ts=1749789576&t=31471cc2d1e1bc0296809d80a9e8d3eae1877a68&token=1749789576_082db0a85014611ea635ec33d6f798b36867cfc2',
    'https://t4.bcbits.com/stream/1188325c682bc2a7c1c31d0cb1d814be/mp3-128/2063117494?p=0&ts=1749789654&t=b3e738f55167c0dec1e10ab39ace7ad0c669b4c1&token=1749789654_6990431eebfd9830f40616890b55681045e5f4f9',
    'https://t4.bcbits.com/stream/cb36876317844404f158c654230eddc5/mp3-128/1866789838?p=0&ts=1749789713&t=c0b3ab08011d9d294cc49dcebc6e34f8eddea398&token=1749789713_198314b67f75e7a01a752124b59f7831ce5c14f3',

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
    const randomSongUrl = musicFiles[randomIndex];

    console.log("Attempting to play next song:", randomSongUrl);

    // Immediately show the 'forwards' icon while loading/playing the next song
    if (musicIcon) {
        musicIcon.className = "gg-arrow-right-r";
    }
    musicToggleContainer.classList.add('active-music'); // Keep active state during transition

    // Assume it's a direct audio file (MP3, WAV, etc.)
    backgroundMusic.src = randomSongUrl;
    backgroundMusic.load(); // Load the new song

    // Attempt to play the music
    backgroundMusic.play().then(() => {
        // If successful, change to pause icon after 1 second delay
        setTimeout(() => {
            if (musicIcon) {
                musicIcon.className = "gg-play-pause-o";
            }
        }, 1000); // 1 second delay
        console.log("Music playing:", randomSongUrl);
    }).catch(error => {
        // If autoplay prevented or an error occurs, revert to play icon after 1 second delay
        console.warn("Autoplay prevented for:", randomSongUrl, error);
        setTimeout(() => {
            if (musicIcon) {
                musicIcon.className = "gg-play-button-o";
            }
            musicToggleContainer.classList.remove('active-music');
        }, 1000); // 1 second delay
    });
}

/**
 * Toggles the playback state of the background music and updates the button icon.
 * @param {string} newState - 'play' to play music, 'pause' to pause music.
 */
function toggleMusic(newState) {
    if (!backgroundMusic || !musicIcon || !musicToggleContainer) {
        console.error("Missing audio element or music toggle elements. Cannot toggle music.");
        return;
    }

    if (newState === "play") {
        // If the audio source is not set or is currently paused, initiate play.
        if (backgroundMusic.paused || backgroundMusic.src === "") {
            // If backgroundMusic.src is empty, it means no song has been played yet
            // or the previous song failed/was reset. Play a random song.
            if (backgroundMusic.src === "") {
                playRandomMusic(); // This will handle icon changes to 'forwards' then 'pause'
            } else {
                // If a song is loaded but paused, try to play it.
                backgroundMusic.play().then(() => {
                    musicIcon.className = "gg-play-pause-o";
                    musicToggleContainer.classList.add('active-music');
                    console.log("Music resumed.");
                }).catch(error => {
                    console.warn("Autoplay prevented on resume:", error);
                    // Keep icon as play if autoplay failed
                    musicIcon.className = "gg-play-button-o";
                    musicToggleContainer.classList.remove('active-music');
                });
            }
        }
    } else if (newState === "pause") {
        backgroundMusic.pause();
        musicIcon.className = "gg-play-button-o";
        musicToggleContainer.classList.remove('active-music');
        console.log("Music paused.");
    }
}

document.addEventListener('DOMContentLoaded', () => {
    // Check if critical elements exist
    if (!musicToggleContainer || !backgroundMusic || !musicIcon) {
        console.error("Critical elements (music-toggle, backgroundMusic, musicIcon) not found. Script will not run.");
        return; // Exit if essential elements are missing
    }

    let pressTimer;
    const LONG_PRESS_THRESHOLD = 500; // Define long press threshold in milliseconds

    // Event listener for mouse down (desktop)
    musicToggleContainer.addEventListener('mousedown', (e) => {
        // Only respond to left-clicks for long press
        if (e.button === 0) {
            pressTimer = setTimeout(() => {
                // This code executes if the mouse button is held down for LONG_PRESS_THRESHOLD
                console.log("Long press detected: Playing next random song.");
                // Pause current song if playing, then play next random to ensure smooth transition
                if (!backgroundMusic.paused) {
                    backgroundMusic.pause();
                }
                playRandomMusic();
                // Set a flag to prevent the 'mouseup' from triggering a short click logic
                musicToggleContainer.dataset.longPress = 'true';
            }, LONG_PRESS_THRESHOLD);
        }
    });

    // Event listener for mouse up (desktop)
    musicToggleContainer.addEventListener('mouseup', () => {
        clearTimeout(pressTimer); // Clear the timer if mouse button is released
        if (musicToggleContainer.dataset.longPress === 'true') {
            // If it was a long press, reset the flag and do nothing for this mouseup
            delete musicToggleContainer.dataset.longPress;
        } else {
            // This was a short click, proceed with play/pause toggle
            console.log("Short click detected: Toggling play/pause.");
            // Check if music is currently playing or has ended
            if (!backgroundMusic.paused || backgroundMusic.ended) {
                toggleMusic("pause");
            } else { // If paused, play
                toggleMusic("play");
            }
        }
    });

    // Event listener for touch start (mobile)
    musicToggleContainer.addEventListener('touchstart', (e) => {
        // Prevent default touch behavior (like scrolling/zooming) to ensure press is registered
        e.preventDefault();
        pressTimer = setTimeout(() => {
            console.log("Long touch detected: Playing next random song.");
            // Pause current song if playing, then play next random
            if (!backgroundMusic.paused) {
                backgroundMusic.pause();
            }
            playRandomMusic();
            // Set a flag for long press detection
            musicToggleContainer.dataset.longPress = 'true';
        }, LONG_PRESS_THRESHOLD);
    }, { passive: false }); // Use { passive: false } to allow e.preventDefault() for touchstart

    // Event listener for touch end (mobile)
    musicToggleContainer.addEventListener('touchend', () => {
        clearTimeout(pressTimer); // Clear the timer if touch ends
        if (musicToggleContainer.dataset.longPress === 'true') {
            // If it was a long press, reset the flag
            delete musicToggleContainer.dataset.longPress;
        } else {
            // This was a short tap, proceed with play/pause toggle
            console.log("Short touch detected: Toggling play/pause.");
            if (!backgroundMusic.paused || backgroundMusic.ended) {
                toggleMusic("pause");
            } else {
                toggleMusic("play");
            }
        }
    });

    // Add the 'ended' event listener for continuous random play
    // This will trigger playRandomMusic() when any track finishes
    backgroundMusic.addEventListener('ended', playRandomMusic);

    // Initialize the button icon to 'play' as music starts paused
    musicIcon.className = "gg-play-button-o";
});