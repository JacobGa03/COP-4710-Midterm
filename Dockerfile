# Use the official PHP image as the base image
FROM php:7.4-apache

RUN apt-get update && apt-get install -y default-mysql-client \
    && docker-php-ext-install mysqli
# Copy the HTML and PHP files to the appropriate directory
COPY public/ /var/www/html/
COPY backend/ /var/www/html/backend/
# Copy the DB creation and DB dump into the container
COPY db_data/ /var/lib/mysql/

# Copy the save saveDB.sh into the container
# Probably could have been stored elsewhere...
#COPY saveDB.sh /usr/local/bin/saveDB.sh 
#RUN chmod +x /usr/local/bin/saveDB.sh

# Enable Apache mod_rewrite
RUN a2enmod rewrite

# Set the working directory
WORKDIR /var/www/html

# Expose port 80
EXPOSE 80

# Run the script to set up and save the DB 
#ENTRYPOINT [ "/usr/local/bin/saveDB.sh" ]