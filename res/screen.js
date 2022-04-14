"use strict";

/**
 * Calculator LCD Screen
 * @class
 * @property {number} digits - Max LCD Digits in the Display
 * @property {array}  matrix - LCD Pixel Matrix
 * @property {array}  pixels - LCD Pixel Names
 * @author Dean Wagner <info@deanwagner.net>
 */
class Screen {

    // Class Properties
    digits = 0;
    matrix = [];
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

    /**
     * Constructor
     * @constructor
     * @param {number} max - Max LCD Digits in the Display
     */
    constructor(max) {

        // Max LCD Digits in the Display
        this.digits = max;

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
        this.matrix['.'] = [ 0, 0, 0, 0, 0, 0, 0, 1 ];
        this.matrix['-'] = [ 0, 0, 0, 1, 0, 0, 0, 0 ];
        this.matrix['E'] = [ 1, 1, 0, 1, 1, 0, 1, 0 ];
        this.matrix['r'] = [ 0, 0, 0, 1, 1, 0, 0, 0 ];
        this.matrix['o'] = [ 0, 0, 0, 1, 1, 1, 1, 0 ];
        this.matrix['H'] = [ 0, 1, 1, 1, 1, 1, 0, 0 ];
        this.matrix['L'] = [ 0, 1, 0, 0, 1, 0, 1, 0 ];
        this.matrix['O'] = [ 1, 1, 1, 0, 1, 1, 1, 0 ];

        // Get SVG Template
        const screen  = document.getElementById('lcd_screen');
        const baseSVG = document.getElementById('lcd_digit');
        const newSVG  = baseSVG.cloneNode(true);
        screen.innerHTML = '';

        // Build LCD Screen from SVG Template
        for (let i = 0; i < this.digits; i++) {
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

        // Show Screen (this is to avoid FOUC on slow load)
        screen.style.display = 'flex';
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

        // Reverse String
        let digit = str.toString().split('').reverse();

        // Add each Character to LCD Screen
        for (let i = 0; i < digit.length; i++) {
            if (typeof this.matrix[digit[i]] !== 'undefined') {
                this.displayDigit(this.matrix[digit[i]], i);
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
        for (let i = 0; i < this.digits; i++) {
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

export default Screen;