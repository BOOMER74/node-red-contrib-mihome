const mihome = require('node-mihome');

module.exports = (RED) => {
  function Cloud(config) {
    RED.nodes.createNode(this, config);

    this.connected = false;
    this.country = config.country;

    this.miio = null;
    this.aqara = null;
    this.mihome = null;

    const context = this.context();

    this.init = async () => {
      if (this.mihome == null && !context.get('mihome-cloud-init')) {
        context.set('mihome-cloud-init', true);

        const { miCloudProtocol, miioProtocol } = mihome;

        this.miio = miioProtocol;
        this.mihome = miCloudProtocol;

        this.miio.init();

        if (config.aqara) {
          this.aqara = mihome.aqaraProtocol;

          this.aqara.init();
        }

        const { email, password } = this.credentials;

        try {
          await this.mihome.login(email, password);

          this.connected = true;

          this.emit('connected');
        } catch (exception) {
          this.emit('close');

          this.error(`Mi Home: Cloud: ${exception.message}`);
        } finally {
          context.set('mihome-cloud-init', false);
        }
      } else if (!this.connected) {
        await new Promise((resolve) => {
          const checkConnection = () => {
            if (this.mihome.isLoggedIn || !context.get('mihome-cloud-init')) {
              resolve();
            } else {
              setTimeout(checkConnection, 500);
            }
          };

          checkConnection();
        });
      }
    };

    this.on('close', () => {
      this.connected = false;

      if (this.mihome != null) {
        this.mihome.logout();

        this.mihome = null;
      }

      if (this.aqara != null) {
        this.aqara.destroy();

        this.aqara = null;
      }

      if (this.miio != null) {
        this.miio.destroy();

        this.miio = null;
      }

      this.emit('disconnected');
    });
  }

  RED.nodes.registerType('mihome-cloud', Cloud, {
    credentials: {
      email: { type: 'text' },
      password: { type: 'password' },
    },
  });
};
