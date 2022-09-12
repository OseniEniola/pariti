# Pariti Vending Machine

## Reference Documentation
This is a project to demonstrate RESTful API with Node js ExpressJs .
you can find the swagger documentation `http://127.0.0.1:3000/api-docs`
Git hub link `https://github.com/OseniEniola/pariti`

## Dependencies
Node
ExpressJS
ForerunnerDB(in-memory-db)

## Setup
To start the application, run the command `npm install` to install application dependencies
Run comman `npm run start`

#### ENVIRONMENT VARIABLE.
The required environment variables can be gotten from the .env


## Express API setup

The Express API is located in [./src/server.ts].

Applications routes for resources are defined in [.src/routes].

Global concerns like security, cookie parsing, body parsing and request logging are handled in [./server.ts](./server.ts).

file containing preconfigured products and coin are in [./src/dto]

- Presentation is dealt with in the `server.ts` file
- Domain is dealt with in the `./routes` folder. 
- Data is dealt with in the `./src/models` folder


## NB
- The coins configured are 5cents , 10cents, 25cents, 50cents

# Assumption
- The machine can take in dollar notes or coins for payment can gives change in coin

