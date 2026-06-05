FROM dunglas/frankenphp:1-php8.3

# Install additional PHP extensions needed for Laravel, Octane, and Spatie Media Library
RUN install-php-extensions \
    pcntl \
    pdo_mysql \
    gd \
    intl \
    zip \
    opcache

# Install Node.js and chokidar-cli (needed for Octane file watching in development)
RUN curl -fsSL https://deb.nodesource.com/setup_20.x | bash - \
    && apt-get install -y nodejs \
    && npm install -g chokidar-cli

# Set working directory
WORKDIR /app

# Copy the application code
COPY . /app

# Ensure proper permissions for Laravel storage and cache directories
RUN chown -R www-data:www-data /app \
    && chmod -R 775 /app/storage /app/bootstrap/cache

# Expose port 8000 for FrankenPHP/Octane
EXPOSE 8000

# Set environment variable to run Octane
ENV OCTANE_SERVER=frankenphp
