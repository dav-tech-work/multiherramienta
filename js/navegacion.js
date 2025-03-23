// Configuración base de navegación

const initNavigation = () => {
    // Referencias a elementos del DOM
    const menuToggle = document.querySelector('.menu-toggle');
    const menuItems = document.querySelector('.menu-items');
    const searchBtn = document.getElementById('searchBtn');

    if (!menuToggle || !menuItems) {
        console.error('No se encontraron elementos de navegación necesarios');
        return;
    }

    // Toggle del menú móvil
    menuToggle.addEventListener('click', (e) => {
        e.stopPropagation(); // Prevenir que el click se propague al documento
        menuItems.classList.toggle('active');
        // Accesibilidad
        const isExpanded = menuItems.classList.contains('active');
        menuToggle.setAttribute('aria-expanded', isExpanded);
    });

    // Cerrar menú al hacer clic fuera
    document.addEventListener('click', (e) => {
        if (menuItems.classList.contains('active') && 
            !menuToggle.contains(e.target) && 
            !menuItems.contains(e.target)) {
            menuItems.classList.remove('active');
            menuToggle.setAttribute('aria-expanded', false);
        }
    });

    // Cerrar menú al redimensionar a desktop
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            if (window.innerWidth > 500) {
                menuItems.classList.remove('active');
                menuToggle.setAttribute('aria-expanded', false);
            }
        }, 250); // Debounce de 250ms
    });

    // Cerrar menú al hacer clic en un enlace
    menuItems.addEventListener('click', (e) => {
        if (e.target.tagName === 'A') {
            menuItems.classList.remove('active');
            menuToggle.setAttribute('aria-expanded', false);
        }
    });

    // Sistema de búsqueda con validación
    searchBtn?.addEventListener('click', () => {
        // Implementar lógica de búsqueda segura
        const searchInput = document.querySelector('.search-input');
        if (!searchInput) return;

        const query = searchInput.value;
        if (!query || !seguridad.validate.text(query)) {
            console.error('Query de búsqueda inválida');
            return;
        }

        // Aquí implementaremos la búsqueda con el texto validado
        console.log('Búsqueda segura:', seguridad.sanitize.text(query));
    });
};

// Inicializar navegación cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', initNavigation);