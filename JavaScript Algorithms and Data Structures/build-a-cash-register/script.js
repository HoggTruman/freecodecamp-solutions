// get references to elements
const cashProvidedInput = document.getElementById("cash");
const changeText = document.getElementById("change-due");
const purchaseButton = document.getElementById("purchase-btn");
const priceText = document.getElementById("price");

// price of item (OVERRIDDEN BY TEST DATA)
let price = 19.5;

// available cash in draw (OVERRIDDEN BY TEST DATA)
let cid = [["PENNY", 0.5], ["NICKEL", 0], ["DIME", 0], ["QUARTER", 0], ["ONE", 0], ["FIVE", 0], ["TEN", 0], ["TWENTY", 0], ["ONE HUNDRED", 0]];


const unitValue = {
  "PENNY": 0.01,
  "NICKEL": 0.05,
  "DIME": 0.1,
  "QUARTER": 0.25,
  "ONE": 1,
  "FIVE": 5,
  "TEN": 10,
  "TWENTY": 20,
  "ONE HUNDRED": 100
}

// display price
priceText.innerText = `$${price}`;


// using a greedy algorithm can lead to cases where change can be provided but is not...
// This is only a problem with quarters and dimes e.g. we have 0.3 change needed but only 1 quarter and 3 dimes in drawer
function calculateChange(changeDue) {

  // handle case of having the exact amount of change needed
  const totalCID = cid.reduce((a,b) => a + b[1], 0).toFixed(2);

  if (totalCID == changeDue) {
    return cid;
  }

  // handle hundreds down to but not including quarters
  let changeNeeded = changeDue;
  let changeProvided = [];

  for (let [unit, unitInDrawer] of cid.slice(0, 5)) {
    const changeOfUnit = maxChangeOfUnit(changeNeeded, unitInDrawer, unitValue[unit] )

    changeNeeded = (changeNeeded - changeOfUnit).toFixed(2);
    changeProvided.push([unit, changeOfUnit]);

    if (changeNeeded == 0) {
      return changeProvided;
    }
  }

  // handle from quarters down
  // temporary variables used in case of rollback if change cant be given with # of quarters
  const maxQuarters = Math.min(
    Math.floor(changeNeeded/unitValue["QUARTER"]),
    cid[5][1] / unitValue["QUARTER"]
  );

  for (let quarters = maxQuarters; quarters > -1; quarters--) {
    let tempChangeNeeded = changeNeeded - quarters*unitValue["QUARTER"];
    let tempChangeProvided = [...changeProvided, ["QUARTER", quarters*unitValue["QUARTER"]]];

    for (let [unit, unitInDrawer] of cid.slice(6)) {
      const changeOfUnit = maxChangeOfUnit(tempChangeNeeded, unitInDrawer, unitValue[unit]);

      tempChangeNeeded = (tempChangeNeeded - changeOfUnit).toFixed(2);
      tempChangeProvided.push([unit, changeOfUnit]);

      if (tempChangeNeeded == 0) {
        return tempChangeProvided;
      }
    }
  }
  // change can not be given
  return [];
}


function maxChangeOfUnit(changeNeeded, unitInDrawer, unitValue) {
  let maxChange;
  if (unitInDrawer > changeNeeded) {
      maxChange =  Math.floor(changeNeeded/unitValue) * unitValue;
  }
  else {
    maxChange = unitInDrawer;
  }
  return maxChange.toFixed(2);
}


function attemptPurchase() {
  // cid reversed inside so tests dont break
  cid.reverse()
  const cash = Number.parseFloat(cashProvidedInput.value).toFixed(2);

  if (cash < price || isNaN(cash)) {
    alert("Customer does not have enough money to purchase the item");
  }
  else if (cash == price) {
    changeText.innerText = "No change due - customer paid with exact cash";
  }
  else {
    const changeDue = cash - price;
    const change = calculateChange(changeDue);

    if (change.length === 0) {
      changeText.textContent = "Status: INSUFFICIENT_FUNDS";
      return;
    }
    else if (change.toString() == cid.toString()) {
      changeText.textContent = "Status: CLOSED";
    }
    else {
      changeText.textContent = "Status: OPEN";
    }

    for (let [unit, changeInUnit] of change) {
      if (changeInUnit > 0) {
        changeText.textContent += ` ${unit}: $${changeInUnit}`;
      }
    }
  }
}

// add event listeners
purchaseButton.addEventListener("click", attemptPurchase);
