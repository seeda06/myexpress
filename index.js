const express = require('express');
//LINE
const line = require('@line/bot-sdk');
const config = {
    channelAccessToken: 'dy9+1bBiMFzfxSu0knu/Qj/OepIcYU42WNeUplQlX3u3VjYxeHhHMzY2FDhJwAU2fgmeBmByacLi1bSL2UOpB/oRYmwgJH5oQG4C8NI8EfNvh3Q4NNRk3LrgsT0maDNzwy+AgRRQEE+9Qv3GF/XtwwdB04t89/1O/w1cDnyilFU=',
    channelSecret: 'e9eae3f5b4def01bd3cce98c1905d8d3'
};
const client = new line.Client(config);
//FIREBASE
const firebase = require('firebase');
require("firebase/firestore");
const firebaseConfig = {
    apiKey: "AIzaSyClNo_QztyS6M1xdlGzp9NgEDfLkbL8C4Q",
    authDomain: "lineoa-6917c.firebaseapp.com",
    projectId: "lineoa-6917c",
    storageBucket: "lineoa-6917c.appspot.com",
    messagingSenderId: "237222461984",
    appId: "1:237222461984:web:6c411c3748a25790a8f245",
    measurementId: "G-M1WFEFKCP1"
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

function handleEvent(event) {
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

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})