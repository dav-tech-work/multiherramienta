

document.addEventListener("DOMContentLoaded", function () {
    // Construcción segura del correo electrónico
    const user = "danielarribasvelazquez";
    const domain = "gmail.com";
    const email = `${user}@${domain}`;

    // Manejar el botón de correo en el footer
    const mailBtn = document.getElementById('mailBtn');
    if (mailBtn) {
        mailBtn.addEventListener('click', function(event) {
            event.preventDefault();
            window.location.href = `mailto:${email}`;
        });
    }

    // Seleccionamos todos los elementos con el id "email"
    const emailElems = document.querySelectorAll("#email");

    // Creamos el enlace mailto y lo insertamos en los elementos
    emailElems.forEach(emailElem => {
        emailElem.innerHTML = `<a href="mailto:${email}" class="email-link">${email}</a>`;
    });
});