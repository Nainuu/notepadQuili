console.log("Server is starting...");
const io = require('socket.io')(3003, {
    cors: {
        origin: 'http://localhost:3002',
        methods: ['GET', 'POST']
    }
});


io.on('connection' , socket => {
    socket.on('send-changes', delta => {
        socket.broadcast.emit("receive-changes", delta)
    })
});
