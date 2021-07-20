const express = require('express');
//.ENV
const dotenv = require('dotenv');
dotenv.config();

//LINE
const line = require('@line/bot-sdk');
const config = {
    channelAccessToken: process.env.channelAccessToken,
    channelSecret: process.env.channelSecret

};
const client = new line.Client(config);
//FIREBASE
const firebase = require('firebase');
require("firebase/firestore");
const firebaseConfig = {
    apiKey: process.env.apiKey,
    authDomain: process.env.authDomain,
    projectId: process.env.projectId,
    storageBucket: process.env.storageBucket,
    messagingSenderId: process.env.messagingSenderId,
    appId: process.env.appId,
    measurementId: process.env.measurementId

} 
const admin = firebase.initializeApp(firebaseConfig);
const db = admin.firestore();
//WEB
const app = express();
const port = 3000

app.post('/webhook', line.middleware(config), (req, res) => {
    //console.log(req);
    Promise
        .all(req.body.events.map(handleEvent))
        .then((result) => res.json(result));
});

async function handleEvent(event) {
    if (event.type !== 'message' || event.message.type !== 'text') {
        return Promise.resolve(null);
    }
    //console.log(event);
    //console.log(event.message);
    //console.log(event.message.text);
    // SAVE TO FIREBASE
    let chat = await db.collection('chats').add(event);
    
    console.log('Added document with ID: ', chat.id);
    return client.replyMessage(event.replyToken, {
        type: 'text',
        text: event.message.text,
    });
}

// Respond with Hello World! on the homepage:
app.get('/', function (req, res) {
    res.send('Hello World! 556677')
})


app.post('/', function (req, res) {
    res.send('Got a POST request')
})
// Respond to a PUT request to the /user route:
app.put('/user', function (req, res) {
    res.send('Got a PUT request at /user')
})
// Respond to a DELETE request to the /user route:
app.delete('/user', function (req, res) {
    res.send('Got a DELETE request at /user')
})
app.get('/test-firebase', async function (req, res) {
    let data = {
        name: 'Tokyo',
        country: 'Japan'
    }
    const result = await db.collection('cities').add(data);
    console.log('Added document with ID: ', result.id);
    res.send('Test firebase successfully, check your firestore for a new record !!!')
})

app.listen(process.env.PORT || port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})