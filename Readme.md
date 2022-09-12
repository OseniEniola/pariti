# Pariti Vending Machine

## Reference Documentation
This is a project to demonstrate RESTful API with Node js .
you can find the swagger documentation `https://host:3000/api-docs`
The app is deployed on heroku `https://lannister-pay-oseni.herokuapp.com/api-docs`

## Dependencies
Node
Redis

## Setup
To start the application, run the command `npm run start`

#### ENVIRONMENT VARIABLE.
The required environment variables can be gotten from the .env

### Database setup

A REDIS database is used

## Express API setup

The Express API is located in [./src/server.ts].

Applications routes for resources are defined in [.src/routes].

Global concerns like security, cookie parsing, body parsing and request logging are handled in [./server.ts](./server.ts).


- Presentation is dealt with in the `server.ts` file
- Domain is dealt with in the `./routes` folder. 
- Data is dealt with in the `./src/models` folder

## Database setup + management

Install Redis on the host system `https://github.com/zkteco-home/redis-windows`

```

