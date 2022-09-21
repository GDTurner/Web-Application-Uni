// * APP.JS SETUP BELOW * //

const env = process.env.NODE_ENV || 'development';
// for app.js to connect to postgresQL
const config = require('./config.js')[env];

const express = require('express');
const app = express();

//// load ejs library
const ejs = require('ejs');

//load NODE postgres library
const pg = require('pg');

// handling form data
//npm install express-validator
const { body,validationResult } = require('express-validator');

const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

//static file directory
app.use(express.static('public'));

//set our view engine to use ejs templates
app.set('view engine', 'ejs');

// parse application/json
app.use(bodyParser.json())


// * EJS HANDLERS BELOW * //

// THIS JUST RENDERS THE ROOM STATUS PAGE WITHOUT THE TABLE OF DATA
// app.get('/', (req, res) => {
// 	const title = "Lakeside Hotel";
// 	const indexTitle = "Lakeside Hotel";
// 	let message;
// 	res.render('index', { title: title, indexTitle:indexTitle, message:message});
// });

// RENDERS HOUSEKEEPING FROM NAV BAR
app.get('/housekeeping', (req, res) => {
	const title = "Lakeside Hotel";
	const indexTitle = "Lakeside Hotel";
	res.render('housekeeping', { title: title, indexTitle:indexTitle});
});

// RENDERS PAYMENT FROM NAVBAR
app.get('/payment', (req, res) => {
	const title = "Lakeside Hotel";
	const indexTitle = "Lakeside Hotel";
	res.render('payment', { title: title, indexTitle:indexTitle});
});

// * REQUEST HANDLERS BELOW * //


// THIS RENDERS THE ROOM STATUS PAGE WITH THE TABLE OF ROOMS AND THEIR STATUS
app.get('/', async (req,res) => {
	const title = "Lakeside Hotel";
	const indexTitle = "Room Status";
	console.log(req.body);
	let results;
	const pool = new pg.Pool(config);
	const client = await pool.connect();
	const q = 'SET SEARCH_PATH TO hotelbooking; select r_no, r_status, r_notes from room ORDER BY r_no;'
	
	await client.query(q).then(results => {
		client.release();
		console.log(results); 
		// get the results from the second query
   		data = results[1].rows;
		// get the number of rows returned
   		count = results[1].rowCount;
		   res.render('index', { data:data, count:count, title: title, indexTitle:indexTitle });
	}, err => { console.log(err.stack)
		errors = err.stack.split(" at ");
		// we could create an error ejs template here to render the error messages
	    res.json({ message:'Sorry something went wrong! The data has not been processed ' + errors[0]});
	});
		
});

// THIS UPDATES THE ROOM STATUS IN THE DATABASE
app.post('/roomcheck', jsonParser, async (req, res) => {
    const errors = validationResult(req);
     if (!errors.isEmpty()) {
       return res.status(400).json({ errors: errors.array() });
     }

	const title = "Lakeside Hotel";
	const indexTitle = "Success" 
	console.log(req.body);
	const roomNo = req.body.roomNo;
	const roomStatus = req.body.roomStatus;
	const comment = req.body.comment;
	
	let results;
	const pool = new pg.Pool(config);
	const client = await pool.connect();
	const q = `SET search_path to hotelbooking; UPDATE room SET r_status = '${roomStatus}', r_notes = '${comment}' WHERE r_no=${roomNo};`
	
	await client.query(q).then(results => {
		client.release();
	   console.log(results);
	   console.log(q);
		   res.render('statusSucc', {title: title, indexTitle:indexTitle, message:"Room Status Updated!" });
	}, err => console.log(err),
	)});


// GET CUSTOMER DETAILS BY NAME
app.get('/retrieve:fname', async (req,res) => {
	const title = "Payment";
	const indexTitle = "Payment";
	const name = req.query.firstname;
	console.log("name", name)

	let results;
	const pool = new pg.Pool(config);
	const client = await pool.connect();
	const q = `SET SEARCH_PATH TO hotelbooking; 
	SELECT c.c_name, c.c_email, c.c_address, c.c_cardtype, c.c_cardexp, c.c_cardno,
	b.b_ref, b.b_cost, b.b_outstanding, b.b_notes FROM customer c LEFT JOIN booking b 
	ON c.c_no=b.c_no WHERE c.c_name LIKE '%${name}%' ORDER BY b.b_ref;`
	
	await client.query(q).then(results => {
		client.release();
		console.log(results); 
		// get the results from the second query
   		data = results[1].rows;
		// get the number of rows returned
   		count = results[1].rowCount;
		// last week we sent data back in JSON //
		// res.json({ data, rows:count });
		console.log("data", data)
		res.render('payment', { data, title: title, indexTitle:indexTitle });
	}, err => { console.log(err.stack)
		errors = err.stack.split(" at ");
		// we could create an error ejs template here to render the error messages
	    res.json({ message:'Sorry something went wrong! The data has not been processed ' + errors[0]});
	});
		
});

// ADD SURCHARGE TO TOTAL AND OUTSTANDING BALANCE BY BOOKING REF
app.post('/surcharge', async (req,res) => {
	const refSur = req.body.refSur;
	const amountAdd = req.body.amountAdd;

	let results;
	const pool = new pg.Pool(config);
	const client = await pool.connect();
	const q = `SET SEARCH_PATH TO hotelbooking; UPDATE booking
	SET b_outstanding = b_outstanding + ${amountAdd},
	b_cost = b_cost + ${amountAdd} WHERE b_ref = ${refSur};`;
	
	await client.query(q).then(results => {
		client.release();
		console.log("results", results); 
		// get the results from the second query
   		data = results[1].rows;
		// get the number of rows returned
   		count = results[1].rowCount;
	   res.send("Updated");
	}, err => { console.log(err.stack)
		errors = err.stack.split(" at ");
	    res.json({ message:'Sorry something went wrong! The data has not been processed ' + errors[0]});
	});
		
});


// TAKE PAYMENT BY BOOKING REF
app.post('/payment', async (req,res) => {
	const refPay = req.body.refPay;
	const amountPay = req.body.amountPay;
	console.log(req.body);

	let results;
	const pool = new pg.Pool(config);
	const client = await pool.connect();
	const q = `SET SEARCH_PATH TO hotelbooking; UPDATE booking
	SET b_outstanding = b_outstanding - ${amountPay}  WHERE b_ref = ${refPay};`
	
	await client.query(q).then(results => {
		client.release();
		console.log(results); 
   		// data = results[1].rows;
   		// count = results[1].rowCount;
	   res.send("Updated");
	}, err => { console.log(err.stack)
		errors = err.stack.split(" at ");
	    res.json({ message:'Sorry something went wrong! The data has not been processed ' + errors[0]});
	});
		
});



app.listen(3000, () => console.log('Express app listening on port 3000...'));

