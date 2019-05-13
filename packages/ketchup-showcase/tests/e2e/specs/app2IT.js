describe('Showcase e2e - sample test 2', () => {
    it('Visits the app root url 2', () => {
        cy.visit('/');
        cy.get('#content')
            .children()
            .first()
            .should('contain', 'Test');
    });
});