import React from 'react'
import Quill from 'quill'
import "quill/dist/quill.snow.css"
import { io } from 'socket.io-client'

// adding options in the toolbar
const toolbar_options = [
    [{ header : [1,2,3,4,5,6,false]} ],
    [{ font : [] }], // out theme has default fonts
    [{ list : "ordered"} , { list : "bulled"}],
    ["bold" , "italic" , "underline"],
    [{ color : []}, { background : [] }],
    [{ script : "sub"} , { script : "super"}],
    [{ align : []}],
    [ "image" , "blockquote" , "code-block"],
    ["clean"]
];


export default function TextEditor() {
    const [socket , setSocket] = React.useState();
    const [quill , setQuill] = React.useState();

    // Useeffect to run the socket.io
    React.useEffect(() => {
        const s = io('http://localhost:3003');
        setSocket(s);

        return () => {
            s.disconnect();
        }
    } , []);


    React.useEffect(() => {
        if (socket == null || quill == null) return

        const handler = (delta) => {
            quill.updateContents(delta);
          };
        // From the Socket receive changes
        socket.on('receive-changes', handler);

          return () => {
            socket.off('receive-changes', handler)
          };
    }, [quill,socket]);

    // UseEffect to track the changes in the quill
    React.useEffect(() => {
        if (socket == null || quill == null) return

        const handler = (delta, oldDelta, source) => {
            if (source !== 'user') return
            socket.emit('send-changes' , delta)
          };
        // From the Quill API textChange
        quill.on('text-change', handler);

          return () => {
            quill.off('text-change', handler)
          };
    }, [quill,socket]);

    // Quill is not directly compatible with the react hence we make a container name id of a div
    // and then we make a Quill object
    // useEffect is used to run and it should run only once
    const wrapperRef =  React.useCallback((wrapper) => {
        if (wrapper == null) return

        wrapper.innerHTML = "";

        // instead of directly passing the div into the Quill we pass this wrapper div
        const editor = document.createElement('div');
        wrapper.append(editor);
        // creating the Quill object with theme snow which is already imported
        const q = new Quill(editor , {
            theme: "snow" ,
            modules : {toolbar : toolbar_options} });
        
        setQuill(q);

    }, []);
    return (
    <div className='container' ref={wrapperRef}></div>
    )
}
