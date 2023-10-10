exports.sendToken = (student, statuscode, res)=>{

   
        
    const token = student.generateToken();

    const options ={
        expires: new Date(Date.now()+process.env.COOKIE_EXPIRE*24*60*60*1000),
        httpOnly: true,// to make request from http not https
        // secure: false
    }

    res.status(statuscode).cookie("token", token ,options).json({success:true, id: student._id, token: token});
  

}