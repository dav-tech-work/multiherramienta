window.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('escaner-form');
    const resultadoElement = document.getElementById('resultado');
    const loadingElement = document.getElementById('loading');
    const sugerenciasContainer = document.getElementById('sugerencias');
    const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');

    if (!form || !resultadoElement) return;

    // Sugerencias de rangos comunes
    const sugerenciasRangos = [
        { rango: '192.168.1.0/24', descripcion: 'Red local típica' },
        { rango: '10.0.0.0/24', descripcion: 'Red privada clase A' },
        { rango: '172.16.0.0/24', descripcion: 'Red privada clase B' }
    ];

    // Mostrar sugerencias si existe el contenedor
    if (sugerenciasContainer) {
        sugerenciasRangos.forEach(({ rango, descripcion }) => {
            const btn = document.createElement('button');
            btn.className = 'btn btn-sm btn-outline-secondary mr-2';
            btn.textContent = rango;
            btn.title = descripcion;
            btn.onclick = (e) => {
                e.preventDefault();
                form.rango.value = rango;
            };
            sugerenciasContainer.appendChild(btn);
        });
    }

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const rango = form.rango.value.trim();

        if (!rango) {
            mostrarError('Por favor, introduce un rango de red válido');
            return;
        }

        try {
            mostrarCargando();
            const response = await fetch('/escaner-red', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-Token': csrfToken
                },
                body: JSON.stringify({ rango })
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error || 'Error al realizar el escaneo');
            }

            const data = await response.json();
            mostrarResultado(data.resultado);
        } catch (error) {
            mostrarError(error.message || 'Error al realizar el escaneo');
            console.error('Error:', error);
        }
    });

    function mostrarCargando() {
        if (loadingElement) loadingElement.style.display = 'block';
        resultadoElement.innerHTML = 'Escaneando la red... (esto puede tardar unos minutos)';
    }

    function mostrarResultado(resultado) {
        if (loadingElement) loadingElement.style.display = 'none';
        
        // Si el resultado es un array de IPs
        if (Array.isArray(resultado)) {
            resultadoElement.innerHTML = `
                <h4>IPs encontradas (${resultado.length}):</h4>
                <ul class="list-group">
                    ${resultado.map(ip => `<li class="list-group-item">${ip}</li>`).join('')}
                </ul>`;
            return;
        }
        
        // Si es un string (mensaje de error u otro tipo de resultado)
        resultadoElement.innerHTML = `<pre>${resultado}</pre>`;
    }

    function mostrarError(mensaje) {
        if (loadingElement) loadingElement.style.display = 'none';
        resultadoElement.innerHTML = `<div class="alert alert-danger">${mensaje}</div>`;
    }
});