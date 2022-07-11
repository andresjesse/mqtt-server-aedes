# Minimal MQTT Broker with Aedes JS

Study project. Not suitable for production.

## Local Setup

```bash
git clone {this repo}

yarn

yarn start
```

## Railway.app Deploy

1. Fork project to your own github account;

2. Create a new [railway](https://railway.app/) project from github repo;

3. Configure `.env` Variables through Railway project Settings;

4. Create a domain to expose your Broker to public web;

5. Prey for sucessful deploy.

## Testing your Broker

Access: http://www.hivemq.com/demos/websocket-client/

Connect through Websockets using port 80 and your `.env` credentials.

## Notes

There's only one auth user, set by `.env`. Don't commit it!

There's no topic authorization, everything can be published. Uncomment authorization step in `src/server.js` if you want to filter topics.

The `DEBUG` env variable enables log printing (you can see it on railway Deploy logs).
