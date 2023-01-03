const express = require("express");
const app = express();
const DataStore = require("nedb");
const path = require("path");

const db = new DataStore({ filename: path.join(__dirname, "db", "mahatos") });

// 1. generate a random number N between 0 and size of the database - 1.
// 2. findOne({}).skip(N).limit(1).exec( <logic> )
// 3. res.json( <record> )

app.get("/random/:count", (req, res) => {
	const { count } = req.params;

	db.count({}).exec((err, numPugs) => {
		if (err) return res.status(500).end();

		if (Number.isInteger(count) || count > numPugs || count <= 0) {
			return res.status(400).end();
		}

		const skipCount = Math.floor(Math.random() * (numPugs - count));
		db.find({})
			.skip(skipCount)
			.limit(count)
			.exec((err, pugs) => {
				if (err) return res.status(500).end();
				res.set("Access-Control-Allow-Origin", "*");
				res.status(200);
				res.json(pugs);
			});
	});
});

db.loadDatabase(err => {
	if (err) throw err;
	app.listen(3001, () => console.log("Server started at port 3001."));
});
