// get references to elements
const textInput = document.getElementById('text-input');
const checkButton = document.getElementById('check-btn');
const result = document.getElementById('result');

function cleanString(str) {
  const pattern = /[\W_]+/g;
  return str.toLowerCase().replace(pattern, "");
}

function isPalindrome(str) {
  for (let i = 0; i < (str.length+1)/2; i++) {
    if (str[i] !== str[str.length - i - 1]) {
      return false;
    }
  }
  return true;
}

function pressCheckButton() {
  if (textInput.value === "") {
    alert("Please input a value");
    return;
  }

  let enteredText = textInput.value;
  enteredText = cleanString(enteredText);

  if (isPalindrome(enteredText)) {
    result.innerText = `${textInput.value} is a palindrome`;
    result.className = "is-palindrome";
  }
  else {
    result.innerText = `${textInput.value} is not a palindrome`;
    result.className = "is-not-palindrome";
  }
}


// add event listeners
checkButton.addEventListener("click", pressCheckButton);
