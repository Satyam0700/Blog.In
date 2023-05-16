import React, { useEffect, useState } from "react";
import ReactQuill from "react-quill";
import { Navigate, useParams } from "react-router-dom";

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
  

const Edit = () => {

    const {id} = useParams()

  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [content, setContent] = useState("");
  const [files, setFiles] = useState("");
  const [redirect, setRedirect] = useState(false);

  useEffect(() => {
    fetch('http://localhost:5000/post/'+id).then(res => {
        res.json().then(postInfo => {
            setTitle(postInfo.title)
            setContent(postInfo.content)
            setSummary(postInfo.summary)
        })
    })
  }, [])
  

  const updatePost = async (e) => {
    e.preventDefault();
    const data = new FormData()
    data.set('title', title)
    data.set('summary', summary)
    data.set('content', content)
    data.set('id', id)
    if(files?.[0]){
    data.set('file', files?.[0])
    }
    const res = await fetch('http://localhost:5000/post', {
        method: 'PUT',
        body: data,
        credentials: 'include'
    })
    if(res.ok){
       setRedirect(true)
    }
  }

    if (redirect) {
      return <Navigate to={"/post/"+id} />;
    }

  return (
    <form onSubmit={updatePost}>
      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <input
        type="summary"
        placeholder="Summary"
        value={summary}
        onChange={(e) => setSummary(e.target.value)}
      />
      <input type="file" onChange={(e) => setFiles(e.target.files)} />
      <ReactQuill
        style={{ marginTop: "5px" }}
        value={content}
        onChange={setContent}
        modules={modules}
      />
      <button>Update Post</button>
    </form>
  );
};
export default Edit;
