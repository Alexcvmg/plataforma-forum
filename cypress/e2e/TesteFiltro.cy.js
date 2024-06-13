/// <reference types="cypress" />
import { describe, it } from "mocha";

describe('Teste E2E' , () => {
    it('Verificando se o filtro está funcionando, retornando 1 elemento', () => {
        // Visita o site local
        cy.visit('http://localhost:5173/');

        // Busca pelo botão <Login> e clica
        cy.get('[data-cy=login-button]').click();

        // Busca pelo input de email e digita o email
        cy.get('[data-cy=input-email]').type('alexcfcv@hotmail.com');

        // Busca pelo input de senha e digita a senha
        cy.get('[data-cy=input-senha]').type('123456');

        // Busca pelo botão Entrar e clica
        cy.get('[data-cy=button-entrar]').click();

        // Busca pelo input de filtro e 
        cy.get('[data-cy=input-filtro]').type('docker');
        
         // Verifica se a quantidade de elementos mostrados na tela é igual a 1
        cy.get('[data-cy=topicos]').should('have.length', 1);
    })
})