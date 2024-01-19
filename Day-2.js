const { log } = require('node:console');
const fs = require('node:fs/promises');
const internal = require('node:stream');

console.log("Advent of Code!");

class Pull {
    constructor(amount, colour) {
        this.colour = colour;
        this.amount = parseInt(amount);
    }
}
class SubSet {
    constructor(pulls) { // Array of Pull objects
        this.pulls = pulls;

        this.colours = [... new Set( // Produces distinct values
            pulls.map(Pull => { return Pull.colour })
        )];

        this.totalBlocks = pulls.map(Pull => {
            return Pull.amount;
        }).reduce((total, value) => {
            return total + value;
        });
    }
}

class Game {
    constructor(subSets) { // Array of SubSet objects
        this.subSets = subSets;
    }
}

class GameLog {
    constructor(gameId, game) { // int gameId and Game object
        this.gameId = gameId,
            this.game = game
    }
}

async function getSessionLog(rawSessionLog) {
    // const parsedSessionLog = parseRawSessionLog(rawSessionLog).then(result => {return result});
    const parsedSessionLog = await parseRawSessionLog(rawSessionLog); // rawSessionLog to array of rawGameLog
    const gameLogs = await parsedSessionLog.map(rawGameLog => {
        return getGameLog(rawGameLog);
    });
    return gameLogs;
}

async function parseRawSessionLog(logPath) {
    const rawGameLogs = await parseMultilineInput(logPath);
    return rawGameLogs;
}

function getGameLog(rawGameLog) {
        const splitGameLog = parseRawGameLog(rawGameLog); // rawGameLog into splitLog object
        const gameId = getGameId(splitGameLog.rawGameId); // rawGameId to int gameId
        const game = getGame(splitGameLog.rawGame); // rawGame to Game object
        return new GameLog(gameId, game);
}

function parseRawGameLog(rawGameLog) {
        const splitLog = rawGameLog.split(':');
        const rawGameId = splitLog[0];
        const rawGame = splitLog[1];
        return {
            rawGameId: rawGameId,
            rawGame: rawGame,
        }
}

function getGame(rawGame) {
        const parsedGame = parseRawGame(rawGame); // rawGame into array of rawSubSet
        const subsSets = parsedGame.map(rawSubSet => {
            return getSubSet(rawSubSet);
        });
        return new Game(subsSets);
    }

function parseRawGame(rawGame) {
        const rawSubSets = rawGame.split(';');
        return rawSubSets;
}

function getGameId(rawGameId) {
        const noDigits = removeNonDigits(rawGameId);
        return noDigits;
}

function getSubSet(rawSubSet) {
        const parsedSubSet = parseRawSubSet(rawSubSet); // rawSubSet into array of rawPull
        const pulls = parsedSubSet.map(rawPull => {
            return getPull(rawPull);
        });
        return new SubSet(pulls);
    }

function parseRawSubSet(rawSubSet) {
        const rawPulls = rawSubSet.split(',');
        return rawPulls;
}

function getPull(rawPull) {
        const trimmedPull = rawPull.trim();
        const splitPull = parseRawPull(trimmedPull); // '1 blue' -> ['1', 'blue']
        return new Pull(...splitPull);
}

function parseRawPull(rawPull) {
        return rawPull.split(' ');
}

function removeNonDigits(inputString) {
    return inputString.replaceAll(/\D/g, '');
}

async function parseMultilineInput(filePath) { // Takes a multiline input and returns an array with a value for each line
    try {
        const asOneString = await fs.readFile(filePath, 'utf-8'); // Inital stream is one string
        const seperated = asOneString.split('\n'); // Split into an array of individual lines
        return seperated;
    } catch (err) {
        console.error(err);
    }
}

// parseMultilineInput('./Day-2 Input.txt').then(result => {console.log(result)});

getSessionLog('./Day-2 Input.txt').then(result => console.log(result));