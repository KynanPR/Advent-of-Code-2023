const { log } = require('node:console');
const fs = require('node:fs/promises');

console.log("Advent of Code!");

const replacementLookup = {
    zero: '0',
    one: '1',
    two: '2',
    three: '3',
    four: '4',
    five: '5',
    six: '6',
    seven: '7',
    eight: '8',
    nine: '9',
} // Dictionary that gives the real digit form of written out digits 
const calibrationRegex = new RegExp(
    /(?<Digit>\d)|(?<PsudeoDigit>one|two|three|four|five|six|seven|eight|nine)/,
    'ig'
); // Creates a regex object that matches digits into one group and their written out forms into another

function sum(array) {
    let total = 0;
    array.forEach(element => {
        total += element;
    });
    return total
}
getCalibrationTotal('./input.txt').then(result => console.log(result));
// getCalibrationTotal('./input.txt').then(result => console.log(sum(result[1])));

async function getCalibrationTotal(filePath) {
    try {
        return getCalibrationArray(filePath).then( // Await the file read and splitting
            result => { // Process that array
                // const allValues = result.map((element) => {
                //     return getCalibrationValue(element, calibrationRegex);
                // });
                // const finalValue = allValues.reduce((accumulator, currentValue) => accumulator + currentValue, 0);
                // const output = [result, allValues, finalValue];
                // return output;

                return result.map((element) => {
                    return getCalibrationValue(element, calibrationRegex); // Parse the calibration value from each array element
                })
                    .reduce((accumulator, currentValue) => accumulator + currentValue, 0); // Sum together the results
            });
    } catch (err) {
        console.error(err);
    }
}

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
    let matches = [];
    while (firstMatch = regex.exec(inputString)) {
        matches.push(firstMatch[0]);
        regex.lastIndex = firstMatch.index + 1;
    }
    const firstDigit = parseDigit(matches.at(0));
    const lastDigit = parseDigit(matches.at(-1));
    const calibrationValue = parseInt(firstDigit + lastDigit);
    return calibrationValue;
}

function parseDigit(maybeDigit) {
    if (maybeDigit.match(/\d/)) { // Check if the match group is Digit
        return maybeDigit; // It's a real digit so can just return the matched digit
    } else { // It was a psuedoDigit
        const realDigit = replacePsudeoDigit(maybeDigit); // Return the real digit form of the psuedoDigit
        return realDigit;
    }
}

function replacePsudeoDigit(writtenDigit) {
    return replacementLookup[writtenDigit.toLowerCase()];
}