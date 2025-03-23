
document.addEventListener('DOMContentLoaded', () => {
    const themeBtn = document.querySelector('.theme-toggle');
    const langSelect = document.getElementById('languageSelect');

    // Inicializar tema
    const initTheme = () => {
        try {
            const savedTheme = seguridad.storage.get('theme') || 'dark';
            if (!['light', 'dark'].includes(savedTheme)) {
                throw new Error('Tema inválido detectado');
            }
            document.documentElement.setAttribute('data-bs-theme', savedTheme);
            updateThemeIcon(savedTheme);
        } catch (error) {
            console.error('Error al inicializar tema:', error);
            // Establecer tema por defecto
            document.documentElement.setAttribute('data-bs-theme', 'dark');
            updateThemeIcon('dark');
        }
    };

    // Actualizar icono del tema de forma segura
    const updateThemeIcon = (theme) => {
        const icon = themeBtn?.querySelector('i');
        if (!icon) return;

        icon.className = 'fas';
        if (theme === 'dark') {
            icon.classList.add('fa-sun');
        } else {
            icon.classList.add('fa-moon');
        }
    };

    // Cambio de tema claro/oscuro con validación
    themeBtn?.addEventListener('click', () => {
        try {
            const html = document.documentElement;
            const currentTheme = html.getAttribute('data-bs-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            
            // Validar tema antes de aplicar
            if (!['light', 'dark'].includes(newTheme)) {
                throw new Error('Tema inválido');
            }

            html.setAttribute('data-bs-theme', newTheme);
            seguridad.storage.set('theme', newTheme);
            updateThemeIcon(newTheme);
        } catch (error) {
            console.error('Error al cambiar tema:', error);
        }
    });

    // Inicializar tema
    initTheme();
});
