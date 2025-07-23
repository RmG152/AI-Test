<template>
  <div class="pomodoro" :class="status">
    <input v-model="name" class="pomodoro-name" placeholder="Nombre de la tarea..." />
    <div class="timer">{{ formattedTime }}</div>
    <div class="controls">
      <button @click="startStop">{{ isRunning ? 'Pausar' : 'Iniciar' }}</button>
      <button @click="reset">Resetear</button>
      <button @click="$emit('remove')" class="remove-btn">✖</button>
    </div>
    <div class="status-info">
      <span>{{ status === 'working' ? 'Trabajo' : 'Descanso' }}</span>
      <span>Ciclos: {{ cyclesCompleted }}</span>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onUnmounted } from 'vue';

// Emite un evento para ser eliminado por el padre
defineEmits(['remove']);

// Estado del Pomodoro
const name = ref('');
const workTime = 25 * 60; // 25 minutos
const breakTime = 5 * 60; // 5 minutos
const timeLeft = ref(workTime);
const isRunning = ref(false);
const timerId = ref(null);
const status = ref('working'); // 'working' o 'breaking'
const cyclesCompleted = ref(0);

// Formatea el tiempo para mostrarlo como MM:SS
const formattedTime = computed(() => {
  const minutes = Math.floor(timeLeft.value / 60).toString().padStart(2, '0');
  const seconds = (timeLeft.value % 60).toString().padStart(2, '0');
  return `${minutes}:${seconds}`;
});

// Lógica del temporizador
const tick = () => {
  if (timeLeft.value > 0) {
    timeLeft.value--;
  } else {
    // Cambia de estado (trabajo -> descanso o viceversa)
    if (status.value === 'working') {
      status.value = 'breaking';
      timeLeft.value = breakTime;
      cyclesCompleted.value++;
      // Podrías añadir una notificación aquí
    } else {
      status.value = 'working';
      timeLeft.value = workTime;
    }
  }
};

// Iniciar o pausar el temporizador
const startStop = () => {
  isRunning.value = !isRunning.value;
  if (isRunning.value) {
    timerId.value = setInterval(tick, 1000);
  } else {
    clearInterval(timerId.value);
  }
};

// Resetear el temporizador
const reset = () => {
  clearInterval(timerId.value);
  isRunning.value = false;
  status.value = 'working';
  timeLeft.value = workTime;
};

// Limpiar el intervalo cuando el componente se destruye para evitar fugas de memoria
onUnmounted(() => {
  clearInterval(timerId.value);
});
</script>

<style scoped>
/* Estilos para cada Pomodoro */
.pomodoro {
  border: 1px solid #ccc;
  border-radius: 8px;
  padding: 16px;
  margin: 10px;
  width: 280px;
  text-align: center;
  background-color: #f9f9f9;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  position: relative;
}
.pomodoro.working { border-left: 5px solid #ef5350; }
.pomodoro.breaking { border-left: 5px solid #42a5f5; }
.pomodoro-name { border: none; font-size: 1.1em; font-weight: bold; width: 90%; text-align: center; margin-bottom: 10px; }
.timer { font-size: 3.5em; font-weight: bold; margin: 10px 0; }
.controls button { margin: 0 5px; padding: 8px 12px; border-radius: 4px; border: 1px solid #ddd; cursor: pointer; }
.remove-btn { position: absolute; top: 5px; right: 5px; border: none; background: transparent; font-size: 1.2em; cursor: pointer; color: #aaa; }
.status-info { display: flex; justify-content: space-between; margin-top: 15px; font-size: 0.9em; color: #666; }
</style>