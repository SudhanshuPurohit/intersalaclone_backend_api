const nodemailer = require("nodemailer");
const ErrorHandler = require("./ErrorHandler");

exports.sendMail = (req, res, next, otp)=>{


    const transport = nodemailer.createTransport({
        service: "gmail",
        host: "smtp.gmail.com",
        post: 465,
        auth: {
            user: process.env.mailEmailAddrs,
            pass: process.env.mailEmailPassword,
        }
    });

    const mailOptions = {
        from : "Internsala PVT LMT",
        to: req.body.email,
        subject: "Password Reset OTP by Internsala",
        html: `<h1> Your OTP for Reset Password </h1>
         <h3>${otp}</h3>
        `
    }


    transport.sendMail(mailOptions, (err, info)=>{
        if(err)return (next(new ErrorHandlerandler("The Server is Responding", 500)));
        console.log(info);
        return res.status(200).json({
            message: "Mail sent successfully",
            url,
        });
    })
}
