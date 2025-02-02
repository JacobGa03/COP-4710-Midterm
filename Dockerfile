# Use the official PHP image as the base image
FROM php:7.4-apache

# Copy the HTML and PHP files to the appropriate directory
COPY public/ /var/www/html/
COPY backend/ /var/www/html/backend/

# Copy the .htaccess file to the appropriate directory
# COPY ../public/.htaccess /var/www/html/.htaccess

# Enable Apache mod_rewrite
RUN a2enmod rewrite

# Allow .htaccess overrides
# RUN sed -i 's/AllowOverride None/AllowOverride All/' /etc/apache2/apache2.conf

# Set the working directory
WORKDIR /var/www/html

# Expose port 80
EXPOSE 80