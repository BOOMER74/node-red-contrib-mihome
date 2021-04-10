module.exports = (RED) => {
  function Devices(config) {
    RED.nodes.createNode(this, config);

    this.status({ fill: 'red', shape: 'dot', text: 'offline' });

    const cloud = RED.nodes.getNode(config.cloud);

    if (cloud != null) {
      cloud.init().then(() => {
        const { connected, country, protocol } = cloud;

        if (connected) {
          this.status({ fill: 'green', shape: 'dot', text: 'online' });
        }

        cloud.on('connected', async () => {
          this.status({ fill: 'green', shape: 'dot', text: 'online' });
        });

        cloud.on('disconnected', () => {
          this.status({ fill: 'red', shape: 'dot', text: 'offline' });
        });

        this.on('input', async (msg) => {
          if (msg.payload === true && cloud.connected) {
            const devices = await protocol.getDevices(null, { country });

            this.send({ payload: devices });
          }
        });
      });
    }
  }

  RED.nodes.registerType('mihome-devices', Devices);
};
