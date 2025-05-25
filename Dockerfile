FROM node:18-alpine as node-builder

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY database .

RUN npm run build


FROM php:8.2-fpm-alpine

RUN apk add --no-cache \
    git \
    zip \
    unzip \
    curl \
    libpng-dev \
    libjpeg-turbo-dev \
    oniguruma-dev \
    libxml2-dev \
    zip \
    libzip-dev \
    nodejs \
    npm \
    sqlite \
    && docker-php-ext-configure zip \
    && docker-php-ext-install pdo pdo_sqlite mbstring zip exif pcntl bcmath gd

COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

WORKDIR /var/www/html

COPY --from=node-builder / /var/www/html

RUN chown -R www-data:www-data /var/www/html \
    && chmod -R 755 /var/www/html/storage /var/www/html/bootstrap/cache

EXPOSE 9000
