# Aidan's Games API

## Introduction
---
This is an API centered around board games. It has the functionality to upvote board game reviews, post comments on reviews as well as much more. For more information about each endpoint and their functionality use the "/api" endpoint on the hosted version. This is a link to the heroku hosted version: https://nc-games-aidan.herokuapp.com/

The minimum version of node that must be installed is v17.7.1 and the minimum version of Postgres that must be installed is v12.10.
<br>
## Setup
---
### Cloning
Copy the url of the github repo. In this case the url is https://github.com/Oathian/NC-Games-Backend
Open the terminal and navigate to where you would like the file to be located. Then type: 
```
git clone https://github.com/Oathian/NC-Games-Backend
```
<br>

### Installing dependencies

Next, to install any dependencies type `npm install` or `npm i` in your terminal.

<br>

### Creating environment variables

To connect to the two databases locally a package called .env can be used. Firstly, you must create two new files called `.env.test` and `.env.development`, these files will store our variables. To the `.env.test` file add `PGDATABASE=<test-database-name>` and then to the `.env.development` add `PGDATABASE=<dev-database-name>`. The names of each database can be found in `/db/setup.sql` incase you are curious.

<br>

### Seeding the database

To seed your databases run the `npm run setup-dbs` command to create the databases or drop any existing databases with the same name. Then run the `npm run seed` command to create the required tables and populated them.

<br>

### Running tests

Now that the database is seeded locally and dependencies are installed, tests can be run. Type `npm test` or `npm t` in your terminal to run both test suites. Alternatively, you can add a file name to the end of either of these commands to only run that test suite.
