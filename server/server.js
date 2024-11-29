console.log("Server is starting....");
const io = require('socket.io')(3003, {
    cors: {
        origin: 'http://localhost:3000',
        methods: ['GET', 'POST']
    }
});

// Add error handling for the server
io.on('connection', (socket) => {
    console.log("Client connected");
    socket.on('get-document' , documentId => {
        const data = "";
        socket.join(documentId);
        socket.emit('load-document', data);


        socket.on('send-changes' , delta => {
            socket.broadcast.to(documentId).emit('receive-changes' ,delta);
    });
    })
});

io.on('error', (err) => {
    console.error("Socket.io error:", err);
});
