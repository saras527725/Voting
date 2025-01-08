const express=require('express')
const router=express.Router()
           const Userr=require('./../models/user')
           //router is used for structure file in a proper manner so that we use this for no confusion
           // ( basically sara code ek hi file mei na ho isi liye routers use kiya jata hai)
 const {jwtAuthMiddleware,generateToken} =require('./../jwt');
router.post('/signup', async (req, res) => {
  try {
    const data = req.body
     // create new user doc using mongoose mode
    const newUser = new Userr(data)
// save new user to database 
    const response = await newUser.save();
    console.log('Data saved');
    const payload= {
      id: response._id, // or   id: response.id,
    }
    console.log("payload id  is ",payload);
    const token = generateToken(payload);
    // const token=generateToken(response.username); if we can't write payload funtion then i write this.
    console.log('Token is : ',token);

    res.status(200).json({response: response, token: token});// this line is used for print data in postmn,chrome when we save data in database.
  }
  catch (error) {
    console.error('Error saving Userr', error);
    res.status(500).json({ error: "internal server error" });
  }
})

// login route
router.post('/login', async (req, res) => {
try {
//extract aadharno. and pass wrod from req.body
  const { aadharCardNumber, password } = req.body
  // find user by aadharCardNumber
  const user = await Userr.findOne({ username: aadharCardNumber });
  console.log(user)
  // check if user not exists and password is incorrect
    if (!user || !(await Userr.comparePassword(password))) {
      return res.status(401).json({ error: "Invalid usernameeeeee or password" });
  } 
    // if user is found and password is correct then generate token
    const payload = {
      id: user._id,
      username: user.username,
      }
      const token = generateToken(payload);
      res.status(200).json({ token: token });
      }
      catch (error) {
        console.error('Error logging in Userr', error);
        res.status(500).json({ error: "internal server error" });
        }
        })


        // profile route
        router.get('/profile',jwtAuthMiddleware,async(req,res)=>{
          try{
            const userData=req.user;// extract the userdata from the token (req.user jwt file se milra hai)
            // console.log('userdata-----',userData);
            const userid=userData.id
            const user=await Userr.findById(userid)
            console.log('user ==',user);
            // res.status(200).json(user);
             res.status(200).json({user});
            }
            catch(error){
              console.error('Error fetching user data',error);
              res.status(500).json({error:"internal server error (user data not shown)"}) }
            })
router.put('/profile/password',jwtAuthMiddleware, async(req,res)=>{
  try{
    const userId=req.user;//extract the userid from the token
    const {currentpassword,newpassword}=req.body//extract the curr and new passw from the req,body
// find the user by userid
const user=await Userr.findById(userId)
// if pass does not match
if (!(await Userr.comparePassword(currentpassword))) {
  return res.status(401).json({ error: "Invalid usernameeeeee or password" });
}   
user.password=newpassword
                                   await user.save();   
              //                     await Userr.save();   
// verify this





console.log("Pasword updated")
res.status(200).json({message:"password updated successfully"})
}catch(error){
  console.error('Error updating password',error);
  res.status(500).json({error:"internal server error (password not updated)"})
  }
  })

  
module.exports=router