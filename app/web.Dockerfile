# Web server in front of the Toolshop API (built locally: the published image is ARM-only).
FROM nginx:1.27-alpine
COPY vhost.conf /etc/nginx/conf.d/default.conf
