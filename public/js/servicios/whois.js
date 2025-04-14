window.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('whois-form');
    const resultadoElement = document.getElementById('resultado');
    const loadingElement = document.getElementById('loading');
    const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');

    if (!form || !resultadoElement) return;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const dominio = form.dominio.value.trim();

        if (!dominio) {
            mostrarError('Por favor, introduce un dominio válido');
            return;
        }

        try {
            mostrarCargando();
            const response = await fetch('/whois', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-Token': csrfToken
                },
                body: JSON.stringify({ dominio })
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error || 'Error en la consulta WHOIS');
            }

            const data = await response.json();
            mostrarResultado(data.resultado);
        } catch (error) {
            mostrarError(error.message || 'Error al realizar la consulta WHOIS');
            console.error('Error:', error);
        }
    });

    function mostrarCargando() {
        if (loadingElement) loadingElement.style.display = 'block';
        resultadoElement.innerHTML = 'Consultando información WHOIS...';
    }

    function mostrarResultado(resultado) {
        if (loadingElement) loadingElement.style.display = 'none';
        resultadoElement.innerHTML = `<pre class="whois-result">${resultado}</pre>`;
    }

    function mostrarError(mensaje) {
        if (loadingElement) loadingElement.style.display = 'none';
        resultadoElement.innerHTML = `<div class="error">${mensaje}</div>`;
    }
});