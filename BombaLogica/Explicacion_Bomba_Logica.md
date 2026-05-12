# Documentación: Demostración de Bomba Lógica

> **Nota:** Este proyecto fue creado con fines estrictamente educativos y de análisis. El código no realiza ninguna acción destructiva real en el sistema.

## 🛠️ ¿Cómo se construyó y cómo funciona?

El proyecto se diseñó utilizando una arquitectura de "Caballo de Troya", donde el código malicioso se oculta dentro de una aplicación que funciona perfectamente y parece legítima.

Se divide en dos partes principales:
1. **La Aplicación Legítima (Empaquetado):** Una aplicación web funcional llamada *TaskFlow Pro* (implementada en `index.html`, `styles.css` y `app.js`). Es un gestor de tareas donde el usuario puede agregar, completar y eliminar tareas. Este es el "empaquetado" que oculta la amenaza.
2. **La Bomba Lógica (Payload):** El código malicioso (implementado en `bomba.js`) se carga silenciosamente junto con la aplicación. Utiliza una técnica llamada *Hooking* (gancho) para interceptar las acciones del usuario en la aplicación legítima (por ejemplo, contar cuántas tareas se crean) sin modificar el código original de forma obvia.

Cuando la condición del detonador se cumple, la bomba "estalla" inyectando una nueva capa visual sobre la pantalla que simula un ataque de intrusión y ransomware.

---

## 📝 Respuestas a las preguntas de análisis

### 1. ¿Qué hace la bomba lógica?
En esta simulación, cuando la bomba lógica se activa, interrumpe el funcionamiento de la aplicación legítima y simula tomar el control del sistema. Visualmente hace lo siguiente:
- Finge una intrusión mediante una terminal que muestra comandos de deshabilitación de firewalls.
- Simula un ataque de tipo *Ransomware*, mostrando una falsa barra de progreso que indica que los archivos del usuario (como documentos, fotos y bases de datos) están siendo cifrados o corrompidos.
- *Nota:* Como es una demostración segura, después de asustar al usuario, muestra una pantalla de revelación educativa explicando lo que acaba de pasar.

### 2. ¿Cuándo se activa?
La bomba lógica incluye múltiples opciones de **detonadores** (condiciones) que evalúa constantemente en segundo plano. En esta demostración se programaron 4 tipos de detonadores para ilustrar las diferentes formas en que pueden operar:
- **Por Fecha (Time Bomb):** Monitorea el reloj del sistema y detona automáticamente cuando se alcanza una fecha específica en el futuro (en este caso, el día de mañana).
- **Por Conteo de Acciones:** Monitorea el uso de la aplicación legítima y detona cuando el usuario realiza una acción un número determinado de veces (ej. crear la 5ª tarea).
- **Por Palabra Clave:** Analiza los datos ingresados por el usuario y detona si se introduce una cadena de texto específica (ej. escribir la palabra "ACTIVAR" en el título de una tarea).
- **Por Tiempo de Uso:** Detona automáticamente después de que la aplicación haya estado abierta durante 60 segundos continuos.

### 3. ¿Cómo se puede detectar?
Las bombas lógicas son difíciles de detectar porque a menudo son creadas por personas con acceso interno (insiders) y el código no se activa inmediatamente. Sin embargo, se pueden detectar mediante:
- **Auditorías y revisión de código (Code Review):** Un desarrollador revisando el código podría notar la inclusión del archivo extraño (`bomba.js`) o el patrón de "enganche" (`window.__onTaskCreated`).
- **Análisis estático de seguridad (SAST):** Herramientas automatizadas que buscan variables o funciones con nombres sospechosos, condicionales basados en fechas o bucles de monitoreo anómalos.
- **Análisis de comportamiento dinámico:** Al ejecutar el programa en un entorno aislado (*Sandbox*), los sistemas de seguridad (como un EDR o Antivirus avanzado) podrían notar que la aplicación intenta leer el reloj del sistema constantemente o intenta acceder a archivos que no le corresponden.
- **Monitoreo de integridad de archivos (FIM):** Herramientas que alertan si se añadió o modificó código en los servidores de producción sin autorización.

### 4. ¿Qué daño podría causar?
En un **escenario real**, al tener acceso a la computadora o al servidor, una bomba lógica podría ser devastadora. Los daños típicos incluyen:
- **Destrucción de datos:** Borrar bases de datos completas, limpiar discos duros o formatear servidores (ej. usando comandos como `rm -rf /`).
- **Cifrado y secuestro (Ransomware):** Cifrar todos los archivos importantes de la empresa y exigir un rescate económico para devolver la llave de descifrado.
- **Exfiltración de información confidencial:** Enviar en secreto correos electrónicos, contraseñas, bases de datos de clientes o secretos industriales a un servidor controlado por el atacante.
- **Sabotaje:** Desactivar sistemas críticos (como la red eléctrica, sistemas de refrigeración o sistemas financieros) en un momento específico calculado para causar el máximo daño.

### 5. ¿Cómo se puede detener?
La contención y prevención requieren una combinación de políticas de seguridad y medidas técnicas:
- **Aislamiento inmediato:** Si se sospecha de un equipo comprometido o si la bomba está en proceso de ejecución, lo primero es desconectar el dispositivo de la red para evitar que se propague o envíe datos al exterior.
- **Desactivación del código:** Localizar el script o bloque de código que contiene el detonador y la carga maliciosa, y eliminarlo o comentarlo para neutralizar la amenaza.
- **Principio de menor privilegio:** Asegurarse de que el programa legítimo y sus usuarios tengan permisos restringidos en el sistema operativo, de modo que si la bomba detona, no tenga permisos de administrador para borrar o cifrar archivos críticos.
- **Restauración de copias de seguridad (Backups):** Tener respaldos frecuentes, aislados y cifrados que permitan restaurar el sistema a un punto seguro antes de que la bomba lógica fuera instalada en caso de que ya haya causado daño.
