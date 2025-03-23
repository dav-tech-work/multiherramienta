// ip_privada.js

window.addEventListener('DOMContentLoaded', () => {
    const input = document.getElementById('ip');
    const button = document.getElementById('ip-button');

    if (!input || !button) return;

    button.addEventListener('click', () => {
        obtenerIPLocal(ip => {
            input.value = ip || 'No disponible';
        });
    });

    function obtenerIPLocal(callback) {
        const pc = new RTCPeerConnection({iceServers: []});
        pc.createDataChannel('');

        pc.createOffer().then(offer => pc.setLocalDescription(offer));

        pc.onicecandidate = event => {
            if (!event || !event.candidate) return;

            const match = event.candidate.candidate.match(/([0-9]{1,3}(\.[0-9]{1,3}){3})/);
            if (match) {
                callback(match[1]);
            }
            pc.onicecandidate = null;
        };
    }
});
