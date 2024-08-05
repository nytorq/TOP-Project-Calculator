const calculator = (function() {
    // console.log(${screenController.operand1} + ${screenController.operator} ${screenController.operand2})

    const calculateButton = document.querySelector('#button-equals');
    // let numberArray = [];
    // const operandConverter = function() {
    //     numberArray[0] = Number(screenController.memory[0]);
    //     numberArray[1] = screenController.memory[1];
    //     numberArray[2] = Number(screenController.memory[2]);
    // }
    let result;

    const updateRest = function () {
        screenController.memory[0] = result;
        screenController.memory[1] = '';
        screenController.memory[2] = '';
        screenController.updateDisplay();
    }

    const calculate = function () {
        // operandConverter();
        // let expression = numberArray.join('');
        // let result = eval(expression);
        // return result;
        switch (screenController.memory[1]) {
            case '+':
            result = parseFloat(screenController.memory[0]) + parseFloat(screenController.memory[2]);
            updateRest();
            break;
            case '-' : result = parseFloat(screenController.memory[0]) - parseFloat(screenController.memory[2]);
            updateRest();
            break;
            case 'x' : result = parseFloat(screenController.memory[0]) * parseFloat(screenController.memory[2]);
            updateRest();
            break;
            case '÷' : result = parseFloat(screenController.memory[0]) / parseFloat(screenController.memory[2]);
            updateRest();
            break;
            default:
                console.log('error');
        }
    }
    calculateButton.addEventListener('click', calculate);

    
    return {calculate, result}
})();

/* Logic on constructing operands:

Evaluating as if we were gonna have 3 arguments in an array, i.e operand1, an operator, and operand2.
- If number and first entry, store into operand.
- If operator and first entry, enter 0 as first operand and character as operator.
- if number and 2+ entry, join into operand
- If operator and 2+ entry, enter character as operator
- If number and operator exists,  

Evaluating as one string
- If !operator && operatand1.contains(!.) {operand1 = this.innerText}
- If !operator && operatand1.contains(!.) {operand1 = this.innerText}
- If operator { operand2 = this.innerText}

Operand eval
if (this.innerText = '.' operand.contains('.') { do something/.alert} else if ()
*/

const screenController = (function() {
    let memory = [];
    let operand1 = '';
    let operator = '';
    let operand2 = '';
    let input = {
        character: '',
        type: '',
        string: ''
    }

    const calculatorDisplay = document.querySelector('#display');

    const insertIntoMemory = function() {
        memory[0] = operand1;
        memory[1] = operator;
        memory[2] = operand2;
        updateDisplay();
    }

    const updateDisplay = function() {
        let displayCharacters = memory.join('');
        calculatorDisplay.innerText = displayCharacters;
        console.log(input)
        console.log(memory)
    }

    const clearMemory = function() {
        memory.length = 0;
        operand1 = '';
        operator = '';
        operand2 = '';
        input.string = '';
        updateDisplay();
    }

    const deleteLast = function() {
        operator.length === 0 ? operand1 = operand1.slice(0,-1) : operand2 = operand2.slice(0, -1);
        insertIntoMemory();
    }

    const operandSwitcher = function() {
        input.string = input.string + input.character;
        operator.length === 0 ? operand1 = operand1 + input.character : operand2 = operand2 + input.character;
    }

    const storeInput = function() {
        if (input.type === 'operator') {
            operator = input.character;
        } else if (input.type === 'decimal') {
            !input.string.includes('.') ? operandSwitcher() : console.log('Only one decimal at a time.')
        } else if (input.type === 'operand') {
            operandSwitcher();
        } else if (input.type === 'calculate') {
            calculator.calculate();
        }
        insertIntoMemory();
    }

    const registerClick = function() {
        input.character = this.innerText;
        if (this.classList.contains('operator')) {
            input.type = 'operator';
        } else if (this.classList.contains('decimal')) {
            input.type = 'decimal';
        } else if (this.classList.contains('number')) {
            input.type = 'operand';
        } else if (this.classList.contains('calculate')) {
            input.type = 'calculate';
        }
        storeInput();
    }

    const numericKeys = document.getElementsByClassName('keypad');
    for (i = 0 ; i < numericKeys.length ; i++) {
        let button = numericKeys[i];
        button.addEventListener('click', registerClick);
    }
    
    const clearButton = document.querySelector('#button-clear');
    clearButton.addEventListener('click', clearMemory);

    const deleteButton = document.querySelector('#button-delete');
    deleteButton.addEventListener('click', deleteLast);

    return {memory, operand1, operand2, operator, input, updateDisplay}


})();