const express = require('express') //extra
const bodyParser = require('body-parser') //extra
const exphbs = require('express-handlebars') //extra
const path = require('path') //extra
const nightmare = require('nightmare')() 
const nodemailer = require('nodemailer') 
//const args = process.argv.slice(2)
// const url = args[0]
// const minPrice = args[1]
// const mail_id = args[2]


const app = express()          //extra


//View Engine setup

//app.engine('handlebars', exphbs());   //old code for app.engine

app.engine(
    'handlebars',
     exphbs({
         extname: "hbs",
         defaultLayout: false,
         layoutsDir: "views/layouts/"
     }));  //extra
app.set('view engine', 'handlebars');  //extra

//Static Folder
app.use('/public', express.static(path.join(__dirname, 'public')));

//Body Parser Middleware
//parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: false}));  //extra

//parse application
app.use(bodyParser.json()); //extra

app.get('/', (req, res) => {   //extra
    res.render('contact');          //extra 
});                            //extra

app.post('/send', (req, res) => {
    const output = `
        <p>ALERT!! The Price on your desired product has dropped below ${req.body.price} .</p>
        <h3>Your Details</h3>
        <ul>
            <li>Name: ${req.body.name}</li>
            <li>Email: ${req.body.email}</li>
            <li>Your Desired Price: ${req.body.price}</li>
        </ul>
        <h3>Product's URL</h3>
        <p>${req.body.url}</p>
    `;
    checkPrice()
    async function checkPrice()
    {
        try{
            const priceString = await nightmare.goto(req.body.url) //url
                                                .wait("#priceblock_ourprice")
                                                .evaluate(() => document.getElementById("priceblock_ourprice").innerText)
                                                .end()

        const priceNumber = parseFloat(priceString.replace('₹', '').replace(',', ''))   
        if(priceNumber < req.body.price ){                //minPrice
        await sendEmail(
        'Price has DROPPED!!!',
        `The price on ${req.body.url} has dropped below ${req.body.price}`  // url and minPrice
        )
        }
    }
        catch(e){
            await sendEmail(`Amazon Price Checker Error`,e.message)
            throw e
        }
    }
    async function sendEmail(subject, body){
        let transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 587,
            secure: false,
            auth: {
                user: "amazonpricetracker0@gmail.com",
                pass: "Kfbe75yXwUgfb"
            },
            tls:{
                rejectUnauthorized: false
            }
        });
    
        const mailOptions = {
            from: '"amazonpricetracker0@gmail.com" <amazonpricetracker0@gmail.com>',
            to: `${req.body.email}`,
            subject: subject,
            text: body,
            html: output //body
        };
    
        transporter.sendMail(mailOptions, (error, info) => {
            if(error){
                return console.log(error)
            }
        res.render('contact', {message: 'Email sent successfully!'})
        console.log('Message sent: %s', info.messageId)
        console.log('Preview URL is: %s', nodemailer.getTestMessageURL(info))    
        
    });
    }; 
    
});


app.listen(3000, () => console.log('Server Started!'));   //extra




//-------------------------UNNECESSARY--------------------------------


//------------------------------UNNECESSARY----------------------------------------


//-------------------------------------------------------OLD CODE-------------------------------------------------------

// const nightmare = require('nightmare')()
// const nodemailer = require('nodemailer')
// const args = process.argv.slice(2)
// const url = args[0]
// const minPrice = args[1]
// const mail_id = args[2]

// OLD CODE 

// checkPrice()
// async function checkPrice()
// {
//     try{
//         const priceString = await nightmare.goto(url)
//                                             .wait("#priceblock_ourprice")
//                                             .evaluate(() => document.getElementById("priceblock_ourprice").innerText)
//                                             .end()

//     const priceNumber = parseFloat(priceString.replace('₹', '').replace(',', ''))       // 
//     if(priceNumber < minPrice){
//     await sendEmail(
//     'Price is low',
//     `The price on ${url} has dropped below ${minPrice}`
//     )
//     } 
// }
//     catch(e){
//         await sendEmail(`Amazon Price Checker Error`,e.message)
//         throw e
//     }
// }

// async function sendEmail(subject, body){
//     let transporter = nodemailer.createTransport({
//         host: 'smtp.gmail.com',
//         port: 587,
//         secure: false,
//         auth: {
//             user: "pkuldeepr@gmail.com",
//             pass: "yHnvfR7iK,@1"
//         },
//         tls:{
//             rejectUnauthorized: false
//         }
//     });

//       const mailOptions = {
//         from: '"amazon-price-checker@extension.com" <pkuldeepr@gmail.com>',
//         to: `${mail_id}`,
//         subject: subject,
//         text: body,
//         html: body//output 
//     };

//     transporter.sendMail(mailOptions, (error, info) => {
//         if(error){
//             return console.log(error)
//         }
//     console.log('Message sent: %s', info.messageId)
//     console.log('Preview URL is: %s', nodemailer.getTestMessageURL(info))    
//     })
// }


















