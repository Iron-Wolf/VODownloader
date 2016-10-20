#!/bin/bash
#
# Patchwork of commands (tested on the fly and without error handling),
# used to download Twitch VoD and upload them to kodi media center.
#
# Requirement : 
# - youtube-dl (https://github.com/rg3/youtube-dl)
# - sshpass
#
# Get current download status : 
# $ tail -f -c 50 /tmp/t2k/download-worked.log
#
# WebSocket integration
# Project : https://github.com/joewalnes/websocketd
# Command : ./websocketd --devconsole --port 8080 ./twitch2kodi.sh ws > /dev/null &

# Check number of parameter
if [ "$#" != "1" ]; then
	exit 1
fi

# conditionnal launch
if [ "$1" == "ws" ]; then
	# launch script in WebSocket mode
	WEBSOCKET=true
else
	WEBSOCKET=false
fi


function process {
	# PART 1 : dowload video
	# -f : format
	# -o : output file
	# --restrict-filenames : remove non unicode char and space
	# --get-filename : don't download video and return his filename
	# https://www.twitch.tv/mistermv/v/93554812
	mkdir /tmp/t2k

	FILE=$(./youtube-dl --get-filename -o "video/%(title)s.%(ext)s" $1 --restrict-filenames)
	./youtube-dl -f "High" -o "video/%(title)s.%(ext)s" $1 --restrict-filenames > /tmp/t2k/download-worked.log 2> /tmp/t2k/download-failed.log

	EXITSTATUS=$?
	if [ $EXITSTATUS != "0" ]; then
		echo "Error on youtube-dl"
		exit 2
	fi

	# PART 2 : transfert it to the server
	HOST='xxx.xxx.xx.xx'
	USER='xxxx'
	PASSWD='xxxx'

	#sshpass -p $PASSWD scp $FILE $USER@$HOST:Movies > /tmp/t2k/upload-worked.log 2> /tmp/t2k/upload-failed.log

	EXITSTATUS=$?
	if [ $EXITSTATUS != "0" ]; then
		echo "Error on sshpass"
		exit 2
	fi
}


# do / while
while : ; do
	if [ $WEBSOCKET == true ]; then
		# in WebSocket mode, read URL from input
		echo "Waiting for url..."; read LINE
		process $LINE
	else
		process $1
	fi
	[[ $WEBSOCKET == true ]] || break
done

exit 0
