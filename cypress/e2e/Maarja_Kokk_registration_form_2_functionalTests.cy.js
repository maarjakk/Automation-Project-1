beforeEach(() => {
    cy.visit('cypress/fixtures/registration_form_2.html')
})

/*
Assignement 4: add content to the following tests
*/

describe('Functional tests', () => {

    it('User can use only same both first and validation passwords', () => {
        // Add test steps for filling in only mandatory fields
        cy.get('#username').type('Something')
        cy.get('#email').type('testing@email.com')
        cy.get('[data-testid="phoneNumberTestId"]').type('555666777')
        cy.get('[data-cy="name"]').type('Maarja')
        cy.get('#lastName').type('Kokk')
        cy.get('input[name="password"]').type('Enterpassword')     
        
        // Type confirmation password which is different from first password
        cy.get('[name="confirm"]').type('Differentpassword')  
        cy.get('h2').contains('Password').click()
        
        // Assert that submit button is not enabled
        cy.get('.submit_button').should('be.disabled')
        
        // Assert that successful message is not visible
        cy.get('#success_message').should('not.be.visible')
        
        // Assert that error message is visible
        cy.get('#password_error_message').should('be.visible').should('contain', 'Passwords do not match!')

        // Change the test, so the passwords would match
        cy.get('input[name="password"]').clear()
        cy.get('[name="confirm"]').clear()
        cy.get('input[name="password"]').type('Enterpassword') 
        cy.get('[name="confirm"]').type('Enterpassword')  
        cy.get('h2').contains('Password').click()

        // Add assertion, that error message is not visible anymore
        cy.get('#password_error_message').should('not.be.visible')

        // Add assertion, that submit button is now enabled
        cy.get('.submit_button').should('be.enabled')
    })

    it('User can submit form with all fields added', () => {
        // Add test steps for filling in ALL fields
        cy.get('#username').type('Something')
        cy.get('#email').type('testing@email.com')
        cy.get('[data-testid="phoneNumberTestId"]').type('555666777')
        cy.get('[data-cy="name"]').type('Maarja')
        cy.get('#lastName').type('Kokk')
        cy.get('[data-testid="phoneNumberTestId"]').type('555666777')
        cy.get('input[type="radio"][value="HTML"]').check()
        cy.get('input[type="checkbox"][name="vehicle1"]').check()
        cy.get('#cars').select('Volvo')
        cy.get('#animal').select('cat')
        cy.get('input[name="password"]').type('Enterpassword')
        cy.get('[name="confirm"]').type('Enterpassword')  

        // Assert that submit button is enabled
        cy.get('h2').contains('Password').click()
        cy.get('.submit_button').should('be.enabled')
        cy.get('.submit_button').click()

        // Assert that after submitting the form system show successful message
        cy.get('#success_message').should('be.visible')
        cy.get('#success_message').should('have.css', 'display', 'block')
    })

    it('User can submit form with valid data and only mandatory fields added', () => {
        // Add test steps for filling in ONLY mandatory fields
        inputValidMandatoryData('johnSmith')
        cy.get('#username').type('Something')
        cy.get('#email').type('testing@email.com')
        cy.get('[data-testid="phoneNumberTestId"]').type('555666777')
        cy.get('[data-cy="name"]').type('John')
        cy.get('#lastName').type('Smith')
        cy.get('[data-testid="phoneNumberTestId"]').type('555666777')
        cy.get('input[name="password"]').type('Enterpassword')
        cy.get('[name="confirm"]').type('Enterpassword')
        cy.get('h2').contains('Password').click()

        // Assert that submit button is enabled
        cy.get('.submit_button').should('be.enabled')
        cy.get('.submit_button').click()

        // Assert that after submitting the form system shows successful message
        cy.get('#success_message').should('be.visible')
        cy.get('#success_message').should('have.css', 'display', 'block')
        // example, how to use function, which fills in all mandatory data
        // in order to see the content of the function, scroll to the end of the file
    })

    it('Submit button is disabled if mandatory field (last name) is missing', () => {
        // Add at least 1 test for checking some mandatory field's absence
        inputValidMandatoryData('johnSmith')

        // Clear lastName input field
        cy.get('#lastName').clear()
        cy.get('h2').contains('Password').click()

        // Assert that submit button is not enabled
        cy.get('.submit_button').should('be.disabled')
        cy.get('#input_error_message').should('be.visible').should('contain', 'Mandatory input field is not valid or empty!')
    })
})

function inputValidMandatoryData(username) {
    cy.log('Username will be filled')
    cy.get('input[data-testid="user"]').type(username)
    cy.get('#email').type('validemail@yeap.com')
    cy.get('[data-cy="name"]').type('John')
    cy.get('#lastName').type('Doe')
    cy.get('[data-testid="phoneNumberTestId"]').type('10203040')
    cy.get('#password').type('MyPass')
    cy.get('#confirm').type('MyPass')
    cy.get('h2').contains('Password').click()
}