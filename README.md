# VeAL

## About

VeAL is a younger leaner take on [BeEF](http://beefproject.com/), the industry standard web application for penetration testers to manage, execute, and assess client-side web browser vulnerabilities.

Using sockets instead of requests on a 10 second interval, VeAL allows hooked browsers to receive, execute, and respond to commands several times faster than BeEF.

It's all built on top of @erikras' wonderful [boilerplate](https://github.com/erikras/react-redux-universal-hot-example).

## Installation

```bash
npm install
```

## Running Dev Server

```bash
npm run dev
```

## Building and Running Production Server

```bash
npm run build
npm run start
```

## Explanation

VeAL is the platform for managing hooked browsers. Hooks pointing to your VeAL server can be injected into any web page. VeAL is split into two separate ports, one for administrators and one for test subjects. This allows additional protections to be put in place to protect your adminstrator interface.


## Documentation
Coming Soon!


#### Unit Tests

The project uses [Mocha](https://mochajs.org/) to run your unit tests, it uses [Karma](http://karma-runner.github.io/0.13/index.html) as the test runner, it enables the feature that you are able to render your tests to the browser (e.g: Firefox, Chrome etc.), which means you are able to use the [Test Utilities](http://facebook.github.io/react/docs/test-utils.html) from Facebook api like `renderIntoDocument()`.

To run the tests in the project, just simply run `npm test` if you have `Chrome` installed, it will be automatically launched as a test service for you.

To keep watching your test suites that you are working on, just set `singleRun: false` in the `karma.conf.js` file. Please be sure set it to `true` if you are running `npm test` on a continuous integration server (travis-ci, etc).

## Roadmap 

