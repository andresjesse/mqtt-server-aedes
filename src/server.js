require("dotenv").config();

const DEBUG = process.env.DEBUG === "true";

const aedes = require("aedes")();
const httpServer = require("http").createServer();
const ws = require("websocket-stream");
const port = 8888;

// authentication
aedes.authenticate = (client, username, password, callback) => {
  try {
    password = Buffer.from(password, "base64").toString();
    if (
      username === process.env.MQTT_USER &&
      password === process.env.MQTT_PASS
    ) {
      return callback(null, true);
    }
    const error = new Error(
      "Authentication Failed!! Please enter valid credentials."
    );
    console.log("Authentication failed.");
    return callback(error, false);
  } catch (error) {
    console.log(error);
  }
};

// authorising client topic to publish a message (disabled to accept everything)
// aedes.authorizePublish = (client, packet, callback) => {
//   if (packet.topic === "abc") {
//     return callback(new Error("wrong topic"));
//   }
//   if (packet.topic === "charcha") {
//     packet.payload = Buffer.from("overwrite packet payload");
//   }
//   callback(null);
// };

// create websocket server
ws.createServer({ server: httpServer }, aedes.handle);

httpServer.listen(port, function () {
  console.log("websocket server listening on port ", port);
});

// debug calls

if (DEBUG) {
  aedes.on("client", function (client) {
    console.log(
      `CLIENT_CONNECTED : MQTT Client ${
        client ? client.id : client
      } connected to aedes broker ${aedes.id}`
    );
  });
  // emitted when a client disconnects from the broker
  aedes.on("clientDisconnect", function (client) {
    console.log(
      `CLIENT_DISCONNECTED : MQTT Client ${
        client ? client.id : client
      } disconnected from the aedes broker ${aedes.id}`
    );
  });
  // emitted when a client subscribes to a message topic
  aedes.on("subscribe", function (subscriptions, client) {
    console.log(
      `TOPIC_SUBSCRIBED : MQTT Client ${
        client ? client.id : client
      } subscribed to topic: ${subscriptions
        .map((s) => s.topic)
        .join(",")} on aedes broker ${aedes.id}`
    );
  });
  // emitted when a client unsubscribes from a message topic
  aedes.on("unsubscribe", function (subscriptions, client) {
    console.log(
      `TOPIC_UNSUBSCRIBED : MQTT Client ${
        client ? client.id : client
      } unsubscribed to topic: ${subscriptions.join(",")} from aedes broker ${
        aedes.id
      }`
    );
  });
  // emitted when a client publishes a message packet on the topic
  aedes.on("publish", function (packet, client) {
    if (client) {
      console.log(
        `MESSAGE_PUBLISHED : MQTT Client ${
          client ? client.id : "AEDES BROKER_" + aedes.id
        } has published message "${packet.payload}" on ${
          packet.topic
        } to aedes broker ${aedes.id}`
      );
    }
  });
}
