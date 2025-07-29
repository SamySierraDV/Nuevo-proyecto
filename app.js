// El principal objetivo de este desafío es fortalecer tus habilidades en lógica de programación. Aquí deberás desarrollar la lógica para resolver el problema.de
let amigo = document.getElementById('amigo');
let nombresAmigos = [];
let listaAmigos = document.getElementById('listaAmigos');

let resultado = document.getElementById('resultado');

function agregarAmigo() {
    let nombre = amigo.value;
    if (nombresAmigos.includes(nombre)) {
        alert('El nombre ya existe');
    } else if (amigo.value === '') {
        alert('El nombre no puede estar vacío');
    } else {
        nombresAmigos.push(nombre);
        amigo.value = '';
        mostrarAmigos();
    }
}

function mostrarAmigos() {
    listaAmigos.innerHTML = '';
    nombresAmigos.forEach(nombre => {
        let li = document.createElement('li');
        li.textContent = nombre;
        listaAmigos.appendChild(li);
    });
}

function sortearAmigo() {
    let sortearAmigo = Math.floor(Math.random() * nombresAmigos.length);

    if (nombresAmigos.length === 0) {
        alert('No hay amigos');
        return;
    }
    else if (nombresAmigos.length === 1) {
        alert('Son minimo 2 hay amigos');
        return;
    }
    else {
        sortearAmigo = sortearAmigo - 1;
    }
    resultado.innerHTML = `El amigo secreto es ${nombresAmigos[sortearAmigo]}`;
    mostrarAmigos();
    
}



