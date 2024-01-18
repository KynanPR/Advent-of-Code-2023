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
    try {
        const parsedSessionLog = parseRawSessionLog(rawSessionLog); // rawSessionLog to array of rawGameLog
        const gameLogs = parsedSessionLog.map(rawGameLog => {
            return getGameLog(rawGameLog);
        });
        return gameLogs;
    } catch (error) {
        return error;
    }
}

async function parseRawSessionLog(logPath) {
    try {
        const rawGameLogs = await parseMultilineInput(logPath);
        return rawGameLogs;
    } catch (error) {
        console.error(error);
    }
}

async function getGameLog(rawGameLog) {
    try {
        const splitGameLog = parseRawGameLog(rawGameLog); // rawGameLog into splitLog object
        const gameId = getGameId(splitGameLog.rawGameId); // rawGameId to int gameId
        const game = getGame(splitGameLog.rawGame); // rawGame to Game object
        return new GameLog(gameId, game);
    } catch (error) {
        return error;
    }
}

async function parseRawGameLog(rawGameLog) {
    try {
        const splitLog = rawGameLog.split(':');
        const rawGameId = splitlog[0];
        const rawGame = splitLog[1];
        return {
            rawGameId: rawGameId,
            rawGame: rawGame,
        }
    } catch (error) {
        return error;
    }
}

async function getGame(rawGame) {
    try {
        const parsedGame = parseRawGame(rawGame); // rawGame into array of rawSubSet
        const subsSets = parsedGame.map(rawSubSet => {
            return getSubSet(rawSubSet);
        });
        return new Game(subsSets);
    } catch (error) {
        return error;
    }
}

async function parseRawGame(rawGame) {
    try {
        const rawSubSets = rawGame.split(';');
        return rawSubSets;
    } catch (error) {
        return error;
    }
}

async function getGameId(rawGameId) {
    try {
        const noDigits = removeNonDigits(rawGameId);
        return noDigits;
    } catch (error) {
        return error;
    }
}

async function getSubSet(rawSubSet) {
    try {
        const parsedSubSet = parseRawSubSet(rawSubSet); // rawSubSet into array of rawPull
        const pulls = parsedSubSet.map(rawPull => {
            return getPull(rawPull);
        });
        return new SubSet(pulls);
    } catch (error) {
        return error;
    }
}

async function parseRawSubSet(rawSubSet) {
    try {
        const rawPulls = rawSubSets.split(',');
        return rawPulls;
    } catch (error) {
        return error;
    }
}

async function getPull(rawPull) {
    try {
        const splitPull = parseRawPull(rawPull); // '1 blue' -> ['1', 'blue']
        return new Pull(...splitPull);
    } catch (error) {
        return error;
    }
}

async function parseRawPull(rawPull) {
    try {
        return rawPull.split(' ');
    } catch (error) {
        return error;
    }
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

console.log(getSessionLog('./Day-2 Input.txt'));