#VODownloader

Simple use of websocket with bash script.
The main goal is to download VOD (only Twitch for now) from several hosting provider.

The code is as clean as possible. However, it's a side project, so don't expect good quality code here :)

##Requirement
- youtube-dl (https://github.com/rg3/youtube-dl)
- sshpass (it's not secure, but I know what I'm doing)
- websocket (https://github.com/joewalnes/websocketd)

##Process
1. Launch __startT2K.sh__ script
  * This start a websocket with __twitch2kodi.sh__ (containing core functions)
  * Also start a websocket with __workedLog.sh__ and __failedLog.sh__ (only read log entry from the main script)

2. Connect to __index.html__ via http
  * The __myScript.js__ script will init connection with the three websocket, and dynamically update the UI.

##Docker
See the docker implementation of the project on my [other repo](https://github.com/Iron-Wolf/Docker-conf/tree/master/vodownloader).
