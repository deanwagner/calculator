"use strict";

/**
 * Calculator Operations
 * @class
 * @property {number}  digits   - Max LCD Digits in the Display
 * @property {object}  screen   - LCD Screen Object
 * @property {string}  display  - String to be Displayed in LCD Screen
 * @property {number}  memory   - Previously Entered Digit
 * @property {string}  operator - String Representation of Mathematical Operator
 * @property {boolean} reset    - Reset Screen Flag
 * @property {boolean} decimal  - Decimal Used Flag
 * @property {boolean} finished - Finished Operation Flag
 * @author Dean Wagner <info@deanwagner.net>
 */
class Operations {

    // Class Properties
    digits    = 0;
    screen    = {};
    display   = '0';
    memory    = null;
    operator  = '';
    reset     = false;
    decimal   = false;
    finished  = false;

    /**
     * Constructor
     * @constructor
     * @param {number} max - Max LCD Digits in the Display
     */
    constructor(max) {
        // Max LCD Digits in the Display
        this.digits = max;
    }

    /**
     * Handle Math Operations
     * @param {string} op - Math Operator
     */
    operate(op) {
        // Parse Screen Value
        const screen = (this.decimal) ? parseFloat(this.display) : parseInt(this.display);

        if ((this.memory === null) || (this.operator === '')) {
            // No Previous Input
            this.reset    = true;
            this.memory   = screen;
            this.operator = op;
        } else {
            let result;

            // Perform Operation
            switch (this.operator) {
                case '+':
                    result = this.add(this.memory, screen);
                    break;
                case '-':
                    result = this.subtract(this.memory, screen);
                    break;
                case '*':
                    result = this.multiply(this.memory, screen);
                    break;
                case '/':
                    result = (screen === 0) ? 'LOL' : this.divide(this.memory, screen);
                    break; // ^ Divide-by-Zero Check ^
                default:
                    result = 'Error';
            }

            /*
            // Debug
            const debug = {
                'Decimal'  : this.decimal,
                'Display'  : this.display,
                'Parsed'   : screen,
                'Memory'   : this.memory,
                'Operator' : this.operator,
                'Result'   : result,
                'String'   : result.toString()
            };
            console.table(debug);
            */

            if ((result === 'Error') || (result === 'LOL')) {
                // Handle Error
                this.reset    = true;
                this.operator = '';
                this.memory   = null;
                this.display  = result;
            } else {
                // Handle Result
                this.memory   = result;
                this.display  = result.toString();

                if (op === '=') {
                    // Operation Finished
                    this.finished = true;
                    this.reset    = false;
                    this.operator = '';
                } else {
                    // Continue Operation
                    this.finished = false;
                    this.reset    = true;
                    this.operator = op;
                }
            }
        }
    }

    /**
     * Handle User Input
     * @param {object} value - Input Value
     */
    input(value) {
        if (value === '.') {
            // Decimal Point
            if (this.decimal !== true) {
                this.decimal = true;
                if (this.finished) {
                    this.finished = false;
                    this.display  = value;
                } else {
                    this.display += value;
                }
            }
        } else if (value === '⁺/₋') {
            // +/-
            if (this.display.charAt(0) === '-') {
                this.display = this.display.substring(1);
            } else {
                this.display = '-' + this.display;
            }
        } else {
            // Digit
            if (this.display === '0') {
                this.display = value;
            } else if (this.display === '-0') {
                this.display = '-' + value;
            } else {
                if (this.finished) {
                    this.finished = false;
                    this.display  = value;
                } else {
                    this.display += value;
                }
            }
        }

        // String Too Large to Display
        if (this.display.length > this.digits) {
            if (this.display.includes('.')) {
                // Round Decimals
                let decimal;
                for (let i = this.digits; i > 0; i--) {
                    decimal = parseFloat(this.display).toFixed(i);
                    if (decimal.toString().length <= this.digits) {
                        i = 0;
                    }
                }

                if (decimal.toString().length > this.digits) {
                    // Show Error
                    this.memory   = null;
                    this.reset    = true;
                    this.operator = '';
                    this.display  = 'Error';
                } else {
                    this.display = decimal.toString();
                }

            } else {
                // Show Error
                this.memory   = null;
                this.reset    = true;
                this.operator = '';
                this.display  = 'Error';
            }
        }
    }

    /**
     * Adds 2 Numbers
     * @param   {number|null} num1 - Augend
     * @param   {number|null} num2 - Addend
     * @returns {number} - Sum
     */
    add(num1, num2) {
        return num1 + num2;
    }

    /**
     * Subtracts 2 Numbers
     * @param   {number|null} num1 - Minuend
     * @param   {number|null} num2 - Subtrahend
     * @returns {number} - Difference
     */
    subtract(num1, num2) {
        return num1 - num2;
    }

    /**
     * Multiplies 2 Numbers
     * @param   {number|null} num1 - Multiplier
     * @param   {number|null} num2 - Multiplicand
     * @returns {number} - Product
     */
    multiply(num1, num2) {
        return num1 * num2;
    }

    /**
     * Divides 2 Numbers
     * @param   {number|null} num1 - Dividend
     * @param   {number|null} num2 - Divisor
     * @returns {number} - Quotient
     */
    divide(num1, num2) {
        return num1 / num2;
    }

    /**
     * Handle Equals Button Event
     */
    equals() {
        if ((this.operator !== '') && (this.memory !== null)) {
            this.operate('=');
        }
    }

    /**
     * Clear Display and Memory
     */
    clear() {
        this.display  = '0';
        this.memory   = null;
        this.operator = '';
        this.decimal  = false;
        this.finished = false;
    }

    /**
     * Remove Last Character
     */
    back() {
        this.display = (this.display.length > 1) ? this.display.slice(0, -1) : '0';
    }

    /**
     * Reset LCD Screen
     */
    resetOperation() {
        if (this.reset) {
            this.reset   = false;
            this.decimal = false;
            this.display = '0';
        }
    }

    /**
     * Get Result
     * @returns {string} - Current Display
     */
    getResult() {
        return this.display;
    }
}

export default Operations;