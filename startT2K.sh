#!/bin/bash

killall websocketd

./websocketd --devconsole --port 8080 ./twitch2kodi.sh ws > /dev/null &
./websocketd --port 8081 ./workedLog.sh &
./websocketd --port 8082 ./failedLog.sh &

