# Use the official PHP image as the base image
FROM php:7.4-apache

# Copy the HTML and PHP files to the appropriate directory
COPY public/ /var/www/html/
COPY backend/ /var/www/html/backend/

# Enable Apache mod_rewrite
RUN a2enmod rewrite

# Set the working directory
WORKDIR /var/www/html

# Expose port 80
EXPOSE 80