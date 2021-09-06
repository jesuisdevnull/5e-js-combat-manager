 "use strict"
/* ========================================================================= */

//Class representing a Node with pointers to both a next and previous Node.

class Node {
            constructor(data){
                this.data = data;
                this.next = null;
                this.previous = null;
            }

            getData(){
                return this.data;
            }

            setData(data) {
                this.data = data;
            }
        }

//Class representing a circular doubly linked list.

        class CircularDoublyLinkedList {
            constructor(){
                this.head = null;
                this.length = 0;
            }


            isEmpty(){
                return this.head === null;
            }

            purge() {
                this.head = null;
                this.length = 0;
            }

            getFirst() {
                return this.head;
            }

            getLast() {
                return this.head.previous;
            }

            getLength() {
                return this.length;
            }

            insertAtEnd(data){
                let newNode = new Node(data);
                if (this.isEmpty()) {
                    this.head = newNode;
                    this.head.next = this.head;
                    this.head.previous = this.head;
                    this.length++;
                } else {
                    let currentNode = this.head.previous;
                    currentNode.next = newNode;
                    newNode.next = this.head;
                    newNode.previous = currentNode;
                    this.head.previous = newNode;
                    this.length++;
                }
            }

            insertAtStart(data) {
                let newNode = new Node(data);
                if (this.isEmpty()) {
                    this.head = newNode;
                    this.head.next = this.head;
                    this.head.previous = this.head;
                    this.length++;
                } else {
                    newNode.next = this.head;
                    this.head.previous.next = newNode;
                    newNode.previous = this.head.previous;
                    this.head.previous = newNode;
                    this.head = newNode;
                    this.length++;
                }
            }

            insertBetween(data,node1,node2){
                let newNode = new Node(data);
                newNode.next = node2;
                newNode.previous = node1;
                node1.next = newNode;
                node2.previous = newNode;
            }

            insertInOrder(data){
                let success = false;
                if (this.isEmpty()){
                    this.insertAtStart(data);
                } else if(this.length === 1){
                    let current = this.head;
                    if (data.initiative >= current.data.initiative) {
                        this.insertAtStart(data);
                    } else {
                        this.insertAtEnd(data);
                    }
                } else {
                    let current = this.head;
                    while (success === false) {
                        if (data.initiative >= current.data.initiative) {
                            console.log(current.data);
                            this.insertBetween(data, current.previous, current);
                            this.length++;
                            success = true;
                        } else {
                            if (current.next === this.head) {
                                this.insertAtEnd(data);
                                success = true;
                            } else {
                                current = current.next;
                            }
                        }
                    }
                }
            }

            search(searchID) {
                let current = this.head;
                if (current.data.id == searchID) {
                    return current;
                } else {
                    while(current.next !== this.head){
                        if (current.data.id === searchID) {
                            console.log("Found " + current.data.name)
                            return current;
                        } else {
                            current = current.next;
                        }
                    }
                }
                throw "Element not found!";
            }

            remove(id){
                if (this.isEmpty()) {
                    throw "List is empty!"
                } else {
                    let toDelete = this.search(id);
                    console.log("Deleting " + toDelete.data.name);
                    if (this.length === 1) {
                        this.head = null;
                        this.length--;
                    } else {
                        toDelete.previous.next = toDelete.next;
                        toDelete.next.previous = toDelete.previous;
                        if(toDelete === this.head) {
                            this.head = toDelete.next;
                        }
                        this.length--;
                    }
                }
            }
        }

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
        return Math.max(Dice.roll(amount,faces,modifier),Dice.roll(amount,faces,modifier));
    }

    static rollDisadv(amount, faces, modifier = 0){
        return Math.min(Dice.roll(amount,faces,modifier),Dice.roll(amount,faces,modifier));
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
    constructor(name, dexterity, initiativeModifier, mode) {
        this.name = name;
        this.id = -1;
        if (initiativeModifier === undefined && mode === undefined) {
            this.initiative = dexterity;
        } else {
            let dexterityModifier = StatCalculator.calculateAbilityModifier(dexterity);
            switch(mode){
                case 0:this.initiative = Dice.roll(1,20,initiativeModifier) + dexterityModifier;
                break;
                case 1:this.initiative = Dice.rollAdv(1,20,initiativeModifier) + dexterityModifier;
                break;
                case 2:this.initiative = Dice.rollDisadv(1,20,initiativeModifier) + dexterityModifier;
                break;
            }
        }    
    }
}

/* Class that represents the current encounter. Has a creature list for displaying a table in the DOM, 
as well as a list that's used to display the current turn when combat starts. */

class Encounter {
    constructor() {
        this.creatures = [];
        this.turnList = new CircularDoublyLinkedList();
        this.idCounter = 0;
        this.isInCombat = false;
        this.currentTurn = null;
    }

    isEmpty() {
        return this.creatures.length === 0;
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

    emptyCreatureList() {
        this.creatures = [];
    }

    sort() {
        this.creatures.sort((c1,c2) => c2.initiative-c1.initiative)
    }

    startCombat() {

        this.creatures.forEach((creature) => {
            console.log('Inserting ' + creature.name + ' into turn list.')
            this.turnList.insertInOrder(creature);
        });
        this.currentTurn = this.turnList.head;
        this.isInCombat = true;
    }

    getCurrentTurn() {
        if (this.currentTurn === null) {
            return null;
        } else {
            return this.currentTurn.data.name;
        }
    }

    nextTurn() {
        this.currentTurn = this.currentTurn.next;
    }

    previousTurn() {
        this.currentTurn = this.currentTurn.previous;
    }

    addToTurnList(creature) {
        this.turnList.insertInOrder(creature);
    }

    removeFromTurnList(id) {
        if (this.currentTurn.data.id === id) {
            if (this.turnList.length === 1) {
                this.endCombat();
            } else {
                this.nextTurn();
                UI.onDeleteLabelUpdate(this);
                this.turnList.remove(id);
            }
        } else {
            this.turnList.remove(id);
        }
        
    }

    endCombat() {
        this.turnList.purge();
        this.emptyCreatureList();
        this.currentTurn = null;
        this.isInCombat = false;
        this.idCounter = 0;
        console.log('Ending combat.');
    }
}

//Class that handles all tasks regarding the updating of the DOM.

class UI {
    static displayCreatures(currentEncounter) {
        const combatList = document.querySelector("#combat-list");
        if (combatList.children.length > 0) {
            while (combatList.children.length > 0) {
                combatList.removeChild(combatList.lastChild);
            }
        }

        this.unhideTable();

        currentEncounter.creatures.forEach(combatant => {
            let newRow = document.createElement('tr');
            newRow.innerHTML = `<td><span class="creature-name">${combatant.name}</span></td>`+
            `<td colspan="2"> <span class="creature-initiative">${combatant.initiative}</span></td>`+
            `<td style="display:none;"> <span style="display:none;" class="creature-id">${combatant.id}</span> </td>`+
            `<td> <button type="button" class="delete-button">x</button> </td>`;
            combatList.appendChild(newRow);
        });
    }

    static hideTable(){
        const table = document.querySelector('table');
        const turnControlTop = document.querySelector('#combat-control-top');
        const turnControlBottom = document.querySelector('#combat-control-bottom');
        turnControlBottom.style.display = 'none';
        turnControlTop.style.display = 'none';
        table.style.display = 'none';
        table.style.padding = '0';
    }

    static unhideTable(){
        const table = document.querySelector('table');
        const container = document.querySelector('.table-container');
        const turnControlTop = document.querySelector('#combat-control-top');
        const turnControlBottom = document.querySelector('#combat-control-bottom');
        turnControlBottom.style.display = 'flex';
        turnControlTop.style.display = 'flex';
        table.style.padding = '2em';
        table.style.display = 'table';
        container.style.padding = '3em';
    }

    static initialTurnLabelUpdate(event){
        const turnButton = document.querySelector('#next-turn-button');
        const turnLabel = document.querySelector('#current-turn-label');
        if (event.target.encounterReference.getCurrentTurn().slice(-1).toLowerCase() === 's') {
            turnLabel.innerHTML = `It is currently ${event.target.encounterReference.getCurrentTurn()}' turn`
        } else {
            turnLabel.innerHTML = `It is currently ${event.target.encounterReference.getCurrentTurn()}'s turn`
        }
        event.target.style.display = 'none';
        turnButton.style.display = 'block';
        this.enableEndButton();
    }

    static turnLabelUpdate(event) {
        const turnLabel = document.querySelector('#current-turn-label');
        event.target.encounterReference.nextTurn();
        if (event.target.encounterReference.getCurrentTurn().slice(-1).toLowerCase() === 's') {
            turnLabel.innerHTML = `It is currently ${event.target.encounterReference.getCurrentTurn()}' turn`
        } else {
            turnLabel.innerHTML = `It is currently ${event.target.encounterReference.getCurrentTurn()}'s turn`
        }
    }

    static onDeleteLabelUpdate(encounter) {
        const turnLabel = document.querySelector('#current-turn-label');
        if (encounter.getCurrentTurn().slice(-1).toLowerCase() === 's') {
            turnLabel.innerHTML = `It is currently ${encounter.getCurrentTurn()}' turn`
        } else {
            turnLabel.innerHTML = `It is currently ${encounter.getCurrentTurn()}'s turn`
        }
    }

    static enableEndButton(){
        const endCombatButton = document.querySelector('#end-combat-button');
        endCombatButton.disabled = false;
    }

    static disableEndButton(){
        const endCombatButton = document.querySelector('#end-combat-button');
        endCombatButton.disabled = true;
    }

    static enableFixedMode(event) {
        const fixedButton = event.target;
        const rollButton = document.querySelector('#roll-init-button');
        const dexField = document.querySelector('#dex-score');
        const initField = document.querySelector('#initiative-bonuses');
        const fixedInit = document .querySelector('#init-score');
        const radioButtons = document.querySelectorAll('input[type="radio"]');
        radioButtons.forEach((rbtn) => {
            rbtn.disabled = true;
        });
        fixedButton.disabled = true;
        rollButton.disabled = false;
        dexField.value = '';
        dexField.disabled = true;
        initField.value = '';
        initField.disabled = true;
        fixedInit.value = '0';
        fixedInit.disabled = false; 
    }

    static enableRollMode(event) {
        const rollButton = event.target;
        const fixedButton = document.querySelector('#fixed-init-button');
        const dexField = document.querySelector('#dex-score');
        const initField = document.querySelector('#initiative-bonuses');
        const fixedInit = document.querySelector('#init-score');
        const radioButtons = document.querySelectorAll('input[type="radio"]');
        radioButtons.forEach((rbtn) => {
            rbtn.disabled = false;
        });
        rollButton.disabled = true;
        fixedButton.disabled = false;
        dexField.disabled = false;
        dexField.value = '0';
        initField.disabled = false;
        initField.value = '0';
        fixedInit.disabled = true;
        fixedInit.value = '';
    }

    static initialForm() {
        const rollButton = document.querySelector('#roll-init-button');
        const fixedButton = document.querySelector('#fixed-init-button');
        const dexField = document.querySelector('#dex-score');
        const initField = document.querySelector('#initiative-bonuses');
        const fixedInit = document .querySelector('#init-score');
        const radioButtons = document.querySelectorAll('input[type="radio"]');
        radioButtons.forEach((rbtn) => {
            rbtn.disabled = false;
        });
        rollButton.disabled = true;
        fixedButton.disabled = false;
        dexField.disabled = false;
        dexField.value = '0';
        initField.disabled = false;
        initField.value = '0';
        fixedInit.disabled = true;
        fixedInit.value = '';
    }

    static reset() {
        const combatList = document.querySelector("#combat-list");
        const startCombatButton = document.querySelector('#start-combat-button');
        const turnButton = document.querySelector('#next-turn-button');
        const turnLabel = document.querySelector('#current-turn-label');
        if (combatList.children.length > 0) {
            while (combatList.children.length > 0) {
                combatList.removeChild(combatList.lastChild);
            }
        }
        turnLabel.innerHTML = 'Combat has not currently started.';
        turnButton.style.display = 'none';
        startCombatButton.style.display = 'block';
        this.hideTable();
        this.disableEndButton();
    }
}

/* ========================================================================= */

//Global variable for the encounter.

const encounter = new Encounter();

//Reset the form to initial state on load.

UI.initialForm();

/* ========================================================================= */

//Event that switches the form to fixed mode.

const fixedInitButton = document.querySelector('#fixed-init-button');
fixedInitButton.addEventListener('click', (e) => {
    UI.enableFixedMode(e);
});

//Event that switches the form to roll mode.

const rollInitButton = document.querySelector('#roll-init-button');
rollInitButton.addEventListener('click', (e) => {
    UI.enableRollMode(e);
});

//Event that takes the input from input fields and adds it to the DOM.
 
const addCreatureButton = document.querySelector('#add-button');
addCreatureButton.encounterReference = encounter;
addCreatureButton.addEventListener('click', (e) => {
    const disabledButton = document.querySelector('button:disabled');
    const nameField = document.querySelector('#creature-name');
    const dexField = document.querySelector('#dex-score');
    const bonusesField = document.querySelector('#initiative-bonuses');
    const initiativeField = document.querySelector('#init-score');

    let newCreature;

    if (disabledButton.id === 'roll-init-button') {
        const radioOption = document.querySelector('input[type="radio"]:checked');     
        switch(radioOption.id){
            case "option-norm": newCreature = new Creature(nameField.value, parseInt(dexField.value), parseInt(bonusesField.value),0);
            break;
            case "option-adv": newCreature = new Creature(nameField.value, parseInt(dexField.value), parseInt(bonusesField.value), 1);
            break;
            case "option-dis": newCreature = new Creature(nameField.value, parseInt(dexField.value), parseInt(bonusesField.value),2);
            break;
            default: newCreature = {};
            break;
        }
        
    } else {
        newCreature = new Creature(nameField.value, parseInt(initiativeField.value));
    }
    e.target.encounterReference.add(newCreature);
        if (e.target.encounterReference.isInCombat) {
            e.target.encounterReference.addToTurnList(newCreature);
        }
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
        if (combatList.encounterReference.isInCombat) {
            combatList.encounterReference.removeFromTurnList(creatureToDeleteID);    
        }
        if (combatList.encounterReference.isEmpty()) {
            UI.reset();
            combatList.encounterReference.endCombat();
        }
    }
})

//Event that starts combat and allows the use of the turn list inside the encounter instance.

const startCombatButton = document.querySelector('#start-combat-button');
startCombatButton.encounterReference = encounter;
startCombatButton.addEventListener('click',(e) => {
    const turnButton = document.querySelector('#next-turn-button');
    const turnLabel = document.querySelector('#current-turn-label');
    console.log(e.target.encounterReference);
    e.target.encounterReference.startCombat();
    UI.initialTurnLabelUpdate(e);
});

//Event that cycles through turns in the encounter instance and displays the current turn.

const nextTurnButton = document.querySelector('#next-turn-button');
nextTurnButton.encounterReference = encounter;
nextTurnButton.addEventListener('click', (e) => {
    UI.turnLabelUpdate(e);
})

//Event that ends combat

const endCombatButton = document.querySelector('#end-combat-button');
endCombatButton.encounterReference = encounter;
endCombatButton.addEventListener('click',(e) => {
    UI.reset();
    e.target.encounterReference.endCombat();
})