const chai = require('chai');
let assert = chai.assert;
const ConvertHandler = require('../controllers/convertHandler.js');

let convertHandler = new ConvertHandler();

suite('Unit Tests', function() {
  suite('getNum tests', function() {
    const getNum = convertHandler.getNum;

    test('Read whole number input', function(){
      assert.equal(getNum("10"), 10);
      assert.equal(getNum("2gal"), 2);
    });

    test('Read decimal number input', function(){
      assert.equal(getNum("2.5"), 2.5);
      assert.equal(getNum("4.56gal"), 4.56);
    });

    test('Read fractional number input', function(){
      assert.equal(getNum("1/5"), 1/5);
      assert.approximately(getNum("1/3"), 1/3, 0.000001);
      assert.equal(getNum("1/5gal"), 1/5);
      assert.approximately(getNum("1/3gal"), 1/3, 0.000001);
    });

    test('Read fractional number with decimal input', function(){
      assert.equal(getNum("1.5/5"), 1.5/5);
      assert.approximately(getNum("1.5/4.5"), 1.5/4.5, 0.000001);
      assert.equal(getNum("1.5/5gal"), 1.5/5);
      assert.approximately(getNum("1.5/4.5gal"), 1.5/4.5, 0.000001);
    });

    test('Error on double fraction input', function(){
      assert.equal(getNum("1/2/3"), 'invalid number');
      assert.equal(getNum("1/2/3gal"), 'invalid number');
    });

    test('Default to 1 when non-numerical input', function(){
      assert.equal(getNum("gal"), 1);
    });
  });

  suite('getUnit tests', function() {
    const getUnit = convertHandler.getUnit;

    test('extract unit (whether valid or invalid)', function() {
      assert.equal(getUnit('123cheese'), 'cheese');
      assert.equal(getUnit('cheese'), 'cheese');
      assert.equal(getUnit('//..11gal'), 'gal');
      assert.equal(getUnit('123gal212441gal'), 'gal212441gal');
      assert.equal(getUnit('123'), 'invalid unit');
    });
  });

  suite('getReturnUnit tests', function() {
    const getReturnUnit = convertHandler.getReturnUnit;

    test("return 'invalid unit' for invalid unit", function() {
      assert.equal(getReturnUnit('cheese'), 'invalid unit');
      assert.equal(getReturnUnit('kg mi'), 'invalid unit');
    });

    test("return correct unit for valid unit", function() {
      assert.equal(getReturnUnit('L'), 'gal');
      assert.equal(getReturnUnit('gal'), 'L');
      assert.equal(getReturnUnit('kg'), 'lbs');
      assert.equal(getReturnUnit('lbs'), 'kg');
      assert.equal(getReturnUnit('km'), 'mi');
      assert.equal(getReturnUnit('mi'), 'km');
      assert.equal(getReturnUnit('gAL'), 'L')
    });
  });

  suite('spellOutUnit tests', function() {
    const spellOutUnit = convertHandler.spellOutUnit;

    test('correct spelled out unit for each unit', function() {
      assert.equal(spellOutUnit('L'), 'litres');
      assert.equal(spellOutUnit('gal'), 'gallons');
      assert.equal(spellOutUnit('kg'), 'kilograms');
      assert.equal(spellOutUnit('lbs'), 'pounds');
      assert.equal(spellOutUnit('km'), 'kilometers');
      assert.equal(spellOutUnit('mi'), 'miles');
    });
  });

  suite('convert tests', function() {
    const convert = convertHandler.convert;

    test('gal to L conversions', function() {
      assert.equal(convert(1, 'L'), 3.78541);
    });

    test('L to gal conversions', function() {
      assert.equal(convert(3.78541, 'gal'), 1);
    });

    test('lbs to kg conversions', function() {
      assert.equal(convert(1, 'kg'), 0.45359);
    });

    test('kg to lbs conversions', function() {
      assert.equal(convert(0.453592, 'lbs'), 1);
    });

    test('mi to km conversions', function() {
      assert.equal(convert(1, 'km'), 1.60934);
    });

    test('km to m conversions', function() {
      assert.equal(convert(1.60934, 'mi'), 1);
    });
  });

  suite('getString tests', function() {
    const getString = convertHandler.getString;

    test('general', function() {
      assert.equal(getString(1, 'gallons', 3.78541, 'litres'), '1 gallons converts to 3.78541 litres');
    });
  });

});