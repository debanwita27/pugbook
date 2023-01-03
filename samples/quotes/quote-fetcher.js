const https = require("https");
const fs = require("fs");
const path = require("path");

/**
 * Converts a byte buffer into an object
 * @param {Buffer} data A byte buffer that encodes a string 
 * @returns An object that is the JSON representation of the string
 */
function convertToJSON(data) {
    const buf = Buffer.concat(data);
    const string = buf.toString();
    const payload = JSON.parse(string);
    return payload;
}

/**
 * Makes a GET request to [url], and calls a callback function on the JSON returned.
 * @param {string} url A URL that returns a response with JSON payload. 
 * @param {(data: object) => any} onJSONReceived A callback to handle the JSON data
 */
function fetchJSON(url, onJSONReceived) {
    https.get(url, (listener) => {
        // We initialize an empty array that will store the incoming packets as they arrive
        const data = [];

        // We tell the listener to perform an action everytime it receives a chunk of data.
        // Every time we receive a packet, we add it to the "data" list.
        listener.on("data", (chunk) => data.push(chunk));

        // Again, we tell the listener to perform yet another action, when it has received the last packet.
        // Once we're done receiving packets, we convert `data` to a JSON object,
        // and pass it to the callback as an argument.
        listener.on("end", () => {
            const jsonRet = convertToJSON(data);
            onJSONReceived(jsonRet);
        });
    });
}

const writeJSONtoFile = (json) => {
    const dataToWrite = `"${json.quote}" - ${json.author}`;
    const filePath = path.join(__dirname, "/quote.txt");
    fs.writeFileSync(filePath, dataToWrite);
};

function fetchAndWriteQuote() {
    fetchJSON("https://dummyjson.com/quotes/random", writeJSONtoFile);
}

fetchAndWriteQuote();
