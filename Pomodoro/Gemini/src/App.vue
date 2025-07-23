<template>
  <div id="app-container">
    <header>
      <h1>Multi-Pomodoro</h1>
      <button @click="addPomodoro" class="add-new-btn">+ Añadir Pomodoro</button>
    </header>
    <main class="pomodoro-list">
      <Pomodoro
        v-for="pomo in pomodoros"
        :key="pomo.id"
        @remove="removePomodoro(pomo.id)"
      />
    </main>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import Pomodoro from './components/Pomodoro.vue';

// Lista de pomodoros
const pomodoros = ref([
  { id: Date.now() } // Empezamos con un Pomodoro por defecto
]);

// Añadir un nuevo pomodoro a la lista
const addPomodoro = () => {
  pomodoros.value.push({ id: Date.now() });
};

// Eliminar un pomodoro de la lista por su ID
const removePomodoro = (idToRemove) => {
  pomodoros.value = pomodoros.value.filter(p => p.id !== idToRemove);
};
</script>

<style>
/* Estilos globales */
body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; background-color: #f0f2f5; }
#app-container { max-width: 1200px; margin: 0 auto; padding: 20px; }
header { text-align: center; margin-bottom: 20px; }
header h1 { color: #333; }
.add-new-btn { background-color: #4CAF50; color: white; border: none; padding: 10px 20px; font-size: 1em; border-radius: 5px; cursor: pointer; }
.pomodoro-list { display: flex; flex-wrap: wrap; justify-content: center; gap: 10px; }
</style>