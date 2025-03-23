 // Función para cargar y resaltar código
async function cargarCodigo(element) {
    try {
        const src = element.dataset.src;
        if (!src) {
            console.error('No se encontró el atributo data-src');
            return;
        }

        console.log('Intentando cargar:', src); // Debug

        const response = await fetch(src);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const text = await response.text();
        element.textContent = text;
        
        // Asegurarse de que se aplica el resaltado
        element.classList.add('language-python');
        hljs.highlightElement(element);
    } catch (error) {
        console.error("Error al cargar el archivo:", error);
        element.textContent = "Error al cargar el código.";
    }
}

// Cargar el código cuando se abre un details
document.addEventListener('click', async function(e) {
    const summary = e.target.closest('summary');
    if (summary) {
        const details = summary.parentElement;
        if (details.hasAttribute('open')) {
            return; // Ya está abierto, no hacer nada
        }
        
        const codeBlocks = details.querySelectorAll('code[data-src]');
        for (const block of codeBlocks) {
            if (!block.textContent.trim()) {
                await cargarCodigo(block);
            }
        }
    }
});

// Cargar el código del primer details si está abierto por defecto
document.addEventListener('DOMContentLoaded', function() {
    // Configurar highlight.js
    hljs.configure({
        languages: ['python'],
        cssSelector: 'pre code.language-python'
    });

    const openDetails = document.querySelector('details[open]');
    if (openDetails) {
        const codeBlocks = openDetails.querySelectorAll('code[data-src]');
        codeBlocks.forEach(block => {
            if (!block.textContent.trim()) {
                cargarCodigo(block);
            }
        });
    }
});