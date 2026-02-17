// PAREDES DEL MAPA
const walls = [
  { x: 0, y: 0, width: 640, height: 16 },
  { x: 0, y: 344, width: 640, height: 16 },
  { x: 0, y: 0, width: 16, height: 360 },
  { x: 624, y: 0, width: 16, height: 360 }
];

// ZONAS INTERACTIVAS
const interactions = [
  {
    id: "ocarina",
    x: 160,
    y: 120,
    width: 110,
    height: 90,
    prompt: "E: Abrir Ocarina"
  },
  {
    id: "canva",
    x: 340,
    y: 155,
    width: 120,
    height: 95,
    prompt: "E: Abrir Canva"
  }
];

function collide(a, b) {
  return (
    a.x < b.x + b.width &&
    a.x + a.width > b.x &&
    a.y < b.y + b.height &&
    a.y + a.height > b.y
  );
}
