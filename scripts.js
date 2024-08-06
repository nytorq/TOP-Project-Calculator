const calculator = (function() {
    let memory = {
        operand1: '',
        operator: '',
        operand2: '',
        activeOperand: 1
    };

    const operandSwitcher = function() {
        memory.activeOperand === 1 ? memory.activeOperand = 2 : memory.activeOperand = 1;
    }

    const inputTriage = function() {
        switch (screenController.currentInput.type) {
            case 'operator':
                if (memory.operand1 === null) {
                    console.log('%cThere is no first operand. You must insert a number first.', 'color: red;')
                } else {
                    memory.operator = screenController.currentInput.character;
                    operandSwitcher();
                }
                break
            case 'number':
                if (memory.activeOperand === 1) {
                    memory.operand1 = memory.operand1 + screenController.currentInput.character;
                } else if (memory.activeOperand === 2) {
                    memory.operand2 = memory.operand2 + screenController.currentInput.character;
                }
                break
            case 'decimal':
                let strOperand1 = memory.operand1.toString();
                let strOperand2 = memory.operand2.toString();
                if (memory.activeOperand === 1 && !strOperand1.includes('.')) {
                    memory.operand1 = memory.operand1 + screenController.currentInput.character;
                } else if (memory.activeOperand === 2 && !strOperand2.includes('.')) {
                    memory.operand2 = memory.operand2 + screenController.currentInput.character;
                }
                break
            case 'calculate':
                operate();
        }
        // console.log(`The currentInput is: ${screenController.currentInput.character} and your formula now reads as:`);
        screenController.updateDisplay();
        console.log(`%c${memory.operand1} ${memory.operator} ${memory.operand2}`, 'color: blue; font-size: 24px;');
    }

    const clearMemory = function() {
        memory.operand1 = '';
        memory.operator = '';
        memory.operand2 = '';
        memory.activeOperand = 1;
        screenController.updateDisplay();
        console.log(`%cMemory has been cleared.`, 'color: orange;')
    }

    const deleteLast = function() {
        let strOperand1 = memory.operand1.toString();
        let strOperand2 = memory.operand2.toString();
        if (screenController.currentInput.type === 'operator') {
            memory.operator = '';
        } else if (memory.activeOperand === 1) {
            memory.operand1 = parseFloat(strOperand1.slice(0,-1),10);
        } else if (memory.activeOperand === 2) {
            memory.operand2 = parseFloat(strOperand2.slice(0,-1), 10);
        }
        screenController.updateDisplay();
        console.log(`%c${memory.operand1} ${memory.operator} ${memory.operand2}`, 'color: blue; font-size: 24px;');
    }

    const normalizeOperator = function(op) {
        // console.log(`The original character code is ` + op.charCodeAt(0))
        switch (op) {
            case '−': // Unicode minus sign
            case '−': // HTML entity &minus; (might be represented as Unicode)
                return '-';
            case '+': // Plus sign or HTML entity &plus;
                return '+';
            default:
                return op;
        }
    }

    const operate = function() {

        let normedOperator = normalizeOperator(memory.operator);
        let result;
        // console.log(`The normed character code is ` + normedOperator.charCodeAt(0));

        if (memory.operand2 === '0') {
            console.log('%c The earth shook and became ever so slightly off-kilter...', 'color:purple;')
        } else {
            switch (normedOperator) {
                case '+': 
                    result = parseFloat(memory.operand1) + parseFloat(memory.operand2);
                    break
                case '-' : 
                    result = parseFloat(memory.operand1) - parseFloat(memory.operand2);
                    break
                case '×' : 
                    result = parseFloat(memory.operand1) * parseFloat(memory.operand2);
                    break
                case '÷' : 
                    result = parseFloat(memory.operand1) / parseFloat(memory.operand2);
                    break
                default:
                    console.log('%cError: no operator present in calculation.', 'color: red;');
                    return null
            }
            clearMemory();
            memory.operand1 = result;
        }        
    }
        
    return {memory, inputTriage, clearMemory, deleteLast}
})();

const screenController = (function() {
    // VARIABLES
    let currentInput = {
        character: '',
        type: '',
    }
    
    // BUTTONS
    const clearButton = document.querySelector('#button-clear');
    clearButton.addEventListener('click', calculator.clearMemory);


    const backspaceButton = document.querySelector('#button-delete');
    backspaceButton.addEventListener('click', calculator.deleteLast);


    const calculatorKeys = document.getElementsByClassName('keypad');
    const registerClick = function() {
        currentInput.character = this.innerText;
        currentInput.type = this.classList[1];
        calculator.inputTriage();
    }
    for (i = 0 ; i < calculatorKeys.length ; i++) {
        let button = calculatorKeys[i];
        button.addEventListener('click', registerClick);
    }

    const calculatorDisplay = document.querySelector('#display');

    const updateDisplay = function() {
        let displayCharacters = calculator.memory.operand1 + calculator.memory.operator + calculator.memory.operand2;
        calculatorDisplay.innerText = displayCharacters;
    }

    return {currentInput, updateDisplay}


})();