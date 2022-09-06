'use strict';

const MAX_OPERAND_LENGTH = 10;

const buttons = document.querySelector('.buttons-container');
const inputDisplay = document.querySelector('.input-display')
const equationDisplay = document.querySelector('.equation-display');

let currentInput = '';
let currentEquation = '';
let currentOperator = '';
let numDigitsInOperand = 0;
let operations = [];

equationDisplay.textContent = '';
inputDisplay.textContent = '0';

let state = {
    awaitingOperand: false,
    solved: false
}

document.addEventListener('keydown', function (e) {
    // console.log(e.key);


    switch (e.key) {
        case '1':
        case '2':
        case '3':
        case '4':
        case '5':
        case '6':
        case '7':
        case '8':
        case '9':
            handleNumber(e.key);
            break;
        case '0':
            handleZero();
            break;
        case '.':
            handleDecimal();
            break;
        case '+':
        case '-':
        case '*':
        case '/':
        case '^':
            handleOperator(e.key);
            break;
        case 'Enter':
        case '=':
            handleEquals();
            break;



        case 'Backspace':
            handleDelete(e);
            break;
    }

    equationDisplay.textContent = operations.join(' ');

});










buttons.addEventListener('click', function (e) {
    let btnName = e.target.classList;
    let btn = e.target.textContent;
    e.target.blur();

    if (btn === '0') {
        handleZero();
    }

    else if (btnName.contains('btn-num')) {
        handleNumber(btn);
    }

    else if (btn === '.') {
        handleDecimal();
    }

    else if (btnName.contains('btn-operator')) {
        handleOperator(btn);
    }

    else if (btn === "+/-") {
        handleSign();
    }

    else if (btn === '=') {
        handleEquals()
    }

    else if (btn === 'C') {
        handleClear();
    }

    else if (btn === 'Del') {
        handleDelete();
    }

    equationDisplay.textContent = operations.join(' ');

})



















function handleZero() {
    if (numDigitsInOperand > 0)
        appendToOperand('0', true);
}

function handleNumber(digit) {
    if (numDigitsInOperand < MAX_OPERAND_LENGTH)
        appendToOperand(digit, true);
    if (state.awaitingOperand) {
        operations.push(currentOperator);
        state.awaitingOperand = false;
    }
    if (state.solved) {
        operations = [];
        state.solved = false;
    }
}

function handleDecimal() {
    if (numDigitsInOperand < MAX_OPERAND_LENGTH
        && !currentInput.includes('.')) {
        if (numDigitsInOperand < 1)
            appendToOperand('0', true)
        appendToOperand('.', false)
        if (state.solved) {
            operations = [];
            state.solved = false;
        }
    }
}

function handleOperator(op) {
    if (numDigitsInOperand > 0) {
        operations.push(currentInput);
        resetOperand();
        inputDisplay.textContent = op;
        state.awaitingOperand = true;
        currentOperator = op;
    }
    else if (state.solved) {
        operations = [calculateOperations()];
        inputDisplay.textContent = op;
        state.awaitingOperand = true;
        currentOperator = op;
        state.solved = false;
    }
}

function handleSign() {
    currentInput = "-" + currentInput;
    inputDisplay.textContent = currentInput;
}

function handleEquals() {
    if (operations.length > 0 && currentInput.length > 0) {
        operations.push(currentInput)
        resetOperand();
        let result = calculateOperations();
        inputDisplay.textContent = result;
        state.solved = true;
    }
}

function handleClear() {
    resetOperand();
    operations = [];
    state.solved = false;
    state.awaitingOperand = false;
}

function handleDelete() {
    currentInput = currentInput.slice(0, -1);
    inputDisplay.textContent = currentInput;
}
















function appendToOperand(add, increaseDigits = false) {
    currentInput += add;
    inputDisplay.textContent = currentInput;
    if (increaseDigits) numDigitsInOperand++;
}

function resetOperand() {
    numDigitsInOperand = 0;
    currentInput = '';
    inputDisplay.textContent = 0;
}

function calculateOperations() {
    let arr = [...operations]


    for (let i = 1; i < arr.length; i) {
        let v = arr.at(i);
        if (v === '^') {
            let op1 = Number(arr.at(i - 1));
            let op2 = Number(arr.at(i + 1));
            let result = Math.pow(op1, op2);
            arr.splice(i - 1, i + 2, result);
        } else {
            i += 2;
        }
    }

    for (let i = 1; i < arr.length; i) {
        let v = arr.at(i);
        if (v === '*') {
            let op1 = Number(arr.at(i - 1));
            let op2 = Number(arr.at(i + 1));
            let result = op1 * op2;
            arr.splice(i - 1, i + 2, result);
        } else if (v === '/') {
            let op1 = Number(arr.at(i - 1));
            let op2 = Number(arr.at(i + 1));
            let result = op1 / op2;
            arr.splice(i - 1, i + 2, result);
        } else {
            i += 2;
        }
    }

    for (let i = 1; i < arr.length; i) {
        let v = arr.at(i);
        if (v === '+') {
            let op1 = Number(arr.at(i - 1));
            let op2 = Number(arr.at(i + 1));
            let result = op1 + op2;
            arr.splice(i - 1, i + 2, result);
        } else if (v === '-') {
            let op1 = Number(arr.at(i - 1));
            let op2 = Number(arr.at(i + 1));
            let result = op1 - op2;
            arr.splice(i - 1, i + 2, result);
        } else {
            i += 2;
        }
    }



    // operationsClone.forEach((v, i, a) => {
    //     if (v === '^') {
    //         let result = Math.pow(a.at(i - 1), a.at(i + 1))
    //         a.splice(i - 1, i + 2, result);
    //     }
    // })
    // operationsClone.forEach((v, i, a) => {
    //     console.log(v);
    //     let op1 = Number(a.at(i - 1));
    //     let op2 = Number(a.at(i + 1));
    //     if (v === '*') {
    //         let result = op1 * op2;
    //         a.splice(i - 1, i + 2, result);
    //     }
    //     if (v === '/') {
    //         let result = op1 / op2;
    //         a.splice(i - 1, i + 2, result);
    //     }
    // })
    // operationsClone.forEach((v, i, a) => {
    //     if (v === '+') {
    //         let result = a.at(i - 1) + a.at(i + 1);
    //         a.splice(i - 1, i + 2, result);
    //     }
    //     if (v === '-') {
    //         let result = a.at(i - 1) - a.at(i + 1);
    //         a.splice(i - 1, i + 2, result);
    //     }
    // })
    let result = arr[0] + "";
    // result = result.slice(0, 12);
    let maxLength = MAX_OPERAND_LENGTH;
    if (result.includes('-')) maxLength++;
    let extension = '';
    if (result.includes('e')) {
        let eI = result.indexOf('e');
        extension = result.slice(eI);
        maxLength -= 4;
    }
    let newResult = result.slice(0, maxLength);
    if (newResult.includes('.')) newResult = result.slice(0, maxLength + 1);
    newResult += extension;

    return newResult;
}