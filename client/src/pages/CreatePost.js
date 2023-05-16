import React, { useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { Navigate } from "react-router-dom";

const modules = {
  toolbar: [
    ['bold', 'italic', 'underline', 'strike'],
    ['blockquote', 'code-block'],

    [{ 'header': 1 }, { 'header': 2 }],
    [{ 'list': 'ordered' }, { 'list': 'bullet' }],
    ['link', 'image'],
    [{ 'indent': '-1' }, { 'indent': '+1' }],
    [{ 'direction': 'rtl' }],
    [{ 'header': [1, 2, 3, 4, 5, 6, false] }],

    ['clean']
  ]
}

const CreatePost = () => {
  const [title, setTitle] = useState('')
  const [summary, setSummary] = useState('')
  const [content, setContent] = useState('')
  const [files, setFiles] = useState('')
  const [redirect, setRedirect] = useState(false);

  const createNewPost = async (e) => {
    e.preventDefault()
    const data = new FormData()
    data.set('title', title)
    data.set('summary', summary)
    data.set('content', content)
    data.set('file', files[0])

    const res = await fetch('http://localhost:5000/post', {
      method: "POST",
      body: data,
      credentials: 'include'
    })
    if (res.ok) {
      setRedirect(true);
    }
  }

  if (redirect) {
    return <Navigate to={"/"} />;
  }

  return (
    <form onSubmit={createNewPost}>
      <input type="text" placeholder="Title" value={title} onChange={e => setTitle(e.target.value)} />
      <input type="summary" placeholder="Summary" value={summary} onChange={e => setSummary(e.target.value)} />
      <input type="file" onChange={e => setFiles(e.target.files)} />
      <ReactQuill style={{ marginTop: "5px" }} value={content} onChange={setContent} modules={modules} />
      <button>Create Post</button>
    </form>
  );
};

export default CreatePost;
