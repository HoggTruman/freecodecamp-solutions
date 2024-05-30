// get references to page elements
const numberInput = document.getElementById("number");
const convertButton = document.getElementById("convert-btn");
const output = document.getElementById("output");

// store roman numerals and their values (have to use array to keep them ordered)
const romanNumerals = ['M', 'CM', 'D', 'CD', 'C', 'XC', 'L', 'XL', 'X', 'XL', 'X', 'IX', 'V', 'IV', 'I'];

const romanNumeralValue = {
  'M': 1000,
  'CM': 900,
  'D': 500,
  'CD': 400,
  'C': 100,
  'XC': 90,
  'L': 50,
  'XL': 40,
  'X': 10,
  'IX': 9,
  'V': 5,
  'IV': 4,
  'I': 1
  };



function checkInput() {
  const convertedInput = Number(numberInput.value);

  if (!convertedInput) {
    output.innerText = "Please enter a valid number";
    return false;
  }

  if (convertedInput < 1) {
    output.innerText = "Please enter a number greater than or equal to 1";
    return false;
  }

  if (convertedInput >= 4000) {
    output.innerText = "Please enter a number less than or equal to 3999";
    return false;
  }

  if (convertedInput % 1 !== 0) {
    output.innerText = "Please enter an integer"
    return false;
  }

  return true;
}

function toRomanNumeral(number) {
  if (number === 0) {
    return "";
  }

  for (const romanNumeral of romanNumerals) {
    if (number - romanNumeralValue[romanNumeral] >= 0) {
      return romanNumeral + toRomanNumeral(number - romanNumeralValue[romanNumeral]);
    }
  }
}

function convertButtonPressed() {
  if (checkInput()) {
    output.innerText = toRomanNumeral(Number(numberInput.value))
  }

  // stop output being hidden
  output.style.display = "flex";
}


// add event listeners
convertButton.addEventListener("click", convertButtonPressed);
