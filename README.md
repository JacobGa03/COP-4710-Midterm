# COP-4710-Midterm

Midterm Project for COP 4710 at UCF Spring '25

## Using Docker

From the root directory, run `docker compose up --build`. This will start the docker container.

It is important to note that you must have the Docker engine already running so that way you can run our container.

From here, you can run `docker ps` to find the different docker containers which are running.

### Accessing the Web Page

Once the docker container is started go to your web browser and go to `localhost:8000/landing.html` to view the landing page.

### Logging Into MySQL Database

Find the container running the MySQL database. Run the command `docker exec -it <container id> mysql -u myuser -p`.

After running this you will be prompted for the MySQL password, enter it.

Now you have access to the MySQL database!

## Utilizing MySQL

After logging in, type `use mydatabase` to start using the database for this project. Now you are using the database. Next, type `show tables` to display the current tables in the database.

## Connecting MySQL to DBeaver

Create new DB connection, select MySQL. Next, find the IP address of the docker container running the MySQL server.

To do this, run `docker ps` and locate the Docker ID of the container running MySQL.

Next run `docker inspect <docker id>` and then look for the field labeled `IP Address` and use that as the URL for the connection.

Lastly, copy the Database name, username, and password from the `docker-compose.yml` file.

## SQL Dump

To recreate the database reliably during development, we use a mysql dump to make the database from scratch.

Run this command from **outside** of the container to dump the data into the backup `.sql` file. This should save whatever DB you have. Although doing this shouldn't be too important since the actual data doesn't matter.

`docker exec cop4710termproject-db-1 mysqldump --user=${MYSQL_USER} --password=${MYSQL_PASSWORD} mydatabase --no-tablespaces > /db_data/DB_Data.sql`

## Container Names

Useful when needing to run `docker exec`

| Main WebPage         | MySQL               |
| -------------------- | ------------------- |
| cop4710midterm-web-1 | cop4710midterm-db-1 |
