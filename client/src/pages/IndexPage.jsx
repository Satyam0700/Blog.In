import React, { useEffect, useState } from 'react'
import Post from '../components/post/Post'

const IndexPage = () => {

  const [posts, setPosts] = useState([])

  useEffect(() => {  
    fetch('http://localhost:5000/post').then(res => {
      res.json().then(posts => {
        setPosts(posts)
      })
    })
  }, [])
  

  return (
    <div>
      {posts.length > 0 && posts.map((post, index) => (
        <Post {...post} />
      ))}
        
        {/* <Post />
        <Post /> */}
    </div>
  )
}

export default IndexPage