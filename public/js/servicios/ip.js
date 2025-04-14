// ip_publica.js mejorado con geolocalización y mapa

window.addEventListener('DOMContentLoaded', () => {
    const ipElement = document.getElementById('ip');
    const refreshButton = document.getElementById('refresh-ip');
    const mapContainer = document.getElementById('map');
    let map, marker;

    // Inicializar el mapa
    function initMap() {
        if (!mapContainer) return;
        map = L.map(mapContainer).setView([0, 0], 2);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors'
        }).addTo(map);
    }

    // Obtener y mostrar la IP
    async function obtenerIP() {
        try {
            ipElement.textContent = 'Obteniendo IP...';
            const response = await fetch('https://ipapi.co/json/');
            const data = await response.json();
            
            if (data.error) throw new Error('Error al obtener IP');
            
            ipElement.textContent = `${data.ip} (${data.city}, ${data.country_name})`;
            
            // Actualizar mapa
            if (map) {
                if (marker) marker.remove();
                map.setView([data.latitude, data.longitude], 10);
                marker = L.marker([data.latitude, data.longitude])
                    .addTo(map)
                    .bindPopup(`${data.ip}<br>${data.city}, ${data.country_name}`)
                    .openPopup();
            }
        } catch (error) {
            console.error('Error:', error);
            ipElement.textContent = 'Error al obtener la IP';
        }
    }

    // Inicializar
    if (mapContainer) initMap();
    obtenerIP();

    // Evento de actualización
    refreshButton?.addEventListener('click', obtenerIP);
});