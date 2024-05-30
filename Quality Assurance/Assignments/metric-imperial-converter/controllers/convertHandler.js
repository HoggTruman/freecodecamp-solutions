function ConvertHandler() {
  this.getNum = function(input) {
    const splitIndex = input.search(/[^\d/.]/g);

    // default to 1 when no number provided
    if (splitIndex === 0) {
      return 1;
    }

    const numStr = splitIndex !== -1? input.slice(0, splitIndex): input;
    const operands = numStr.split('/');
    let num;

    // try to evaluate num if there are 0 or 1 divisions, else leave as undefined
    if (operands.length == 1) {
      num = Number(operands[0]);
    }
    else if (operands.length == 2) {
      num = Number(operands[0]) / Number(operands[1]);
    }

    return !isNaN(num)? num: 'invalid number';
  };




  this.getUnit = function(input) {
    const splitIndex = input.search(/[^\d/.]/g);
    if (splitIndex === -1) {
      return 'invalid unit';
    }
    const unit = input.slice(splitIndex);

    if (unit == 'l' || unit =='L') {
      return 'L';
    }
    return unit.toLowerCase()
  };




  this.getReturnUnit = function(initUnit) {
    const lowerInitUnit = initUnit.toLowerCase();
    const returnUnit = {
      'l': 'gal',
      'gal': 'L',
      'kg': 'lbs',
      'lbs': 'kg',
      'km': 'mi',
      'mi': 'km'
    }

    return returnUnit[lowerInitUnit]? returnUnit[lowerInitUnit]: 'invalid unit';
  };




  this.spellOutUnit = function(unit) {
    const speltUnit = {
      'L': 'litres',
      'gal': 'gallons',
      'kg': 'kilograms',
      'lbs': 'pounds',
      'km': 'kilometers',
      'mi': 'miles'
    }

    return speltUnit[unit]? speltUnit[unit]: 'invalid unit';
  };




  this.convert = function(initNum, returnUnit) {
    if (initNum == 'invalid number' || returnUnit == 'invalid unit') {
      return 'invalid number';
    }

    const galToL = 3.78541;
    const lbsToKg = 0.453592;
    const miToKm = 1.60934;
    let result;

    switch (returnUnit) {
      case 'L':
        result = initNum * galToL;
        break;
      case 'gal':
        result = initNum / galToL;
        break;
      case 'kg':
        result = initNum * lbsToKg;
        break;
      case 'lbs':
        result = initNum / lbsToKg;
        break;
      case 'km':
        result = initNum * miToKm;
        break;
      case 'mi':
        result = initNum / miToKm;
        break;
      default:
        return 'invalid number';
    }

    return Number(result.toFixed(5));
  };



  
  this.getString = function(initNum, speltInitUnit, returnNum, speltReturnUnit) {
    if (initNum === 'invalid number' && speltReturnUnit === 'invalid unit') {
      return 'invalid number and unit';
    }
    if (initNum === 'invalid number') {
      return 'invalid number';
    }
    if (speltReturnUnit === 'invalid unit') {
      return 'invalid unit'
    }

    return `${initNum} ${speltInitUnit} converts to ${returnNum} ${speltReturnUnit}`;
  };

}

module.exports = ConvertHandler;
