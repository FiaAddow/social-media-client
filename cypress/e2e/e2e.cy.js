describe('Authentication Forms', () => {
  describe('Register Modal', () => {

    it('should display the register form', () => {
      cy.visit('/')
      cy.get('[data-cy="registerForm"]')
        .should('be.visible')
    })
  })

  
  describe('Login Modal', () => {
    beforeEach(() => {
      cy.visit('/')
      cy.get('#registerForm')
      cy.contains('#registerForm .modal-footer button', 'Login').click()
      // Click the register button to open the modal
      cy.get('[data-cy="register-login"]').click()
    })

    it('should display the login form when login button is clicked', () => {
      cy.get('[data-cy="loginForm"]')
        .within(() => {
          cy.get('#loginEmail').should('be.exist').and('have.attr', 'required')
          cy.get('#loginPassword').should('be.exist').and('have.attr', 'required')
        })
    })

    it('should successfully login with valid credentials', () => {
      cy.get('[data-cy="loginForm"]').within(() => {
        cy.get('#loginEmail')
          .type('test@stud.noroff.no')
          .should('have.value', 'test@stud.noroff.no')

        cy.get('#loginPassword')
          .type('Password123')
          .should('have.value', 'Password123')

        cy.get('[data-cy="login-submit"]').click()
      })

      // Check successful login
      cy.get('[data-visible="loggedIn"]').should('be.visible')
      cy.get('[data-visible="loggedOut"]').should('not.be.visible')
    })
    it('should not login with invalid credentials and show error message', () => {
      cy.get('[data-bs-target="#loginModal"]').click()
      cy.get('[data-cy="loginForm"]').within(() => {
        cy.get('#loginEmail')
          .should('be.visible')
          .type('wrong@stud.noroff.no')

        cy.get('#loginPassword')
          .should('be.visible')
          .type('WrongPassword123')

        cy.get('[data-cy="login-submit"]').click()
      })

      // Assert error message is shown
      cy.get('.alert-danger')
        .should('be.visible')
        .and('contain', 'Invalid email or password')

      // Assert user remains logged out
      cy.get('[data-visible="loggedOut"]').should('be.visible')
      cy.get('[data-visible="loggedIn"]').should('not.be.visible')
    })
  })

  describe('Logout Functionality', () => {
    beforeEach(() => {
      cy.visit('/')
      // Login first
      cy.get('[data-bs-target="#loginModal"]').click()
      cy.get('[data-cy="loginForm"]').within(() => {
        cy.get('#loginEmail').type('test@stud.noroff.no')
        cy.get('#loginPassword').type('Password123')
        cy.get('[data-cy="login-submit"]').click()
      })
      // Wait for login to finish
      cy.get('[data-visible="loggedIn"]').should('be.visible')
    })

    it('should successfully logout when clicking logout button', () => {
      cy.get('[data-cy="logout-button"]').click()

      // Check user is logged out
      cy.get('[data-visible="loggedOut"]').should('be.visible')
      cy.get('[data-visible="loggedIn"]').should('not.be.visible')

      // Check login button is visible again
      cy.get('[data-bs-target="#loginModal"]').should('be.visible')
    })
  })

})