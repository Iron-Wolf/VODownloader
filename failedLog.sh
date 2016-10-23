#! /bin/bash

while [ true ]; do
	STATUS=$( cat /tmp/t2k/download-failed.log | tail -n 1)
	echo $STATUS
	sleep 1;
done

