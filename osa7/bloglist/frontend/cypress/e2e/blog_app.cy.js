describe('Blog app', function() {
  beforeEach(function() {
    cy.visit('')
    cy.request('POST', `${Cypress.env('BACKEND')}/testing/reset`)
    const user = {
      name: 'Test User',
      username: 'testuser',
      password: '12345678'
    }
    const user2 = {
      name: 'Test User 2',
      username: 'testuser2',
      password: '87654321'
    }
    cy.request('POST', `${Cypress.env('BACKEND')}/users`, user)
    cy.request('POST', `${Cypress.env('BACKEND')}/users`, user2)
  })

  it('Login form is shown', function() {
    cy.contains('Log in to application')
    cy.get('input[id=username][name=Username]').parent().contains('username')
    cy.get('input[name=Password]').parent().contains('password')
    cy.get('button[type=submit]').contains('login')
  })

  describe('Login', function() {
    it('succeeds with correct credentials', function() {
      cy.get('#username').type('testuser')
      cy.get('#password').type('12345678')
      cy.get('#login-button').click()
      cy.contains('blogs')
      cy.contains('Test User logged in')
    })

    it('fails with wrong credentials', function() {
      cy.get('#username').type('testuser')
      cy.get('#password').type('1234')
      cy.get('#login-button').click()
      cy.get('.error')
        .should('contain', 'wrong username or password')
        .and('have.css', 'color', 'rgb(255, 0, 0)')
        .and('have.css', 'border-style', 'solid')
      cy.should('not.contain', 'blogs')
      cy.should('not.contain', 'Test User logged in')
    })
  })

  describe('When logged in', function() {
    const blog = {
      title: 'Test Blog',
      author: 'Some Author',
      url: 'test.blog'
    }
    const blog2 = {
      title: 'Test Blog 2',
      author: 'Some Author 2',
      url: 'test.blog'
    }

    beforeEach(function() {
      cy.get('#username').type('testuser')
      cy.get('#password').type('12345678')
      cy.get('#login-button').click()
    })

    it('a blog can be created', function() {
      cy.contains('new blog').parent().find('button').click()
      cy.get('#title-input').type(blog.title)
      cy.get('#author-input').type(blog.author)
      cy.get('#url-input').type(blog.url)
      cy.get('#blog-submit').click()
      cy.get('.success')
        .should('contain', `a new blog ${blog.title} by ${blog.author} added`)
        .and('have.css', 'color', 'rgb(0, 128, 0)')
        .and('have.css', 'border-style', 'solid')
      cy.get('#visibleContent')
        .should('contain', blog.title)
        .should('contain', blog.author)
    })

    it('a blog can be liked', function() {
      cy.contains('new blog').parent().find('button').click()
      cy.get('#title-input').type(blog.title)
      cy.get('#author-input').type(blog.author)
      cy.get('#url-input').type(blog.url)
      cy.get('#blog-submit').click()

      cy.get('#view-button').click()
      cy.get('#like-button').parent().contains('likes 0')
      cy.get('#like-button').click()
      cy.get('#like-button').parent().contains('likes 1')
    })

    it('a blog can be removed', function() {
      cy.contains('new blog').parent().find('button').click()
      cy.get('#title-input').type(blog.title)
      cy.get('#author-input').type(blog.author)
      cy.get('#url-input').type(blog.url)
      cy.get('#blog-submit').click()
      cy.get('#view-button').click()
      cy.get('#delete-button').click()
      cy.should('not.contain', blog.title)
    })

    it('the delete button is not shown to other users', function() {
      cy.contains('new blog').parent().find('button').click()
      cy.get('#title-input').type(blog.title)
      cy.get('#author-input').type(blog.author)
      cy.get('#url-input').type(blog.url)
      cy.get('#blog-submit').click()
      cy.get('#logout-button').click()
      cy.get('#username').type('testuser2')
      cy.get('#password').type('87654321')
      cy.get('#login-button').click()
      cy.get('#view-button').click()
      cy.should('not.contain', '#delete-button')
    })

    it('blogs are sorted by descending likes', function() {
      cy.contains('new blog').parent().find('button').as('newBlog')
      cy.get('@newBlog').click()
      cy.get('#title-input').type(blog.title)
      cy.get('#author-input').type(blog.author)
      cy.get('#url-input').type(blog.url)
      cy.get('#blog-submit').click()

      cy.get('@newBlog').click()
      cy.get('#title-input').type(blog2.title)
      cy.get('#author-input').type(blog2.author)
      cy.get('#url-input').type(blog2.url)
      cy.get('#blog-submit').click()

      cy.get('.blog').eq(0).should('contain', blog.title)
      cy.get('.blog').eq(1).should('contain', blog2.title)

      cy.get('.blog').eq(1).find('#view-button').click()
      cy.get('.blog').eq(1).find('#like-button').as('likeButton')
      cy.get('@likeButton').click()

      cy.get('.blog').eq(1).should('contain', blog.title)
      cy.get('.blog').eq(0).should('contain', blog2.title)
    })
  })
})
