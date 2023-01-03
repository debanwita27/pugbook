const DataStore = require("nedb");
const path = require("path");
const prompt = require("prompt-sync")();

// Mahato Lineage DB

const db = new DataStore({ filename: path.join(__dirname, "data-store"), autoload: true });

// 1. prompt user for input
// - Name
// - Sex
// - Pug?

function readRecord() {
	const name = prompt("Name: ");
	const sex = prompt("Sex: ");
	const isPugStr = prompt(`is ${name} a pug?[Y/N]: `).toLowerCase();
	const isPug = isPugStr === "y";

	return { name, sex, isPug };
}

function promptForRecords() {
	const record = readRecord();
	db.insert(record, err => {
		if (err) console.log("failed to insert record");
		else console.log("successfully added record");
		const addAnother = prompt("add another? [Y/N]").toLowerCase() === "y";
		if (addAnother) promptForRecords();
	});
}

function runApp() {
	const arg = process.argv[2].toLowerCase();

	switch (arg) {
		case "add": {
			promptForRecords();
			break;
		}
		case "list": {
			const allEntries = db.getAllData();
			const entriesStr = allEntries.map(
				({ name, sex, isPug, _id }) =>
					`[ name: ${name}, sex: ${sex}, is pug?: ${isPug ? "yes" : "no"}, id: ${_id} ]`
			);
			const output = entriesStr.join(",\n");

			console.log(output);
			break;
		}
		case "del": {
			const id = process.argv[3];
			if (!id) {
				throw new Error("syntax: node database del <id>");
			}

			db.remove({ _id: id }, {}, err => {
				if (err) throw err;
				console.log("Successfully removed item");
			});
			break;
		}
		default:
			break;
	}
}

db.loadDatabase(err => {
	if (err) throw new Error("Opps");
	runApp();
});
