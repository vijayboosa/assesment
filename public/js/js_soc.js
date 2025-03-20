// js_soc.js
const socket = io({
    transports: ["websocket"],
    withCredentials: true,
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 2000, // Wait 2s before reconnecting
});


socket.on('job:posted', (data) => { 
    showToast(data);
});

socket.on('application:rejected', (data) => {
    showToast(data)
});

socket.on('interview:scheduled', (data) => {
    showToast(data)
});  