module.exports = (RED) => {
  /**
   * @namespace {import('node-red__registry')}
   * @member {NodeAPI} RED
   */
  function THSensor(config) {
    RED.nodes.createNode(this, config);

    this.name = null;

    this.status({ fill: 'red', shape: 'dot', text: 'offline' });

    /**
     * @type {Cloud & Node & EventEmitter}
     */
    const cloud = RED.nodes.getNode(config.cloud);

    if (cloud != null && config.did != null) {
      cloud.init().then(async () => {
        const { aqara, connected, country, mihome: protocol } = cloud;

        let device;

        if (connected && aqara != null) {
          try {
            const [_device] = await protocol.getDevices([config.did], { country });

            const instance = protocol.device({ id: config.did, model: 'lumi.sensor_ht.v1' });

            device = { ..._device, instance };
          } catch (exception) {
            this.warn(`Mi Home: TH Sensor: ${exception.message}`);
          }

          if (device != null) {
            if (config.name == null || config.name.length === 0) {
              this.name = device.name;
            }

            this.status({ fill: 'green', shape: 'dot', text: `online: ${device.name}` });
          }
        }

        this.on('input', async (msg) => {
          if (connected && msg.payload === true && device != null) {
            const battery = await device.instance.getBattery();
            const humidity = await device.instance.getHumidity();
            const temperature = await device.instance.getTemperature();

            this.send({
              payload: {
                battery,
                humidity,
                temperature,
              },
            });
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

  RED.nodes.registerType('mihome-th-sensor', THSensor);
};
