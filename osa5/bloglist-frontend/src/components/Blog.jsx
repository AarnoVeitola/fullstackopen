import { useState } from 'react'

const Blog = ({ blog, user, handleLike, handleDelete }) => {
  const [visible, setVisible] = useState(false)

  const deleteButton = () => (
    <button onClick={() => handleDelete(blog)}>delete</button>
  )

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const hideWhenVisible = { display: visible ? 'none' : '' }
  const showWhenVisible = { display: visible ? '' : 'none' }

  return (
    <div style={blogStyle}>
      <div style={hideWhenVisible}>
        {blog.title} {blog.author}
        <button onClick={() => setVisible(true)}>view</button>
      </div>
      <div style={showWhenVisible}>
        {blog.title} {blog.author}
        <button onClick={() => setVisible(false)}>hide</button>
        <br/>
        {blog.url}
        <br/>
        likes {blog.likes}
        <button onClick={() => handleLike(blog)}>like</button>
        <br/>
        {blog.user.name}
        <br/>
        {user.username === blog.user.username && deleteButton()}
      </div>
    </div>
  )
}

export default Blog