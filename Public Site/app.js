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

app.get('/', (req, res) => {
	const title = "Lakeside Hotel";
	const indexTitle = "Lakeside Hotel";
	res.render('index', { title: title, indexTitle:indexTitle});
});

app.get('/about-us', (req, res) => {
	const title = "Lakeside Hotel";
	const indexTitle = "Lakeside Hotel";
	res.render('about-us', { title: title, indexTitle:indexTitle});
});

app.get('/facilities', (req, res) => {
	const title = "Lakeside Hotel";
	const indexTitle = "Lakeside Hotel";
	res.render('facilities', { title: title, indexTitle:indexTitle});
});

app.get('/rooms', (req, res) => {
	const title = "Lakeside Hotel";
	const indexTitle = "Lakeside Hotel";
	res.render('rooms', { title: title, indexTitle:indexTitle});
});

app.get('/upcoming', (req, res) => {
	const title = "Lakeside Hotel";
	const indexTitle = "Lakeside Hotel";
	res.render('upcoming', { title: title, indexTitle:indexTitle});
});

app.get('/contact', (req, res) => {
	const title = "Lakeside Hotel";
	const indexTitle = "Lakeside Hotel";
	res.render('contact', { title: title, indexTitle:indexTitle});
});

app.get('/booking', (req, res) => {
	const title = "Lakeside Hotel";
	const indexTitle = "Lakeside Hotel";
	let message = "";
	res.render('booking', { title: title, indexTitle:indexTitle, message: message});
});



app.get('/customerdetails', (req, res) => {
	const title = "Lakeside Hotel";
	const indexTitle = "Lakeside Hotel";
	res.render('customerdetails', { title: title, indexTitle:indexTitle});
});

app.get('/bookingdetails', (req, res) => {
	const title = "Lakeside Hotel";
	const indexTitle = "Lakeside Hotel";
	res.render('bookingdetails', { title: title, indexTitle:indexTitle});
});


app.get('/confirmed', (req, res) => {
	const title = "Lakeside Hotel";
	const indexTitle = "Lakeside Hotel";
	res.render('confirmed', { title: title, indexTitle:indexTitle});
});
// * REQUEST HANDLERS BELOW * //


// ADD CUSTOMER AND CREATE BOOKINGS
app.post('/cust',[body('name').trim().isLength({ min: 2 }).escape(), 
	body('email').trim().isEmail().escape(),
	body('address').trim().isLength({ min: 5 }).escape(),
	body('cardNumber').trim().isInt({ min: 16 }).escape()], async (req, res) => {
    const errors = validationResult(req);
     if (!errors.isEmpty()) {
       return res.status(400).json({ errors: errors.array() });
     }
	console.log("cust form body", req.body);
	const name = req.body.name;
	const email = req.body.email;
	const address = req.body.address;
	const cardNumber = req.body.ccnum;
	const expiryDate =  req.body.expiryDate;
	const cardType = req.body.cardType; 
	const comment = req.body.comment;
	const inDate = req.body.inDate;
	const outDate = req.body.outDate;
	const roomType = req.body.roomtype;
	const numRooms = parseInt(req.body.numRooms);
	const price = req.body.total;

	// store customer details
	let results;
	const pool = new pg.Pool(config);
	const client = await pool.connect();
	const q = `SET search_path to hotelbooking; insert into customer (c_name, c_email, c_address, c_cardtype, c_cardexp, c_cardno) 
	values ('${name}', '${email}', '${address}','${cardType}', '${expiryDate}', '${cardNumber}'); 
	INSERT INTO booking (c_no, b_cost, b_outstanding, b_notes)
	values ((SELECT customer.c_no FROM customer ORDER BY c_no DESC LIMIT 1), ${price}, ${price}, '${comment}');
	INSERT INTO roombooking VALUES (
		(SELECT DISTINCT(r_no) FROM room_check 
			WHERE r_class='${roomType}' AND r_no NOT IN (
			SELECT r_no FROM room_check WHERE checkin BETWEEN '${inDate}' 
			 AND '${outDate}' OR checkout BETWEEN '${inDate}' 
			 AND '${outDate}') ORDER BY r_no asc limit 1), (select b_ref from booking ORDER BY c_no desc limit 1), 
			'${inDate}', '${outDate}');`
	const r = `INSERT INTO roombooking VALUES (
		(SELECT DISTINCT(r_no) FROM room_check 
			WHERE r_class='${roomType}' AND r_no NOT IN (
			SELECT r_no FROM room_check WHERE checkin BETWEEN '${inDate}' 
			 AND '${outDate}' OR checkout BETWEEN '${inDate}' 
			 AND '${outDate}') ORDER BY r_no asc limit 1), (select b_ref from booking ORDER BY c_no desc limit 1), 
			'${inDate}', '${outDate}');`;
	const title = "Lakeside Hotel";
	const indexTitle = "Lakeside Hotel";
// customer number and booking ref handled by generated always as identity constraint
		await client.query(q).then(results => {
			client.release();
			console.log("just q");
			res.send( "success");

		}, err => { console.log(err)});
	});


// if(numRooms <= 1) {
// 	await client.query(q).then(results => {
// 		client.release();
// 		console.log("just q");
// 		res.render('confirmed');
// 	}, err => { console.log(err);}
// )}
// else {
// 	await client.query(q, r).then(results => {
// 		client.release();
// 		console.log("q and r");
// 		res.render('confirmed');
// 	}, err => { console.log(err)}
// 	)};
// });

// **WORKING** BELOW | Check available rooms between selected checkin and checkout date
app.post('/bookingcheck', jsonParser, async (req,res) => {
	const title = "Hotel Booking";
	const indexTitle = "Room Booking Information";

	console.log('point 1');
	console.log(req.body);
	const inDate = req.body.inDate;
	const outDate = req.body.outDate;
	const roomtype = req.body.roomtype;
	const numRooms = parseInt(req.body.numRooms);
	const days = req.body.days;
	
	let results;
	console.log('point 2');
	const pool = new pg.Pool(config);
	const client = await pool.connect();
	const q = `SET search_path TO hotelbooking; SELECT rates.r_class, COUNT(room.r_no) FROM rates 
	LEFT OUTER JOIN room ON rates.r_class=room.r_class AND room.r_no NOT IN 
	(SELECT r_no FROM room_check
	WHERE room_check.checkin >= '${inDate}' AND room_check.checkout <= '${outDate}') GROUP BY rates.r_class;
	SELECT (price * ${days}) * ${numRooms} AS total FROM rates WHERE r_class = '${roomtype}';`;
	console.log('point 3');
	
	await client.query(q).then(results => {
		client.release();
		console.log('point 4');
	    console.log(results); //
	   	// get the results from the second query
		data = results[1].rows;
		price = results[2].rows
		console.log('point 5');
		console.log("app js data log", data, price)
		res.json({ data, room:roomtype, numRooms:numRooms, price });
	}, err => { console.log(err.stack, "error marker")
		errors = err.stack.split(" at ");
	    res.render('rooms', {title:"Lakeside Hotel", indexTitle:"Lakeside Hotel" });
	})	
});
// **WORKING** ABOVE | Check available rooms between selected checkin and checkout date



app.listen(3000, () => console.log('Express app listening on port 3000...'));
