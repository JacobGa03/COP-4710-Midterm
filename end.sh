#!/bin/bash
DB_NAME="your_database_name"
DB_USER="your_username"
DB_PASS="your_password"
BACKUP_DIR="/backup"
TIMESTAMP=$(date +"%F_%H-%M-%S")

mysqldump -u $DB_USER -p $DB_PASS $DB_NAME > $BACKUP_DIR/db_backup_$TIMESTAMP.sql

if [ $? -eq 0 ]; then
    echo "Backup successful!"
    cd $BACKUP_DIR
    git add .
    git commit -m "Backup on $TIMESTAMP"
    git push origin main
else
    echo "Backup failed!"
fi