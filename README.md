# Hot Potato

Search and add movies to couch potato

### Setup

```
npm install
```

### How to run

```
APIKEY=123 npm start
```

or

```
APIKEY=123 node index.js
```

### URL

http://localhost:3000/

### Example systemd unit file

```
[Unit]
Description=Hot Potato
After=network.target

[Service]
Environment=APIKEY=123
Type=simple
User=ubuntu
WorkingDirectory=/home/ubuntu
ExecStart=/usr/bin/node /home/ubuntu/index.js
Restart=on-failure

[Install]
WantedBy=multi-user.target
```