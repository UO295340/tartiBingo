// Canvas y configuración inicial
const canvas = document.getElementById('ruletaCanvas');
const ctx = canvas.getContext('2d');
canvas.width = 600;
canvas.height = 600;

const spinButton = document.getElementById('spinButton');
const historialUl = document.getElementById('seleccionados');

// Lista de participantes con imágenes (reemplaza las URLs con las de tus imágenes)
let participantes = [
    { nombre: 'Carmen', imagen: 'Carmen.png' },
    { nombre: 'Cova', imagen: 'Cova.png' },
    { nombre: 'Cris', imagen: 'Cris.png' },
    { nombre: 'Laura', imagen: 'Laura.png' },
    { nombre: 'Llara', imagen: 'Llara.png' },
    { nombre: 'Nati', imagen: 'Nati.png' },
    { nombre: 'Sheila', imagen: 'Sheila.png' },
    { nombre: 'Ea', imagen: 'Ea.png' },
    { nombre: 'Irene', imagen: 'Irene.png' },
    { nombre: 'Marta', imagen: 'Marta.png' },
    { nombre: 'Paula', imagen: 'Paula.png' },
    { nombre: 'Sara', imagen: 'Sara.png' },
    { nombre: 'Thalia', imagen: 'Thalia.png' }
];

let seleccionados = [];
let anguloActual = 0;

// Colores pastel para los segmentos
const coloresPastel = [
    "#ff99cc", // Rosa suave
    "#e9eae0", // Blanco rosado
    "#e7625f", // Amarillo pastel
    "#aa1945", // Lila claro
    "#f7bec0"  // Verde menta
];

// Cargar las imágenes antes de dibujar la ruleta
function cargarImagenes() {
    const promesas = participantes.map(participante => {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.src = participante.imagen;
            img.onload = () => {
                participante.img = img; // Almacenamos la imagen cargada en el objeto participante
                resolve();
            };
            img.onerror = reject;
        });
    });

    // Esperamos a que todas las imágenes se hayan cargado
    return Promise.all(promesas);
}

// Tamaño del segmento (depende del número de participantes)
const calcularTamañoSegmento = () => (2 * Math.PI) / participantes.length;

// Dibujar la ruleta
function dibujarRuleta() {
    const radio = canvas.width / 2;
    const tamañoSegmento = calcularTamañoSegmento();
    const imageSize = radio * 0.4; // Tamaño de la imagen basado en el radio de la ruleta (40%)

    // Limpiar el canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Dibujar los segmentos
    participantes.forEach((persona, index) => {
        const inicio = anguloActual + index * tamañoSegmento;
        const fin = inicio + tamañoSegmento;

        // Asignar colores pastel alternados
        ctx.fillStyle = coloresPastel[index % coloresPastel.length];

        // Dibujar el segmento de la ruleta
        ctx.beginPath();
        ctx.moveTo(radio, radio);
        ctx.arc(radio, radio, radio, inicio, fin);
        ctx.closePath();
        ctx.fill();

        // Dibujar la imagen del participante en el segmento
        const img = persona.img; // Imagen previamente cargada

        ctx.save();
        ctx.translate(radio, radio); // Mover al centro

        // Calcular la posición de la imagen dentro del segmento
        const distanciaDelCentro = radio * 0.8; // Distancia del centro al borde del segmento (80% del radio)
        ctx.rotate(inicio + tamañoSegmento / 2); // Rotar para que la imagen se ubique correctamente

        // Dibujar la imagen en la posición calculada (centrada en el borde del segmento)
        ctx.drawImage(
            img,
            distanciaDelCentro - imageSize / 2, // Centrar la imagen
            -imageSize / 2, // Centrar la imagen verticalmente
            imageSize, // Ancho dinámico
            imageSize // Alto dinámico
        );

        ctx.restore();
    });
}

// Mostrar el modal con el participante seleccionado
function mostrarModal(participante) {
    const modal = document.getElementById('modalSeleccionado');
    const seleccionadoNombre = document.getElementById('seleccionadoNombre');
    const seleccionadoImagen = document.getElementById('seleccionadoImagen');
    const closeBtn = modal.querySelector('.close');

    // Establecer el nombre del participante seleccionado
    seleccionadoNombre.textContent = `🎀 ${participante.nombre} 🎀`;

    // Establecer la imagen del participante seleccionado
    seleccionadoImagen.src = participante.imagen;
    seleccionadoImagen.alt = `Imagen de ${participante.nombre}`;

    modal.style.display = 'block'; // Mostrar el modal

    // Cerrar el modal al hacer clic en el botón de cerrar
    closeBtn.onclick = () => {
        modal.style.display = 'none';
    };

    // Cerrar el modal al hacer clic fuera del contenido
    window.onclick = (event) => {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    };
}


// Modificar la función girarRuleta
function girarRuleta() {
    if (participantes.length === 0) {
        alert('No hay más participantes.');
        return;
    }

    const vueltas = Math.random() * 10 + 5; // Vueltas aleatorias
    const indiceSeleccionado = Math.floor(Math.random() * participantes.length);
    const tamañoSegmento = calcularTamañoSegmento();
    const anguloSeleccionado = indiceSeleccionado * tamañoSegmento + tamañoSegmento / 2;

    let incremento = 0;
    const intervalo = setInterval(() => {
        incremento += 0.1; // Velocidad inicial
        anguloActual += incremento;

        if (incremento > vueltas) {
            clearInterval(intervalo);

            // Determinar el seleccionado
            const seleccionado = participantes[indiceSeleccionado];

            // Mostrar el modal con el nombre y la imagen
            mostrarModal(seleccionado);

            // Eliminar del tablero y añadir al historial
            participantes.splice(indiceSeleccionado, 1);
            seleccionados.push(seleccionado);
            actualizarHistorial();

            anguloActual = 0;
            dibujarRuleta();
        }

        dibujarRuleta();
    }, 50);
}


// Actualizar historial
function actualizarHistorial() {
    historialUl.innerHTML = '';
    seleccionados.forEach(participante => {
        const li = document.createElement('li');
        li.textContent = participante.nombre;
        historialUl.appendChild(li);
    });
}

// Eventos
spinButton.addEventListener('click', girarRuleta);

// Inicializar
cargarImagenes().then(() => {
    dibujarRuleta();
}).catch(error => {
    console.error("Error al cargar las imágenes:", error);
});