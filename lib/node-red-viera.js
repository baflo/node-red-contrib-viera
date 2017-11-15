const PanasonicViera = require('panasonic-viera-control/panasonicviera');

module.exports = function (RED) {
    const clients = {};

    function createVieraClient(config) {
        if (!clients[config.viera]) {
            const avrConfig = RED.nodes.getNode(config.viera);
            clients[config.viera] = new PanasonicViera(`${avrConfig.host}`);
            clients[config.viera].on('close', () => {
                delete clients[config.viera];
            });
            clients[config.viera].connect();
        }

        return clients[config.viera];
    }

    function connectViera(handler) {
        return function (config) {
            RED.nodes.createNode(this, config);
            const node = this;
            const vieraClient = createVieraClient(config);

            node.on('input', msg => {
                handler(vieraClient, config.keycode)
                    .then(response => {
                        msg.payload = response;
                        node.send(msg);
                    })
                    .catch(err => {
                        msg.payload = { error: err };
                        node.send(msg);
                    });
            });
        }
    }

    RED.nodes.registerType('send-key-code', (connectViera(
        (client, code) => client.send(code)
    )));
}
