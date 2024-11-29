import React from 'react'
import Quill from 'quill'
import "quill/dist/quill.snow.css"
import { io } from 'socket.io-client'
import { useParams } from 'react-router-dom'

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
  const {id: documentId} = useParams();
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


    // For getting documentId of the text editor and using it
    React.useEffect(() => {
      if (socket == null || quill == null) return

      socket.once("load-document" , documents => {
        quill.setContents(documents);
        quill.enable();
      });

      socket.emit('get-document', documentId);
    }, [quill, socket, documentId]);

    // For running quill
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
    }, [quill, socket, documentId]);

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
        

        // This below section is with the documentid useEffect
        q.disable();
        q.setText('Loading....')

        setQuill(q);

    }, []);
    return (
    <div className='container' ref={wrapperRef}></div>
    )
}
