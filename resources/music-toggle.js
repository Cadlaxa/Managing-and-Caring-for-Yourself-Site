// Get references to the audio element and the music toggle container
const backgroundMusic = document.getElementById('backgroundMusic');
const musicToggleContainer = document.querySelector('.music-toggle');
const musicIcon = musicToggleContainer ? musicToggleContainer.querySelector('i') : null;

// Keys for localStorage
const MUSIC_STATE_KEY = 'musicPlayerState';
const CURRENT_SONG_URL_KEY = 'currentSongUrl';
const PLAYBACK_TIME_KEY = 'playbackTime';
const IS_PLAYING_KEY = 'isPlaying';

// Music files array including your provided URLs (which are direct MP3s)
const musicFiles = [
    'https://t4.bcbits.com/stream/a6bcd1018c0f9934a56416c93de8ba81/mp3-128/3563446242?p=0&ts=1749789518&t=09efb78988755e6fa2eb77b76df3719d4780c18b&token=1749789518_ac6462f28780132c730ff70c17103730a7c89895',
    'https://t4.bcbits.com/stream/414f8f32e5a577461dc912b6781edb21/mp3-128/3937674236?p=0&ts=1749789305&t=a2321d5a969b6e785113a86512176f4012774da9&token=1749789305_e69bb55ebfdc7f41100234ca42565f9aab48dc92',
    'https://t4.bcbits.com/stream/e1cd40751c009de8f23cd1c1832de090/mp3-128/252656254?p=0&ts=1749789472&t=ed4d606f157005d70f8fc0bb2d14d3736b73b879&token=1749789472_05c680be2c60dc9c80387a486177847a69144949',
    'https://t4.bcbits.com/stream/f00b69aba2e9f045736c582a12d618cc/mp3-128/1445891977?p=0&ts=1749789576&t=31471cc2d1e1bc0296809d80a9e8d3eae1877a68&token=1749789576_082db0a85014611ea635ec33d6f798b36867cfc2',
    'https://t4.bcbits.com/stream/1188325c682bc2a7c1c31d0cb1d814be/mp3-128/2063117494?p=0&ts=1749789654&t=b3e738f55167c0dec1e10ab39ace7ad0c669b4c1&token=1749789654_6990431eebfd9830f40616890b55681045e5f4f9',
    'https://t4.bcbits.com/stream/cb36876317844404f158c654230eddc5/mp3-128/1866789838?p=0&ts=1749789713&t=c0b3ab08011d9d294cc49dcebc6e34f8eddea398&token=1749789713_198314b67f75e7a01a752124b59f7831ce5c14f3',
];

/**
 * Saves the current music state to localStorage.
 * Stores: current song URL, current playback time, and whether it was playing.
 */
function saveMusicState() {
    try {
        const state = {
            [CURRENT_SONG_URL_KEY]: backgroundMusic.src,
            [PLAYBACK_TIME_KEY]: backgroundMusic.currentTime,
            [IS_PLAYING_KEY]: !backgroundMusic.paused
        };
        localStorage.setItem(MUSIC_STATE_KEY, JSON.stringify(state));
        console.log("Music state saved:", state);
    } catch (e) {
        console.error("Error saving music state to localStorage:", e);
    }
}

/**
 * Loads and restores the music state from localStorage.
 */
function loadMusicState() {
    try {
        const savedStateString = localStorage.getItem(MUSIC_STATE_KEY);
        if (savedStateString) {
            const savedState = JSON.parse(savedStateString);
            const savedSongUrl = savedState[CURRENT_SONG_URL_KEY];
            const savedTime = savedState[PLAYBACK_TIME_KEY];
            const wasPlaying = savedState[IS_PLAYING_KEY];

            if (savedSongUrl && savedTime !== undefined) {
                backgroundMusic.src = savedSongUrl;
                backgroundMusic.currentTime = savedTime;
                backgroundMusic.load(); // Load the audio

                console.log("Music state loaded:", savedState);

                if (wasPlaying) {
                    // Attempt to play only if it was playing and the source is loaded
                    backgroundMusic.play().then(() => {
                        console.log("Music resumed from last session.");
                        if (musicIcon) {
                            musicIcon.className = "gg-play-pause-o";
                        }
                        musicToggleContainer.classList.add('active-music');
                    }).catch(error => {
                        console.warn("Autoplay prevented on page load. User interaction required to resume:", error);
                        // If autoplay fails, set icon to play
                        if (musicIcon) {
                            musicIcon.className = "gg-play-button-o";
                        }
                        musicToggleContainer.classList.remove('active-music');
                    });
                } else {
                    // Was paused, just update icon
                    if (musicIcon) {
                        musicIcon.className = "gg-play-button-o";
                    }
                    musicToggleContainer.classList.remove('active-music');
                }
            }
        } else {
            console.log("No saved music state found.");
            // If no state, ensure button is in play state
            if (musicIcon) {
                musicIcon.className = "gg-play-button-o";
            }
            musicToggleContainer.classList.remove('active-music');
        }
    } catch (e) {
        console.error("Error loading music state from localStorage:", e);
        // Fallback to default initial state if error occurs
        if (musicIcon) {
            musicIcon.className = "gg-play-button-o";
        }
        musicToggleContainer.classList.remove('active-music');
    }
}

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

    
    if (musicIcon) {
        musicIcon.className = "gg-arrow-right-r";
    }
    musicToggleContainer.classList.add('active-music'); 

    
    backgroundMusic.src = randomSongUrl;
    backgroundMusic.load(); 

    
    backgroundMusic.play().then(() => {
        
        setTimeout(() => {
            if (musicIcon) {
                musicIcon.className = "gg-play-pause-o";
            }
        }, 1000); 
        console.log("Music playing:", randomSongUrl);
        saveMusicState(); 
    }).catch(error => {
        
        console.warn("Autoplay prevented for:", randomSongUrl, error);
        setTimeout(() => {
            if (musicIcon) {
                musicIcon.className = "gg-play-button-o";
            }
            musicToggleContainer.classList.remove('active-music');
        }, 1000); 
        saveMusicState(); 
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
        
        if (backgroundMusic.paused || backgroundMusic.src === "") {
            
            
            if (backgroundMusic.src === "") {
                playRandomMusic(); 
            } else {
                
                backgroundMusic.play().then(() => {
                    musicIcon.className = "gg-play-pause-o";
                    musicToggleContainer.classList.add('active-music');
                    console.log("Music resumed.");
                    saveMusicState(); 
                }).catch(error => {
                    console.warn("Autoplay prevented on resume:", error);
                    
                    musicIcon.className = "gg-play-button-o";
                    musicToggleContainer.classList.remove('active-music');
                    saveMusicState(); 
                });
            }
        }
    } else if (newState === "pause") {
        backgroundMusic.pause();
        musicIcon.className = "gg-play-button-o";
        musicToggleContainer.classList.remove('active-music');
        console.log("Music paused.");
        saveMusicState(); 
    }
}

document.addEventListener('DOMContentLoaded', () => {
    
    if (!musicToggleContainer || !backgroundMusic || !musicIcon) {
        console.error("Critical elements (music-toggle, backgroundMusic, musicIcon) not found. Script will not run.");
        return; 
    }

    
    loadMusicState();

    let pressTimer;
    const LONG_PRESS_THRESHOLD = 500; 

    
    musicToggleContainer.addEventListener('mousedown', (e) => {
        
        if (e.button === 0) {
            pressTimer = setTimeout(() => {
                
                console.log("Long press detected: Playing next random song.");
                
                if (!backgroundMusic.paused) {
                    backgroundMusic.pause();
                }
                playRandomMusic();
                
                musicToggleContainer.dataset.longPress = 'true';
            }, LONG_PRESS_THRESHOLD);
        }
    });

    
    musicToggleContainer.addEventListener('mouseup', () => {
        clearTimeout(pressTimer); 
        if (musicToggleContainer.dataset.longPress === 'true') {
            
            delete musicToggleContainer.dataset.longPress;
        } else {
            
            console.log("Short click detected: Toggling play/pause.");
            
            if (!backgroundMusic.paused || backgroundMusic.ended) {
                toggleMusic("pause");
            } else { 
                toggleMusic("play");
            }
        }
    });

    
    musicToggleContainer.addEventListener('touchstart', (e) => {
        
        e.preventDefault();
        pressTimer = setTimeout(() => {
            console.log("Long touch detected: Playing next random song.");
            
            if (!backgroundMusic.paused) {
                backgroundMusic.pause();
            }
            playRandomMusic();
            
            musicToggleContainer.dataset.longPress = 'true';
        }, LONG_PRESS_THRESHOLD);
    }, { passive: false }); 

    
    musicToggleContainer.addEventListener('touchend', () => {
        clearTimeout(pressTimer); 
        if (musicToggleContainer.dataset.longPress === 'true') {
            
            delete musicToggleContainer.dataset.longPress;
        } else {
            
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

    // Add event listener to save state before page unload
    window.addEventListener('beforeunload', saveMusicState);
    window.addEventListener('pagehide', saveMusicState); // For mobile browsers (iOS Safari)
});
