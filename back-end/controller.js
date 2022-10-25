const nodemailer = require("nodemailer");
const axios = require("axios").default;
const queryString = require('query-string');

exports.handlePost = async (req,res) => {
    const { name, email, message, token } = req.body;

    //recaptcha status
    const recaptchaStatus = await postCaptcha(token);

    if (recaptchaStatus === 'failed') {
        res.status(400).send({status: 'recaptcha failed'});
        return;
    }

    //send email
    const msgStatus = await sendMessage(name,email,message);
    
    if (msgStatus === 'success') res.status(200).send({status: 'request succeeded'});
    else res.status(400).send({status: 'message failed'})
}

//post to Google reCaptcha
const postCaptcha = async token => {
    const params = {
        secret: process.env.RECAPTCHA_KEY,
        response: token
    }
    
    //convert to query string
    const queryStringParams = queryString.stringify(params, {arrayFormat: 'bracket'});

    try {
        const resp = await axios.post('https://www.google.com/recaptcha/api/siteverify', queryStringParams);
        console.log(resp.data);

        if (resp.data.success === true && resp.data.score >= 0.5 ) return('success');
        else return('failed');

    } catch (err) {
        console.log(err);
        return('failed');
    }
}

//send email
const sendMessage = async (name,email,message) => {

    const replyMsg =  `
        <p>Hello,</p>
        <p>Thank you for reaching out to MattAllen.Tech! I will reply to your message as soon as possible.</p>
        <p>Have a great day,</p>
        <p>Matt Allen </p>
        <p> 
            <em>Web Developer</em><br />
            <em>Remote, Ohio</em><br />
            <em>info@mattallen.tech</em><br />
            <em>https://mattallen.tech</em><br />
        </p>
        <img src='cid:logo' alt='MattAllen.Tech Logo' />
    `

    try {
        let transporter = nodemailer.createTransport({
            host: "mattallen.tech",
            port: 465,
            secure: true, // true for 465, false for other ports
            auth: {
                user: process.env.EMAIL_LOGIN, 
                pass: process.env.EMAIL_PW,
            },
        });
            
       //send email to message sender
        await transporter.sendMail({
            from: '"info@mattallen.tech" <info@mattallen.tech>', 
            to: email,
            subject: "Message Recieved", 
            html: replyMsg,
            attachments: [{
                filename: 'email-logo.png',
                path: 'email-logo.png',
                cid: 'logo'
            }]
        });

        //send email info@mattallen.tech
        await transporter.sendMail({
            from: 'info@mattallen.tech" <info@mattallen.tech>', 
            to: 'info@mattallen.tech',
            subject: "New Message Recieved", 
            html: `
                <p>
                   Name: ${name} <br />
                   Email: ${email} <br />
                   Message: ${message}
                </p>
            `
        });
        return('success')
            
    } catch (err) {
        return('failed')
    }
}