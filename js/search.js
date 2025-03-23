// Configuración de búsqueda
document.addEventListener('DOMContentLoaded', () => {
    const searchContainer = document.querySelector('.nav-right');
    if (!searchContainer) return;

    // Crear y añadir el HTML del buscador si no existe
    if (!document.querySelector('.search-container')) {
        const searchHTML = `
            <div class="search-container">
                <button class="search-toggle" aria-label="Abrir búsqueda">
                    <i class="fas fa-search"></i>
                </button>
                <div class="search-dropdown">
                    <input type="text" id="searchInput" placeholder="Buscar..." aria-label="Campo de búsqueda">
                    <button class="close-search" aria-label="Cerrar búsqueda">
                        <i class="fas fa-times"></i>
                    </button>
                    <div class="search-results"></div>
                </div>
            </div>
        `;
        searchContainer.insertAdjacentHTML('afterbegin', searchHTML);
    }

    const searchToggle = document.querySelector('.search-toggle');
    const searchDropdown = document.querySelector('.search-dropdown');
    const searchInput = document.getElementById('searchInput');
    const closeSearch = document.querySelector('.close-search');
    const searchResults = document.querySelector('.search-results');

    // Función para mostrar/ocultar el dropdown de búsqueda
    function toggleSearch() {
        searchDropdown.classList.toggle('active');
        if (searchDropdown.classList.contains('active')) {
            searchInput.focus();
        }
    }

    // Cerrar búsqueda al hacer clic fuera
    document.addEventListener('click', (e) => {
        const isSearchContainer = e.target.closest('.search-container');
        if (!isSearchContainer && searchDropdown.classList.contains('active')) {
            searchDropdown.classList.remove('active');
        }
    });

    // Eventos de búsqueda
    searchToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleSearch();
    });

    closeSearch.addEventListener('click', (e) => {
        e.stopPropagation();
        searchDropdown.classList.remove('active');
    });

    // Prevenir que el dropdown se cierre al hacer clic dentro
    searchDropdown.addEventListener('click', (e) => {
        e.stopPropagation();
    });

    // Función de búsqueda
    function performSearch(query) {
        // Elementos buscables por página
        const searchableSelectors = {
            '/pages/formacion.html': '[data-searchable], .course-card, .skill-card',
            '/pages/curriculum.html': '.experience-item, .education-item, .skill-item',
            '/pages/proyectos.html': '.project-card, .project-title, .project-description',
            'default': '[data-searchable]'
        };

        // Determinar qué selector usar basado en la página actual
        const currentPath = window.location.pathname;
        const selector = searchableSelectors[currentPath] || searchableSelectors.default;
        
        const searchableElements = document.querySelectorAll(selector);
        const results = [];

        searchableElements.forEach(element => {
            const title = element.getAttribute('data-search-title') || 
                         element.querySelector('.title')?.textContent || 
                         element.querySelector('h2, h3')?.textContent || 
                         element.textContent;
            
            const content = element.textContent;

            if (title.toLowerCase().includes(query.toLowerCase()) || 
                content.toLowerCase().includes(query.toLowerCase())) {
                results.push({
                    title: title,
                    content: content.substring(0, 100) + '...',
                    element: element
                });
            }
        });

        return results;
    }

    // Mostrar resultados
    function displayResults(results) {
        searchResults.innerHTML = '';

        if (results.length === 0) {
            searchResults.innerHTML = '<div class="search-result-item">No se encontraron resultados</div>';
            return;
        }

        results.forEach(result => {
            const resultItem = document.createElement('div');
            resultItem.className = 'search-result-item';
            resultItem.innerHTML = `
                <div class="search-result-title">${result.title}</div>
                <div class="search-result-content">${result.content}</div>
            `;

            resultItem.addEventListener('click', () => {
                result.element.scrollIntoView({ behavior: 'smooth' });
                // Resaltar el elemento encontrado
                result.element.classList.add('search-highlight');
                setTimeout(() => {
                    result.element.classList.remove('search-highlight');
                }, 2000);
                searchDropdown.classList.remove('active');
            });

            searchResults.appendChild(resultItem);
        });
    }

    // Evento de búsqueda en tiempo real
    let searchTimeout;
    searchInput.addEventListener('input', (e) => {
        clearTimeout(searchTimeout);
        const query = e.target.value;

        searchTimeout = setTimeout(() => {
            if (query.length >= 2) {
                const results = performSearch(query);
                displayResults(results);
            } else {
                searchResults.innerHTML = '';
            }
        }, 300);
    });

    // Manejar tecla Escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && searchDropdown.classList.contains('active')) {
            searchDropdown.classList.remove('active');
        }
    });
});
