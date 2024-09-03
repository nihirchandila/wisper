# wisper
Wisper An Ultimate Anonymous Chatting Platform!
Anyone can create an account by clicking on sign up and by entering name, email, password, and gender.
You can now chat with any of the users available on this platform

env related setup (create and env file in root folder with these variables)

PORT=3001
MONGO_DB_URI=(your mongo db uri)
secretKey = (any secret key for jwt auth)
NODE_ENV=development
DEV= http://localhost:3001 
REACT_APP_DEV=http://localhost:3001 

once env file is setup write these commands
npm i 
npm start