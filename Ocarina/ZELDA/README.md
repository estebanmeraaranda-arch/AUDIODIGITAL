# Ocarina of Time - Web App

## Estructura de Archivos

```
ocarina-project/
│
├── index.html
├── css/
│   └── styles.css
├── js/
│   └── app.js
└── assets/
    ├── music/          # Archivos MP3 de las canciones
    │   ├── zeldas-lullaby.mp3
    │   ├── song-of-time.mp3
    │   ├── song-of-healing.mp3
    │   ├── sarias-song.mp3
    │   ├── suns-song.mp3
    │   ├── song-of-storms.mp3
    │   └── eponas-song.mp3
    │
    └── images/         # Imágenes de fondo para cada canción
        ├── zeldas-lullaby-bg.jpg
        ├── song-of-time-bg.jpg
        ├── song-of-healing-bg.jpg
        ├── sarias-song-bg.jpg
        ├── suns-song-bg.jpg
        ├── song-of-storms-bg.jpg
        └── eponas-song-bg.jpg
```

## Archivos de Audio (formato MP3)

Coloca tus archivos MP3 en la carpeta `assets/music/` con los siguientes nombres:

1. **zeldas-lullaby.mp3** - Zelda's Lullaby (secuencia: ◄ ▲ ► ◄ ▲ ►)
2. **song-of-time.mp3** - Song of Time (secuencia: ► A ▼ ► A ▼)
3. **song-of-healing.mp3** - Song of Healing (secuencia: ◄ ► ▼) ⭐ NUEVA
4. **sarias-song.mp3** - Saria's Song (secuencia: ▼ ► ◄ ▼ ► ◄)
5. **suns-song.mp3** - Sun's Song (secuencia: ► ▼ ▲ ► ▼ ▲)
6. **song-of-storms.mp3** - Song of Storms (secuencia: A ▼ ▲ A ▼ ▲)
7. **eponas-song.mp3** - Epona's Song (secuencia: ▲ ◄ ► ▲ ◄ ►)

## Archivos de Imágenes de Fondo (formato JPG/PNG)

Coloca tus imágenes en la carpeta `assets/images/` con los siguientes nombres:

1. **zeldas-lullaby-bg.jpg** - Fondo para Zelda's Lullaby
   - Sugerencia: Imagen de la Trifuerza, Castillo de Hyrule, o Princess Zelda

2. **song-of-time-bg.jpg** - Fondo para Song of Time
   - Sugerencia: Reloj, Puerta del Tiempo, o el Temple of Time

3. **song-of-healing-bg.jpg** - Fondo para Song of Healing ⭐ NUEVA
   - Sugerencia: Máscara de Majora, luna de Termina, o escena sanadora/pacífica

4. **sarias-song-bg.jpg** - Fondo para Saria's Song
   - Sugerencia: Bosque de Kokiri, árbol Deku, o Saria tocando la ocarina

5. **suns-song-bg.jpg** - Fondo para Sun's Song
   - Sugerencia: Amanecer en Hyrule Field o el sol brillante

6. **song-of-storms-bg.jpg** - Fondo para Song of Storms
   - Sugerencia: Tormenta, molino de viento, o escena lluviosa

7. **eponas-song-bg.jpg** - Fondo para Epona's Song
   - Sugerencia: Epona corriendo, Lon Lon Ranch, o campo abierto

## Características Especiales

### Song of Healing
- **Reconocimiento especial**: Solo requiere las primeras 3 notas (◄ ► ▼)
- Cuando toques estas 3 notas, la canción completa comenzará a reproducirse automáticamente
- El archivo MP3 debe contener la canción completa tal como la hayas grabado o descargado

### Controles del Reproductor
- **Barra de progreso interactiva**: Arrastra para adelantar o retroceder
- **Botón play/pause**: Pausa y reanuda la reproducción
- **Botón X**: Cierra el reproductor y vuelve a la ocarina
- **Tiempo**: Muestra tiempo actual y duración total

### Recomendaciones de Formato
- **Audio**: MP3, 128-320 kbps, calidad media-alta
- **Imágenes**: JPG o PNG, resolución mínima 1920x1080 para mejor calidad
- Los archivos deben estar en las carpetas exactas con los nombres exactos especificados

## Cómo Usar

1. Coloca todos los archivos MP3 en `assets/music/`
2. Coloca todas las imágenes en `assets/images/`
3. Abre `index.html` en tu navegador móvil o de escritorio
4. ¡Toca las notas y disfruta de la magia!

## Notas Técnicas

- La app funciona 100% del lado del cliente (no requiere servidor)
- Compatible con todos los navegadores modernos
- Optimizado para dispositivos móviles
- Los archivos de audio se cargan bajo demanda (solo cuando se reconoce la canción)
