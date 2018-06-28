# whoof (Web-Browser Hooking Framework)
whoof is an early stage lightweight web browser hooking framework. A web browser hook can be thought of as a backdoor in a web page allowing an attacker to execute commands in the page with or without the visitor noticing. whoof is a web application security tool to manage, execute and assess web browser vulnerabilities.

whoof uses Node/Express server-side, with React/Redux on the client-side.

Hooked browsers are managed via WebSockets.

![ss](https://user-images.githubusercontent.com/9021719/42063937-005a1f60-7ae9-11e8-8306-ee1f6916a8d5.jpg)

Check out the [wiki](https://github.com/compewter/whoof/wiki/) for details on features and getting started.

## Features

### Custom Attacks
Use the attack builder to construct custom attacks on the fly.

![screenshot](https://user-images.githubusercontent.com/9021719/39608658-dd9ac762-4ef7-11e8-9667-9f255fba52f6.jpg)

### Execute Arbitrary Commands with the Terminal
Use the terminal to execute arbitrary commands or retrieve data from hooked pages.
![ss](https://user-images.githubusercontent.com/9021719/42064040-71616402-7ae9-11e8-9e87-5d36b3af0137.jpg)

### Easily import/export attacks
One click download an exported attack which can easily be imported in the admin web app.

This repo was built off of and ejected from Facebook's [create-react-app](https://github.com/facebookincubator/create-react-app)

