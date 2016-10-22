#!/bin/bash
./websocketd --devconsole --port 8080 ./twitch2kodi.sh ws > /dev/null &
./websocketd --port 8081 tail -f -c 50 /tmp/t2k/download-worked.log &
./websocketd --port 8082 tail -f /tmp/t2k/download-failed.log &

