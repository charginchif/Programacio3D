# ANIME STRIKE — First Person Shooter

**Anime Strike** es un juego de disparos en primera persona (FPS) desarrollado completamente en el navegador utilizando **Three.js**, HTML5, CSS3 y Vanilla JavaScript. Presenta una estética ciberpunk y anime de acción, con neones, efectos visuales (glassmorphism, destellos) y un sistema de oleadas infinito.

## 🎮 Cómo jugar

Tu objetivo es sobrevivir y conseguir la mayor cantidad de puntos disparando a los orbes luminosos (objetivos) que aparecen en la arena.

### Controles
* **W, A, S, D** o **Flechas Direccionales**: Mover al personaje por la arena.
* **Ratón**: Mover la cámara (apuntar).
* **Clic Izquierdo**: Disparar.
* **ESC**: Pausar el juego / Desbloquear el cursor.

### Mecánicas de Juego
1. **Puntuación y Combos**: Cada objetivo destruido te otorga puntos. Si destruyes varios objetivos rápidamente (dentro de un margen de 3 segundos), acumularás un multiplicador de **Combo**, aumentando exponencialmente los puntos obtenidos por cada baja.
2. **Oleadas (Waves)**: El juego avanza por oleadas cada 45 segundos. Con cada nueva oleada, el número máximo de objetivos simultáneos aumenta y el tiempo de reaparición (spawn) se acorta, aumentando la dificultad.
3. **Infinidad**: Tienes munición infinita. El reto es mantener el multiplicador de combo lo más alto posible y sobrevivir a la saturación visual de niveles avanzados.

---

## 🛠️ Cómo se hizo (Detalles Técnicos)

El juego no depende de motores pesados como Unity o Unreal, sino que utiliza las capacidades nativas de WebGL a través de la librería Three.js, sin cargar recursos externos (sin imágenes, modelos 3D o archivos de audio externos). Todo se genera procedimentalmente por código.

### 1. Gráficos y Renderizado (Three.js)
* **Escena y Geometría**: La arena, los pilares, las paredes y los objetivos utilizan primitivas geométricas básicas de Three.js (`BoxGeometry`, `CylinderGeometry`, `SphereGeometry`, `TorusGeometry`).
* **Materiales y Luces**: Se utilizan materiales estándar (`MeshStandardMaterial`) con propiedades metálicas y rugosidad para reaccionar a la luz. Los toques neón se logran mediante emisión de luz (`emissive`) y luces puntuales (`PointLight`) atadas a objetos específicos.
* **Sistema de Partículas**: Las estrellas en el fondo, los rastros de las balas y las explosiones al destruir objetivos son mallas o sistemas de partículas instanciadas dinámicamente y destruidas tras un tiempo de vida (lifespan) para optimizar memoria.

### 2. Audio Procedural (Web Audio API)
¡No hay archivos `.mp3` ni `.wav`! Todos los efectos de sonido se generan en tiempo real utilizando la **Web Audio API** de JavaScript (`AudioContext`):
* **Disparo**: Ruido blanco filtrado combinado con un oscilador de baja frecuencia para dar el impacto del cañón.
* **Impacto**: Osciladores en frecuencias altas con distorsión para un sonido metálico de acierto.
* **Anotación/Combo**: Sintetizador con ondas sinusoidales simulando notas musicales (chimes) estilo anime.

### 3. Físicas y Colisiones
* **Movimiento**: Implementación manual de vectores de velocidad, inercia y colisión con los límites de la arena. Incluye un sistema de *head-bobbing* (cabeceo) al caminar simulando el paso natural.
* **Raycasting**: Para los disparos, no se calculan físicas complejas de proyectiles. Se proyecta un rayo (`Raycaster` de Three.js) desde el centro de la cámara hacia el mundo 3D. Si intersecta un orbe, registra el impacto inmediatamente (hitscan).

### 4. Interfaz de Usuario (HUD)
* El HUD, el menú de inicio y el menú de pausa están construidos con HTML normal superpuesto encima del elemento `<canvas>` del juego (posicionamiento absoluto).
* Utiliza el efecto *Glassmorphism* (fondos translúcidos con desenfoque) y estilos Neón, apoyados de animaciones CSS nativas para notificaciones flotantes, marcadores dinámicos y destellos de pantalla al acertar tiros.

---

## 📁 Estructura del Proyecto

El código fuente está dividido de manera modular para un fácil mantenimiento usando módulos ES6 de JavaScript:

* `index.html`: Estructura principal y HUD.
* `css/style.css`: Estilos visuales del HUD y pantallas de inicio/pausa.
* `js/main.js`: Archivo principal, inicializa el juego y maneja el *Game Loop* a 60fps.
* `js/scene.js`: Construcción del mapa (luces, suelo, pilares, cielo estrellado).
* `js/player.js`: Lógica de movimiento en primera persona y captura del ratón (*Pointer Lock*).
* `js/shooting.js`: Lógica del `Raycaster` para aciertos y errores.
* `js/targets.js`: Generador aleatorio de orbes y animaciones flotantes.
* `js/effects.js`: Sistema de explosiones, flash del cañón y estelas de balas.
* `js/audio.js`: Generador de sintetizadores y ruidos procedurales.
* `js/ui.js`: Conexión de los eventos del juego con las etiquetas HTML (marcador, combo).

---
*Proyecto desarrollado como práctica de Programación 3D e interactividad en navegador.*
