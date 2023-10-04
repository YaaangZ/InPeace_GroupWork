#!/bin/sh

# Set permissions on certificates after volume mount
chown node:node /usr/src/app/certs/privkey.pem /usr/src/app/certs/fullchain.pem

# Then, run the original command (e.g., start Apache or any other command you want to execute after setting permissions)
exec "$@"
