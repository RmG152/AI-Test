import { readdir, stat, readFile } from 'fs/promises';
import { writeFile } from 'fs/promises';
import path from 'path';

/**
 * Escanea el directorio para construir la estructura del proyecto,
 * basándose en un fichero de configuración.
 * @param {string} dir - Directorio raíz a escanear.
 * @returns {Promise<object>} - Objeto con la estructura de las apps.
 */
async function scanDirectory(dir) {
    console.log('Leyendo fichero de configuración: config.json');
    const configContent = await readFile(path.join(dir, 'config.json'), 'utf8');
    const config = JSON.parse(configContent);
    
    const { ignoreFolders, indexFiles } = config.structure;
    const ignoredDirs = new Set(ignoreFolders);
    console.log('Carpetas a ignorar:', ignoredDirs);
    console.log('Ficheros índice a buscar:', indexFiles);

    const structure = { apps: [] };

    try {
        const topLevelItems = await readdir(dir);

        for (const appName of topLevelItems) {
            const appPath = path.join(dir, appName);
            
            if (!ignoredDirs.has(appName) && (await stat(appPath)).isDirectory()) {
                console.log(`-> Encontrada carpeta de aplicación: ${appName}`);
                const appData = { name: appName, ais: [] };
                const aiDirs = await readdir(appPath);

                for (const aiName of aiDirs) {
                    const aiPath = path.join(appPath, aiName);
                    if ((await stat(aiPath)).isDirectory()) {
                        console.log(`--> Encontrada carpeta de IA: ${aiName}`);
                        const aiFiles = await readdir(aiPath);
                        
                        // Buscar el primer fichero índice válido
                        const indexFile = indexFiles.find(file => aiFiles.includes(file));

                        if (indexFile) {
                            const relativePath = path.join(appName, aiName, indexFile).replace(/\\/g, '/');
                            console.log(`--- Fichero índice encontrado: ${relativePath}`);
                            appData.ais.push({ name: aiName, path: relativePath });
                        } else {
                            console.warn(`Aviso: No se encontró un fichero índice en ${aiPath}`);
                        }
                    }
                }

                if (appData.ais.length > 0) {
                    structure.apps.push(appData);
                }
            }
        }
    } catch (error) {
        console.error('Error durante el escaneo del directorio:', error);
        throw error;
    }

    // Ordenar alfabéticamente para consistencia
    structure.apps.sort((a, b) => a.name.localeCompare(b.name));
    structure.apps.forEach(app => app.ais.sort((a, b) => a.name.localeCompare(b.name)));

    return structure;
}

// --- Punto de entrada del script ---
console.log('Generando fichero de estructura del proyecto...');
scanDirectory('.')
    .then(structure => writeFile('structure.json', JSON.stringify(structure, null, 2), 'utf8'))
    .then(() => console.log('Éxito: El fichero structure.json ha sido creado/actualizado.'))
    .catch(error => {
        console.error('Fallo al generar el fichero de estructura:', error);
        process.exit(1);
    });
