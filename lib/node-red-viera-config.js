module.exports = function (RED) {
    function VieraConfig(n) {
        RED.nodes.createNode(this, n);
        this.name = n.name;
        this.host = n.host;
    }

    RED.nodes.registerType('viera-config', VieraConfig);
}