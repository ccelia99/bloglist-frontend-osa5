describe('Blog app ', function() {
  beforeEach(function() {
    cy.request('POST', 'http://localhost:3001/api/testing/reset')
    const user = {
      name: 'Jaska Jokunen',
      username: 'jaska',
      password: 'salainen'
    }
    cy.request('POST', 'http://localhost:3001/api/users/', user) 
    cy.visit('http://localhost:3001')
  })

  it('Login form is shown', function() {
    cy.contains('log in').click()
  })

  describe('Login',function() {
    it('succeeds with correct credentials', function() {
      cy.contains('log in').click()
      cy.get('#username').type('jaska')
      cy.get('#password').type('salainen')
      cy.get('#login-button').click()

      cy.contains('Jaska Jokunen logged in')
    })

    it('login fails with wrong password', function() {
      cy.contains('log in').click()
      cy.get('#username').type('jaska')
      cy.get('#password').type('wrong')
      cy.get('#login-button').click()
  
      cy.get('.error')
        .should('contain', 'wrong credentials')
        .and('have.css', 'color', 'rgb(255, 0, 0)')
        .and('have.css', 'border-style', 'solid')
      cy.get('html').should('not.contain', 'Jaska Jokunen logged in')
    })
  })

  describe('when logged in', function() {
    beforeEach(function() {
      cy.login({ username: 'jaska', password: 'salainen' })
    })

    it('a new blog can be created', function() {
        cy.contains('new blog').click()
        cy.get('#title').type('a blog created by cypress')
        cy.get('#author').type('Jaska J.')
        cy.get('#url').type('www://urrl.com')
        cy.contains('save').click()
        cy.contains('a blog created by cypress')
      })
    })
})