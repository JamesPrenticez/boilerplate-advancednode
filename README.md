# Free Code Camp
## [Introduction to Advanced Node and Express Challenges](https://www.freecodecamp.org/learn/quality-assurance/advanced-node-and-express/)

# Heroku
## https://advancednode-jamesprenticez.herokuapp.com/

### Set up a Database for mongoDB
https://docs.mongodb.com/drivers/node/quick-start#connect-to-your-cluster

### Set up heroku for mongo DB
https://developer.mongodb.com/how-to/use-atlas-on-heroku

#### Protip
Make sure you allow IP access from anywhere...

### .env files obviously not avaliable on heroku so..
https://stackoverflow.com/questions/58082890/how-to-load-mongodb-uri-from-env-file-on-heroku
https://stackoverflow.com/questions/56777088/unable-to-connect-to-mongodb-database-with-my-heroku-app
$ heroku logs -a advancednode-jamesprenticez
$ heroku config:set MONGO_URI="mongodb+srv://JamesPrenticez:<!PASSWORD!>@ffc-passport.efd9z.mongodb.net/<!DBNAME!>?retryWrites=true&w=majority" -a advancednode-jamesprenticez 
