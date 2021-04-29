module.exports = (RED) => {
  /**
   * @namespace {import('node-red__registry')}
   * @member {NodeAPI} RED
   */
  function Devices(config) {
    RED.nodes.createNode(this, config);

    this.status({ fill: 'red', shape: 'dot', text: 'offline' });

    /**
     * @type {Cloud & Node & EventEmitter}
     */
    const cloud = RED.nodes.getNode(config.cloud);

    if (cloud != null) {
      cloud.init().then(() => {
        const { connected, country, mihome: protocol } = cloud;

        if (connected) {
          this.status({ fill: 'green', shape: 'dot', text: 'online' });
        }

        this.on('input', async (msg) => {
          if (connected && msg.payload === true) {
            const devices = await protocol.getDevices(null, { country });

            this.send({ payload: devices });
          }
        });
      });

      cloud.on('connected', async () => {
        this.status({ fill: 'green', shape: 'dot', text: 'online' });
      });

      cloud.on('disconnected', () => {
        this.status({ fill: 'red', shape: 'dot', text: 'offline' });
      });
    }
  }

  RED.nodes.registerType('mihome-devices', Devices);
};
