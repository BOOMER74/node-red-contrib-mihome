# node-red-contrib-mihome

[![platform](https://img.shields.io/badge/platform-Node--RED-red?style=flat-square)](https://nodered.org)
[![npm](https://img.shields.io/npm/v/node-red-contrib-mihome?style=flat-square)](https://www.npmjs.com/package/node-red-contrib-mihome)
[![npm](https://img.shields.io/npm/dt/node-red-contrib-mihome?style=flat-square)](https://www.npmjs.com/package/node-red-contrib-mihome)
[![GitHub](https://img.shields.io/github/license/BOOMER74/node-red-contrib-mihome?style=flat-square)](https://github.com/BOOMER74/node-red-contrib-mihome/blob/master/LICENSE)

Add nodes to get data from devices connected to Mi Home using [node-mihome](https://github.com/maxinminax/node-mihome).

## Install

Run `npm i node-red-contrib-mihome` in `~/.node-red` directory or search **node-red-contrib-mihome** and install from **Palette Manager**.

## Supported devices

| Device | Model | Node |
| ------ | ----- | ---- |
| Xiaomi Mi Temperature and Humidity Monitor 2 | LYWSD03MMC (China)<br>NUN4126GL (Global, should be checked) | `mihome-th-monitor` |

## Adding device support

If you want to add device support, you can make a PR or add request in discussions. Check [supported devices](https://github.com/maxinminax/node-mihome/blob/master/DEVICES.md) in `node-mihome` package and use node [template](/nodes/template) for boost development. Additional information you can find in [contributing guide](/CONTRIBUTING.md).

## Available nodes

### mihome-cloud

Provide authorization for Mi Home.

### mihome-devices

Returns all devices connected to Mi Home.

#### Settings

| Setting | Required | Description |
| ------- | -------- | ----------- |
| Name | No | Node display name |

#### Setup

|     | Description |
| --- | ----------- |
| **Input** | `payload` with `true` value   |
| **Output** | `payload` as array of objects |

### mihome-th-monitor

Returns climate data.

#### Settings

| Setting | Required | Description |
| ------- | -------- | ----------- |
| Name | No | Node display name |
| Device ID | Yes | Unique device ID from Mi Home, you can get it by checking `did` field from `mihome-devices` output |

#### Setup

|            | Description                   |
| ---------- | ----------------------------- |
| **Input** | `payload` with `true` value |
| **Output** | `payload` as object contains temperature, humidity, battery level (could be null) and timestamps |
