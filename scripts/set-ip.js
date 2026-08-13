const os = require('os');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const port = process.env.EXPO_PUBLIC_PORT;

if (!port) {
    console.error('EXPO_PUBLIC_PORT is not set.');
    process.exit(1);
}

const interfaces = os.networkInterfaces();

let localIp;

for (const networkInterface of Object.values(interfaces)) {
    for (const address of networkInterface ?? []) {
        if (
            address.family === 'IPv4' &&
            !address.internal
        ) {
            localIp = address.address;
            break;
        }
    }

    if (localIp) {
        break;
    }
}

if (!localIp) {
    console.error('Could not find a local network IP.');
    process.exit(1);
}

const apiUrl = `http://${localIp}:${port}`;

// eslint-disable-next-line no-undef
const envPath = path.join(__dirname, '..', '.env');

fs.writeFileSync(
    envPath,
    `EXPO_PUBLIC_PORT=${port}\nEXPO_PUBLIC_API_URL=${apiUrl}\n`
);

console.log(`API URL set to ${apiUrl}`);