"use strict";

// Import Modules
import Screen     from './screen.js';
import Operations from './operations.js';

/**
 * LCD Calculator App
 * @class
 * @property {number} digits  - Max LCD Digits in the Display
 * @property {object} screen  - LCD Screen Object
 * @property {object} compute - Calculator Operations Object
 * @property {array}  keys    - Valid Keyboard Inputs
 * @author Dean Wagner <info@deanwagner.net>
 */
class Calculator {

    // Class Properties
    digits  = 10;
    screen  = {};
    compute = {};

    // Valid Keyboard Inputs
    keys = [
        '0', '1', '2', '3', '4',
        '5', '6', '7', '8', '9',
        '+', '-', '*', '/', '.',
        'Enter', 'Backspace', 'Delete'
    ];

    /**
     * Constructor
     * @constructor
     */
    constructor() {

        // Load Modules
        this.screen  = new Screen(this.digits);
        this.compute = new Operations(this.digits);

        // Button Event Listeners
        const buttons = document.getElementsByTagName('button');
        for (let i = 0; i < buttons.length; i++) {
            buttons[i].addEventListener('click', (e) => {
                // Handle Button Click Event
                this.buttonEvent(e.target);
            });
        }

        // Keyboard Event Listeners
        document.addEventListener('keydown', (e) => {
            if (this.keys.includes(e.key)) {
                // Add Animation Class
                const btn = document.getElementById(this.getID(e.key));
                if (typeof btn !== 'undefined') {
                    btn.classList.add('press');
                }
            }
        });
        document.addEventListener('keyup', (e) => {
            if (this.keys.includes(e.key)) {
                // Rout Input Event
                this.keyboardEvent(e);

                // Remove Animation Class
                const btn = document.getElementById(this.getID(e.key));
                if (typeof btn !== 'undefined') {
                    btn.classList.remove('press');
                }
            }
        });

        // Display Welcome Message
        this.screen.displayString('HELLO');
    }

    /**
     * Keyboard Event Router
     * @param {object} event - Keyup Event
     */
    keyboardEvent(event) {
        this.compute.resetOperation();

        // Route Button Event
        switch (event.key) {
            case 'Delete':
                this.compute.clear();
                break;
            case 'Backspace':
                this.compute.back();
                break;
            case '+':
                this.compute.operate('+');
                break;
            case '-':
                this.compute.operate('-');
                break;
            case '*':
                this.compute.operate('*');
                break;
            case '/':
                this.compute.operate('/');
                break;
            case 'Enter':
                this.compute.equals();
                break;
            default:
                this.compute.input(event.key);
        } 

        // Display Result
        this.screen.displayString(this.compute.getResult());
    }

    /**
     * Button Click Event Router
     * @param {object} button - Button Clicked
     */
    buttonEvent(button) {
        this.compute.resetOperation();

        // Route Button Event
        switch (button.id) {
            case 'btn_c':
                this.compute.clear();
                break;
            case 'btn_b':
                this.compute.back();
                break;
            case 'btn_a':
                this.compute.operate('+');
                break;
            case 'btn_s':
                this.compute.operate('-');
                break;
            case 'btn_m':
                this.compute.operate('*');
                break;
            case 'btn_d':
                this.compute.operate('/');
                break;
            case 'btn_e':
                this.compute.equals();
                break;
            default:
                this.compute.input(button.innerText);
        } 

        // Display Result
        this.screen.displayString(this.compute.getResult());
    }

    /**
     * Get Button ID from Keystroke
     * @param   {string} key - Key Value
     * @returns {string} - Button ID
     */
    getID(key) {
        switch (key) {
            case 'Delete':
                return 'btn_c';
            case 'Backspace':
                return 'btn_b';
            case '+':
                return 'btn_a';
            case '-':
                return 'btn_s';
            case '*':
                return 'btn_m';
            case '/':
                return 'btn_d';
            case '.':
                return 'btn_p';
            case 'Enter':
                return 'btn_e';
            default:
                return 'btn_' + key;
        }
    }
}

export default Calculator;