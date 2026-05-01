import { useState } from 'react'
import Togglable from './Togglable'

const Blog = ({ blog,handleBlogDelete,handleLike }) => {
  const [view, setView] = useState(false)

  const handleLikeUpdate=(event) => {
    event.preventDefault()
    handleLike(blog)
  }
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5,
  }
  return (
    <div style={blogStyle}>
      {blog.title}
      {view ? (
        <div>
          <a href={blog.url}>{blog.url}</a>
          <br />
          {blog.likes} <button onClick={handleLikeUpdate}>like</button>
          <br />
          {blog.author}
          <br />
          Blog created by {blog.user.name}
          <br />
          <button style={{
            backgroundColor:'blue',
            color:'white',
            cursor:'pointer'
          }} onClick={() => handleBlogDelete(blog)}>Delete</button>
        </div>
      ) : (
        ''
      )}
      <button onClick={() => setView(!view)}>{view ? 'cancel' : 'view'}</button>
    </div>
  )
}

export default Blog
