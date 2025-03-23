// ip_publica.js mejorado con geolocalización y mapa

window.addEventListener('DOMContentLoaded', () => {
    const input = document.getElementById('ip');
    const button = document.getElementById('ip-button');
    const mapContainer = document.getElementById('map');

    if (!input || !button || !mapContainer) return;

    button.addEventListener('click', () => {
        fetch('https://ipwhois.app/json/')
            .then(res => res.json())
            .then(data => {
                const { ip, city, country, latitude, longitude } = data;
                input.value = ip + ' (' + city + ', ' + country + ')';
                mostrarMapa(latitude, longitude);
            })
            .catch(err => {
                console.error('Error al obtener la IP pública:', err);
                input.value = 'Error';
            });
    });

    let mapa;

    function mostrarMapa(lat, lon) {
        if (!mapa) {
            mapa = L.map('map').setView([lat, lon], 10);

            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; OpenStreetMap contributors'
            }).addTo(mapa);
        } else {
            mapa.setView([lat, lon], 10);
        }

        L.marker([lat, lon]).addTo(mapa)
            .bindPopup('Ubicación aproximada de la IP').openPopup();
    }
});