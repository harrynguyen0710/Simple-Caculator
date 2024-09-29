// selects the display input element where the result is shown
const display = document.getElementById('display'); 
// selects all the buttons on the calculator
const buttons = document.querySelectorAll('button'); 

// array to hold the current expression (numbers and operators)
let expressions = []; 
// variable to hold the current number being typed
let currentInput = ''; 
// placeholder for future operator usage (not used in the current implementation)
let operator = null;

// function to check if a value is an operator
/*
input: a number or an operator
process: 
    - check if the parameter is an operator, or a number by the includes method
    - if it's an operator return true, else return false
output: a boolean value
*/
function isOperator(value) {
    // returns true if the value is one of the four operators
    return ['+', '-', '*', '/'].includes(value); 
}

// loop through each button to add a click event listener
/*
input: button's value from user
process:
    - use an array to store all values from users
    - then use the calculate method to get the result 
output: none
*/
buttons.forEach(button => {
    button.addEventListener('click', function () {
        // get the text value of the button that was clicked
        const value = this.innerText; 

        // check if the value is a number or a decimal point
        if (!isNaN(value) || value === ".") {
            // only allow one decimal point in a number (avoid .9 or .123)
            if (value !== '.' || (value === '.' && !currentInput.includes('.'))) {
                // append the number or decimal to the current input
                currentInput += value; 
                // update the display with the current input
                display.value = currentInput; 
            }
        
        // check if the value is an operator
        } else if (['+', '-', '*', '/'].includes(value)) {
            // if there's a number in the current input
            if (currentInput !== '') { 
                // convert it to a number and add it to the expressions array
                expressions.push(parseFloat(currentInput)); 
                // reset current input for the next value from user
                currentInput = ''; 
            }
            // if the last item in the expressions array is not an operator and there's something in the array
            // this condition appears to avoid the case 2 adjacent operators.
            if (!isOperator(expressions[expressions.length - 1]) && expressions.length > 0) {
                // add the operator to the expressions array
                expressions.push(value); 
                // show the expression (number + operator) on the display
                display.value = expressions.join(' '); 
            }

        // clear the display if the 'C' button is pressed
        } else if (value === 'C') {
            // reset the expressions array
            expressions = []; 
            // reset current input
            currentInput = ''; 
            // clear the display
            display.value = ''; 

        // handle the equals ('=') button click
        } else if (value === '=') {
            // if there's a number in the current input
            if (currentInput !== '') { 
                // add it to the expressions array
                expressions.push(parseFloat(currentInput)); 
            }

            // check if the last element is an operator (to prevent calculation errors)
            // avoid the case where there's no number after an operator, such as, 1 + 1 + =
            if (['+', '-', '*', '/'].includes(expressions[-1])) {
                // error message if the last item is an operator
                display.value = 'Something went wrong';
                // reset the expressions array
                expressions = []; 
            } else {
                // calculate the result of the expression by calling the calculate method
                const result = calculate(expressions); 
                // update the display and current input with the result
                currentInput = display.value = result; 
                // reset the expressions array after the calculation for the next stage
                expressions = []; 
            }
        }

    });
});

// function to perform the actual calculations
/* 
input: an array of expression, such as ['1','+','1']
process:
    - create an array for storing the result
    - iterate the passed array to calculate the * / operators first
    - then push the result and + - operators to the new array
    - iterate the new array to calculate the + - operator 
output:
    - a number (float or integer)
*/
const calculate = (expressions) => {
    // array to hold intermediate results (for * and / operations)
    let resultArray = []; 

    // first pass: handle * and / operators
    for (let i = 0; i < expressions.length; i++) {
        // if the operator is multiplication
        if (expressions[i] === '*') { 
            // multiply the last number in resultArray with the next number
            let product = resultArray.pop() * expressions[i + 1]; 
            // push the product back to resultArray
            resultArray.push(product); 
            // skip the next number as it was already processed
            i += 1; 
        // if the operator is division
        } else if (expressions[i] === '/') { 
            // divide the last number in resultArray by the next number
            let division = resultArray.pop() / expressions[i + 1]; 
            // push the result back to resultArray
            resultArray.push(division); 
            // skip the next number as it was already processed
            i += 1; 
        } else {
            // for numbers and +, -, just push them to resultArray
            resultArray.push(expressions[i]); 
        }
    }

    // second pass: handle + and - operators
    // initialize the result with the first number in the resultArray
    let finalResult = resultArray[0]; 
    // loop through resultArray skipping numbers, only looking at operators
    for (let i = 1; i < resultArray.length; i += 2) { 
        if (resultArray[i] === '+') {
            // if it's +, add the next number to the finalResult
            finalResult += resultArray[i + 1]; 
        } else if (resultArray[i] === '-') {
            // if it's -, subtract the next number from finalResult
            finalResult -= resultArray[i + 1]; 
        }
    }

    return finalResult; // return the final calculated result
};
