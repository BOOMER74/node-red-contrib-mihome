# node-red-contrib-mihome

Add nodes to get data from devices connected to Mi Home.

## Supported devices

### Xiaomi Mi Temperature and Humidity Monitor 2

Models LYWSD03MMC (China) and NUN4126GL (Global, should be checked).

## Available nodes

### mihome-cloud

Provide authorization for Mi Home.

### mihome-devices

#### Input

Send `true` to get all devices.

#### Output

Devices list as array of objects.

### mihome-th-monitor

#### Settings

Device ID: You can get it by checking `did` field from `mihome-devices` output.

#### Input

Send `true` to get temperature and humidity.

#### Output

Object, contains temperature and humidity data. Additionally, returns timestamps.
