import React, { useEffect , useRef} from 'react'
import Quill from 'quill'
import "quill/dist/quill.snow.css"


// 
export default function TextEditor() {
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
        new Quill(editor , { theme: "snow" });

    }, []);
  return (
    <div className='container' ref={wrapperRef}></div>
  )
}
