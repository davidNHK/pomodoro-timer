import { mount } from '@cypress/react';
import { useForm } from 'react-hook-form';

import GlobalContextProvider from '../GlobalContext.provider';
import AddGameLibraryForm, {
  GameBoxArtUploadField,
} from './AddGameLibrary.form';

function uploadBoxArt() {
  cy.getBySel('game-box-art-upload-input').selectFile(
    'cypress/fixtures/elden-ring.jpeg',
    {
      force: true,
    },
  );
  cy.getBySel('game-box-art-image').should('be.visible');
}

function fillAddGameLibraryForm() {
  cy.getBySel('game-name-input').click().clear().type('ELDEN RING');
  cy.getBySel('game-publisher-input')
    .clear()
    .type('SONY INTERACTIVE ENTERTAINMENT');

  cy.getBySel('game-platform-input').click();
  cy.getBySel('game-platform-input-ps5').click();
  cy.getBySel('number-of-players-input').click().clear().type('1');
  cy.getBySel('genre-input').click();
  cy.getBySel('genre-input-action').click();
  cy.getBySel('release-date-input').click().clear().type('03/24/2022');
}

describe('GameBoxArtUploadField', () => {
  function TestGameBoxArtUploadField() {
    const methods = useForm<any>({});
    return (
      <GlobalContextProvider>
        <GameBoxArtUploadField control={methods.control} disabled={false} />
      </GlobalContextProvider>
    );
  }
  it('should upload box art', () => {
    mount(<TestGameBoxArtUploadField />);
    uploadBoxArt();
  });
});

describe('AddGameLibraryForm', () => {
  it('should create record on db when submit form', () => {
    mount(
      <GlobalContextProvider>
        <AddGameLibraryForm
          cancelSubmit={cy.stub()}
          finishSubmit={cy.stub().as('finishSubmit')}
        />
      </GlobalContextProvider>,
    );
    uploadBoxArt();
    fillAddGameLibraryForm();
    cy.getBySel('submit-add-new-game-form').click();
    cy.get('@finishSubmit').should('have.been.called');
    cy.getBySel('created-game-id')
      .should('exist', { force: true })
      .then(el => {
        const gameId = el.text();
        cy.request({
          method: 'GET',
          url: `http://localhost:5333/test/seeder/game/${gameId}`,
        })
          .its('body.data.id')
          .should('equal', gameId);
      });
  });

  it('should show error alert when submit form that pass frontend validation but not backend', () => {
    mount(
      <GlobalContextProvider>
        <AddGameLibraryForm
          cancelSubmit={cy.stub()}
          finishSubmit={cy.stub().as('finishSubmit')}
        />
      </GlobalContextProvider>,
    );
    uploadBoxArt();
    cy.getBySel('game-name-input').click().clear().type('ELDEN RING');
    cy.getBySel('game-publisher-input')
      .clear()
      .type('SONY INTERACTIVE ENTERTAINMENT');

    cy.getBySel('game-platform-input').click();
    cy.getBySel('game-platform-input-ps5').click();
    cy.getBySel('number-of-players-input').click().clear().type('1');
    cy.getBySel('genre-input').click();
    cy.getBySel('genre-input-action').click();
    cy.getBySel(`number-of-players-input`).click().clear().type('4');
    cy.getBySel('submit-add-new-game-form').click();
    cy.getBySel('alert-error-title')
      .should('be.visible')
      .should('have.text', 'BAD_USER_INPUT');
  });

  it('should error when number of player less than 0', () => {
    mount(
      <GlobalContextProvider>
        <AddGameLibraryForm
          cancelSubmit={cy.stub()}
          finishSubmit={cy.stub().as('finishSubmit')}
        />
      </GlobalContextProvider>,
    );
    cy.getBySel(`number-of-players-input`).click().clear().type('-1');
    cy.get('body').click();
    cy.getBySel(`number-of-players-error`).should(
      'have.text',
      "number of players can't less than 0",
    );
  });

  it('should error when missing box art', () => {
    mount(
      <GlobalContextProvider>
        <AddGameLibraryForm
          cancelSubmit={cy.stub()}
          finishSubmit={cy.stub().as('finishSubmit')}
        />
      </GlobalContextProvider>,
    );
    fillAddGameLibraryForm();
    cy.getBySel(`submit-add-new-game-form`).click();
    cy.getBySel(`game-box-art-upload-error`).should(
      'have.text',
      'box art must be provided',
    );
  });
});
