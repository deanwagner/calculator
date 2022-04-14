# LCD Calculator
### LCD Calculator with an SVG Display

Live Demo:  
https://deanwagner.github.io/calculator/

![Project Screenshot](https://deanwagner.github.io/calculator/img/calculator-screenshot.png)

This project was created for the [Calculator assignment](https://www.theodinproject.com/paths/foundations/courses/foundations/lessons/calculator) as part of [The Odin Project](https://www.theodinproject.com) curriculum. I met all the assignment objectives and then expanded on it with my own concepts to make it more functional and user-friendly.

The most noteworthy aspect of this project is the faux liquid crystal display. Rather than simply displaying the raw i/o I created this display to simulate a real calculator. In the markup just one SVG digit is defined with seven LCD pixels that can be turned on/off individually with JavaScript and CSS. When the page is loaded the single SVG digit is cloned and repeated to create the ten digit display. When data is to be displayed the string is parsed and each character is associated with a corresponding item in the predefined pixel matrix, which dictates which of the individual LCD pixels are to be activated for each character to be displayed.

### Provided Assets

* None

### Objectives

1. Function for each math operator
2. Operator function that takes an operator and calls one of previous functions
3. Display with button for each digit, operation function, 'clear', and 'equals'
4. Functions to populate display
5. String multiple operations together (12 + 7 - 5 * 3 = 42)
6. Do not evaluate more than one pair of numbers at a time
7. Round long decimal numbers to avoid overflow
8. 'Clear' button should wipe all existing data
9. Error message for divide-by-zero
10. (+) Decimal button for floating point numbers
11. (+) Different colors for operation and number buttons
12. (+) 'Backspace' button for wrong entries
13. (+) Keyboard support

### Scope Creep

* __LCD Display__ utilizing inline SVG images
* `[+/-]` button for positive/negative numbers
* Responsive Design
* PWA and A2HS support