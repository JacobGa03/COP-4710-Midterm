#!/bin/bash

# Wait for the MySQL server to be ready
wait_for_mysql() {
  echo "Waiting for MySQL server to be ready..."
  until mysqladmin ping -h db --silent; do
    sleep 1
  done
}

# Initialize the database
initialize_db() {
  echo "Initializing database..."
  # Drops old tables 
  mysql -h db -u${MYSQL_USER} -p${MYSQL_PASSWORD} -e "DROP DATABASE IF EXISTS ${MYSQL_DATABASE}; CREATE DATABASE ${MYSQL_DATABASE};"
  # Clean slate
  mysql -h db -u${MYSQL_USER} -p${MYSQL_PASSWORD} ${MYSQL_DATABASE} < /var/lib/mysql/DB_Setup.sql
}

# Backup the database
backup_db() {
  echo "Backing up database..."
  mysqldump -h db -u${MYSQL_USER} -p${MYSQL_PASSWORD} ${MYSQL_DATABASE} > /var/lib/mysql/DB_Data.sql
}

# Trap the SIGTERM signal to backup the database when the container stops
trap 'echo "Received SIGTERM, backing up database..."; backup_db' SIGTERM

# Wait for MySQL server to be ready
wait_for_mysql

# Initialize the database
initialize_db

# Start Apache in the foreground
apache2-foreground