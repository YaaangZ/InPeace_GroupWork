# Use the official Node.js 16 image.
FROM node:16.20.0-alpine3.18

# Set the environment variable
ENV REACT_APP_BACKEND_URL=https://inpeace.ie:8080


# Install Apache and Apache SSL module
RUN apk --no-cache add apache2 apache2-ssl && \
    sed -i 's/#LoadModule rewrite_module modules\/mod_rewrite.so/LoadModule rewrite_module modules\/mod_rewrite.so/' /etc/apache2/httpd.conf

# Create and change to the app directory.
WORKDIR /usr/src/app

# Copy application dependency manifests to the container image.
COPY package*.json ./

# Install production dependencies.
RUN npm install --only=production

# Copy local code to the container image.
COPY . .

# Build the React application
RUN npm run build

# Copy the built app to Apache's public folder
RUN cp -R build/* /var/www/localhost/htdocs/

# Copy the .htaccess file to Apache's public folder
COPY .htaccess /var/www/localhost/htdocs/.htaccess

# Change ownership to apache for all the contents inside /var/www/localhost/htdocs
RUN chown -R apache:apache /var/www/localhost/htdocs

# Set directory and file permissions
RUN find /var/www/localhost/htdocs -type d -exec chmod 755 {} \;   # For directories
RUN find /var/www/localhost/htdocs -type f -exec chmod 644 {} \;   # For files

# Ensure .htaccess is readable
RUN chmod 644 /var/www/localhost/htdocs/.htaccess

# Copy the Apache configuration file
COPY apache-app.conf /etc/apache2/conf.d/

# Start Apache in the foreground
CMD httpd -D FOREGROUND
