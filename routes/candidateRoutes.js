const express=require('express')
const router=express.Router()
           const User=require('../models/user')
           const Candidate=require('../models/canditates')

           const {jwtAuthMiddleware} =require('./../jwt');
 // below code ko function bolte hai
const checkAdminRole = async (userId)=>{
try{
const user=await User.findById(userId);
if(user.role =='admin'){
  return true;
  }
}catch(err){
  console.log(err);
  return false;
  }}

router.post('/', jwtAuthMiddleware,async (req, res) => {
  try {
  //   const userData=req.user;
  //   const userID= userData._id;
  //  if(!await checkAdminRole(userID))// it mean user is not admin or checkadmin value is false
  //   {
  //     console.log ("You are not an admin");
  //     return res.status(403).send({ message: "You are not an admin" });
  // }else{
  //   console.log ("You are an admin");
  // }
  // OR
  if(! await checkAdminRole(req.user.id))  // if iam not use await then ye function call nahi hoga and const data ke neeche wale saare code run hone lagege
  // OR if not use await then The function does not wait for the promise to resolve. It proceeds to the next line immediately, treating the if condition as truthy since a promise object always evaluates as truthy in JavaScript.
    return res.status(403).json({message: 'user does not have admin role'});
// if above line code run then below is not run because of return statement(ek function mei ek hi baar hum [return res.status..] use kar skte hai) and ye mat soachna ki if condition run hogi toh neeche wali automatic else hogi. ye reason nahi hai.
  
const data = req.body
     // create new user doc using mongoose mode
    const newCandidate = new Candidate(data)
// save new user to database 
    const response = await newCandidate.save();
    console.log('Data saved');
    res.status(200).json({response: response}); 
  }
  catch (error) {
    console.error('Error saving Userr', error);
    res.status(500).json({ error: "internal server error" });
  }
})
router.put('/:candidateID',jwtAuthMiddleware, async (req, res)=>{
  try{
      if(!checkAdminRole(req.user.id))
          return res.status(403).json({message: 'user does not have admin role'});
      
      const candidateID = req.params.candidateID; // Extract the id from the URL parameter
      const updatedCandidateData = req.body; // Updated data for the person

      const response = await Candidate.findByIdAndUpdate(candidateID, updatedCandidateData, {
          new: true, // Return the updated document
          runValidators: true, // Run Mongoose validation
      })

      if (!response) {
          return res.status(404).json({ error: 'Candidate not found' });
      }

      console.log('candidate data updated');
      res.status(200).json(response);
  }catch(err){
      console.log(err);
      res.status(500).json({error: 'Internal Server Error'});
  }
})

router.delete('/:candidateID',jwtAuthMiddleware, async (req, res)=>{
  try{
      if(!checkAdminRole(req.user.id))
          return res.status(403).json({message: 'user does not have admin role'});
      
      const candidateID = req.params.candidateID; // Extract the id from the URL parameter

      const response = await Candidate.findByIdAndDelete(candidateID);
      if (!response) {
          return res.status(404).json({ error: 'Candidate not found' });
      }
      console.log('candidate deleted');
      res.status(200).json(response);
  }catch(err){
      console.log(err);
      res.status(500).json({error: 'Internal Server Error'});
  }
})
router.get('/vote/:candidateID', jwtAuthMiddleware, async (req, res)=>{
  // no admin can vote
  // user can only vote once
  
  //  candidateID = req.params.candidateID;
  const candidateID = req.params.candidateID;
  const userId = req.user.id;
  try{
      // Find the Candidate document with the specified candidateID
      const candidate = await Candidate.findById(candidateID);
      if(!candidate){
          return res.status(404).json({ message: 'Candidate not found' });
      }
      const user = await User.findById(userId);
      if(!user){
          return res.status(404).json({ message: 'user not found' });
      }
      if(user.role == 'admin'){
          return res.status(403).json({ message: 'admin is not allowed'});
           // this is token when i created admin  eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3N2VhMTI3MjkxYmE4NDhkZGVkMzBkYyIsImlhdCI6MTczNjM1MjA0MH0.oV2CHimc3kcQypapE2HlpbnbMg7wNVKQlQ8s2BihpXQ
 
      }
      if(user.IsVoted){
          return res.status(400).json({ message: 'You have already voted' });
      }

      // Update the Candidate document to record the vote
      candidate.votes.push({user: userId})
      candidate.voteCount++;
      await candidate.save();

      // update the user document
      user.IsVoted = true
      await user.save();

      return res.status(200).json({ message: 'Vote recorded successfully' });
  }catch(err){
      console.log(err);
      return res.status(500).json({error: 'Internal Server Error'});
  }
});

// vote count 
router.get('/vote/count', async (req, res) => {
  try{
      // Find all candidates and sort them by voteCount in descending order
      const candidate = await Candidate.find().sort({voteCount: 'desc'});

      // Map the candidates to only return their name and voteCount
      const voteRecord = candidate.map((data)=>{
          return {
              party: data.party,
              count: data.voteCount
          }
      });

      return res.status(200).json(voteRecord);
  }catch(err){
      console.log(err);
      res.status(500).json({error: 'Internal Server Error'});
  }
});


// Get List of all candidates with only name and party fields
router.get('/', async (req, res) => {
  try {
      // Find all candidates and select only the name and party fields, excluding _id
                      // const candidates = await Candidate.find();
                     // console.log(candidates);  // this will return all data under candidate collection
      const candidates = await Candidate.find({}, 'name party -_id');

      // Return the list of candidates
      res.status(200).json(candidates);
  } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal Server Error' });
  }
});
  
module.exports=router