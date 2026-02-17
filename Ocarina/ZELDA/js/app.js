// Mapeo de notas a frecuencias (escala de ocarina)
const noteFrequencies = {
    'A': 'D4',
    'C-down': 'F4',
    'C-right': 'A4',
    'C-left': 'B4',
    'C-up': 'D5'
};

// Configuración de canciones con archivos de audio e imágenes
const songs = {
    'C-left,C-up,C-right,C-left,C-up,C-right': {
        name: "Zelda's Lullaby",
        icon: '🔱',
        audioFile: 'assets/music/zeldas-lullaby.mp3',
        backgroundImage: 'assets/images/zeldas-lullaby-bg.jpg',
        melody: ['B4', 'D5', 'A4', 'B4', 'D5', 'A4']
    },
    'C-right,A,C-down,C-right,A,C-down': {
        name: 'Song of Time',
        icon: '⏰',
        audioFile: 'assets/music/song-of-time.mp3',
        backgroundImage: 'assets/images/song-of-time-bg.jpg',
        melody: ['A4', 'D4', 'F4', 'A4', 'D4', 'F4']
    },
    'C-left,C-right,C-down': {
        name: 'Song of Healing',
        icon: '💚',
        audioFile: 'assets/music/song-of-healing.mp3',
        backgroundImage: 'assets/images/song-of-healing-bg.jpg',
        melody: ['B4', 'A4', 'F4']
    },
    'C-down,C-right,C-left,C-down,C-right,C-left': {
        name: "Saria's Song",
        icon: '🌲',
        audioFile: 'assets/music/sarias-song.mp3',
        backgroundImage: 'assets/images/sarias-song-bg.jpg',
        melody: ['F4', 'A4', 'B4', 'F4', 'A4', 'B4']
    },
    'C-right,C-down,C-up,C-right,C-down,C-up': {
        name: "Sun's Song",
        icon: '☀️',
        audioFile: 'assets/music/suns-song.mp3',
        backgroundImage: 'assets/images/suns-song-bg.jpg',
        melody: ['A4', 'F4', 'D5', 'A4', 'F4', 'D5']
    },
    'A,C-down,C-up,A,C-down,C-up': {
        name: 'Song of Storms',
        icon: '⛈️',
        audioFile: 'assets/music/song-of-storms.mp3',
        backgroundImage: 'assets/images/song-of-storms-bg.jpg',
        melody: ['D4', 'F4', 'D5', 'D4', 'F4', 'D5']
    },
    'C-up,C-left,C-right,C-up,C-left,C-right': {
        name: "Epona's Song",
        icon: '🐴',
        audioFile: 'assets/music/eponas-song.mp3',
        backgroundImage: 'assets/images/eponas-song-bg.jpg',
        melody: ['D5', 'B4', 'A4', 'D5', 'B4', 'A4']
    }
};

let synth;
let sequence = [];
let isPlaying = false;
let currentAudio = null;
let currentSong = null;
let progressUpdateInterval = null;

// Elementos del DOM
const sequenceDisplay = document.getElementById('sequenceDisplay');
const songPlayer = document.getElementById('songPlayer');
const backgroundOverlay = document.getElementById('backgroundOverlay');
const songIconLarge = document.getElementById('songIconLarge');
const songTitleLarge = document.getElementById('songTitleLarge');
const progressBarFill = document.getElementById('progressBarFill');
const progressSlider = document.getElementById('progressSlider');
const currentTimeDisplay = document.getElementById('currentTime');
const totalTimeDisplay = document.getElementById('totalTime');
const playPauseBtn = document.getElementById('playPauseBtn');
const closeButton = document.getElementById('closeButton');

// Inicializar Tone.js para las notas individuales
async function initAudio() {
    await Tone.start();
    synth = new Tone.Synth({
        oscillator: { type: 'sine' },
        envelope: {
            attack: 0.05,
            decay: 0.3,
            sustain: 0.4,
            release: 0.8
        }
    }).toDestination();
    
    const reverb = new Tone.Reverb({
        decay: 2,
        wet: 0.3
    }).toDestination();
    synth.connect(reverb);
}

// Tocar una nota individual
function playNote(frequency, duration = '8n') {
    if (!synth) return;
    synth.triggerAttackRelease(frequency, duration);
}

// Actualizar display de secuencia
function updateDisplay() {
    if (sequence.length === 0) {
        sequenceDisplay.innerHTML = '<span style="color: #888;">Presiona las notas...</span>';
    } else {
        sequenceDisplay.innerHTML = sequence.map(note => {
            let symbol = note;
            if (note === 'C-up') symbol = '▲';
            else if (note === 'C-down') symbol = '▼';
            else if (note === 'C-left') symbol = '◄';
            else if (note === 'C-right') symbol = '►';
            return `<div class="note-pill">${symbol}</div>`;
        }).join('');
    }
}

// Formatear tiempo en MM:SS
function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
}

// Actualizar barra de progreso
function updateProgress() {
    if (!currentAudio) return;
    
    const progress = (currentAudio.currentTime / currentAudio.duration) * 100;
    progressBarFill.style.width = progress + '%';
    progressSlider.value = progress;
    currentTimeDisplay.textContent = formatTime(currentAudio.currentTime);
}

// Reproducir canción completa desde archivo MP3
async function playSong(song) {
    if (isPlaying) return;
    isPlaying = true;
    currentSong = song;

    // Configurar UI
    songIconLarge.textContent = song.icon;
    songTitleLarge.textContent = song.name;
    backgroundOverlay.style.backgroundImage = `url('${song.backgroundImage}')`;
    
    // Mostrar reproductor
    songPlayer.classList.add('active');

    // Crear y configurar elemento de audio
    currentAudio = new Audio(song.audioFile);
    
    currentAudio.addEventListener('loadedmetadata', () => {
        totalTimeDisplay.textContent = formatTime(currentAudio.duration);
        progressSlider.max = 100;
    });

    currentAudio.addEventListener('timeupdate', updateProgress);

    currentAudio.addEventListener('ended', () => {
        playPauseBtn.textContent = '▶️';
    });

    // Reproducir
    try {
        await currentAudio.play();
        playPauseBtn.textContent = '⏸️';
        
        // Actualizar progreso cada 100ms
        progressUpdateInterval = setInterval(updateProgress, 100);
    } catch (error) {
        console.error('Error al reproducir audio:', error);
        closeSongPlayer();
    }
}

// Cerrar reproductor de canciones
function closeSongPlayer() {
    if (currentAudio) {
        currentAudio.pause();
        currentAudio = null;
    }
    
    if (progressUpdateInterval) {
        clearInterval(progressUpdateInterval);
        progressUpdateInterval = null;
    }
    
    songPlayer.classList.remove('active');
    isPlaying = false;
    currentSong = null;
    sequence = [];
    updateDisplay();
    
    // Resetear UI
    progressBarFill.style.width = '0%';
    progressSlider.value = 0;
    currentTimeDisplay.textContent = '0:00';
    totalTimeDisplay.textContent = '0:00';
    playPauseBtn.textContent = '⏸️';
}

// Verificar si la secuencia coincide con alguna canción
function checkSong() {
    const sequenceKey = sequence.join(',');
    
    // Verificar coincidencia exacta
    if (songs[sequenceKey]) {
        playSong(songs[sequenceKey]);
        return true;
    }
    
    // Verificar si las primeras 3 notas coinciden con Song of Healing
    if (sequence.length === 3) {
        const firstThree = sequence.join(',');
        if (firstThree === 'C-left,C-right,C-down') {
            playSong(songs['C-left,C-right,C-down']);
            return true;
        }
    }
    
    return false;
}

// Event listeners para botones de notas
document.querySelectorAll('.note-button').forEach(button => {
    button.addEventListener('click', async () => {
        if (isPlaying) return;

        if (!synth) await initAudio();

        const note = button.dataset.note;
        button.classList.add('pressed');
        setTimeout(() => button.classList.remove('pressed'), 300);

        playNote(noteFrequencies[note]);
        sequence.push(note);
        updateDisplay();

        // Para Song of Healing, verificar después de 3 notas
        if (sequence.length === 3) {
            setTimeout(() => checkSong(), 500);
        }
        
        // Para otras canciones, verificar después de 6 notas
        if (sequence.length === 6) {
            setTimeout(() => checkSong(), 500);
        }

        // Limitar a 6 notas máximo
        if (sequence.length > 6) {
            sequence.shift();
            updateDisplay();
        }
    });
});

// Botón limpiar
document.getElementById('clearBtn').addEventListener('click', () => {
    sequence = [];
    updateDisplay();
});

// Botón repetir
document.getElementById('replayBtn').addEventListener('click', async () => {
    if (sequence.length === 0 || isPlaying) return;
    if (!synth) await initAudio();

    for (let i = 0; i < sequence.length; i++) {
        playNote(noteFrequencies[sequence[i]]);
        await new Promise(resolve => setTimeout(resolve, 500));
    }
});

// Controles del reproductor
playPauseBtn.addEventListener('click', () => {
    if (!currentAudio) return;
    
    if (currentAudio.paused) {
        currentAudio.play();
        playPauseBtn.textContent = '⏸️';
    } else {
        currentAudio.pause();
        playPauseBtn.textContent = '▶️';
    }
});

// Control de progreso interactivo
progressSlider.addEventListener('input', (e) => {
    if (!currentAudio) return;
    
    const seekTime = (e.target.value / 100) * currentAudio.duration;
    currentAudio.currentTime = seekTime;
    updateProgress();
});

// Botón cerrar
closeButton.addEventListener('click', closeSongPlayer);

// Cerrar con tecla Escape
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && isPlaying) {
        closeSongPlayer();
    }
});
