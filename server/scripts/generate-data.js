const https = require("https");
const DataStore = require("nedb");
const path = require("path");

const pugDb = new DataStore({ filename: path.join(__dirname, "..", "db", "mahatos") });

pugDb.loadDatabase(() => {
	setInterval(
		() =>
			fetchPug(record => {
				pugDb.insert(record, () => console.log("inserted", record));
			}),
		500
	);
});

function getJSONfromURL(url, onJSONReceived) {
	https.get(url, res => {
		const chunks = [];
		res.on("data", chunk => {
			chunks.push(chunk);
		});
		res.on("end", () => {
			const data = Buffer.concat(chunks).toString();
			const json = JSON.parse(data);
			onJSONReceived(json);
		});
	});
}

function fetchPug(callbackFunc) {
	const record = { name: null, image: null, quote: null };

	/**
	 * @returns `true` if the all fields of the record are non-null. Else returns `false`.
	 */
	function isRecordInitialized() {
		return record.name !== null && record.image !== null && record.quote !== null;
	}

	// If we're done initializing the record, then pass it to the callback.
	// Else do nothing and wait for the record to be initialized.
	function callCbIfInitialzed() {
		if (isRecordInitialized()) {
			callbackFunc(record);
		}
	}

	getJSONfromURL("https://dog.ceo/api/breed/pug/images/random", json => {
		record.image = json.message;
		callCbIfInitialzed();
	});

	getJSONfromURL("https://randomuser.me/api/", json => {
		record.name = json.results[0].name.first + " Mahato";
		callCbIfInitialzed();
	});

	getJSONfromURL("https://dummyjson.com/quotes/random", json => {
		record.quote = json.quote;
		callCbIfInitialzed();
	});
}
