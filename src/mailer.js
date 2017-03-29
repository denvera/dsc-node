// User: security@alone.za.net Pass: 8DXm7Q%M
var nodemailer = require('nodemailer');
var config = require('config');
// create reusable transporter object using SMTP transport

var mailConfig = config.get('mail');

var transporter = nodemailer.createTransport({
    service: mailConfig.service,
    auth: mailConfig.auth
});


var mailOptions = {
    from: '56 3rd Ave, Harfield Security <security@alone.za.net>', // sender address
    to: 'denvera@gmail.com', // list of receivers
    subject: '', // Subject line
    text: 'Default Body', // plaintext body
    html: '<b>Default Body</b>' // html body
};


var sendMail = function(body, subject) {
    transporter.sendMail({
        from: mailConfig.from,
        to: mailConfig.to,
        subject: subject,
        text: body,
        html: '<b>' + body + '</b>'
    }, function(error, info){
        if (error){
            return console.log(error);
        }
        console.log('Message sent: ' + info.response);
    });
}

module.exports.sendMail = sendMail;