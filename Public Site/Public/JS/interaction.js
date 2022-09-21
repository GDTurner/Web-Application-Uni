

// check booking
// process JSON messages | For the selected room, if the count returned is equal 
// or greater than the number of rooms selected, reveal the payment details form
// else show alternatives 
function processJSON(json){
	console.log("json display", json);
	console.log("json.data display", json.data);
	for(let i=0; i < json.data.length; i++){
		if(json.data[i].r_class == json.room) {
			let count = json.data[i].count;
			console.log("data[i] count", count);
			if(count >= json.numRooms){
				console.log("success");
				storePrice(json.price[0].total);
				showPay() ;
				}
			else {
				rooms = json;
				console.log("fail inner");
				showAlts(rooms);	
		};
	};
};
};

function storePrice(price){
	total = price;
	return total;
};


function showPay() {
	const priceDisplay = document.getElementById('price');
	priceDisplay.innerHTML = `Total Price: £${total}`;
	const altWrap = document.getElementById('altwrap');
	altWrap.style.display = 'none';
	const pform = document.getElementById('payment');
	pform.style.display = 'none';
	if (pform.style.display === 'none') {
		pform.style.display = 'block';
	} else {
		pform.style.display = 'none';
	}
}

function showAlts(roomtype) {
	const sup_t = document.getElementById('sup_t');
	const sup_d = document.getElementById('sup_d');
	const std_t = document.getElementById('std_t');
	const std_d = document.getElementById('std_d');
	const altWrap = document.getElementById('altwrap');
	console.log("showAlt block", roomtype);
	altWrap.style.display = 'block';
	sup_t.style.display ='none';
	sup_d.style.display ='none';
	std_t.style.display ='none';
	std_d.style.display ='none';

	const pform = document.getElementById('payment');
	pform.style.display = 'none';
	for( i in roomtype.data){
		if(roomtype.data[i].count >= roomtype.numRooms) {
			let room = roomtype.data[i].r_class;
			console.log("room display", room);
			let block = document.getElementById(room);
			console.log(block)
			if (block.style.display === 'none'){
				block.style.display = 'block';
			}
			 }
		else {};

		}

};


function onError(error){
	console.log(error);
};

function onResponse(response){
	console.log(response);
	console.log(response.status);
	response.json().then(processJSON);
};


function formatMessageCheck(roomtype, inDate, outDate, numRooms, days){
	const message ={
		roomtype: roomtype,
		inDate: inDate,
        outDate: outDate,
		numRooms: numRooms,
		days: days
	};
	return JSON.stringify(message);
};

function storeSerialized(serialized){
	bookVals = serialized;
	console.log("bookvals", bookVals);
	return bookVals;
};

// https://stackabuse.com/javascript-get-number-of-days-between-dates/ (this was more complicated than I expected)
function getNumberOfDays(start, end) {
    const date1 = new Date(start);
    const date2 = new Date(end);

    // One day in milliseconds
    const oneDay = 1000 * 60 * 60 * 24;

    // Calculating the time difference between two dates
    const diffInTime = date2.getTime() - date1.getTime();

    // Calculating the no. of days between two dates
    const diffInDays = Math.round(diffInTime / oneDay);

    return diffInDays;
};

//// form handler 
function onCheck(e){
	//// stop the form being submitted by default
	e.preventDefault();
    const roomtype = document.querySelector('#roomtype').value;
	const checkin = document.querySelector('#checkin').value;
	const checkout = document.querySelector('#checkout').value;
	const numRooms = document.querySelector('#numrooms').value;
	const inFormat = new Date(checkin);
	const outFormat = new Date(checkout);
	const inDate = inFormat.toISOString().slice(0,10);
	const outDate = outFormat.toISOString().slice(0,10);
	const days = getNumberOfDays(inDate, outDate);
	const serializedMessage = formatMessageCheck( roomtype, inDate, outDate, numRooms, days);
	storeSerialized(serializedMessage);
	console.log(serializedMessage);
	fetch('bookingcheck', {method: 'POST',
						headers: {
							'Content-Type': 'application/json'
						},
						body:serializedMessage
						}
			)
			.then(onResponse);
	e.stopPropagation();
};

const check = document.querySelector('#book'); 
check.addEventListener('click', onCheck);

// ABOVE : CHECK IF ROOMS ARE AVAILABLE


// BELOW : SET MIN SELECTABLE DATE TO TODAY. 'toISOString' solution to set 'yyyy-mm-dd' format found at https://tinyurl.com/47mxa767 (stack overflow)
function todayDate(){
	let today = new Date();
	let res = today.toISOString().slice(0,10);
	document.getElementById('checkin').setAttribute('min', res);
	
};

function todayDateOut(){
	checkmin = document.getElementById('checkin').value;
	document.getElementById('checkout').setAttribute('min', checkmin);
};

const mindateout = document.querySelector('#checkout'); 
mindateout.addEventListener('click', todayDateOut);

const mindatein = document.querySelector('#checkin'); 
mindatein.addEventListener('click', todayDate);


// // ABOVE : SET MIN SELECTABLE DATE TO TODAY. 'toISOString' solution to set 'yyyy-mm-dd' format found at https://tinyurl.com/47mxa767 (stack overflow)


// // BELOW : SUBMIT CUSTOMER INFO/BOOKING TO DB, LINK TO BOOKING CONFIRM PAGE 


function onResponse1(response){
	console.log(response.status);
	console.log(response);	
	const booking = document.getElementById("bookingpage");
	const confirmed = document.getElementById("confirm");
	booking.style.display = 'none';
	confirmed.style.display = 'block';
};


function formatMessageA(name, email, address, ccnum, expdate, cardType, comment, total, roomtype, inDate, outDate, numRooms, days){
	const message ={
		name: name,
		email: email,
        address: address,
        cardNumber: ccnum,
        expiryDate: expdate,
		cardType: cardType,
		comment: comment,
		total: total,
		roomtype: roomtype,
		inDate: inDate,
        outDate: outDate,
		numRooms: numRooms,
		days: days

	};
	return JSON.stringify(message);
};

// form handler 
function onSubmit1(e){
	//// stop the form being submitted by default
	e.preventDefault();
    const name = document.querySelector('#fname').value;
	const email = document.querySelector('#email').value;
	const address = document.querySelector('#adr').value;
	const ccnum = document.querySelector('#ccnum').value;
	const expdate = document.querySelector('#expdate').value;
	const cardType = document.querySelector('#card_type').value;
	const comment = document.querySelector('#comment').value;
	const roomtype = document.querySelector('#roomtype').value;
	const checkin = document.querySelector('#checkin').value;
	const checkout = document.querySelector('#checkout').value;
	const numRooms = document.querySelector('#numrooms').value;
	const inFormat = new Date(checkin);
	const outFormat = new Date(checkout);
	const inDate = inFormat.toISOString().slice(0,10);
	const outDate = outFormat.toISOString().slice(0,10);
	const days = getNumberOfDays(inDate, outDate);
	const serializedMessage = formatMessageA( name, email, address, ccnum, expdate, cardType, comment, total
		, roomtype, inDate, outDate, numRooms, days);
	console.log(serializedMessage);
	fetch('cust', {  method: 'POST',  
				  headers: {
      			  	'Content-Type': 'application/json'
				  },
				  body:serializedMessage
			   }
		)
		.then(onResponse1);
	e.stopPropagation();
};

const submit = document.querySelector('#submitBook'); 
submit.addEventListener('click', onSubmit1);

// PROCESS CUSTOMER DETAILS FROM ABOVE //
	