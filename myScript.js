
// --------------------------- //
//		INITIALISATION		   //
// --------------------------- //

// Global variable
var wsUri = "ws://localhost:8080/";
var websocket;

function firstLoading() {
	var consoleLog = document.getElementById('consoleLog');
	var consoleLogPhone = document.getElementById('consoleLogPhone');
	var switchButton = document.getElementById('switchButton');
	var sendButton = document.getElementById('sendButton');
	
	disableDiv(true);
}


// --------------------------- //
//		WEBSOCKET CORE		   //
// --------------------------- //
function switchConnection() {
	if (switchButton.text == "connect") {
		// get connection to the WebSocket server and update UI
		try {
			websocket = new WebSocket(wsUri);
		}
		catch (ex) {
			appendConsoleText('errorSpan', 'Exception: ' + ex);
			return;
		}
		
		websocket.onopen = function(evt) { onOpen(evt) };
		websocket.onclose = function(evt) { onClose(evt) };
		websocket.onmessage = function(evt) { onMessage(evt) };
		websocket.onerror = function(evt) { onError(evt) };
		
		//enableUI(true);
		//appendConsoleText('okSpan', 'Connection OK');
	}
	else if (switchButton.text == "disconnect") {
		websocket.close();
		//enableUI(false);
		appendConsoleText('infoSpan', 'Disconnected');
	}

}

function sendMessage() {
	var message = document.getElementById('completUrl').value;
	
	try {
		websocket.send(message);
	}
	catch (ex) {
		appendConsoleText('errorSpan', 'sendMessage: ' + ex);
	}
}


function onOpen(evt) {
	// change layout acording to the connection status
	enableUI(true);
	appendConsoleText('okSpan', 'onOpen: ' + (evt.data || '...') );
}

function onClose(evt) {
	// change layout acording to the connection status
	enableUI(false);
	appendConsoleText('infoSpan', 'onClose: [Clean: ' + evt.wasClean 
								+ ', Code: ' + evt.code + ', Reason: ' + (evt.reason || 'none') + ']' );
}

function onMessage(evt) {
	appendConsoleText('messageSpan', 'onMessage: ' + evt.data );
	// if data NOT contain the given String, return -1
	if (evt.data.indexOf("...") === -1)
		appendConsoleText('', 'Response : ' + evt.data);
}

function onError(evt) {
	appendConsoleText('errorSpan', 'onError: ' + (evt.data || '...'));
}


// --------------------------- //
//		BUSINESS FUNCTION	   //
// --------------------------- //
function enableUI(status) {
	// to enable UI : set the "disable" attribut to "false"
	disableDiv(!status);
	// update some text
	switchButton.text = (status) ? "disconnect" : "connect";
}

function disableDiv(status) {
	var allChildNodes = document.getElementById("urlBox").getElementsByTagName('*');
	// TODO : temporary class name
	document.getElementById("urlBox").className = (status) ? "messageSpan" : "";
	
	if (status) {sendButton.setAttribute('disabled', true );}
	else {sendButton.removeAttribute('disabled');}
	
	for(var i = 0; i < allChildNodes.length; i++) {
		allChildNodes[i].disabled = (allChildNodes[i].id != "youtube") ? status : "true";
	}
}

function appendConsoleText(type, text) {
	var currentTime = new Date().toLocaleString();
	consoleLog.innerHTML = consoleLog.innerHTML + currentTime + ' <span class="' + type + '">' + text + '<br/><hr></span>' ;
	consoleLogPhone.innerHTML = consoleLogPhone.innerHTML + currentTime + ' <span class="' + type + '">' + text + '<br/><hr></span>' ;
}

function clearLog() {
	consoleLog.innerHTML = "";
	consoleLogPhone.innerHTML = "";
}

function reverse(s) {
	var o = [];
	for (var i = 0, len = s.length; i <= len; i++)
		o.push(s.charAt(len - i));
	
	return o.join('');
}
