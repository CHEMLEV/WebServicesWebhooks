
const express = require("express");
const router = express.Router();
const User = require('../models/user.js');
const Song = require('../models/song.js');
router.use(express.json());
const jwt = require('jsonwebtoken');
const secretKey = require('../config.js');
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;

router.post('/signup', async (req, res) => {
  try {
    const { email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const user = new User({ email, password });
    await user.save();

    const token = jwt.sign({ userId: user._id }, secretKey);

    res.cookie('token', token, { httpOnly: true });

    res.status(201).json({ user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


router.post('/login', async (req, res) => {

  const provided_email = req.body.email;
  const provided_password = req.body.password;
   
  const user = await User.findOne({email: provided_email});
      
  if (!user) {
    return res.status(401).json({ message: 'Invalid email or password.' });
  }
    
  if (user.password != provided_password) {
    return res.status(401).json({ message: 'Invalid email or password.' });
  }
  
  const token = jwt.sign({userId: user._id}, secretKey, {expiresIn: '1h'});

  res.cookie('token', token, { httpOnly: true });
  res.json({ message: 'Login successful ' + token });   
});


const auth = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1] || req.query.token;
  if (!token) return res.status(401).json({ message: 'Authorization required' });
  
  jwt.verify(token, secretKey, (err, decoded) => {
    if (err) return res.status(401).json({ message: 'Invalid token' });
    req.user = decoded;
    next();
  });
};


router.get('/users/getAll', auth, async (req, res) => {
  try {   
  const users = await User.find();   
  res.json(users);
  }
  catch (err) { 
  res.status(500).json({error: err.message});
              }
  });

router.get('/users/getManyByID', auth, async (req, res) => {
  try {
  const request_ids_array = req.query._ids.split(',');
  const int_ids_array = request_ids_array.map(_id => parseInt(_id));
  const users = await User.find({_id: { $in: int_ids_array}});
  res.send(users);
  }
  catch (err) {
    res.status(500).json({error: err.message});
              }
  });


router.get('/users/getOneByName', auth, async (req, res) => {
  const requested_name = req.query.name;
  try {
      const user = await User.findOne({name: requested_name});
      if (user) {
      res.json(user);
      }
      else {
      res.send("Error: User not found");
      }
      }
  catch (error) {
          console.error(error);
          res.status(500).json({ message: 'Internal server error' });
                }
  });

router.put('/users/updateOneByID', auth, async (req, res) => {
  const requested_id = new ObjectId(req.query._id);
    try {
      const data_for_update = req.body;
      const user = await User.findOne({_id: requested_id});
      if (!user) {
        throw new Error(`User with ID '${requested_id}' not found.`);
      }
      if (data_for_update.email !== undefined) {
        user.email = data_for_update.email;
      }
      if (data_for_update.password !== undefined) {
        user.password = data_for_update.password;
      }
      
      await user.save();
  
      res.send(`User with ID '${requested_id}' updated successfully.`);
      console.log(user.email);
    } catch (error) {
      res.status(500).send(`Error updating user: ${error.message}`);
    }
  });

router.delete('/users/deleteOneByID', auth, async (req, res) => {
  const requested_id = parseInt(req.query.id);
  
  try {
  await User.findOneAndDelete({id: requested_id});
  res.send(`User with ID ${requested_id} has been deleted.`);
} catch (err) {
  console.error(err);
  res.status(500).send(`Error deleting user with ID ${requested_id}.`);
}
});

router.get('/about', (req, res) => {
  res.send('This is the about page');
});


module.exports = router;
