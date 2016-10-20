
// --------------------------- //
//		INITIALISATION		   //
// --------------------------- //

// Global variable
var wsUri = "ws://localhost:8080/";
var websocket;

function firstLoading() {
	var switchMessage = document.getElementById('switchMessage');
	var switchButton = document.getElementById('switchButton');
	disableDiv(true);
}


// --------------------------- //
//		WEBSOCKET CORE		   //
// --------------------------- //
function switchConnection() {
	if (switchButton.value == "Connect") {
		// get connection to the WebSocket server and update UI
		try {
			websocket = new WebSocket(wsUri);
		}
		catch (ex) {
			switchMessage.innerHTML = '<span class="errorSpan">Exception: ' + ex + '</span>';
			return;
		}

		websocket.onopen = function(evt) { onOpen(evt) };
		websocket.onclose = function(evt) { onClose(evt) };
		websocket.onmessage = function(evt) { onMessage(evt) };
		websocket.onerror = function(evt) { onError(evt) };
		
		enableUI(true);
		//switchMessage.innerHTML = '<span class="okSpan">Connection OK</span>';
	}
	else if (switchButton.value == "Disconnect") {
		websocket.close();
		enableUI(false);
		//switchMessage.innerHTML = '<span class="infoSpan">Disconnected</span>';
	}
}

function sendMessage() {
	var message = document.getElementById('completUrl').value;
	
	try {
		websocket.send(message);
	}
	catch (ex) {
		switchMessage.innerHTML = '<span class="errorSpan">Exception: ' + ex + '</span>';
	}
}


function onOpen(evt) {
	// change layout acording to the connection status
	enableUI(true);
	switchMessage.innerHTML = '<span class="okSpan">onOpen: ' + evt.data + '</span>';
}

function onClose(evt) {
	// change layout acording to the connection status
	enableUI(false);
	switchMessage.innerHTML = '<span class="infoSpan">onClose: [Clean: ' + evt.wasClean 
								+ ', Code: ' + evt.code + ', Reason: ' + (evt.reason || 'none') + ']</span>';
}

function onMessage(evt) {
	switchMessage.innerHTML = '<span class="messageSpan">onMessage: ' + evt.data + '</span>';
	// if data NOT contain the given String, return -1
	if (evt.data.indexOf("...") === -1)
		document.getElementById('switchOutput').innerHTML = evt.data;
}

function onError(evt) {
	switchMessage.innerHTML = '<span class="errorSpan">onError: ' + evt.data + '</span>';
}


// --------------------------- //
//		BUSINESS FUNCTION	   //
// --------------------------- //
function enableUI(status) {
	// to enable UI : set the "disable" attribut to "false"
	disableDiv(!status);
	// update some text
	switchButton.value = (status) ? "Disconnect" : "Connect";
}

function disableDiv(status) {
	var allChildNodes = document.getElementById("urlBox").getElementsByTagName('*');
	// TODO : temporary class name
	document.getElementById("urlBox").className = (status) ? "messageSpan" : "";
	
	for(var i = 0; i < allChildNodes.length; i++) {
		allChildNodes[i].disabled = (allChildNodes[i].id != "youtube") ? status : "true";
	}
}

function reverse(s) {
	var o = [];
	for (var i = 0, len = s.length; i <= len; i++)
		o.push(s.charAt(len - i));
	
	return o.join('');
}
