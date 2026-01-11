const express = require('express');
const twilio = require('twilio');
const app = express();

const accountSid = 'AC9a22b1a5b8ab116f9f73a876d15e776b'; 
const authToken = '4f9c616c12ddbae0354f57f09845e69b'; 
const client = new twilio(accountSid, authToken);

app.get('/make-call', (req, res) => {
    const toNumber = req.query.to;
    const audioUrl = req.query.audio; 
    // એપમાંથી મોકલેલો ટેક્સ્ટ મેસેજ અંહી પકડશે, જો કઈ નહિ હોય તો "Jay Swaminarayan" બોલશે
    const customMsg = req.query.msg || "Jay Swaminarayan"; 
    
    console.log("કોલ વિનંતી મળી:", toNumber);

    let twimlResponse = `
        <Response>
            <Pause length="1"/>
            
            <Say voice="alice" language="hi-IN">${customMsg}</Say>
            
            <Pause length="1"/>
            
            ${audioUrl && audioUrl.trim() !== "" ? `
                <Play>${audioUrl}</Play>
            ` : ""}
            
            <Pause length="1"/>
            <Hangup/>
        </Response>`;

    client.calls.create({
        twiml: twimlResponse,
        to: toNumber,
        from: '+17656360480' 
    })
    .then(call => {
        console.log("કોલ શરૂ થયો:", call.sid);
        res.status(200).send('Call Started!');
    })
    .catch(err => {
        console.error("Twilio એરર:", err.message);
        res.status(500).send("Twilio Error: " + err.message);
    });
});

app.listen(3000, () => console.log('સર્વર પોર્ટ 3000 પર ચાલુ છે...'));
