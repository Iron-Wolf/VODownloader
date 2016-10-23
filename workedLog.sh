#! /bin/bash

while [ true ]; do
	STATUS=$( cat /tmp/t2k/download-worked.log | tail -c 54)
	echo $STATUS
	sleep 1;
done
