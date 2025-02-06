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

## Container IDs

| Main WebPage       | MySQL                                                  |
| ------------------ | ------------------------------------------------------ |
| cop4710midterm-web | docker exec -it cop4710midterm-db-1 mysql -u myuser -p |
