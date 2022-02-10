"use strict";

/**
 * LCD Calculator App
 * @class
 * @author  Dean Wagner <info@deanwagner.net>
 */
class Calculator {

    // Class Properties
    maxDigits = 10;
    display   = '0';
    memory    = null;
    operator  = '';
    reset     = false;
    decimal   = false;
    finished  = false;

    // LCD Pixel Names
    pixels = [
        'topCenter',
        'topLeft',
        'topRight',
        'midCenter',
        'botLeft',
        'botRight',
        'botCenter',
        'point'
    ];

    // Valid Keyboard Inputs
    keys = [
        '1', '2', '3', '4', '5',
        '6', '7', '8', '9', '0',
        '+', '-', '*', '/', '.',
        'Enter', 'Backspace', 'Delete'
    ];

    /**
     * Constructor
     * @constructor
     */
    constructor() {

        // LCD Pixel Matrix: Numbers
        this.matrix = [
            [ 1, 1, 1, 0, 1, 1, 1, 0 ], // 0
            [ 0, 0, 1, 0, 0, 1, 0, 0 ], // 1
            [ 1, 0, 1, 1, 1, 0, 1, 0 ], // 2
            [ 1, 0, 1, 1, 0, 1, 1, 0 ], // 3
            [ 0, 1, 1, 1, 0, 1, 0, 0 ], // 4
            [ 1, 1, 0, 1, 0, 1, 1, 0 ], // 5
            [ 1, 1, 0, 1, 1, 1, 1, 0 ], // 6
            [ 1, 0, 1, 0, 0, 1, 0, 0 ], // 7
            [ 1, 1, 1, 1, 1, 1, 1, 0 ], // 8
            [ 1, 1, 1, 1, 0, 1, 1, 0 ]  // 9
        ];

        // LCD Pixel Matrix: Characters
        this.matrix['_'] = [ 0, 0, 0, 0, 0, 0, 0, 0 ];
        this.matrix['E'] = [ 1, 1, 0, 1, 1, 0, 1, 0 ];
        this.matrix['r'] = [ 0, 0, 0, 1, 1, 0, 0, 0 ];
        this.matrix['o'] = [ 0, 0, 0, 1, 1, 1, 1, 0 ];
        this.matrix['H'] = [ 0, 1, 1, 1, 1, 1, 0, 0 ];
        this.matrix['L'] = [ 0, 1, 0, 0, 1, 0, 1, 0 ];
        this.matrix['O'] = [ 1, 1, 1, 0, 1, 1, 1, 0 ];
        this.matrix['.'] = [ 0, 0, 0, 0, 0, 0, 0, 1 ];
        this.matrix['-'] = [ 0, 0, 0, 1, 0, 0, 0, 0 ];

        // Get SVG Template
        const screen   = document.getElementById('lcd_screen');
        const baseSVG  = document.getElementById('lcd_digit');
        const newSVG   = baseSVG.cloneNode(true);
        screen.innerHTML = '';

        // Build LCD Screen from SVG Template
        for (let i = 0; i < this.maxDigits; i++) {
            // Clone SVG Template
            const svg = newSVG.cloneNode(true);

            // Assign IDs
            svg.id = svg.id + '_' + i;
            const ids = svg.querySelectorAll('.lcd_pixels > *');
            for (let ii = 0; ii < ids.length; ii++) {
                ids[ii].id = ids[ii].id + '_' + i;
            }

            // Add to DOM
            screen.prepend(svg);
        }

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
        this.displayString('HELLO');
    }

    /**
     * Keyboard Event Router
     * @param {object} event - Keyup Event
     */
    keyboardEvent(event) {
        this.resetLCD();

        // Route Button Event
        switch (true) {
            case (event.key === 'Delete'):
                this.clear();
                break;
            case (event.key === 'Backspace'):
                this.back();
                break;
            case (event.key === '+'):
                this.operate('+');
                break;
            case (event.key === '-'):
                this.operate('-');
                break;
            case (event.key === '*'):
                this.operate('*');
                break;
            case (event.key === '/'):
                this.operate('/');
                break;
            case (event.key === 'Enter'):
                this.equals();
                break;
            default:
                this.input(event.key); 
        } 

        // Display Result
        this.displayString(this.display);
    }

    /**
     * Button Click Event Router
     * @param {object} button - Button Clicked
     */
    buttonEvent(button) {
        this.resetLCD();

        // Route Button Event
        switch (true) {
            case (button.id === 'btn_c'):
                this.clear();
                break;
            case (button.id === 'btn_b'):
                this.back();
                break;
            case (button.id === 'btn_a'):
                this.operate('+');
                break;
            case (button.id === 'btn_s'):
                this.operate('-');
                break;
            case (button.id === 'btn_m'):
                this.operate('*');
                break;
            case (button.id === 'btn_d'):
                this.operate('/');
                break;
            case (button.id === 'btn_e'):
                this.equals();
                break;
            default:
                this.input(button.innerText); 
        } 

        // Display Result
        this.displayString(this.display);
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
            switch (true) {
                case (this.operator === '+'):
                    result = this.add(this.memory, screen);
                    break;
                case (this.operator === '-'):
                    result = this.subtract(this.memory, screen);
                    break;
                case (this.operator === '*'):
                    result = this.multiply(this.memory, screen);
                    break;
                case (this.operator === '/'):
                    result = (screen === 0) ? 'Error' : this.divide(this.memory, screen);
                    break; // ^ Divide-by-Zero Check ^
                default:
                    result = 'Error';
            }

            // Debug - Activate with #debug at end of URL
            if (window.location.hash === 'debug') {
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
            }

            if (result === 'Error') {
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
     * Adds 2 Numbers
     * @param   {number} num1 - Augend
     * @param   {number} num2 - Addend
     * @returns {number} - Sum
     */
    add(num1, num2) {
        return num1 + num2;
    }

    /**
     * Subtracts 2 Numbers
     * @param   {number} num1 - Minuend
     * @param   {number} num2 - Subtrahend
     * @returns {number} - Difference
     */
    subtract(num1, num2) {
        return num1 - num2;
    }

    /**
     * Multiplies 2 Numbers
     * @param   {number} num1 - Multiplier
     * @param   {number} num2 - Multiplicand
     * @returns {number} - Product
     */
    multiply(num1, num2) {
        return num1 * num2;
    }

    /**
     * Divides 2 Numbers
     * @param   {number} num1 - Dividend
     * @param   {number} num2 - Divisor
     * @returns {number} - Quotient
     */
    divide(num1, num2) {
        return num1 / num2;
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
    }

    /**
     * Remove Last Character
     */
    back() {
        if (this.display.length > 1) {
            this.display = this.display.slice(0, -1);
        } else {
            this.display = '0';
        }
    }

    /**
     * Display String
     * @param {string} str - String to Display
     */
    displayString(str) {
        this.displayClear();

        // Empty String
        if (str === '') {
            str = '0';
        }

        // String Too Large to Display
        if (str.length > this.maxDigits) {
            if (str.includes('.')) {
                // Round Decimals
                const decimal = parseFloat(str).toFixed(7);
                str = decimal.toString();
                //todo loop to test fixed vs max
            } else {
                // Show Error
                this.memory   = null;
                this.reset    = true;
                this.operator = '';
                str = 'Error';
            }
        }

        // Reverse String
        let digits = str.toString().split('').reverse();

        // Add each Character to LCD Screen
        for (let i = 0; i < digits.length; i++) {
            if (typeof this.matrix[digits[i]] !== 'undefined') {
                this.displayDigit(this.matrix[digits[i]], i);
            }
        }
    }

    /**
     * Add Character to LCD Screen
     * @param {array}  digit - Pixel Matrix of Character
     * @param {number} place - Position on Screen
     */
    displayDigit(digit, place) {
        // Loop through Pixel Matrix
        digit.forEach((value, index) => {
            // Get Pixel Name
            const elm = document.getElementById(this.pixels[index] + '_' + place);

            // Alter Pixel
            if (this.pixels[index] === 'point') {
                // Decimal Point
                if (value) {
                    // Pixel On
                    elm.classList.remove('lcd_off');
                    elm.classList.add('lcd_show');
                } else {
                    // Pixel Off
                    elm.classList.remove('lcd_show');
                    elm.classList.add('lcd_off');
                } 
            } else {
                // Character
                if (value) {
                    // Pixel On
                    elm.classList.remove('lcd_hide');
                    elm.classList.add('lcd_show');
                } else {
                    // Pixel Off
                    elm.classList.remove('lcd_show');
                    elm.classList.add('lcd_hide');
                } 
            }
        });
    }

    /**
     * Clear Display
     */
    displayClear() {
        // Loop through all Digits
        for (let i = 0; i < this.maxDigits; i++) {
            // Loop through Pixel Names
            for (let ii = 0; ii < this.pixels.length; ii++) {
                // Get Pixel
                const elm = document.getElementById(this.pixels[ii] + '_' + i);

                // Kill Pixel
                if (this.pixels[ii] === 'point') {
                    // Decimal Point
                    elm.classList.remove('lcd_show');
                    elm.classList.add('lcd_off');
                } else {
                    // Digit
                    elm.classList.remove('lcd_show');
                    elm.classList.add('lcd_hide');
                }
            }
        }
    }

    /**
     * Reset LCD Screen
     */
    resetLCD() {
        if (this.reset) {
            this.reset   = false;
            this.decimal = false;
            this.display = '0';
        }
    }

    /**
     * Get Button ID from Keystroke
     * @param   {string} key - Key Value
     * @returns {string} - Button ID
     */
    getID(key) {
        switch (true) {
            case (key === 'Delete'):
                return 'btn_c';
            case (key === 'Backspace'):
                return 'btn_b';
            case (key === '+'):
                return 'btn_a';
            case (key === '-'):
                return 'btn_s';
            case (key === '*'):
                return 'btn_m';
            case (key === '/'):
                return 'btn_d';
            case (key === '.'):
                return 'btn_p';
            case (key === 'Enter'):
                return 'btn_e';
            default:
                return 'btn_' + key;
        }
    }
}