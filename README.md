# Northcoders House of Games API

## Creating environment variables

To connect to the two databases locally a package called .env can be used. Firstly, you must create two new files called `.env.test` and `.env.development`, these files will store our variables. To the `.env.test` file add `PGDATABASE=<test-database-name>` and then to the `.env.development` add `PGDATABASE=<dev-database-name>`. The names of each database can be found in `/db/setup.sql` incase you are curious.