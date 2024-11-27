import React from 'react'
import Quill from 'quill'
import "quill/dist/quill.snow.css"


// 
export default function TextEditor() {
    // adding options in the toolbar
    const toolbar_options = React.useMemo(() => [
        [{ header : [1,2,3,4,5,6,false]} ],
        [{ font : [] }], // out theme has default fonts
        [{ list : "ordered"} , { list : "bulled"}],
        ["bold" , "italic" , "underline"],
        [{ color : []}, { background : [] }],
        [{ script : "sub"} , { script : "super"}],
        [{ align : []}],
        [ "image" , "blockquote" , "code-block"],
        ["clean"]
    ], []);

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
        new Quill(editor , {
            theme: "snow" ,
            modules : {toolbar : toolbar_options} });

    }, [toolbar_options]);
    return (
    <div className='container' ref={wrapperRef}></div>
    )
}
