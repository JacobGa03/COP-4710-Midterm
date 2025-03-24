#!/bin/bash

# Stop the PHP Apache server first so the SQL dump can take place
docker-compose stop cop4710midterm-web-1

# Give the above some time to execute
sleep 10

docker-compose stop cop4710midterm