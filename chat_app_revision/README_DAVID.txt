INSTRUCTIONS:
BACKEND: 
1) TO START THE SERVERS, USE: 
ASSOCIATED WITH THE AUTH SERVICE:
$env:AUTH_CONNECTION="mongodb://127.0.0.1:27017/auth"
$env:JWT_SECRET="secret"

ASSOCIATED WITH THE USER SERVICE:
$env:USER_CONNECTION="mongodb://127.0.0.1:27017/user"

ASSOCIATED WITH THE GRAPHQLSERVER:
$env:AUTH_SERVICE_CONNECTION="http://127.0.0.1:3001/auth"
$env:USER_SERVICE_CONNECTION="http://127.0.0.1:3002/user"  

2) RUN THE COMMANDS: 
YOU NEED TO OPEN 4 WINDOWS, ONE FOR EACH COMMAND:
-npm run start-auth-service
-npm run start-user-service
-npm run start-apollo-server


FRONTEND: 
ONLY GO TO chat-app/frontend AND SEND THE COMMAND: 
-npm start