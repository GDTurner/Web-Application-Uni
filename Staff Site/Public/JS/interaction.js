///BELOW: HANDLER FOR CHECKING ROOM AVAILABILITY DURING SELECTED DATES :BELOW

//process JSON messages 
// function processJSON(json){
// 	console.log(json);


// function onError(error){
// 	console.log(error);
// };

// function onResponse(response){
// 	console.log(response.status);
// 	// response.json().then(processJSON);
// };


// function formatMessage(roomtype, checkin, checkout){
// 	const message ={
// 		roomtype: roomtype,
// 		checkin: checkin,
//         checkout: checkout
// 	};
// 	return JSON.stringify(message);
// };

// //// form handler 
// function onCheck(e){
// 	//// stop the form being submitted by default
// 	e.preventDefault();
//     const roomtype = document.querySelector('#roomtype').value;
// 	const checkin = document.querySelector('#checkin').value;
// 	const checkout = document.querySelector('#checkout').value;
// 	const serializedMessage = formatMessage( roomtype, checkin, checkout);
// 	console.log(serializedMessage);
// 	fetch('bookingcheck').then(onResponse);
// 	e.stopPropagation();
// };

// const submit = document.querySelector('#check'); 
// submit.addEventListener('click', onCheck);

// // process JSON data
// function processJSON(json){
// 	fetch('/bookingcheck').then(onResponse, onError);

// };

// function onError(error){
// 	console.log(error);
// };

// function onResponse(response){
// 	console.log(response.status);
// 	response.json().then(processJSON);
// };

// ///// send fetch call
// fetch('/bookingcheck').then(onResponse, onError);
// const submit = document.querySelector('#check'); 
// submit.addEventListener('click', processJSON);

//ABOVE: HANDLER FOR CHECKING ROOM AVAILABILITY DURING SELECTED DATES :ABOVE


///BELOW: UPDATES ROOM STATUS :BELOW

function processJSONfail(json){
	console.log(json);
	const response = document.querySelector('#message');
	response.innerHTML = `<%- include('statusFail') %>`;
	location.reload();
};

function onError(error){
	console.log(error);
	error.json().then(processJSONfail);
};

function onResponse(response){
	console.log(response.status);
	location.reload();

	
};


function formatMessage(roomNo, roomStatus, comment){
	const message ={
		roomNo: roomNo,
		roomStatus: roomStatus,
		comment: comment
	};
	return JSON.stringify(message);
};

//// form handler 
function onSubmit(e){
	//// stop the form being submitted by default
	e.preventDefault();
    const roomNo = document.querySelector('#room_no').value;
	const roomStatus = document.querySelector('#room_status').value;
	const comment = document.querySelector('#comment').value;
	const serializedMessage = formatMessage( roomNo, roomStatus, comment);
	console.log(serializedMessage);
	fetch('http://localhost:3000/roomcheck', {  method: 'POST',  
				  headers: {
      			  	'Content-Type': 'application/json',
					 'Accept': 'application/json'
				  },
				  body:serializedMessage
			   }
		)
		.then(onResponse);
	e.stopPropagation();
};

const statusChange = document.querySelector('#status'); 
statusChange.addEventListener('click', onSubmit);

///ABOVE: UPDATES ROOM STATUS :ABOVE

///BELOW: REFRESHES ROOM STATUS :BELOW
function processClick(){
	// console.log(json);
	// console.log(json.rows);
	////// number of rows returned from server
	fetch('/').then(onResponseR);
};


function onErrorR(error){
	console.log(error);
};

function onResponseR(response){
	console.log(response.status);
	
};


///// send fetch call
fetch('/').then(onResponseR, onErrorR);

///ABOVE: REFRESHES ROOM STATUS :ABOVE

