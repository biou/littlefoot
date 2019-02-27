context('Scroll', () => {
  beforeEach(() => {
    cy.server()
    cy.viewport(800, 600)
    cy.visit('/cypress/fixtures/scroll.html')
  })

  it('repositions popover above or below the button', () => {
    cy.get('button').click()

    cy.scrollTo('top')
    cy.get('.littlefoot-footnote').should('have.class', 'is-positioned-top')

    cy.scrollTo('bottom')
    cy.get('.littlefoot-footnote').should('have.class', 'is-positioned-bottom')
  })

  it('scrolls popover content', () => {
    cy.get('button').click()

    cy.get('.littlefoot-footnote')
      .should('have.class', 'is-scrollable')
      .and('not.have.class', 'is-fully-scrolled')

    cy.get('.littlefoot-footnote__content').scrollTo('bottom')

    // FIXME: Content scroll events not triggering correctly.
    // cy.get('.littlefoot-footnote').should('have.class', 'is-fully-scrolled')

    cy.get('.littlefoot-footnote__content').scrollTo('top')

    cy.get('.littlefoot-footnote').should('not.have.class', 'is-fully-scrolled')
  })
})