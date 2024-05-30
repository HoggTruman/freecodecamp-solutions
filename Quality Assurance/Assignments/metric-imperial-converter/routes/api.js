'use strict';

const expect = require('chai').expect;
const ConvertHandler = require('../controllers/convertHandler.js');

module.exports = function (app) {
  
  let convertHandler = new ConvertHandler();

  app.get('/api/convert', (req, res) => {
    const input = req.query.input;

    const initNum = convertHandler.getNum(input);
    const initUnit = convertHandler.getUnit(input);
    const returnUnit = convertHandler.getReturnUnit(initUnit);
    const returnNum = convertHandler.convert(initNum, returnUnit);

    const speltInitUnit = convertHandler.spellOutUnit(initUnit)
    const speltReturnUnit = convertHandler.spellOutUnit(returnUnit);

    const returnString = convertHandler.getString(initNum, speltInitUnit, returnNum, speltReturnUnit);

    if (initNum === 'invalid number' || returnUnit === 'invalid unit') {
      res.send(returnString);
    }
    else {
      const responseObject = {
        initNum: initNum,
        initUnit: initUnit,
        returnNum: returnNum,
        returnUnit: returnUnit,
        string: returnString,
      };

      res.json(responseObject);
    }
  })

};
