console.log("Server is starting....");


// MongoDB
const mangoose = require('mangoose');
const Document = require('./Document');

mongoose.connect('mongodb://localhost/google-docs-clone', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => {
    console.log('Connected to MongoDB');
})
.catch((error) => {
    console.error('Error connecting to MongoDB:', error);
});

// connection with the client
const io = require('socket.io')(3003, {
    cors: {
        origin: 'http://localhost:3000',
        methods: ['GET', 'POST']
    }
});

const defaultValue = "";

// Add error handling for the server
io.on('connection', (socket) => {
    console.log("Client connected");

    socket.on('get-document' , async documentId => {
        const document = await findOrCreateDocument(documentId);
        socket.join(documentId);
        socket.emit('load-document', document.data);


        socket.on('send-changes' , delta => {
            socket.broadcast.to(documentId).emit('receive-changes' ,delta);
    });

    socket.on('save-document', async data => {
        await Document.findByIdAndUpdate(documentId , { data });
    });
    });
});

async function findOrCreateDocument(id) {
    if (id === null) return

    const document = await Document.findById(id);
    if(document) return document;
    return await Document.create({ _is: id , data : defaultValue});
}

io.on('error', (err) => {
    console.error("Socket.io error:", err);
});
