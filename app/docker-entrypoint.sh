#!/bin/sh

envsubst '$VITE_BACKEND_URL $VITE_API_TOKEN $VITE_FIREBASE_API_KEY $VITE_FIREBASE_AUTH_DOMAIN $VITE_FIREBASE_PROJECT_ID $VITE_FIREBASE_STORAGE_BUCKET $VITE_FIREBASE_MESSAGING_SENDER_ID $VITE_FIREBASE_APP_ID' \
    < /etc/nginx/conf.d/default.conf.template > /etc/nginx/conf.d/default.conf

exec nginx -g "daemon off;"
