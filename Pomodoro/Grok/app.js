// Array para almacenar los temporizadores
let timers = [];

// Cargar temporizadores guardados al iniciar
function loadTimers() {
    const savedTimers = localStorage.getItem('timers');
    if (savedTimers) {
        timers = JSON.parse(savedTimers);
        // Restaurar temporizadores sin intervalos activos
        timers.forEach(timer => {
            timer.interval = null;
            timer.running = false;
        });
    }
    renderTimers();
}

// Guardar temporizadores en localStorage
function saveTimers() {
    localStorage.setItem('timers', JSON.stringify(timers));
}

// Crear un nuevo temporizador
function createTimer() {
    const timer = {
        id: Date.now(),          // Identificador único
        duration: 25 * 60,       // 25 minutos en segundos
        remaining: 25 * 60,      // Tiempo restante
        running: false,          // Estado del temporizador
        interval: null           // Referencia al intervalo
    };
    timers.push(timer);
    saveTimers();
    renderTimers();
}

// Iniciar un temporizador
function startTimer(id) {
    const timer = timers.find(t => t.id === id);
    if (!timer.running && timer.remaining > 0) {
        timer.running = true;
        timer.interval = setInterval(() => {
            timer.remaining--;
            if (timer.remaining <= 0) {
                clearInterval(timer.interval);
                timer.running = false;
                timer.remaining = 0;
                alert(`¡Temporizador ${id} completado!`);
            }
            renderTimers();
            saveTimers();
        }, 1000);
    }
}

// Pausar un temporizador
function pauseTimer(id) {
    const timer = timers.find(t => t.id === id);
    if (timer.running) {
        clearInterval(timer.interval);
        timer.running = false;
        timer.interval = null;
        renderTimers();
        saveTimers();
    }
}

// Detener un temporizador
function stopTimer(id) {
    const timer = timers.find(t => t.id === id);
    clearInterval(timer.interval);
    timer.interval = null;
    timer.running = false;
    timer.remaining = timer.duration;
    renderTimers();
    saveTimers();
}

// Renderizar los temporizadores en la interfaz
function renderTimers() {
    const container = document.getElementById('timers-container');
    container.innerHTML = '';
    timers.forEach(timer => {
        const minutes = Math.floor(timer.remaining / 60);
        const seconds = timer.remaining % 60;
        const timeString = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
        const timerElement = document.createElement('div');
        timerElement.innerHTML = `
            <p>${timeString}</p>
            <button onclick="startTimer(${timer.id})" ${timer.remaining === 0 ? 'disabled' : ''}>Iniciar</button>
            <button onclick="pauseTimer(${timer.id})" ${!timer.running ? 'disabled' : ''}>Pausar</button>
            <button onclick="stopTimer(${timer.id})">Detener</button>
        `;
        container.appendChild(timerElement);
    });
}

// Evento para agregar un nuevo temporizador
document.getElementById('add-timer').addEventListener('click', createTimer);

// Cargar temporizadores al iniciar la página
window.onload = loadTimers;