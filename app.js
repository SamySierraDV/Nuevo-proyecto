let amigo = document.getElementById('amigo');
let nombresAmigos = [];
let listaAmigos = document.getElementById('listaAmigos');
let resultado = document.getElementById('resultado');


let options = [];
var startAngle = 0;
var arc = Math.PI / 1; // Valor inicial para evitar división por cero
var spinTimeout = null;

var spinArcStart = 10;
var spinTime = 0;
var spinTimeTotal = 0;

var ctx;

/* Funciones para colorear la ruleta */
function byte2Hex(n) {
  var nybHexString = "0123456789ABCDEF";
  return String(nybHexString.substr((n >> 4) & 0x0F, 1)) + nybHexString.substr(n & 0x0F, 1);
}

function RGB2Color(r, g, b) {
  return '#' + byte2Hex(r) + byte2Hex(g) + byte2Hex(b);
}

function getColor(item, maxitem) {
  var phase = 0;
  var center = 128;
  var width = 127;
  var frequency = Math.PI * 2 / maxitem;

  var red = Math.sin(frequency * item + 2 + phase) * width + center;
  var green = Math.sin(frequency * item + 0 + phase) * width + center;
  var blue = Math.sin(frequency * item + 4 + phase) * width + center;

  return RGB2Color(red, green, blue);
}

// --- Agregar amigo al array y actualizar ruleta ---
function agregarAmigo() {
  let nombre = amigo.value.trim();
  if (nombresAmigos.includes(nombre)) {
    alert('El nombre ya existe');
  } else if (nombre === '') {
    alert('El nombre no puede estar vacío');
  } else {
    nombresAmigos.push(nombre);
    amigo.value = '';
    actualizarRuleta();
  }
}

// --- Mostrar y permitir eliminar amigos ---
function mostrarAmigos() {
  listaAmigos.innerHTML = '';
  nombresAmigos.forEach((nombre, index) => {
    let li = document.createElement('li');
    li.textContent = nombre;
    li.style.cursor = 'pointer';
    li.title = "Haz clic para eliminar";
    li.addEventListener('click', () => {
      nombresAmigos.splice(index, 1); // elimina del array
      actualizarRuleta();
    });
    listaAmigos.appendChild(li);
  });
}

// --- Actualiza todas las estructuras dependientes de la lista ---
function actualizarRuleta() {
  options = [...nombresAmigos];
  arc = options.length > 0 ? Math.PI / (options.length / 2) : Math.PI; // para evitar división por 0
  mostrarAmigos();
  drawRouletteWheel();
}
/* Funcion para reiniciar el juego */
function reiniciar() {
    nombresAmigos = [];
    actualizarRuleta();
}

// --- Sortear amigo al pulsar el botón ---
function sortearAmigo() {
  if (nombresAmigos.length === 0) {
    alert('No hay amigos');
    return;
  } else if (nombresAmigos.length === 1) {
    alert('Se necesitan al menos 2 amigos para sortear');
    return;
  }
  spin();
}

// --- Dibuja la ruleta ----
function drawRouletteWheel() {
  var canvas = document.getElementById("canvas");
  if (canvas.getContext) {
    var outsideRadius = 200;
    var textRadius = 160;
    var insideRadius = 125;

    ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, 500, 500);
    ctx.strokeStyle = "black";
    ctx.lineWidth = 2;
    ctx.font = 'bold 12px Helvetica, Arial';

    for (var i = 0; i < options.length; i++) {
      var angle = startAngle + i * arc;
      ctx.fillStyle = getColor(i, options.length);

      ctx.beginPath();
      ctx.arc(250, 250, outsideRadius, angle, angle + arc, false);
      ctx.arc(250, 250, insideRadius, angle + arc, angle, true);
      ctx.stroke();
      ctx.fill();

      ctx.save();
      ctx.shadowOffsetX = -1;
      ctx.shadowOffsetY = -1;
      ctx.shadowBlur = 0;
      ctx.shadowColor = "rgb(220,220,220)";
      ctx.fillStyle = "black";
      ctx.translate(
        250 + Math.cos(angle + arc / 2) * textRadius,
        250 + Math.sin(angle + arc / 2) * textRadius
      );
      ctx.rotate(angle + arc / 2 + Math.PI / 2);
      var text = options[i];
      ctx.fillText(text, -ctx.measureText(text).width / 2, 0);
      ctx.restore();
    }

    // Flecha indicadora
    ctx.fillStyle = "black";
    ctx.beginPath();
    ctx.moveTo(250 - 4, 250 - (outsideRadius + 5));
    ctx.lineTo(250 + 4, 250 - (outsideRadius + 5));
    ctx.lineTo(250 + 4, 250 - (outsideRadius - 5));
    ctx.lineTo(250 + 9, 250 - (outsideRadius - 5));
    ctx.lineTo(250 + 0, 250 - (outsideRadius - 13));
    ctx.lineTo(250 - 9, 250 - (outsideRadius - 5));
    ctx.lineTo(250 - 4, 250 - (outsideRadius - 5));
    ctx.lineTo(250 - 4, 250 - (outsideRadius + 5));
    ctx.fill();
  }
}

// --- Control de la animación del giro ---
function spin() {
  spinArcStart = Math.random() * 10 + 10;
  spinTime = 0;
  spinTimeTotal = (Math.random() * 3000) + 4000;
  rotateWheel();
}

function rotateWheel() {
  spinTime += 30;
  if (spinTime >= spinTimeTotal) {
    stopRotateWheel();
    return;
  }
  var spinAngle = spinArcStart - easeOut(spinTime, 0, spinArcStart, spinTimeTotal);
  startAngle += (spinAngle * Math.PI / 180);
  drawRouletteWheel();
  spinTimeout = setTimeout(rotateWheel, 30);
}

function stopRotateWheel() {
  clearTimeout(spinTimeout);
  var degrees = startAngle * 180 / Math.PI + 90;
  var arcd = arc * 180 / Math.PI;
  var index = Math.floor((360 - degrees % 360) / arcd);

  ctx.save();
  ctx.font = 'bold 30px Helvetica, Arial';
  var text = options[index];
  ctx.fillText(text, 250 - ctx.measureText(text).width / 2, 250 + 10);
  ctx.restore();

  resultado.innerHTML = `El amigo secreto es: <strong>${text ? text : ''}</strong>`;
}

function easeOut(t, b, c, d) {
  var ts = (t /= d) * t;
  var tc = ts * t;
  return b + c * (tc + -3 * ts + 3 * t);
}

// Dibuja la ruleta vacía al inicio
drawRouletteWheel();
