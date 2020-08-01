# NHS POST-Redirect-GET Example

A demo of the server-sde POST-Redirect-GET pattern. Written in TypeScript.

## Run it locally

To run it locally - firstly install the dependencies:

`npm install`

### Environment variables

Create a .env file at the application root directory and copy the following then substitute relevant values such as APP_PASSWORD etc with something more sensible.

```
APP_USERNAME=A Username
APP_PASSWORD=A Password
NODE_ENV=development
SESSION_SECRET=a session secret
SESSION_DURATION=60000
PORT=3000
```

To start the server enter

`npm run start:dev`

This will start the server, any changes to the code will be picked up and the application will then restart.

## Tests

I've added some light tests for demonstration purposes.

`npm test`
