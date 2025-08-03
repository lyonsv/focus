describe('Homepage', () => {
  beforeEach(() => {
    cy.visit('/', { timeout: 10000 })
  })

  it('should load the homepage and display the title', () => {
    cy.get('[data-testid="homepage-title"]', { timeout: 10000 }).should('be.visible')
    cy.get('[data-testid="homepage-title"]').should('contain', 'Hello')
  })

  it('should have the correct page title', () => {
    cy.title().should('eq', 'Base')
  })
}) 