import React from 'react'
import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'

describe('<Blog />', () => {
  let container
  let mockLikeHandler

  const user = {
    name: 'Example User',
    username: 'exampleuser'
  }
  const blog = {
    title: 'Example blog',
    author: 'Example author',
    url: 'exampleurl.com',
    likes: 0,
    user: user
  }

  beforeEach(() => {
    mockLikeHandler = jest.fn()
    container = render(
      <Blog
        blog={blog}
        user={user}
        handleLike={mockLikeHandler}
      />
    ).container
  })

  test('renders title and author', () => {
    const visibleContent = container.querySelector('#visibleContent')
    expect(visibleContent).toHaveTextContent(blog.title)
    expect(visibleContent).toHaveTextContent(blog.author)
  })

  test('renders likes, url, and user', () => {
    const hiddenContent = container.querySelector('#hiddenContent')
    expect(hiddenContent).toHaveTextContent(blog.likes)
    expect(hiddenContent).toHaveTextContent(blog.url)
    expect(hiddenContent).toHaveTextContent(user.name)
  })

  test('details are not initially visible', () => {
    const visibleContent = container.querySelector('#visibleContent')
    const hiddenContent = container.querySelector('#hiddenContent')
    expect(visibleContent).not.toHaveStyle('display: none')
    expect(hiddenContent).toHaveStyle('display: none')
  })

  test('after clicking the button, details are visible', async () => {
    const userInstance = userEvent.setup()
    const button = screen.getByText('view')
    await userInstance.click(button)

    const div = container.querySelector('#hiddenContent')
    expect(div).not.toHaveStyle('display: none')
  })

  test('after clicking the like button twice, the event handler is called twice', async () => {
    const userInstance = userEvent.setup()
    const button = screen.getByText('like')

    await userInstance.click(button)
    await userInstance.click(button)

    expect(mockLikeHandler.mock.calls).toHaveLength(2)
  })
})