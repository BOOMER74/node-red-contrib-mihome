const mihome = require('node-mihome');

module.exports = (RED) => {
  function Cloud(config) {
    RED.nodes.createNode(this, config);

    this.country = config.country;
    this.connected = false;

    this.miio = null;
    this.protocol = null;

    this.init = async () => {
      if (this.protocol == null || !this.protocol.isLoggedIn) {
        const { miCloudProtocol: protocol, miioProtocol: miio } = mihome;

        this.miio = miio;
        this.protocol = protocol;

        await miio.init();

        const { email, password } = this.credentials;

        try {
          await protocol.login(email, password);

          this.emit('connected');
        } catch (exception) {
          this.emit('close', exception.message);
        }
      } else {
        this.emit('connected');
      }
    };

    this.on('connected', () => {
      this.connected = true;
    });

    this.on('disconnected', () => {
      this.connected = false;
    });

    this.on('close', async () => {
      this.emit('disconnected');

      if (this.protocol != null && this.protocol.isLoggedIn) {
        this.protocol.logout();
      }

      if (this.miio != null) {
        this.miio.destroy();
      }
    });
  }

  RED.nodes.registerType('mihome-cloud', Cloud, {
    credentials: {
      email: { type: 'text' },
      password: { type: 'password' },
    },
  });
};
