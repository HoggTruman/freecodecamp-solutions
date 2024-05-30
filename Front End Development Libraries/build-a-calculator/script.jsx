import React from "https://esm.sh/react";
import ReactDOM from "https://esm.sh/react-dom";


class Calculator extends React.Component {
  constructor() {
    super();
    this.defaultState = {
      result: '',
      display: '0',
      currentNumber: '0',
      currentOperator: '',
      numbers: [],
      operators: [],
    };

    this.state = this.defaultState;

    this.setResult = this.setResult.bind(this);
    this.setDisplay = this.setDisplay.bind(this);
    this.setCurrentOperator = this.setCurrentOperator.bind(this);
    this.setCurrentNumber = this.setCurrentNumber.bind(this);
    this.setNumbers = this.setNumbers.bind(this);
    this.setOperators = this.setOperators.bind(this);

    this.appendNumber = this.appendNumber.bind(this);
    this.appendDecimal = this.appendDecimal.bind(this);
    this.appendOperator = this.appendOperator.bind(this);
    this.clear = this.clear.bind(this);
    this.equalsPressed = this.equalsPressed.bind(this);

  }

  // state update methods
  setResult(result) {
      this.setState({
        ...this.state,
        result: result,
      })
  }

  setDisplay(display) {
      this.setState({
        ...this.state,
        display: display,
      })
  }

  setCurrentNumber(number) {
    this.setState({
        ...this.state,
        currentNumber: number,
      })
  }

  setCurrentOperator(operator) {
    this.setState({
        ...this.state,
        currentOperator: operator,
      })
  }

  setNumbers(numbers) {
    this.setState({
        ...this.state,
        numbers: numbers,
      })
  }

  setOperators(operators) {
    this.setState({
        ...this.state,
        operators: operators,
      })
  }


  // class methods
  appendNumber(number) {
    if (this.state.currentNumber === '0' || this.state.currentNumber === '-0') {
      // replace 0 instead of let leading zeros accrue
      this.setDisplay(this.state.display.slice(0, this.state.display.length - 1) + number);
      this.setCurrentNumber(number);
    }
    else {
      if (this.state.currentNumber === '') {
      // starting a new number, push current operator to operators and then reset it
      this.setOperators([...this.state.operators, this.state.currentOperator]);
      this.setCurrentOperator('');
    }
      // append number
      this.setDisplay(this.state.display + number);
      this.setCurrentNumber(this.state.currentNumber + number);
    }
  }


  appendDecimal() {
    if (!this.state.currentNumber.includes('.')) {
      // ensure there isn't already a decimal point

      if (this.state.currentNumber === '') {
        // starting a new number, push current operator to operators and then reset it
        this.setOperators([...this.state.operators, this.state.currentOperator]);
        this.setCurrentOperator('');
      }
      // append decimal point
      this.setDisplay(this.state.display + '.');
      this.setCurrentNumber(this.state.currentNumber + '.');
    }
  }


  appendOperator(operator) {
    if (this.state.currentOperator !== '') {
      if (operator === '-' || operator === '+') {
        // if we already have an operator and + or - is pressed, start next number with + or - and push
        this.setOperators([...this.state.operators, this.state.currentOperator]);
        this.setCurrentOperator('');
        this.setCurrentNumber(operator);
        this.setDisplay(this.state.display + operator);
      }
      else {
        // if operator is not + or - and we have a current operator, replace current operator
        this.setCurrentOperator(operator);
        this.setDisplay(this.state.display.slice(0, this.state.display.length - 1) + operator);
      }
    }
    else if ( this.state.currentNumber !== '' &&
              this.state.currentNumber.at(-1) !== '.' &&
              this.state.currentNumber !== '-' &&
              this.state.currentNumber !== '+') {
      // if we have no current operator and a valid current number, push current number and set current op
      this.setNumbers([...this.state.numbers, this.state.currentNumber]);
      this.setCurrentNumber('');
      this.setCurrentOperator(operator);
      this.setDisplay(this.state.display + operator);
    }
  }


  clear() {
    this.setState(this.defaultState);
  }


  equalsPressed() {
    if ( this.state.currentNumber !== '' &&
         this.state.currentNumber.at(-1) !== '.' &&
         this.state.currentNumber !== '-' &&
         this.state.currentNumber !== '+'
       ) {
      // push current number if it is valid
      this.setNumbers([...this.state.numbers, this.state.currentNumber]);
      this.setCurrentNumber('');
    }
    else {
      // otherwise return
      return;
    }
    const result = this.calculateResult(this.state.numbers, this.state.operators)
    this.setNumbers([])
    this.setOperators([]);
    this.setCurrentNumber(result)
    this.setDisplay(result);
    this.setResult(result);

  }


  calculateResult(numbers, operators) {
    let remainingNumbers = [...numbers];
    let remainingOperators = [...operators];

    // change minus operators to + and change sign of corresponding number
    for (let i = 0; i < operators.length; i++) {
      if (operators[i] === '-') {
        remainingNumbers[i + 1] = `${-Number(remainingNumbers[i + 1])}`;
        remainingOperators[i] = '+';
      }
    }

    const operations = {
      '/': (a, b) => a / b,
      '*': (a, b) => a * b,
      '+': (a, b) => a + b,
    }

    for (let operator of ['/', '*', '+']){
      while (remainingOperators.includes(operator)) {
        const index = remainingOperators.indexOf(operator);
        const operandL = Number(remainingNumbers[index]);
        const operandR = Number(remainingNumbers.splice(index + 1, 1)[0]);
        remainingOperators.splice(index, 1);

        remainingNumbers[index] = `${operations[operator](operandL, operandR)}`;

      }
    }
    return remainingNumbers[0];
  }

  evaluateExpression(a, b, opp) {
    switch(opp) {
      case '/':
        return `${Number(a) / Number(b)}`;
      case '*':
        return `${Number(a) * Number(b)}`;
      case '+':
        return `${Number(a) + Number(b)}`;
      case '-':
        return `${Number(a) - Number(b)}`;
    }
  }

  render() {
    const callbacks = {
      number: (number) => this.appendNumber(number),
      operator: (operator) => this.appendOperator(operator),
    }
    const buttonData = {
      zero: {
        id: 'zero',
        symbol: '0',
        callback: callbacks.number,
      },
      one: {
        id: 'one',
        symbol: '1',
        callback: callbacks.number,
      },
      two: {
        id: 'two',
        symbol: '2',
        callback: callbacks.number,
      },
      three: {
        id: 'three',
        symbol: '3',
        callback: callbacks.number,
      },
      four: {
        id: 'four',
        symbol: '4',
        callback: callbacks.number,
      },
      five: {
        id: 'five',
        symbol: '5',
        callback: callbacks.number,
      },
      six: {
        id: 'six',
        symbol: '6',
        callback: callbacks.number,
      },
      seven: {
        id: 'seven',
        symbol: '7',
        callback: callbacks.number,
      },
      eight: {
        id: 'eight',
        symbol: '8',
        callback: callbacks.number,
      },
      nine: {
        id: 'nine',
        symbol: '9',
        callback: callbacks.number,
      },
      add: {
        id: 'add',
        symbol: '+',
        callback: callbacks.operator,
      },
      subtract: {
        id: 'subtract',
        symbol: '-',
        callback: callbacks.operator,
      },
      multiply: {
        id: 'multiply',
        symbol: '*',
        callback: callbacks.operator,
      },
      divide: {
        id: 'divide',
        symbol: '/',
        callback: callbacks.operator,
      },
      decimal: {
        id: 'decimal',
        symbol: '.',
        callback: this.appendDecimal,
      },
      equals: {
        id: 'equals',
        symbol: '=',
        callback: this.equalsPressed,
      },
      clear: {
        id: 'clear',
        symbol: 'clear',
        callback: this.clear,
      },
    };


    const buttonOrdering = [
      'clear', 'divide',
      'seven', 'eight', 'nine', 'multiply',
      'four', 'five', 'six', 'subtract',
      'one', 'two', 'three', 'add',
      'zero', 'decimal', 'equals',
    ]
    const buttons = buttonOrdering.map((id) => {
      return <CalculatorButton
               buttonData={buttonData[id]}
             />
    });

    return (
      <div id="calculator">
        <div id="display">{this.state.display}</div>
        <div id="button-container">
          {buttons}
        </div>
      </div>
    )
  }
}


class CalculatorButton extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    const { id, symbol, callback } = this.props.buttonData;
    const btnElement = document.getElementById(id);
    btnElement.addEventListener("click", (event) => {
      callback(symbol);
    });
  }

  render() {
    const { id, symbol } = this.props.buttonData;

    return (
      <button id={id}>
          {symbol}
      </button>
    );
  }
}


// render
ReactDOM.render(<Calculator />, document.getElementById('root'));
