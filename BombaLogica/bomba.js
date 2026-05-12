/**
 * =====================================================================
 * BOMBA LÓGICA — Módulo Educativo de Demostración
 * =====================================================================
 * ADVERTENCIA: Este código es EXCLUSIVAMENTE para fines educativos.
 * Demuestra cómo una bomba lógica puede ocultarse dentro de software
 * aparentemente legítimo y activarse bajo condiciones específicas.
 *
 * NO causa daño real — solo efectos visuales en el navegador.
 * =====================================================================
 */

const LogicBomb = (() => {
    // ========== CONFIGURACIÓN DEL DETONADOR ==========
    let config = {
        triggerType: 'date',          // Tipo de detonador activo
        triggerDate: getTomorrowDate(), // Fecha de activación
        triggerTaskCount: 5,           // Número de tareas para detonar
        triggerKeyword: 'ACTIVAR',     // Palabra clave
        triggerTimeSeconds: 60,        // Segundos de uso
        armed: true,                   // Estado de la bomba
        detonated: false,              // Ya detonó?
    };

    let startTime = Date.now();
    let timerInterval = null;

    function getTomorrowDate() {
        const d = new Date();
        d.setDate(d.getDate() + 1);
        return d.toISOString().split('T')[0];
    }

    // ========== INICIALIZACIÓN ==========
    function init() {
        setupEducationalPanel();
        setupTriggerMonitoring();
        updateStatusDisplay();

        // Hook: se llama cada vez que se crea una tarea
        window.__onTaskCreated = onTaskCreated;
    }

    // ========== MONITOREO DE DETONADORES ==========
    function setupTriggerMonitoring() {
        // Verificar condición cada segundo
        if (timerInterval) clearInterval(timerInterval);
        timerInterval = setInterval(() => {
            if (config.detonated || !config.armed) return;
            checkTriggerCondition();
            updateStatusDisplay();
        }, 1000);
    }

    function checkTriggerCondition() {
        switch (config.triggerType) {
            case 'date':
                checkDateTrigger();
                break;
            case 'time-usage':
                checkTimeTrigger();
                break;
            // task-count y keyword se verifican en onTaskCreated
        }
    }

    function checkDateTrigger() {
        const today = new Date().toISOString().split('T')[0];
        if (today >= config.triggerDate) {
            detonate('📅 La fecha del sistema (' + today + ') alcanzó o superó la fecha objetivo (' + config.triggerDate + ').');
        }
    }

    function checkTimeTrigger() {
        const elapsed = Math.floor((Date.now() - startTime) / 1000);
        const progress = Math.min(100, Math.round((elapsed / config.triggerTimeSeconds) * 100));
        document.getElementById('detail-progress').textContent = progress + '%';

        if (elapsed >= config.triggerTimeSeconds) {
            detonate('⏱️ El usuario utilizó la aplicación por más de ' + config.triggerTimeSeconds + ' segundos continuos.');
        }
    }

    function onTaskCreated(task, totalCount) {
        if (config.detonated || !config.armed) return;

        if (config.triggerType === 'task-count') {
            const progress = Math.round((totalCount / config.triggerTaskCount) * 100);
            document.getElementById('detail-progress').textContent = Math.min(100, progress) + '%';
            if (totalCount >= config.triggerTaskCount) {
                detonate('📋 Se crearon ' + totalCount + ' tareas, alcanzando el umbral de ' + config.triggerTaskCount + '.');
            }
        }

        if (config.triggerType === 'keyword') {
            if (task.title.toUpperCase().includes(config.triggerKeyword)) {
                detonate('🔑 Se detectó la palabra clave "' + config.triggerKeyword + '" en el título de la tarea: "' + task.title + '".');
            }
        }
    }

    // ========== DETONACIÓN ==========
    function detonate(reason) {
        if (config.detonated) return;
        config.detonated = true;
        config.armed = false;

        // Guardar razón para mostrar luego
        document.getElementById('trigger-explanation').textContent = reason || 'Detonación manual desde el panel educativo.';

        // Actualizar estado
        const statusEl = document.getElementById('bomb-status');
        statusEl.innerHTML = '<span class="status-dot" style="background:#ff5252"></span><span>DETONADA</span>';

        // Efecto de temblor en la app
        document.getElementById('app-container').classList.add('shake');

        // Mostrar overlay
        setTimeout(() => {
            document.getElementById('bomb-overlay').classList.remove('hidden');
            runPhase1();
        }, 600);
    }

    // ========== FASE 1: Terminal de "intrusión" ==========
    function runPhase1() {
        const output = document.getElementById('terminal-output');
        const lines = [
            { text: '$ scanning system...', cls: '' },
            { text: '[INFO] Conexión establecida con el host local', cls: '' },
            { text: '[INFO] Identificando procesos activos...', cls: '' },
            { text: '[WARN] Acceso no autorizado detectado', cls: 'warning' },
            { text: '[WARN] Módulo de seguridad deshabilitado', cls: 'warning' },
            { text: '[ERROR] Firewall bypassed', cls: 'error' },
            { text: '$ accessing /usr/local/data/...', cls: '' },
            { text: '[INFO] 847 archivos encontrados', cls: '' },
            { text: '[INFO] Iniciando proceso de cifrado...', cls: '' },
            { text: '[ERROR] ¡¡¡PAYLOAD ACTIVADO!!!', cls: 'error' },
            { text: '', cls: '' },
            { text: '╔══════════════════════════════════════╗', cls: 'error' },
            { text: '║    BOMBA LÓGICA DETONADA             ║', cls: 'error' },
            { text: '║    Sistema comprometido               ║', cls: 'error' },
            { text: '╚══════════════════════════════════════╝', cls: 'error' },
        ];

        let i = 0;
        const interval = setInterval(() => {
            if (i >= lines.length) {
                clearInterval(interval);
                setTimeout(() => runPhase2(), 1500);
                return;
            }
            const div = document.createElement('div');
            div.className = 'terminal-line ' + lines[i].cls;
            div.textContent = lines[i].text;
            output.appendChild(div);
            output.scrollTop = output.scrollHeight;
            i++;
        }, 350);
    }

    // ========== FASE 2: "Cifrado" falso ==========
    function runPhase2() {
        document.getElementById('bomb-phase-1').classList.add('hidden');
        document.getElementById('bomb-phase-2').classList.remove('hidden');

        const fakeFiles = [
            'C:\\Users\\Documents\\proyecto_final.docx',
            'C:\\Users\\Pictures\\vacaciones_2025.jpg',
            'C:\\Users\\Desktop\\presupuesto.xlsx',
            'C:\\Users\\Documents\\tesis_capitulo3.pdf',
            'C:\\Users\\Downloads\\codigo_fuente.zip',
            'C:\\Users\\Music\\playlist_favorita.m3u',
            'C:\\Users\\Documents\\contraseñas.txt',
            'C:\\Users\\Desktop\\presentacion.pptx',
            'C:\\Program Files\\database\\registros.db',
            'C:\\Users\\Documents\\contrato_laboral.pdf',
        ];

        const bar = document.getElementById('encrypt-bar');
        const status = document.getElementById('encrypt-status');
        const fileList = document.getElementById('file-list');
        let idx = 0;

        const interval = setInterval(() => {
            if (idx >= fakeFiles.length) {
                clearInterval(interval);
                bar.style.width = '100%';
                status.textContent = '¡Cifrado completado! Todos los archivos fueron comprometidos.';
                setTimeout(() => runPhase3(), 2500);
                return;
            }

            const progress = Math.round(((idx + 1) / fakeFiles.length) * 100);
            bar.style.width = progress + '%';
            status.textContent = 'Cifrando: ' + fakeFiles[idx];

            const line = document.createElement('div');
            line.textContent = '[ENCRYPTED] ' + fakeFiles[idx] + ' ✗';
            line.style.marginBottom = '4px';
            line.style.animation = 'fadeIn 0.3s ease';
            fileList.appendChild(line);
            fileList.scrollTop = fileList.scrollHeight;

            idx++;
        }, 600);
    }

    // ========== FASE 3: Revelación educativa ==========
    function runPhase3() {
        document.getElementById('bomb-phase-2').classList.add('hidden');
        document.getElementById('bomb-phase-3').classList.remove('hidden');

        document.getElementById('btn-restore').addEventListener('click', restore);
    }

    function restore() {
        document.getElementById('bomb-overlay').classList.add('hidden');
        document.getElementById('app-container').classList.remove('shake');

        // Resetear fases
        document.getElementById('bomb-phase-1').classList.remove('hidden');
        document.getElementById('bomb-phase-2').classList.add('hidden');
        document.getElementById('bomb-phase-3').classList.add('hidden');
        document.getElementById('terminal-output').innerHTML = '';
        document.getElementById('file-list').innerHTML = '';
        document.getElementById('encrypt-bar').style.width = '0%';

        // Re-armar
        config.detonated = false;
        config.armed = true;
        startTime = Date.now();

        const statusEl = document.getElementById('bomb-status');
        statusEl.innerHTML = '<span class="status-dot armed"></span><span>ARMADA — Esperando</span>';
        updateStatusDisplay();
    }

    // ========== PANEL EDUCATIVO ==========
    function setupEducationalPanel() {
        // Toggle panel
        document.getElementById('edu-toggle').addEventListener('click', () => {
            document.getElementById('edu-content').classList.toggle('hidden');
        });

        // Trigger selection
        document.querySelectorAll('input[name="trigger"]').forEach(radio => {
            radio.addEventListener('change', (e) => {
                config.triggerType = e.target.value;
                config.detonated = false;
                config.armed = true;
                startTime = Date.now();
                updateStatusDisplay();
            });
        });

        // Manual detonate
        document.getElementById('btn-manual-detonate').addEventListener('click', () => {
            detonate('💣 Detonación manual desde el panel de control educativo.');
        });

        // View code
        document.getElementById('btn-view-code').addEventListener('click', showCode);
        document.getElementById('code-modal-close').addEventListener('click', () => {
            document.getElementById('code-modal-overlay').classList.add('hidden');
        });
    }

    function updateStatusDisplay() {
        const typeEl = document.getElementById('detail-type');
        const condEl = document.getElementById('detail-condition');
        const progEl = document.getElementById('detail-progress');

        const labels = {
            'date': 'Fecha Específica',
            'task-count': 'Conteo de Tareas',
            'keyword': 'Palabra Clave',
            'time-usage': 'Tiempo de Uso',
        };

        typeEl.textContent = labels[config.triggerType] || config.triggerType;

        switch (config.triggerType) {
            case 'date':
                condEl.textContent = 'Fecha ≥ ' + config.triggerDate;
                const today = new Date().toISOString().split('T')[0];
                progEl.textContent = today >= config.triggerDate ? '100%' : 'Esperando...';
                break;
            case 'task-count':
                const count = TaskApp.getTaskCount();
                condEl.textContent = count + ' / ' + config.triggerTaskCount + ' tareas';
                progEl.textContent = Math.min(100, Math.round((count / config.triggerTaskCount) * 100)) + '%';
                break;
            case 'keyword':
                condEl.textContent = 'Buscar "' + config.triggerKeyword + '" en títulos';
                progEl.textContent = 'Monitoreando...';
                break;
            case 'time-usage':
                const elapsed = Math.floor((Date.now() - startTime) / 1000);
                condEl.textContent = elapsed + 's / ' + config.triggerTimeSeconds + 's';
                progEl.textContent = Math.min(100, Math.round((elapsed / config.triggerTimeSeconds) * 100)) + '%';
                break;
        }
    }

    function showCode() {
        const codeDisplay = document.getElementById('bomb-code-display');
        codeDisplay.textContent = `// ====== ANATOMÍA DE LA BOMBA LÓGICA ======

// 1. DETONADOR (Trigger Condition)
// La bomba monitorea una condición específica:
function checkTriggerCondition() {
    switch (config.triggerType) {
        case 'date':
            // Compara fecha actual con fecha objetivo
            if (today >= config.triggerDate) detonate();
            break;
        case 'task-count':
            // Cuenta acciones del usuario
            if (totalTasks >= 5) detonate();
            break;
        case 'keyword':
            // Busca palabras clave en input del usuario
            if (title.includes('ACTIVAR')) detonate();
            break;
        case 'time-usage':
            // Mide tiempo de ejecución
            if (elapsedSeconds >= 60) detonate();
            break;
    }
}

// 2. PAYLOAD (Carga Maliciosa Simulada)
// En esta demo: efectos visuales inofensivos
// En la realidad podría ser:
//   - Borrado de archivos (rm -rf, del /f)
//   - Cifrado de datos (ransomware)
//   - Exfiltración de datos a servidor remoto
//   - Corrupción de bases de datos
//   - Escalamiento de privilegios

// 3. OCULTAMIENTO (Stealth)
// El código se oculta dentro de una app legítima.
// Técnicas comunes:
//   - Nombres de variables/funciones engañosos
//   - Código mezclado con funcionalidad real
//   - Ofuscación y minificación
//   - Carga dinámica desde servidor remoto

// 4. PERSISTENCIA
// Mecanismos para sobrevivir reinicios:
//   - Registro del sistema (Windows Registry)
//   - Tareas programadas (cron, Task Scheduler)
//   - Servicios del sistema
//   - Inicio automático (Startup folder)`;

        document.getElementById('code-modal-overlay').classList.remove('hidden');
    }

    // Iniciar cuando el DOM esté listo
    document.addEventListener('DOMContentLoaded', init);

    return { detonate, restore, config };
})();
