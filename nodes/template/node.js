module.exports = (RED) => {
  function Node(config) {
    RED.nodes.createNode(this, config);

    this.status({ fill: 'red', shape: 'dot', text: 'offline' });

    const cloud = RED.nodes.getNode(config.cloud);

    if (cloud != null) {
      // Initialize Mi Home connection
      cloud.init().then(() => {
        // Get protocol object and required data
        const { connected, country, mihome: protocol /* aqara: protocol */ } = cloud;

        if (connected) {
          this.status({ fill: 'green', shape: 'dot', text: 'online' });
        }

        this.on('input', async (msg) => {
          if (connected && msg.payload === true) {
            // Call some protocol function
            const result = await protocol.miioCall('did', 'method', {}, country);
            // Or initialize device and call his method,
            // see https://github.com/maxinminax/node-mihome#create-device for details

            this.send({ payload: result });
          }
        });
      });

      cloud.on('connect', async () => {
        this.status({ fill: 'green', shape: 'dot', text: 'online' });
      });

      cloud.on('disconnect', () => {
        this.status({ fill: 'red', shape: 'dot', text: 'offline' });
      });
    }
  }

  RED.nodes.registerType('mihome-node', Node);
};
