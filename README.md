# node-red-contrib-mihome

[![platform](https://img.shields.io/badge/platform-Node--RED-red?style=flat-square)](https://nodered.org)
[![npm](https://img.shields.io/npm/v/node-red-contrib-mihome?style=flat-square)](https://www.npmjs.com/package/node-red-contrib-mihome)
[![npm](https://img.shields.io/npm/dw/node-red-contrib-mihome?style=flat-square)](https://www.npmjs.com/package/node-red-contrib-mihome)
[![GitHub](https://img.shields.io/github/license/BOOMER74/node-red-contrib-mihome?style=flat-square)](https://github.com/BOOMER74/node-red-contrib-mihome/blob/master/LICENSE)

Add nodes to get data from devices connected to Mi Home using [node-mihome](https://github.com/maxinminax/node-mihome). See [changelog](CHANGELOG.md) for the latest changes.

## Requirements

* `node` v12.22.0 or higher
* `node-red` v1.3.0 or higher

## Install

Run `npm i node-red-contrib-mihome` in `~/.node-red` directory or search **node-red-contrib-mihome** and install from **Palette Manager**.

## Supported devices

| Device | Models | Tested | Node info |
| :----- | :----- | :----: | :-------- |
| Mi Temperature and<br>Humidity Monitor 2 | LYWSD03MMC (China)<br>NUN4126GL (Global, should be checked) | ✅ | Palette name: _th monitor_<br>Node name: `mihome-th-monitor` |
| Mi Temperature and<br>Humidity Sensor | WSDCGQ01LM | ❌ | Palette name: _th sensor_<br>Node name: `mihome-th-sensor` |

## Adding device support

If you want to add device support, you can make a PR or add request in discussions. Check [supported devices](https://github.com/maxinminax/node-mihome/blob/master/DEVICES.md) in `node-mihome` package and use node [template](nodes/template) for boost development. Additional information you can find in [contributing guide](CONTRIBUTING.md).

## Available nodes

### mihome-cloud

Provide authorization for Mi Home.

#### Settings

| Setting | Required | Description |
| ------- | -------- | ----------- |
| Username | ✅ | Mi Home account username |
| Password | ✅ | Mi Home account password |
| Country | ✅ | Which server use to connect |
| Aqara | ❌ | Should it be Aqara protocol  initiated |

##### Setting preview

![mihome-cloud](images/cloud-settings.png)

**Aqara protocol limitations:** you can set up only one `mihome-cloud` node with Aqara protocol enabled, all another may cause errors (in short explanation it's because `node-mihome` open socket connection in exclusive mode).

### mihome-devices

Returns all devices connected to Mi Home.

Palette name: devices.

#### Statuses

| Statuses | Preview |
| -------- | ------- |
| Node not connected to cloud | ![mihome-devices](images/devices-offline.png) |
| Node connected to cloud | ![mihome-devices](images/devices-online.png) |

#### Settings

| Setting | Required | Description |
| ------- | -------- | ----------- |
| Cloud | ✅ | Mi Home account settings |
| Name | ❌ | Node display name |

##### Setting preview

![mihome-devices](images/devices-settings.png)

#### Setup

|     | Description |
| --- | ----------- |
| **Input** | `payload` with `true` value |
| **Output** | `payload` as array of objects |

### mihome-th-monitor

Returns climate data.

Palette name: th monitor.

#### Statuses

| Statuses | Preview |
| -------- | ------- |
| Node not connected to cloud | ![mihome-th-monitor](images/th-monitor-offline.png) |
| Node connected to cloud but not configured | ![mihome-th-monitor](images/th-monitor-online-not-configured.png) |
| Node connected to cloud and configured | ![mihome-th-monitor](images/th-monitor-online-configured.png) |

#### Settings

| Setting | Required | Description |
| ------- | -------- | ----------- |
| Cloud | ✅ | Mi Home account settings |
| Device ID | ✅ | Unique device ID from Mi Home, you can get it by checking `did` field from `mihome-devices` output |
| Name | ❌ | Node display name |

##### Setting preview

![mihome-th-monitor](images/th-monitor-settings.png)

#### Setup

|     | Description                   |
| --- | ----------------------------- |
| **Input** | `payload` with `true` value |
| **Output** | `payload` as object contains temperature, humidity, battery level (could be null) and timestamps |
