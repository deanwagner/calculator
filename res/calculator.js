"use strict";

/**
 * LCD Calculator App
 * @class
 * @author  Dean Wagner <info@deanwagner.net>
 */
class Calculator {

    /**
     * Constructor
     * @constructor
     */
    constructor() {
        // LCD Pixel Names
        this.pixels = [
            'topCenter',
            'topLeft',
            'topRight',
            'midCenter',
            'botLeft',
            'botRight',
            'botCenter',
            'point'
        ];

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
        
        // Class Properties
        this.maxDigits = 10;
        this.display   = '0';
        this.memory    = null;
        this.operator  = '';
        this.reset     = false;
        this.decimal   = false;

        // Get SVG Template
        this.screen   = document.getElementById('lcd_screen');
        const baseSVG = document.getElementById('lcd_digit');
        this.newSVG   = baseSVG.cloneNode(true);
        this.screen.innerHTML = '';

        // Build LCD Screen from SVG Template
        for (let i = 0; i < this.maxDigits; i++) {
            // Clone SVG Template
            const svg = this.newSVG.cloneNode(true);

            // Assign IDs
            svg.id = svg.id + '_' + i;
            const ids = svg.querySelectorAll('.lcd_pixels > *');
            for (let ii = 0; ii < ids.length; ii++) {
                ids[ii].id = ids[ii].id + '_' + i;
            }

            // Add to DOM
            this.screen.prepend(svg);
        }

        // Event Listener
        this.buttons = document.getElementsByTagName('button');
        for (let i = 0; i < this.buttons.length; i++) {
            this.buttons[i].addEventListener('click', (e) => {
                // Handle Button Click Event
                this.buttonEvent(e.target);
            });
        }

        // Display Welcome Message
        this.displayString('HELLO');
    }

    /**
     * Button Click Event Router
     * @param {object} button - Button Clicked
     */
    buttonEvent(button) {
        if (this.reset) {
            // Reset LCD Screen
            this.reset   = false;
            this.decimal = false;
            this.display = '0';
        }

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
                this.input(button); 
        } 

        // Display Result
        this.displayString(this.display);
    }

    /**
     * Handle Math Operations
     * @param {string} op - Math Operator
     */
    operate(op) {
        this.reset = true;

        if ((this.memory === null) || (this.operator === '')) {
            // No Previous Input
            this.memory = parseInt(this.display);
            this.operator = op;
        } else {
            let result;

            // Perform Operation
            switch (true) {
                case (this.operator === '+'):
                    result = this.add(this.memory, parseInt(this.display));
                    break;
                case (this.operator === '-'):
                    result = this.subtract(this.memory, parseInt(this.display));
                    break;
                case (this.operator === '*'):
                    result = this.multiply(this.memory, parseInt(this.display));
                    break;
                case (this.operator === '/'):
                    result = this.divide(this.memory, parseInt(this.display));
                    break;
                default:
                    result = 'Error';
            }

            if (result === 'Error') {
                // Handle Error
                this.memory   = null;
                this.display  = result;
                this.reset    = true;
                this.operator = '';
                console.error('Invalid Operator');
            } else {
                // Handle Result
                if (op !== '=') {
                    this.operator = op;
                } else {
                    this.operator = '';
                }
                this.memory  = result; 
                this.display = result.toString(); 
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
     * @param {object} button - Button Clicked
     */
    input(button) {
        if (button.id === 'btn_p') {
            // Decimal Point
            if (this.decimal !== true) {
                if (this.display === '0') {
                    this.decimal = true;
                    this.display = '0.';
                } else {
                    this.display += button.innerText;
                }
            }
        } else if (button.id === 'btn_n') {
            // +/-
        } else {
            // Digit
            if (this.display === '0') {
                this.display = button.innerText;
            } else {
                this.display += button.innerText;
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
            this.memory   = null;
            this.reset    = true;
            this.operator = '';
            str = 'Error';
            console.warn('Number Too Large');
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
}