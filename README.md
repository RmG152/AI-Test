# **Proyecto de Test de IAs Automatizado y Personalizable**

Este proyecto te permite crear una página de GitHub Pages que genera automáticamente una galería de tus aplicaciones web, organizadas por proyecto y por la IA utilizada. La página es totalmente personalizable a través de un fichero config.json y se actualiza sola cada vez que añades un nuevo proyecto al repositorio.

## **Cómo Funciona**

1. **config.json**: Este es tu panel de control. Aquí defines el título de la página, los colores, los nombres de las IAs, sus iconos, y qué carpetas debe ignorar el sistema.  
2. **GitHub Action**: Cada vez que haces push, una Action se ejecuta.  
3. **Script (generate-structure.mjs)**: La Action corre un script de Node.js. Este script lee tu config.json y escanea las carpetas de tu proyecto para ver qué aplicaciones has subido.  
4. **structure.json**: El script genera este fichero, que es un mapa de tus proyectos.  
5. **index.html**: La página principal lee config.json y structure.json para construir dinámicamente el menú de navegación con tus colores, iconos y proyectos.

## **Estructura de Carpetas**

Para que el sistema funcione, tu repositorio debe seguir esta estructura:  
/  
├── App1/  
│   ├── Gemini/  
│   │   └── index.html  \<-- Tu aplicación  
│   ├── ChatGPT/  
│   │   └── index.html  
│   └── ...  
├── App2/  
│   ├── Claude/  
│   │   └── index.html  
│   └── ...  
├── .github/  
│   └── workflows/  
│       └── pages.yml  
├── scripts/  
│   └── generate-structure.mjs  
├── config.json         \<-- ¡Tu fichero de configuración\!  
└── index.html

## **Cómo Configurarlo**

1. **Crea los archivos:**  
   * Copia los ficheros index.html, config.json y la carpeta scripts con generate-structure.mjs en la raíz de tu repositorio.  
   * Crea la ruta .github/workflows/ y dentro, el fichero pages.yml.  
2. **Personaliza config.json:**  
   * Abre config.json y edítalo a tu gusto.  
   * **site**: Cambia el título, la descripción, el autor y los colores del tema.  
   * **ais**: Asegúrate de que los nombres de las IAs (en minúsculas, como gemini, chatgpt) coinciden con los nombres de las carpetas que usarás. Puedes añadir o quitar IAs según necesites.  
   * **structure**: Define qué carpetas ignorar y qué nombres de fichero (index.html, etc.) debe buscar el script como punto de entrada de tus apps.  
3. **Sube tus proyectos:**  
   * Crea las carpetas para tus aplicaciones (App1, App2, etc.).  
   * Dentro de cada una, crea subcarpetas con el nombre de la IA (ej. Gemini, Claude), que deben coincidir con las claves que definiste en config.json.  
   * Sube los ficheros de tu aplicación dentro de la carpeta de la IA correspondiente.  
4. **Configura GitHub Pages:**  
   * Ve a la pestaña "Settings" (Configuración) de tu repositorio.  
   * En el menú de la izquierda, selecciona "Pages".  
   * En la sección "Build and deployment", en "Source", selecciona **"GitHub Actions"**.  
5. **¡Listo\!**  
   * Haz push con todos los cambios. La GitHub Action se ejecutará, generará el structure.json y desplegará tu nueva página personalizada.