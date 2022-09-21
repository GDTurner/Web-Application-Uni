
function processJSON(json){
	console.log("json display", json);
	console.log("json.data display", json.data);
};



function onError(error){
	console.log(error);
};

function onResponse(response){
	console.log(response);
	console.log(response.status);
	// response.json().then(processJSON);
	location.reload();
};


function formatMessageAdd(refSur, amountAdd){
	const message ={
		refSur:refSur,
		amountAdd:amountAdd	
	};
	return JSON.stringify(message);
};


//// form handler 
function onAdd(e){
	//// stop the form being submitted by default
	e.preventDefault();
    const refSur = document.querySelector('#refSur').value;
	const amountAdd = document.querySelector('#amountAdd').value;
	const serializedMessage = formatMessageAdd(refSur, amountAdd);
	console.log(serializedMessage);
	fetch('surcharge', {method: 'POST',
					headers: {
						'Content-Type': 'application/json'
					},
					body:serializedMessage
					}
				).then(onResponse);
			e.stopPropagation();
};

const surcharge = document.querySelector('#update'); 
surcharge.addEventListener('click', onAdd);

// Take Payment

function onErrorPay(error){
	console.log(error);
};

function onResponsePay(response){
	console.log(response);
	console.log(response.status);
	location.reload();
};


function formatMessagePay(refPay, amountPay){
	const message ={
		refPay:refPay,
		amountPay:amountPay,	
	};
	return JSON.stringify(message);
};



//// form handler 
function onPay(e){
	//// stop the form being submitted by default
	e.preventDefault();
    const refPay = document.querySelector('#refPay').value;
	const amountPay = document.querySelector('#amountPay').value;
	const serializedMessage = formatMessagePay(refPay, amountPay);
	console.log(serializedMessage);
	fetch('payment', {method: 'POST',
					headers: {
						'Content-Type': 'application/json'
					},
					body:serializedMessage
					}
				).then(onResponsePay);
			e.stopPropagation();
};

const pay = document.querySelector('#pay'); 
pay.addEventListener('click', onPay);