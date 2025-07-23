import { useState, useEffect } from "react";

function formatTime(seconds) {
  const m = Math.floor(seconds / 60).toString().padStart(2, "0");
  const s = (seconds % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}

export default function MultiPomodoro() {
  const [pomodoros, setPomodoros] = useState([]);
  const [nextId, setNextId] = useState(1);

  function addPomodoro() {
    const id = nextId;
    setNextId(id + 1);
    setPomodoros((prev) => [
      ...prev,
      {
        id,
        name: `Pomodoro ${id}`,
        duration: 25 * 60,
        remaining: 25 * 60,
        running: false,
      },
    ]);
  }

  function togglePomodoro(id) {
    setPomodoros((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, running: !p.running } : { ...p, running: false }
      )
    );
  }

  function resetPomodoro(id) {
    setPomodoros((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, remaining: p.duration, running: false } : p
      )
    );
  }

  useEffect(() => {
    const interval = setInterval(() => {
      setPomodoros((prev) =>
        prev.map((p) => {
          if (!p.running) return p;
          const newRemaining = Math.max(p.remaining - 1, 0);
          return { ...p, remaining: newRemaining, running: newRemaining > 0 };
        })
      );
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="p-4 space-y-4">
      <button className="bg-blue-500 text-white px-4 py-2 rounded" onClick={addPomodoro}>
        Agregar Pomodoro
      </button>
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {pomodoros.map((p) => (
          <div key={p.id} className="border rounded shadow p-4 text-center">
            <div className="text-xl font-bold mb-2">{p.name}</div>
            <div className="text-3xl font-mono mb-2">{formatTime(p.remaining)}</div>
            <div className="flex justify-center gap-2">
              <button
                className="bg-green-500 text-white px-4 py-1 rounded"
                onClick={() => togglePomodoro(p.id)}
              >
                {p.running ? "Pausar" : "Iniciar"}
              </button>
              <button
                className="bg-gray-300 px-4 py-1 rounded"
                onClick={() => resetPomodoro(p.id)}
              >
                Reiniciar
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
