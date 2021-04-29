const { decodeHexString, decodeValueString } = require('../utils/mihome');
const { firstItem, sortByField } = require('../utils/array');

const twoDaysSeconds = 2 * 24 * 60 * 60;

module.exports = (RED) => {
  /**
   * @namespace {import('node-red__registry')}
   * @member {NodeAPI} RED
   */
  function THMonitor(config) {
    RED.nodes.createNode(this, config);

    this.name = null;

    this.status({ fill: 'red', shape: 'dot', text: 'offline' });

    /**
     * @type {Cloud & Node & EventEmitter}
     */
    const cloud = RED.nodes.getNode(config.cloud);

    if (cloud != null && config.did != null) {
      cloud.init().then(async () => {
        const { connected, country, mihome: protocol } = cloud;

        if (connected) {
          let device;

          try {
            const [_device] = await protocol.getDevices([config.did], { country });

            device = _device;
          } catch (exception) {
            this.warn(`Mi Home: TH Monitor: ${exception.message}`);
          }

          if (device != null && device.model === 'miaomiaoce.sensor_ht.t2') {
            if (config.name == null || config.name.length === 0) {
              this.name = device.name;
            }

            this.status({ fill: 'green', shape: 'dot', text: `online: ${device.name}` });
          }
        }

        this.on('input', async (msg) => {
          if (connected && msg.payload === true) {
            const now = Math.round(new Date().getTime() / 1000);

            const payload = {
              did: config.did,
              type: 'prop',
              time_start: now - twoDaysSeconds,
              time_end: now,
            };

            let temperatures;
            let humidities;
            let batteries;

            try {
              const { result: _temperatures = [] } = await protocol.request(
                '/user/get_user_device_data',
                {
                  ...payload,
                  key: 0x1004,
                },
                country,
              );
              const { result: _humidities = [] } = await protocol.request(
                '/user/get_user_device_data',
                {
                  ...payload,
                  key: 0x1006,
                },
                country,
              );
              const { result: _batteries = [] } = await protocol.request(
                '/user/get_user_device_data',
                {
                  ...payload,
                  key: 0x100a,
                },
                country,
              );

              temperatures = _temperatures;
              humidities = _humidities;
              batteries = _batteries;
            } catch (exception) {
              this.warn(`Mi Home: TH Monitor: ${exception.message}`);
            }

            if (temperatures != null && humidities != null) {
              const lastTemperature = firstItem(sortByField(temperatures, 'time'));
              const lastHumidity = firstItem(sortByField(humidities, 'time'));
              const lastBattery = firstItem(sortByField(batteries, 'time'));

              if (lastTemperature == null || lastHumidity == null) {
                this.warn('Mi Home: TH Monitor: cannot find last data for temperature or humidity');
              } else {
                const temperature = decodeHexString(decodeValueString(lastTemperature.value));
                const humidity = decodeHexString(decodeValueString(lastHumidity.value));
                const battery = lastBattery == null ? null : decodeHexString(decodeValueString(lastBattery.value));

                if (temperature == null || humidity == null) {
                  this.warn('Mi Home: TH Monitor: cannot decode data for temperature or humidity');
                } else {
                  this.send({
                    payload: {
                      battery,
                      temperature: temperature / 10,
                      humidity: humidity / 10,
                      timestamps: {
                        temperature: lastTemperature.time,
                        humidity: lastHumidity.time,
                      },
                    },
                  });
                }
              }
            }
          }
        });
      });

      cloud.on('connected', () => {
        this.status({
          fill: 'green',
          shape: this.name == null ? 'ring' : 'dot',
          text: this.name == null ? 'online' : `online: ${this.name}`,
        });
      });

      cloud.on('disconnected', () => {
        this.status({ fill: 'red', shape: 'dot', text: 'offline' });
      });
    }
  }

  RED.nodes.registerType('mihome-th-monitor', THMonitor);
};
