beforeEach(() => {
    cy.visit('cypress/fixtures/registration_form_3.html')
})

/*
BONUS TASK: add visual tests for registration form 3
Task list:
* Create test suite for visual tests for registration form 3 (describe block)
* Create tests to verify visual parts of the page:
    * radio buttons and its content
    * dropdown and dependencies between 2 dropdowns:
        * list of cities changes depending on the choice of country
        * if city is already chosen and country is updated, then city choice should be removed
    * checkboxes, their content and links
    * email format
 */
describe('Visual tests', () => {
    it('Check that radio button list is correct', () => {
        cy.get('input[type="radio"]').should('have.length', 4)
        cy.get('input[type="radio"]').next().eq(0).should('have.text', 'Daily')
        cy.get('input[type="radio"]').next().eq(1).should('have.text', 'Weekly')
        cy.get('input[type="radio"]').next().eq(2).should('have.text', 'Monthly')
        cy.get('input[type="radio"]').next().eq(3).should('have.text', 'Never')

        //Verify default state of radio buttons
        cy.get('input[type="radio"]').eq(0).should('not.be.checked')
        cy.get('input[type="radio"]').eq(1).should('not.be.checked')
        cy.get('input[type="radio"]').eq(2).should('not.be.checked')
        cy.get('input[type="radio"]').eq(3).should('not.be.checked')

        // Selecting one will remove selection from the other radio button
        cy.get('input[type="radio"]').eq(0).check().should('be.checked')
        cy.get('input[type="radio"]').eq(1).check().should('be.checked')
        cy.get('input[type="radio"]').eq(0).should('not.be.checked')
    })

    it('Check that country dropdown is correct', () => {
        cy.get('#country').children().should('have.length', 4)

        // Check the content of the Country dropdown
        cy.get('#country').find('option').then(options => {
            const actual = [...options].map(option => option.textContent)
            expect(actual).to.deep.eq(['', 'Spain', 'Estonia', 'Austria'])
        })
    })

    it('Check that cities for Spain are correct', () => {
        cy.get('#country').select('Spain')
        cy.get('#city').children().should('have.length', 5)

        // Check the content of the city dropdown
        cy.get('#city').find('option').then(options => {
            const actual = [...options].map(option => option.textContent)
            expect(actual).to.deep.eq(['','Malaga', 'Madrid', 'Valencia', 'Corralejo'])
        })
    })

    it('Check that checkbox list is correct', () => {
        cy.get('input[type="checkbox"]').should('have.length', 2)

        // Verify labels of the checkboxes
        cy.get('input[type="checkbox"]').eq(0).parent().should('contain.text', 'Accept our privacy policy')
        cy.get('input[type="checkbox"]').eq(1).parent().should('contain.text', 'Accept our cookie policy')
        .find('a')
        .should('have.attr', 'href', 'cookiePolicy.html').click()

        // Check that currently opened URL is correct
        cy.url().should('contain', 'cookiePolicy.html')

        // Go back to previous page
        cy.go('back')
        cy.log('Back again in registration form 3')

        //Verify default state of checkboxes
        cy.get('input[type="checkbox"]').eq(0).should('not.be.checked')
        cy.get('input[type="checkbox"]').eq(1).should('not.be.checked')
    })

    it('Check invalid email format is not allowed', () => {
        cy.get('.email').type('invalid')
        cy.get('h1').contains('Registration page').click()
        cy.get('#emailAlert span')
        .should('contain.text', 'Invalid email address.')
        .and('be.visible') 
        cy.get('input[type="submit"]').should('be.disabled')
    })

    it('Check valid email format is allowed', () => {
        cy.get('.email').type('testing@gmail.com')
        cy.get('h1').contains('Registration page').click()
        cy.get('#emailAlert span').should('not.be.visible')
    })
})
/*
BONUS TASK: add functional tests for registration form 3
Task list:
* Create second test suite for functional tests
* Create tests to verify logic of the page:
    * all fields are filled in + corresponding assertions
    * only mandatory fields are filled in + corresponding assertions
    * mandatory fields are absent + corresponding assertions (try using function)
    * add file functionlity(google yourself for solution!)
 */

describe('Functional tests', () => {
    it.only('All fields are filled', () => {
        cy.get('#name').type('John')
        cy.get('.email').type('testing@email.com')
        cy.get('#country').select('Estonia')
        cy.get('#city').select('Tallinn')
        cy.contains('Date of registration').next().type('2024-01-10').should('have.value','2024-01-10')
        cy.get('input[type="radio"][value="Daily"]').check()
        cy.get('#birthday').type('1990-04-03')
        cy.get('input[type="checkbox"]').eq(0).check()
        cy.get('input[type="checkbox"]').eq(1).check()
        cy.get('input[type="submit"]').should('be.enabled').click()
        cy.get('h1').should('have.text', 'Submission received')
    })

    it('Only mandatory fields are filled', () => {
        inputValidMandatoryData() 
        cy.get('input[type="submit"]').should('be.enabled')
        cy.get('input[type="submit"]').should('be.enabled').click()
        cy.get('h1').should('have.text', 'Submission received')
    })

    it('Mandatory fields are absent', () => {
        inputValidMandatoryData() 
        cy.get('#name').type('John').clear()
        cy.get('.email').type('testing@email.com').clear()
        cy.get('#country').select('')
        cy.get('#country').select('')
        cy.get('input[type="date"]').clear()
        cy.get('#birthday').clear()
        cy.get('input[type="checkbox"]').eq(0).uncheck()
        cy.get('input[type="checkbox"]').eq(1).uncheck()        
        cy.get('input[type="submit"]').should('not.be.enabled')
    })

    it('Upload a file', () => {
        cy.get('input[type=file]').selectFile('cancelbutton.png')	
        cy.contains('Submit file').click()    
        cy.get('h1').should('have.text', 'Submission received')

    })
})

function inputValidMandatoryData() {
    cy.get('#name').type('John')
    cy.get('.email').type('john@email.com')
    cy.get('#country').select('Estonia')
    cy.get('#city').select('Tallinn')
    cy.get('#birthday').type('1990-04-03')
    cy.get('input[type="checkbox"]').eq(0).check()
    cy.get('input[type="checkbox"]').eq(1).check()
}