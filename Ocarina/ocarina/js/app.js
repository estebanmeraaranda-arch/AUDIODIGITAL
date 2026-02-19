// Mapeo de notas a frecuencias (escala de ocarina)
const noteFrequencies = {
    'A': 'D4',
    'C-down': 'F4',
    'C-right': 'A4',
    'C-left': 'B4',
    'C-up': 'D5'
};

// Mapeo de notas a archivos SVG
const noteSvgMap = {
    'A': 'assets/penta/a.svg',
    'C-down': 'assets/penta/c-down.svg',
    'C-right': 'assets/penta/c-right.svg',
    'C-left': 'assets/penta/c-left.svg',
    'C-up': 'assets/penta/c-up.svg'
};

// Configuración de canciones - Song of Healing ahora requiere 6 notas
const songs = {
    'C-left,C-up,C-right,C-left,C-up,C-right': {
        name: "Zelda's Lullaby",
        icon: '',
        audioFile: 'assets/music/zeldas-lullaby.mp3',
        backgroundImage: 'assets/images/zeldas-lullaby-bg.jpg',
        melody: ['B4', 'D5', 'A4', 'B4', 'D5', 'A4']
    },
    'C-right,A,C-down,C-right,A,C-down': {
        name: 'Song of Time',
        icon: '',
        audioFile: 'assets/music/song-of-time.mp3',
        backgroundImage: 'assets/images/song-of-time-bg.jpg',
        melody: ['A4', 'D4', 'F4', 'A4', 'D4', 'F4']
    },
    'C-left,C-right,C-down,C-left,C-right,C-down': {
        name: 'Song of Healing',
        icon: '',
        audioFile: 'assets/music/song-of-healing.mp3',
        backgroundImage: 'assets/images/song-of-healing-bg.jpg',
        melody: ['B4', 'A4', 'F4', 'B4', 'A4', 'F4']
    },
    'C-down,C-right,C-left,C-down,C-right,C-left': {
        name: "Saria's Song",
        icon: '',
        audioFile: 'assets/music/sarias-song.mp3',
        backgroundImage: 'assets/images/sarias-song-bg.jpg',
        melody: ['F4', 'A4', 'B4', 'F4', 'A4', 'B4']
    },
    'C-right,C-down,C-up,C-right,C-down,C-up': {
        name: "Sun's Song",
        icon: '',
        audioFile: 'assets/music/suns-song.mp3',
        backgroundImage: 'assets/images/suns-song-bg.jpg',
        melody: ['A4', 'F4', 'D5', 'A4', 'F4', 'D5']
    },
    'A,C-down,C-up,A,C-down,C-up': {
        name: 'Song of Storms',
        icon: '',
        audioFile: 'assets/music/song-of-storms.mp3',
        backgroundImage: 'assets/images/song-of-storms-bg.jpg',
        melody: ['D4', 'F4', 'D5', 'D4', 'F4', 'D5']
    },
    'C-up,C-left,C-right,C-up,C-left,C-right': {
        name: "Epona's Song",
        icon: '',
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
let successSfx = null; // Efecto de sonido de éxito

// Elementos del DOM
const notesDisplay = document.getElementById('notesDisplay');
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

// Precargar efecto de sonido de éxito
function preloadSuccessSfx() {
    successSfx = new Audio('assets/sounds/bien.mp3');
    successSfx.volume = 0.7;
    successSfx.preload = 'auto';
}

// Inicializar Tone.js
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

// Actualizar display del pentagrama con notas
function updateStaffDisplay() {
    if (sequence.length === 0) {
        notesDisplay.innerHTML = '';
    } else {
        notesDisplay.innerHTML = sequence.map((note, index) => {
            const svgPath = noteSvgMap[note];
            // Agregar clase específica para la altura de cada nota
            const noteClass = `note-${note}`;
            // Posición horizontal fija para cada slot (0-5)
            const leftPosition = 20 + (index * 60); // 60px de separación entre notas
            return `<div class="note-on-staff ${noteClass}" style="left: ${leftPosition}px;"><img src="${svgPath}" alt="${note}"></div>`;
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

// Reproducir efecto de sonido de éxito
async function playSuccessSfx() {
    if (!successSfx) {
        preloadSuccessSfx();
    }
    
    try {
        successSfx.currentTime = 0; // Reiniciar al inicio
        await successSfx.play();
        console.log('✓ Efecto de sonido reproducido');
    } catch (error) {
        console.error('Error al reproducir efecto de sonido:', error);
    }
}

// Reproducir canción completa desde archivo MP3
async function playSong(song) {
    if (isPlaying) return;
    isPlaying = true;
    currentSong = song;

    // Ocultar la interfaz de la ocarina
    document.querySelector('.container').style.display = 'none';

    // Configurar título
    songTitleLarge.textContent = song.name;
    
    // Limpiar overlay anterior
    backgroundOverlay.innerHTML = '';
    
    console.log('🎬 Iniciando reproducción de:', song.name);
    
    // 1. Agregar video de fondo pixelado (común para todas las canciones)
    const video = document.createElement('video');
    video.className = 'background-video';
    video.src = 'assets/images/pixelated-background.mp4';
    video.autoplay = true;
    video.loop = true;
    video.muted = true;
    video.playsInline = true;
    
    // FORZAR estilos para asegurar visibilidad
    video.style.cssText = `
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        object-fit: cover;
        z-index: 1 !important;
        opacity: 1 !important;
        display: block !important;
    `;
    
    // Intentar reproducir el video y manejar errores
    video.addEventListener('loadeddata', () => {
        console.log('✓ Video cargado correctamente');
        console.log('  Dimensiones:', video.videoWidth, 'x', video.videoHeight);
        video.play().then(() => {
            console.log('✓ Video reproduciéndose');
        }).catch(err => {
            console.error('✗ Error al reproducir video:', err);
        });
    });
    
    video.addEventListener('error', (e) => {
        console.error('✗ Error al cargar video de fondo:', e);
        console.log('  Verifica que existe: assets/images/pixelated-background.mp4');
    });
    
    video.addEventListener('playing', () => {
        console.log('✓ Video está reproduciéndose activamente');
    });
    
    backgroundOverlay.appendChild(video);
    console.log('Video agregado al DOM');
    
    // 2. Agregar imagen específica de la canción (centrada)
    if (song.backgroundImage) {
        const songImg = document.createElement('img');
        songImg.className = 'song-image';
        songImg.src = song.backgroundImage;
        songImg.style.cssText = `
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            max-width: 45%;
            max-height: 55%;
            z-index: 3;
            opacity: 0.9;
        `;
        songImg.addEventListener('error', () => {
            console.error('✗ Error al cargar imagen:', song.backgroundImage);
        });
        songImg.addEventListener('load', () => {
            console.log('✓ Imagen de canción cargada');
        });
        backgroundOverlay.appendChild(songImg);
    }
    
    // 3. Agregar overlay oscuro encima
    const darkOverlay = document.createElement('div');
    darkOverlay.className = 'dark-overlay';
    darkOverlay.style.cssText = `
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.3);
        z-index: 2;
    `;
    backgroundOverlay.appendChild(darkOverlay);
    
    // Mostrar reproductor en pantalla completa
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

    // Reproducir audio
    try {
        await currentAudio.play();
        playPauseBtn.textContent = '⏸️';
        console.log('✓ Audio reproduciéndose');
        
        // Actualizar progreso cada 100ms
        progressUpdateInterval = setInterval(updateProgress, 100);
    } catch (error) {
        console.error('✗ Error al reproducir audio:', error);
        alert('Error al cargar el archivo de audio. Verifica que el archivo ' + song.audioFile + ' exista en la carpeta correcta.');
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
    
    // Mostrar de nuevo la interfaz de la ocarina
    document.querySelector('.container').style.display = 'block';
    
    isPlaying = false;
    currentSong = null;
    sequence = [];
    updateStaffDisplay();
    
    // Resetear UI
    progressBarFill.style.width = '0%';
    progressSlider.value = 0;
    currentTimeDisplay.textContent = '0:00';
    totalTimeDisplay.textContent = '0:00';
    playPauseBtn.textContent = '⏸️';
}

// Verificar si la secuencia coincide con alguna canción
async function checkSong() {
    const sequenceKey = sequence.join(',');
    
    if (songs[sequenceKey]) {
        console.log('🎵 ¡Canción reconocida!:', songs[sequenceKey].name);
        
        // Reproducir efecto de sonido de éxito
        await playSuccessSfx();
        
        // Esperar un momento para que se escuche el efecto antes de la transición
        setTimeout(() => {
            playSong(songs[sequenceKey]);
        }, 800); // Espera 800ms para que suene el efecto completo
        
        return true;
    }
    
    return false;
}

// Función para presionar una nota (desde botón o teclado)
async function pressNote(note) {
    if (isPlaying) return;

    if (!synth) await initAudio();

    // Efecto visual en el botón correspondiente
    const button = document.querySelector(`[data-note="${note}"]`);
    if (button) {
        button.classList.add('pressed');
        setTimeout(() => button.classList.remove('pressed'), 300);
    }

    // SIEMPRE tocar la nota MIDI
    playNote(noteFrequencies[note]);
    sequence.push(note);
    updateStaffDisplay();

    // Limitar a 6 notas máximo
    if (sequence.length > 6) {
        sequence.shift();
        updateStaffDisplay();
    }

    // Verificar después de 6 notas si es una canción reconocida
    if (sequence.length === 6) {
        setTimeout(async () => await checkSong(), 300);
    }
}

// Event listeners para botones visuales
document.querySelectorAll('.keyboard-key').forEach(button => {
    button.addEventListener('click', async () => {
        const note = button.dataset.note;
        await pressNote(note);
    });
});

// Event listeners para teclado físico
document.addEventListener('keydown', async (e) => {
    if (isPlaying) return;
    
    const key = e.key.toLowerCase();
    
    // Mapeo de teclas físicas a notas
    const keyMap = {
        'arrowup': 'C-up',
        'arrowdown': 'C-down',
        'arrowleft': 'C-left',
        'arrowright': 'C-right',
        'a': 'A',
        'z': 'A'
    };
    
    const note = keyMap[key];
    if (note) {
        e.preventDefault();
        await pressNote(note);
    }
});

// Botón limpiar
document.getElementById('clearBtn').addEventListener('click', () => {
    sequence = [];
    updateStaffDisplay();
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
    if (e.key !== 'Escape') return;

    if (isPlaying) {
        closeSongPlayer();
        return;
    }

    if (window.parent && window.parent !== window) {
        window.parent.postMessage({ type: 'close-screen' }, '*');
    }
});

// Precargar efecto de sonido al cargar la página
window.addEventListener('load', () => {
    preloadSuccessSfx();
    console.log('Efecto de sonido precargado');
});
