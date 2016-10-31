
// --------------------- //
//    INITIALISATION     //
// --------------------- //

// Global variable
var wsUri = "ws://localhost:8080/";
var wsUriStatus = "ws://localhost:8081/";
var wsUriStatusFailed = "ws://localhost:8082/";
var websocket;
var websocketStatus;
var websocketStatusFailed;


// --------------------- //
//    WEBSOCKET CORE     //
// --------------------- //
function switchConnection() {
  if (switchButton.text == "open") {
    // get connection to the WebSocket server and update UI
    try {
      websocket = new WebSocket(wsUri);
      websocketStatus = new WebSocket(wsUriStatus);
      websocketStatusFailed = new WebSocket(wsUriStatusFailed);
    }
    catch (ex) {
      appendConsoleText('errorSpan', 'Exception: ' + ex);
      return;
    }
    
    websocket.onopen = function(evt) { onOpen(evt) };
    websocket.onclose = function(evt) { onClose(evt) };
    websocket.onmessage = function(evt) { onMessage(evt) };
    websocket.onerror = function(evt) { onError(evt) };
    
    websocketStatus.onmessage = function(evt) { onMessageStatus(evt) };
    websocketStatusFailed.onmessage = function(evt) { onMessageStatusFailed(evt) };
  }
  else if (switchButton.text == "close") {
    websocket.close();
    websocketStatus.close();
    websocketStatusFailed.close();
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
  /*if (evt.data.indexOf("...") === -1)
    appendConsoleText('', 'Response : ' + evt.data);*/
}
function onError(evt) {
  appendConsoleText('errorSpan', 'onError: ' + (evt.data || '...'));
}

function onMessageStatus(evt) {
  // display last message and close connection if main socket is closed
  downloadStatusLog.innerHTML = new Date().toLocaleTimeString() + ' <span class="infoSpan">' + evt.data + '</span>' ;
  if (websocket.readyState == 3)
    websocketStatus.close();
}
function onMessageStatusFailed(evt) {
  // display last message and close connection if main socket is closed
  downloadFailedLog.innerHTML = new Date().toLocaleTimeString() + ' <span class="errorSpan">' + evt.data + '</span>' ;
  if (websocket.readyState == 3)
    websocketStatusFailed.close();
}


// ----------------------- //
//    BUSINESS FUNCTION    //
// ----------------------- //
function enableUI(status) {
  // to enable UI : set the "disable" attribut to "false"
  disableDiv(!status);
  // update some text
  switchButton.text = (status) ? "close" : "open";
}

function disableDiv(status) {
  if (status) {
    sendButton.setAttribute('disabled', true);
    completUrl.setAttribute('disabled', true);
    cancelButton.setAttribute('disabled', true);
  }
  else {
    sendButton.removeAttribute('disabled');
    completUrl.removeAttribute('disabled');
    cancelButton.removeAttribute('disabled');
  }
  
  /*var allChildNodes = document.getElementById("urlBox").getElementsByTagName('*');
  document.getElementById("urlBox").className = (status) ? "messageSpan" : "";
  for(var i = 0; i < allChildNodes.length; i++) {
    allChildNodes[i].disabled = (allChildNodes[i].id != "youtube") ? status : "true";
  }*/
}

function appendConsoleText(type, text) {
  // add text to the consol
  var currentTime = new Date().toLocaleTimeString();
  consoleLog.innerHTML = consoleLog.innerHTML + currentTime + ' <span class="' + type + '">' + text + '<br/><hr></span>' ;
  consoleLogPhone.innerHTML = consoleLogPhone.innerHTML + currentTime + ' <span class="' + type + '">' + text + '<br/><hr></span>' ;
  
  // auto-scrolling
  consoleLog.scrollTop = consoleLog.scrollHeight;
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
