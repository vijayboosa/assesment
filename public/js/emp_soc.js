const socket = io({
    transports: ["websocket"],
    withCredentials: true,
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 2000, // Wait 2s before reconnecting
});


socket.on('application:received', (data) => {
    showToast(data) 
});
