import React, { useEffect, useRef } from 'react';
import Quill from 'quill';
import 'quill/dist/quill.snow.css';

const PostEditor = () => {
  const quillRef = useRef(null);

  useEffect(() => {
    const quill = new Quill(quillRef.current, {
      theme: 'snow',
      modules: {
        toolbar: [
          [{ 'header': [1, 2, false] }],
          ['bold', 'italic', 'underline'],
          [{ 'list': 'ordered' }, { 'list': 'bullet' }],
          ['link', 'image'],
          ['clean'],
        ],
      },
    });

    // Handle image insertion here if needed
    quill.getModule('toolbar').addHandler('image', () => {
      const range = quill.getSelection();
      const value = prompt('Please enter image URL');
      quill.insertEmbed(range.index, 'image', value);
    });
  }, []);

  return (
    <div>
      <div ref={quillRef} style={{ height: '300px' }} />
    </div>
  );
};

export default PostEditor;
