import { mkdir, writeFile } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';
import readline from 'readline';

// --- Configuración ---
// Lista de las IAs para las que se crearán carpetas.
const AIS_TO_CREATE = [
    'Gemini',
    'Claude',
    'ChatGPT',
    'DeepSeek',
    'Le Chat',
    'Grok'
];

// Contenido básico para el fichero index.html de cada IA.
const placeholderHtml = `<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Placeholder</title>
    <style>
        body { 
            font-family: sans-serif; 
            display: flex; 
            justify-content: center; 
            align-items: center; 
            height: 100vh; 
            margin: 0; 
            background-color: #f0f0f0;
        }
        h1 {
            color: #333;
        }
    </style>
</head>
<body>
    <h1>Aplicación en desarrollo...</h1>
</body>
</html>`;

// --- Lógica del Script ---

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

/**
 * Sanea un nombre de aplicación para que sea un nombre de carpeta válido.
 * Reemplaza espacios con guiones y elimina caracteres no alfanuméricos.
 * @param {string} name - El nombre de la aplicación introducido por el usuario.
 * @returns {string} - El nombre saneado.
 */
function sanitizeAppName(name) {
    return name
        .trim()
        .replace(/\s+/g, '-') // Reemplaza espacios con guiones
        .replace(/[^a-zA-Z0-9-]/g, ''); // Elimina caracteres no válidos
}

/**
 * Función principal que ejecuta el script.
 */
async function main() {
    rl.question('Introduce el nombre de la nueva aplicación: ', async (appName) => {
        if (!appName) {
            console.error('❌ Error: El nombre de la aplicación no puede estar vacío.');
            rl.close();
            return;
        }

        const appFolderName = sanitizeAppName(appName);
        const appPath = path.join(process.cwd(), appFolderName);

        // 1. Comprobar si la carpeta de la aplicación ya existe.
        if (existsSync(appPath)) {
            console.error(`❌ Error: La carpeta "${appFolderName}" ya existe.`);
            rl.close();
            return;
        }

        try {
            // 2. Crear la carpeta principal de la aplicación.
            console.log(`\n📁 Creando carpeta principal: ${appFolderName}`);
            await mkdir(appPath);

            // 3. Crear una subcarpeta para cada IA.
            for (const ai of AIS_TO_CREATE) {
                const aiFolderName = ai.charAt(0).toUpperCase() + ai.slice(1).toLowerCase();
                const aiPath = path.join(appPath, aiFolderName);
                console.log(`   └─ Creando subcarpeta para IA: ${aiFolderName}`);
                await mkdir(aiPath);

                // 4. Crear un fichero index.html de marcador de posición.
                const indexPath = path.join(aiPath, 'index.html');
                await writeFile(indexPath, placeholderHtml);
                console.log(`      └─ Creado fichero: index.html`);
            }

            console.log(`\n✅ ¡Éxito! La estructura para la aplicación "${appFolderName}" ha sido creada.`);
            console.log('Ahora puedes añadir los ficheros de tu aplicación en sus respectivas carpetas.');

        } catch (error) {
            console.error('\n🔥 Ocurrió un error durante la creación de carpetas:', error);
        } finally {
            rl.close();
        }
    });
}

// Iniciar la ejecución del script.
main();
