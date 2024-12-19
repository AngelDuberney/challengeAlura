document.addEventListener('DOMContentLoaded', cargarExperiencias);

// Agregar evento para la barra de búsqueda
document.querySelector('#buscador').addEventListener('input', filtrarExperiencias);

function esURLValida(url) {
    try {
        const parsedUrl = new URL(url); // Valida que sea una URL válida
        return parsedUrl.protocol === 'http:' || parsedUrl.protocol === 'https:'; // Acepta solo URLs http/https
    } catch {
        return false;
    }
}

document.querySelector('#form-experiencia').addEventListener('submit', function (event) {
    event.preventDefault();

    // Validación de los campos
    const nombre = document.querySelector('#nombre').value.trim();
    const calificacion = document.querySelector('#calificacion').value.trim();
    const comentario = document.querySelector('#comentario').value.trim();
    const urlImagen = document.querySelector('#imagen').value.trim();

    if (!esURLValida(urlImagen)) {
        alert('Por favor, ingresa un enlace válido de imagen.');
        return;
    }

    if (!nombre || !calificacion || !comentario) {
        alert('Por favor, completa todos los campos.');
        return;
    }

    const experiencia = { nombre, calificacion, comentario, imagen: urlImagen };

    // Validación específica de la calificación
    if (calificacion < 1 || calificacion > 10) {
        alert('La calificación debe estar entre 1 y 10.');
        return;
    }

    guardarExperiencia(experiencia);
    limpiarCollage();
    cargarExperiencias();  // Recargar experiencias con los nuevos datos
    event.target.reset();   // Limpiar el formulario
});

function guardarExperiencia(experiencia) {
    try {
        const maxExperiencias = 20; // Límite de experiencias almacenadas
        const experiencias = JSON.parse(localStorage.getItem('experiencias')) || [];

        if (experiencias.length >= maxExperiencias) {
            experiencias.pop(); // Elimina la más antigua
        }

        experiencias.unshift(experiencia); // Agrega al principio
        localStorage.setItem('experiencias', JSON.stringify(experiencias));
    } catch (error) {
        console.error('Error al guardar la experiencia:', error);
    }
}

function cargarExperiencias() {
    const experiencias = JSON.parse(localStorage.getItem('experiencias')) || [];
    const collage = document.querySelector('#collage-experiencias');
    collage.innerHTML = '';

    if (experiencias.length === 0) {
        collage.innerHTML = '<p class="text-center">No hay experiencias aún. ¡Sé el primero en agregar una!</p>';
        return;
    }

    const fragment = document.createDocumentFragment();
    experiencias.forEach((experiencia, index) => {
        const div = document.createElement('div');
        div.className = 'col-md-4 producto';
        div.innerHTML = `
            <img src="${experiencia.imagen}" alt="${experiencia.nombre}">
            <div class="overlay">
                <h5>${experiencia.nombre}</h5>
                <p>Calificación: ${experiencia.calificacion}/10</p>
                <p>${experiencia.comentario}</p>
            </div>
            <button class="delete-btn" onclick="eliminarExperiencia(${index})"><i class="fas fa-trash-alt"></i></button>
        `;
        fragment.appendChild(div);
    });

    collage.appendChild(fragment);
}

function eliminarExperiencia(index) {
    try {
        const experiencias = JSON.parse(localStorage.getItem('experiencias')) || [];
        experiencias.splice(index, 1); // Elimina la experiencia en el índice dado
        localStorage.setItem('experiencias', JSON.stringify(experiencias));
        cargarExperiencias(); // Recargar las experiencias después de la eliminación
    } catch (error) {
        console.error('Error al eliminar la experiencia:', error);
    }
}

// Función para filtrar las experiencias
function filtrarExperiencias() {
    const busqueda = document.querySelector('#buscador').value.trim().toLowerCase();
    const experiencias = JSON.parse(localStorage.getItem('experiencias')) || [];
    const collage = document.querySelector('#collage-experiencias');
    collage.innerHTML = '';

    const experienciasFiltradas = experiencias.filter(experiencia => {
        const nombreMatch = experiencia.nombre.toLowerCase().includes(busqueda);
        const calificacionMatch = experiencia.calificacion.toString().includes(busqueda);
        return nombreMatch || calificacionMatch;
    });

    if (experienciasFiltradas.length === 0) {
        collage.innerHTML = '<p class="text-center">No se encontraron experiencias.</p>';
        return;
    }

    const fragment = document.createDocumentFragment();
    experienciasFiltradas.forEach((experiencia, index) => {
        const div = document.createElement('div');
        div.className = 'col-md-4 producto';
        div.innerHTML = `
            <img src="${experiencia.imagen}" alt="${experiencia.nombre}">
            <div class="overlay">
                <h5>${experiencia.nombre}</h5>
                <p>Calificación: ${experiencia.calificacion}/10</p>
                <p>${experiencia.comentario}</p>
            </div>
            <button class="delete-btn" onclick="eliminarExperiencia(${index})"><i class="fas fa-trash-alt"></i></button>
        `;
        fragment.appendChild(div);
    });

    collage.appendChild(fragment);
}

// Limpiar el collage cuando se haga la búsqueda
function limpiarCollage() {
    document.querySelector('#collage-experiencias').innerHTML = '';
}
