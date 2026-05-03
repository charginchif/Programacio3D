# Skeletal Animation con Three.js

Este proyecto demuestra cómo cargar un modelo 3D en formato `.glb` y reproducir sus animaciones esqueléticas (Skeletal Animations) usando la librería **Three.js**.

## Archivos del Proyecto

El código se ha modularizado para seguir buenas prácticas de desarrollo web, separando responsabilidades:

1. **`SkeletalAnimation.html`**: Estructura base de la página. Incluye los contenedores para la UI (pantalla de carga, botones, texto informativo) y carga los scripts (usando importmaps) y la hoja de estilos.
2. **`SkeletalAnimation.css`**: Contiene todo el diseño visual (UI) usando un estilo "glassmorphism", animaciones CSS para el círculo de carga (spinner) y el layout responsivo de los controles del HUD.
3. **`SkeletalAnimation.js`**: Contiene toda la lógica 3D de Three.js. Maneja la creación de la escena, cámara, luces, carga asíncrona del modelo 3D y el bucle de renderizado/animación.

---

## ¿Cómo Funciona? (Paso a Paso)

### 1. Escena y Configuración (Three.js)
El script de JavaScript inicializa una escena básica en Three.js que contiene:
- Una cámara en perspectiva (`PerspectiveCamera`).
- Luces para iluminar el modelo y permitir que proyecte sombras (`AmbientLight`, `DirectionalLight`, `FillLight`).
- Un suelo circular (`Mesh`) y una cuadrícula (`GridHelper`) que sirven de base visual para que el modelo no parezca estar flotando en el vacío.
- `OrbitControls` para permitir que el usuario rote y acerque la vista del modelo 3D arrastrando con el ratón.
- Un fondo generado proceduralmente con Canvas2D que dibuja un gradiente radial.

### 2. Carga del Modelo 3D
Usamos la clase `GLTFLoader` de Three.js para cargar un modelo de forma asíncrona. El modelo que usamos es **"RobotExpressive"**, un archivo `.glb` alojado en el repositorio oficial de Three.js que incluye un esqueleto (bones) y 14 animaciones pre-creadas (Correr, Caminar, Bailar, Morir, etc.).

Durante la carga:
- Se muestra un "loading spinner" que se actualiza con el porcentaje de descarga usando el callback de progreso del `GLTFLoader`.
- Se iteran las partes del modelo (`traverse`) para configurar `castShadow` y `receiveShadow` en `true`.

### 3. Skeletal Animation (Animación Esquelética)
Una vez que el modelo carga, accedemos a su lista de animaciones (`gltf.animations`).
- Se instancia un `THREE.AnimationMixer` y se le pasa el modelo 3D. El mixer funciona como el reproductor principal para las animaciones 3D ligadas al esqueleto del objeto.
- Por cada animación encontrada en el archivo, se extrae un "Action" usando `mixer.clipAction(clip)`. Estas acciones se guardan en un diccionario de Javascript (`actions`) para poder llamarlas más tarde por nombre.

### 4. Transiciones Suaves (Crossfade)
En lugar de cambiar de una animación a otra de forma cortante, implementamos una transición suave. 
Cuando el usuario cambia de animación a través de la función `playAnimation(name)`:
- La animación que se está reproduciendo actualmente hace un `fadeOut` gradual en 0.4 segundos.
- La nueva animación se reinicia y hace un `fadeIn` en el mismo lapso de tiempo.
Esto produce un movimiento fluido entre estados (por ejemplo, pasar de estar "Idle" (quieto) a "Run" (correr) de forma natural).

### 5. Interfaz y Controles
La interfaz incluye botones generados dinámicamente según la cantidad de animaciones encontradas en el archivo `.glb`.
El usuario puede interactuar de dos formas:
- **Ratón o Pantalla Táctil:** Haciendo clic en los botones del panel (HUD) de la parte inferior.
- **Teclado:** Presionando las teclas del `1` al `9` para activar las primeras animaciones de forma rápida a través del listener de evento `keydown`.

### 6. El Bucle de Animación
El corazón de la animación es la función `animate()` gestionada por `requestAnimationFrame`. En cada fotograma, se calcula la diferencia de tiempo (`delta`) usando `THREE.Clock` y se le pasa al `mixer.update(delta)`. Esto hace que las posiciones de los "huesos" del modelo se calculen en tiempo real de forma interpolada, logrando la animación en pantalla.
