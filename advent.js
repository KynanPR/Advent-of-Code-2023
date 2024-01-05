const { log } = require('node:console');
const fs = require('node:fs/promises');

console.log("Advent of Code!");

const digitRegex = new RegExp(/[^\d]/, 'g'); // Creates a regex object that matches on anything that isn't a digit

getCalibrationTotal('./input.txt').then(result => console.log(result));

async function getCalibrationTotal(filePath) {
    try {
        return getCalibrationArray(filePath).then( // Await the file read and splitting
            result => { // Process that array
                return result.map((element) => {
                    return getCalibrationValue(element, digitRegex); // Parse the calibration value from each array element
                })
            .reduce((accumulator, currentValue) => accumulator + currentValue, 0); // Sum together the results
        });
    } catch (err) {
        console.error(err);
    }}

async function getCalibrationArray(filePath) {
    try {
        const asOneString = await fs.readFile(filePath, 'utf-8'); // Inital stream is one string
        const calibrationArray = asOneString.split('\n'); // Split into an array of individual lines
        return calibrationArray;
    } catch (err) {
        console.error(err);
    }
}

function getCalibrationValue(inputString, regex) {
    const onlyDigits = inputString.replaceAll(regex, ''); // Remove all non-digit chars from string
    let calibrationValueAsString = onlyDigits.at(0) + onlyDigits.at(-1); // Calibration value is first and last digit
    let calibrationValue = parseInt(calibrationValueAsString);
    return calibrationValue;
}

