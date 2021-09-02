"use strict"

//Class representing a die or a set of die.

class Dice {
    static roll(amount, faces, modifier = 0){
        let accumulator = 0;
        for (let i = 0; i < amount; i++) {
            accumulator += Math.floor((Math.random()*faces)+1);            
        }
        accumulator += modifier;
        return accumulator;
    }

    static rollAdv(amount, faces, modifier = 0){
        return Math.max(roll(amount,faces,modifier),roll(amount,faces,modifier));
    }

    static rollDisadv(amount, faces, modifier = 0){
        return Math.min(roll(amount,faces,modifier),roll(amount,faces,modifier));
    }
}

//Class that handles all needed stat calculation for creatures.

class StatCalculator {
    static calculateAbilityModifier(abilityScore) {
        let modifier = 0;
        switch(abilityScore){
            case 1: modifier = -5;
            break;
            case 2:
            case 3: modifier = -4;
            break;
            case 4:
            case 5: modifier = -3;
            break;
            case 6:
            case 7: modifier = -2;
            break;
            case 8:
            case 9: modifier = -1;
            break;
            case 10:
            case 11: modifier = 0;
            break;
            case 12:
            case 13: modifier = 1;
            break;
            case 14:
            case 15: modifier = 2;
            break;
            case 16:
            case 17: modifier = 3;
            break;
            case 18:
            case 19: modifier = 4;
            break;
            case 20:
            case 21: modifier = 5;
            break;
            case 22:
            case 23: modifier = 6;
            break;
            case 24:
            case 25: modifier = 7;
            break;
            case 26:
            case 27: modifier = 8;
            break;
            case 28:
            case 29: modifier = 9;
            break;
            case 30: modifier = 10;
            break;
            default: modifier = -10;
            break;
        }
        return modifier;
    }
}

//Class representing a creature currently in combat.

class Creature {
    constructor(name, dexterity, initiativeModifier) {
        this.name = name;
        this.id = -1;
        let dexterityModifier = StatCalculator.calculateAbilityModifier(dexterity);
        this.initiative = Dice.roll(1,20,initiativeModifier) + dexterityModifier;
    }
}

//Class that represents the current encounter and keeps the list sorted based on initiative

class Encounter {
    constructor() {
        this.creatures = [];
        this.idCounter = 0;
    }

    add(newCreature) {
        newCreature.id = this.idCounter;
        this.idCounter++;
        this.creatures.push(newCreature);
        this.sort();
    }

    remove(toDelete) {
        let index = -1;
        for (let i = 0; i < this.creatures.length; i++) {
            if (this.creatures[i].id === toDelete) {
                console.log('Found match at index ' + i);
                index = i;
                break;
            }
        }
        console.log(`Deleting ${this.creatures[index].name} at position ${index} with ID ${this.creatures[index].id}`)
        this.creatures.splice(index,1);
    }

    sort() {
        this.creatures.sort((c1,c2) => c2.initiative-c1.initiative)
    }
}

//Class that handles updating the DOM and the UI itself

class UI {
    static displayCreatures(currentEncounter) {
        const combatList = document.querySelector("#combat-list");
        if (combatList.children.length > 0) {
            while (combatList.children.length > 0) {
                combatList.removeChild(combatList.lastChild);
            }
        }

        currentEncounter.creatures.forEach(combatant => {
            let newRow = document.createElement('tr');
            newRow.innerHTML = `<td><span class="creature-name">${combatant.name}</span></td>`+
            `<td colspan="2"> <span class="creature-initiative">${combatant.initiative}</span></td>`+
            `<td style="display:none;"> <span style="display:none;" class="creature-id">${combatant.id}</span> </td>`+
            `<td> <button type="button" class="delete-button">x</button> </td>`;
            combatList.appendChild(newRow);
        });
    }
}

//Global variable for the encounter.

const encounter = new Encounter();

//Event that takes the input from input fields and adds it to the DOM.
 
const addCreatureButton = document.querySelector('#add-button');
addCreatureButton.encounterReference = encounter;
addCreatureButton.addEventListener('click', (e) => {
    let nameField = document.querySelector('#creature-name');
    let dexField = document.querySelector('#dex-score');
    let bonusesField = document.querySelector('#initiative-bonuses');
    let newCreature = new Creature(nameField.value, parseInt(dexField.value), parseInt(bonusesField.value));
    e.target.encounterReference.add(newCreature);
    UI.displayCreatures(e.target.encounterReference);
}); 

//Event that removes creature from the encounter

const combatList = document.querySelector('#combat-list');
combatList.encounterReference = encounter;
combatList.addEventListener('click', (e) => {
    if (e.target.classList.contains('delete-button')) {
        let rowToDelete = e.target.parentElement.parentElement;
        let creatureToDeleteID = parseInt(rowToDelete.children[2].textContent);
        let combatList = rowToDelete.parentElement;
        combatList.removeChild(rowToDelete);
        combatList.encounterReference.remove(creatureToDeleteID);
    }
})