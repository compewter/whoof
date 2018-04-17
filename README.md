# VeAL
VeAL is a web application security tool to manage, execute and assess web browser vulnerabilities.

VeAL uses Node/Express server-side, with React/Redux on the client-side.

Hooked browsers are managed via WebSockets.

### Installation:
```sh
$ cd /path/to/repo
$ npm install
$ cd client
$ npm install
$ cd ..
$ npm start
```

### Usage
Once the servers are running, you can load the admin interface on port 3000.


### Hooking Victims
Include /public/hook.js in a page the victim will load
An example can be found in /public/victim-example.html


This repo was built off of and ejected from Facebook's [create-react-app](https://github.com/facebookincubator/create-react-app)
