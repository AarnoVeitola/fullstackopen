import { useState } from 'react'
import PropTypes from 'prop-types'

const Blog = ({
  blog,
  user,
  handleLike,
  handleDelete
}) => {
  const [visible, setVisible] = useState(false)

  const deleteButton = () => (
    <button
      onClick={() => handleDelete(blog)}
      id='delete-button'
    >
      delete
    </button>
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
    <div style={blogStyle} className='blog'>
      <div style={hideWhenVisible} id='visibleContent'>
        {blog.title} {blog.author}
        <button
          onClick={() => setVisible(true)}
          id='view-button'
        >
          view
        </button>
      </div>
      <div style={showWhenVisible} id='hiddenContent'>
        {blog.title} {blog.author}
        <button
          onClick={() => setVisible(false)}
          id='hide-button'
        >
          hide
        </button>
        <br/>
        {blog.url}
        <br/>
        likes {blog.likes}
        <button
          onClick={() => handleLike(blog)}
          id='like-button'
        >
          like
        </button>
        <br/>
        {blog.user.name}
        <br/>
        {user.username === blog.user.username && deleteButton()}
      </div>
    </div>
  )
}

Blog.propTypes = {
  blog: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired,
  handleLike: PropTypes.func.isRequired,
  handleDelete: PropTypes.func.isRequired
}

export default Blog