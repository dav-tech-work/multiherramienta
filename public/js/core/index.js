// Función para inicializar el tema
function initTheme() {
    const themeToggle = document.querySelector(".theme-toggle");
    if (!themeToggle) return;

    // Obtener los iconos
    const sunIcon = themeToggle.querySelector(".fa-sun");
    const moonIcon = themeToggle.querySelector(".fa-moon");
    
    function setTheme(isDark) {
        document.documentElement.classList.toggle("tema-oscuro", isDark);
        themeToggle.setAttribute("aria-pressed", isDark);
        localStorage.setItem("tema", isDark ? "oscuro" : "claro");
        
        // Actualizar iconos
        if (isDark) {
            moonIcon?.classList.add("d-none");
            sunIcon?.classList.remove("d-none");
        } else {
            sunIcon?.classList.add("d-none");
            moonIcon?.classList.remove("d-none");
        }
    }

    // Cargar tema guardado o usar preferencia del sistema
    const savedTheme = localStorage.getItem("tema");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)");
    
    if (savedTheme) {
        setTheme(savedTheme === "oscuro");
    } else {
        setTheme(prefersDark.matches);
    }

    // Escuchar cambios en el botón de tema
    themeToggle.addEventListener("click", () => {
        const isDark = document.documentElement.classList.contains("tema-oscuro");
        setTheme(!isDark);
    });

    // Escuchar cambios en la preferencia del sistema
    prefersDark.addEventListener("change", (e) => {
        if (!localStorage.getItem("tema")) {
            setTheme(e.matches);
        }
    });
}

// Inicializar cuando el DOM esté listo
if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initTheme);
} else {
    initTheme();
}

export { initTheme };
