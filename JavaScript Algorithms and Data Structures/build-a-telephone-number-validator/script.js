// get references to elements
const numberInput = document.getElementById("user-input");
const checkButton = document.getElementById("check-btn");
const clearButton = document.getElementById("clear-btn");
const result = document.getElementById("results-div");


const phoneRegex = /^(1 |1)?(\(\d{3}\)|\d{3})[- ]?\d{3}[- ]?\d{4}$/;

function checkButtonPressed() {
  if (numberInput.value === "") {
    alert("Please provide a phone number");
    return false;
  }

  if (phoneRegex.test(numberInput.value)) {
    result.innerText = `Valid US number: ${numberInput.value}`;
    result.classList.add("valid");
  }
  else {
    result.innerText = `Invalid US Number: ${numberInput.value}`;
    result.classList.remove("valid");
  }

  // make result visible
  result.classList.remove("hidden");
}


function clearButtonPressed() {
  numberInput.value = "";
  result.innerText = "";
  result.classList.add("hidden");
}

// add event listeners
checkButton.addEventListener("click", checkButtonPressed);
clearButton.addEventListener("click", clearButtonPressed);
