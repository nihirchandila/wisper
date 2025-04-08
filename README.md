# wisper
Wisper An Ultimate Anonymous Chatting Platform!
Anyone can create an account by clicking on sign up and by entering name, email, password, and gender.
You can now chat with any of the users available on this platform, follow these steps:-
1. Go to this url - https://wisper.onrender.com/ (Wait for a 1 minute to let the render server start)
2. Click on sign up button to create an account if you don't have one or directly go to this url- https://wisper.onrender.com/register
3. After loggin in to your account you can see all users in users section and online users is online section. 


You can also setup the project locally, follow these steps:-

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
