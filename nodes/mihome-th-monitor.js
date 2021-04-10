const { decodeHexString, decodeValueString } = require('../utils/mihome');
const { firstItem, sortByField } = require('../utils/array');

const twoDaysSeconds = 2 * 24 * 60 * 60;

module.exports = (RED) => {
  function THMonitor(config) {
    RED.nodes.createNode(this, config);

    this.status({ fill: 'red', shape: 'dot', text: 'offline' });

    const cloud = RED.nodes.getNode(config.cloud);

    if (cloud != null) {
      const sendNull = () => {
        this.send({
          payload: {
            temperature: null,
            humidity: null,
          },
        });
      };

      cloud.init().then(async () => {
        const { connected, country, protocol } = cloud;

        if (config.did != null) {
          let device;

          try {
            const [_device] = await protocol.getDevices([config.did], { country });

            device = _device;
          } catch (exception) {
            this.warn(exception.message);
          }

          if (device != null && device.model === 'miaomiaoce.sensor_ht.t2') {
            // config.name = device.name;

            if (connected) {
              this.status({ fill: 'green', shape: 'dot', text: `online: ${device.name}` });
            }

            cloud.on('connected', () => {
              this.status({ fill: 'green', shape: 'dot', text: `online: ${device.name}` });
            });

            cloud.on('disconnected', () => {
              this.status({ fill: 'red', shape: 'dot', text: 'offline' });
            });

            this.on('input', async (msg) => {
              if (msg.payload === true && cloud.connected && config.did !== null) {
                const now = Math.round(new Date().getTime() / 1000);

                const payload = {
                  did: config.did,
                  type: 'prop',
                  time_start: now - twoDaysSeconds,
                  time_end: now,
                };

                let temperatures;
                let humidities;

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

                  temperatures = _temperatures;
                  humidities = _humidities;
                } catch (exception) {
                  this.warn(exception.message);
                }

                const lastTemperature = firstItem(sortByField(temperatures, 'time'));
                const lastHumidity = firstItem(sortByField(humidities, 'time'));

                if (lastTemperature == null || lastHumidity == null) {
                  sendNull();
                } else {
                  const temperature = decodeHexString(decodeValueString(lastTemperature.value));
                  const humidity = decodeHexString(decodeValueString(lastHumidity.value));

                  if (temperature == null || humidity == null) {
                    sendNull();
                  } else {
                    this.send({
                      payload: {
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
            });
          }
        }
      });
    }
  }

  RED.nodes.registerType('mihome-th-monitor', THMonitor);
};
