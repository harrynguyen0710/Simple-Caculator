// array to hold the current expression (numbers and operators), by default it has a number 0
let mathExpressions = []; 
// variable to hold the current number being typed
let currentInput = ''; 


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


// selects close error popup button
const closePopupBtn = document.getElementById('close-popup-btn');
// selects the error popup
const errorPopup = document.getElementById('errorPopup');

/*
input: a method
process: hide the error popup
ouput: none
*/
closePopupBtn.addEventListener('click', () => {
    // hide the error popup
    errorPopup.style.display = 'none';

});


/*
input: none
process: display the error popup
output: none
*/
function showErrorPopup() {
    // display the error popup
    errorPopup.style.display = 'block';
}


/*
input: a result after computing the inputed math expressions
process: 
    - if the result is undefined or is NaN, return true because it has error.
    - else return false, because there's no error.
output: true or false
*/
function hasOperationError(result) {
    // check result is an error, if has an operation error
    return result == undefined || isNaN(result);
}


// selects all the buttons on the calculator
const buttons = document.querySelectorAll('button'); 
// selects the display input element where the result is shown
const displayInput = document.getElementById('display-input'); 



// loop through each button to add a click event listener
/*
input: button's value from user
process:
    - use an array to store all values from users
    - then use the calculate method with the mathExpression array as a param to get the result 
output: none
*/
buttons.forEach(button => {
    button.addEventListener('click', function () {
        // 1. get the text value of the button that was clicked
        const value = this.innerText; 

        // 2. check if the value is a number or a decimal point
        if (!isNaN(value) || (currentInput !== ''  && value === ".")) {

            // only allow one decimal point in a number (avoid .9 or .123)
            if (value !== '.' || (value === '.' && !currentInput.includes('.'))) {
            
                // append the number or decimal to the current input
                currentInput += value; 

                // update the display with the current input
                displayInput.value = currentInput; 
            }
        
        // 3. check if the value is an operator
        } else if (isOperator(value)) {

            // 3.1. if there's a number in the current input
            if (currentInput !== '') { 

                // convert it to a float number
                let parsedValue = parseFloat(currentInput) 

                // add it to the math expressions array
                mathExpressions.push(parsedValue); 

                // reset current input for the next value from user
                currentInput = ''; 
            }

            // 3.2. if the last item in the math expressions array is not an operator and there's something in the array
            // this condition appears to avoid the case 2 adjacent operators.
            if (!isOperator(mathExpressions[mathExpressions.length - 1]) && mathExpressions.length > 0) {

                // add the operator to the math expressions array
                mathExpressions.push(value); 

                // show the math expression (number + operator) on the display
                displayInput.value = mathExpressions.join(' '); 
            }

        // 4. clear the display if the 'C' button is pressed
        } else if (value === 'C') {

            // reset the math expressions array
            mathExpressions = []; 

            // reset current input
            currentInput = ''; 
            
            // clear the display
            displayInput.value = ''; 

        // 5. handle the equals ('=') button click
        } else if (value === '=') {

            // 5.1 check whether current input is NaN to avoid pushing invalid value
            if (currentInput !== '') {
                mathExpressions.push(parseFloat(currentInput));
            }

            // 5.2 if user doesn't input any opeation and press '=', print 0 in the interface
            if (mathExpressions.length == 0) {

                // display 0 on the interface and set the current input as 0 for the next operation
                currentInput = displayInput.value = '0';

            }
            // 5.3 caluclate to get the end result
            else {

                // calculate the result of the math expression by calling the calculate method
                const result = calculate(mathExpressions); 
                    
                // check if the result can be null  or NaN or undefined, if it is, alert an error
                if (hasOperationError(result)) {

                    // call error popup method
                    showErrorPopup();

                    // set the current value as " " and display nothing to the user interface.
                        currentInput = displayInput.value = ""; 

                } else {
                    
                    // update the display and current input with the result and rounded with the last 3 remainders
                    currentInput = displayInput.value = result; 
                }
            }

                // reset the math expressions array after the calculation for the next stage
                mathExpressions = []; 
        }
    });

});

// function to perform the actual calculations
/* 
input: an array of math expression, such as ['1','+','1']
process:
    - create an array for storing the result
    - iterate the passed array to calculate the * / operators first
    - then push the result and + - operators to the new array
    - iterate the new array to calculate the + - operator 
output:
    - a number (float or integer)
*/
const calculate = (mathExpressions) => {

    // 1. array to hold intermediate results (for * and / operations)
    let resultArray = []; 

    // 2. first pass: handle * and / operators (PRITORITY THE * AND / OPERATIONS)
    for (let i = 0; i < mathExpressions.length; i++) {
        
        // 2.1. if the operator is multiplication
        if (mathExpressions[i] === '*') { 

            // multiply the last number in resultArray with the next number
            let product = resultArray.pop() * (mathExpressions[i + 1]); 

            // push the product back to resultArray
            resultArray.push(product); 

            // skip the next number as it was already processed
            i += 1; 

        // 2.2 if the operator is division
        } else if (mathExpressions[i] === '/') { 

            // divide the last number in resultArray by the next number
            let division = resultArray.pop() / mathExpressions[i + 1]; 

            // push the result back to resultArray
            resultArray.push(division); 

            // skip the next number as it was already processed
            i += 1; 

        } 
        // 2.3
        else {
            // for numbers and +, -, just push them to resultArray
            resultArray.push(mathExpressions[i]); 
           
        }
    }

    // 3. second pass: handle + and - operators
    // initialize the result with the first number in the resultArray
    let finalResult = resultArray[0]; 

    // 4. loop through resultArray skipping numbers, only looking at operators
    for (let i = 1; i < resultArray.length; i += 2) { 
        if (resultArray[i] === '+') {

            // if it's +, add the next number to the finalResult
            finalResult += resultArray[i + 1]; 
            
        } else if (resultArray[i] === '-') {

            // if it's -, subtract the next number from finalResult
            finalResult -= resultArray[i + 1]; 

        }
    }

    // 5. return the final calculated result
    return finalResult; 
};

