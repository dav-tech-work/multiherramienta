// Traducciones
const translations = {
    es: {
       
    },
    en: {
        
    }
};

// Función para cambiar el idioma
function setLanguage(lang) {
    // Guardar la preferencia de idioma
    localStorage.setItem('language', lang);

    // Actualizar elementos con data-lang
    document.querySelectorAll('[data-lang]').forEach(element => {
        element.classList.remove('active', 'active-inline');
        if (element.getAttribute('data-lang') === lang) {
            if (element.tagName === 'A' || element.tagName === 'SPAN') {
                element.classList.add('active-inline');
            } else {
                element.classList.add('active');
            }
        }
    });

    // Actualizar elementos con data-i18n
    document.querySelectorAll('[data-i18n]').forEach(element => {
        const key = element.getAttribute('data-i18n');
        if (translations[lang] && translations[lang][key]) {
            element.innerHTML = translations[lang][key];
        }
    });
}

// Inicializar el idioma al cargar la página
document.addEventListener('DOMContentLoaded', () => {
    // Obtener el idioma guardado o usar español por defecto
    const savedLanguage = localStorage.getItem('language') || 'es';
    setLanguage(savedLanguage);

    // Configurar los botones de cambio de idioma
    document.querySelectorAll('.language-switch').forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            const lang = button.getAttribute('data-lang-switch');
            setLanguage(lang);
        });
    });

    // Configurar el selector de idioma
    const languageSelect = document.getElementById('languageSelect');
    if (languageSelect) {
        languageSelect.value = savedLanguage;
        languageSelect.addEventListener('change', (e) => {
            setLanguage(e.target.value);
        });
    }
});
