const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const keys = require("../../config/keys");
const auth = require("../../config/authenticateToken");
// Load input validation
const validateRegisterInput = require("../../validation/register");
const validateLoginInput = require("../../validation/login");
// Load User model
const User = require("../../models/User");

// @route POST api/users/register
// @desc Register user
// @access Public
router.post("/register", (req, res) => {
User.findOne({ email: req.body.email }).then(user => {
    if (user) {
      return res.status(400).json({ email: "Email already exists" });
    } else {
      const newUser = new User({
        email: req.body.email,
        name: req.body.name,
        password: req.body.password,
        user_type:req.body.user_type
      });
// Hash password before saving in database
      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          if (err) throw err;
          newUser.password = hash;
          newUser
            .save()
            .then(user => res.json({data:user,status:true,message:"Registration completed successfully !"}))
            .catch(err => {
              console.log(err)
              res.json({data:err,status:false,message:"Something Wrong!"});
            });
        });
      });
    }
  });
});

// @route POST api/users/login
// @desc Login user and return JWT token
// @access Public
router.post("/login", (req, res) => {
const email = req.body.email;
  const password = req.body.password;
// Find user by email
  User.findOne({ email }).then(user => {
    // Check if user exists
    if (!user) {
      return res.status(404).json({ message: "Email not found" });
    }
// Check password
    bcrypt.compare(password, user.password).then(isMatch => {
      if (isMatch) {
        // User matched
        // Create JWT Payload
        const payload = {
          id: user.id,
          name: user.name
        };
// Sign token
        jwt.sign(
          payload,
          keys.secretOrKey,
          {
            expiresIn: 31556926 // 1 year in seconds
          },
          (err, token) => {
            res.json({
              success: true,
              token: "Bearer " + token,
              user:user
            });
          }
        );
      } else {
        return res
          .status(400)
          .json({ message: "Password incorrect" });
      }
    });
  });
});


// @route GET api/users/updateUser/:id
router.post("/updateUser",auth,  (req, res) => {
  
  const userID = req.body.id;
  delete req.body.id;
  
   User.updateOne({_id: userID}, 
                        {"$set": req.body
                      }).then(user => {
                        res.json({data:user,status:true,message:"User Updated !"});
                      })
                      .catch(err => {
                        console.log(err)
                        res.json({data:err,status:false,message:"Something Wrong!"});
                      });
});

//Get All user list
router.get("/getAllUsers",auth, (req, res) => {
  User.find({}).then(users => {
    res.json({data:users,status:true,message:"User List Found !"});
  })
  .catch(err => {
    console.log(err)
    res.json({data:err,status:false,message:"Something Wrong!"});
  });
});


module.exports = router;