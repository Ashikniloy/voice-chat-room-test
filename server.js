const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 8080 });

let users = {}; // Stores connected users

wss.on('connection', (ws) => {
    ws.on('message', (message) => {
        const data = JSON.parse(message);
        console.log("Message received on server:", data);

        if (data.type === 'register') {
            users[data.name] = ws;
            ws.username = data.name;
            console.log(`${data.name} registered`);
        } else if (data.target && users[data.target]) {
            users[data.target].send(JSON.stringify(data));
            console.log(`Message forwarded to ${data.target}`);
        }
    });

    ws.on('close', () => {
        if (ws.username) {
            delete users[ws.username];
            console.log(`${ws.username} disconnected`);
        }
    });
});

console.log("✅ WebSocket server running on ws://localhost:8080");