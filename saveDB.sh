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
  mysql -h db -u${MYSQL_USER} -p${MYSQL_PASSWORD} ${MYSQL_DATABASE} < /var/lib/mysql/DB_Data.sql
}

# Backup the database
backup_db() {
  echo "Backing up database..."
  # mysqldump -h db -u${MYSQL_USER} -p${MYSQL_PASSWORD} ${MYSQL_DATABASE} > /var/lib/mysql/DB_Data.sql
  # docker exec cop4710midterm-db-1 /var/lib/mysql/DB_Data.sql -u${MYSQL_USER} -p${MYSQL_PASSWORD} ${MYSQL_DATABASE} >  ./db_data/DB_Data.sql
  docker exec cop4710termproject-db-1 mysqldump --user="${MYSQL_USER}" --password="${MYSQL_PASSWORD}" "mydatabase" --no-tablespaces > /var/lib/mysql/DB_Data.sql
}

# Trap the SIGTERM signal to backup the database when the container stops
trap backup_db SIGTERM

# Wait for MySQL server to be ready
wait_for_mysql

# Initialize the database
initialize_db

# Start Apache in the foreground
apache2-foreground