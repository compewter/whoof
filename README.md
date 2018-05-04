# WHooF (Web Hooking Framework)
WHooF is a web application security tool to manage, execute and assess web browser vulnerabilities.

WHooF uses Node/Express server-side, with React/Redux on the client-side.

Hooked browsers are managed via WebSockets.

![screenshot](https://user-images.githubusercontent.com/9021719/39608608-8aed74f6-4ef7-11e8-9e71-950f7acaf716.jpg)

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

### Custom Attacks
Use the attack builder to construct custom attacks on the fly.

![screenshot](https://user-images.githubusercontent.com/9021719/39608658-dd9ac762-4ef7-11e8-9667-9f255fba52f6.jpg)

This repo was built off of and ejected from Facebook's [create-react-app](https://github.com/facebookincubator/create-react-app)
