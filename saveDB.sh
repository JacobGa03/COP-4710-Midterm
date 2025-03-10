#!/bin/bash

# Wait for the MySQL server to be ready
wait_for_mysql() {
  echo "Waiting for MySQL server to be ready..."
  until mysqladmin ping -h db --silent; do
    sleep 1
  done
  echo "MySQL server is ready."
}

# Initialize the database
initialize_db() {
  echo "Initializing database..."
  mysql -h db -u${MYSQL_USER} -p${MYSQL_PASSWORD} ${MYSQL_DATABASE} < /var/lib/mysql/DB_Setup.sql
  if [ $? -eq 0 ]; then
    echo "Database initialized successfully."
  else
    echo "Failed to initialize the database."
    exit 1
  fi
}

# Backup the database
backup_db() {
  echo "Backing up database..."
  mysqldump --user="${MYSQL_USER}" --password="${MYSQL_PASSWORD}" "${MYSQL_DATABASE}" --no-tablespaces > /var/lib/mysql/DB_Data.sql
  if [ $? -eq 0 ]; then
    echo "Database backed up successfully."
  else
    echo "Failed to back up the database."
    exit 1
  fi
}

# Trap the SIGTERM signal to backup the database when the container stops
trap 'backup_db; exit 0' SIGTERM

# Wait for MySQL server to be ready
wait_for_mysql

# Initialize the database
initialize_db

# Start Apache in the foreground
apache2-foreground