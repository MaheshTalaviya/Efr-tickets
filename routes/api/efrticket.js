const express = require("express");
const router = express.Router();
var mongoose = require('mongoose'); 
const auth = require("../../config/authenticateToken");
const ObjectId = require("mongodb").ObjectID;
// Load EFRTicket model
const EFRTicket = require("../../models/EFRTicket");
const User = require("../../models/User");
var multer  =   require('multer');


const aws = require('aws-sdk');
const multerS3 = require('multer-s3');
const aws_access_key_id='FNP2DUC4DIL2ICP2T6A3';
const aws_secret_access_key='ypr9+kD3TirVYnJyneT1DB1GUMjFBbzHD9OKOPmxkoc';

const spacesEndpoint = new aws.Endpoint('sfo3.digitaloceanspaces.com');
const s3 = new aws.S3({
  accessKeyId: aws_access_key_id, 
  secretAccessKey: aws_secret_access_key,
  endpoint: spacesEndpoint
});

var timeStamp=new Date().getTime();
// @route POST api/efrticket/add
router.post("/add", auth, async (req, res) => {

      const newEFRTicket = new EFRTicket({
        email: req.body.email,
        email_thread: req.body.email_thread,
        priority_level:req.body.priority_level,
        agent:req.body.agent,
        assignedAdmin : req.body.assignedAdmin,
        status:req.body.status,
        admin_level:req.body.admin_level,
        agent_email:req.body.agent_email,
        series:req.body.series
      });
      newEFRTicket
        .save()
        .then(async (efrTicket) => { 
          const userById = await User.findById(req.body.agent);

          userById.efrticket.push(efrTicket);
          userById.save()
              .then(user =>{
                res.json({data:efrTicket,status:true,message:"EFR Ticket Created Sucessfully !"});
              })
              .catch(err => {
                console.log(err)
                res.json({data:err,status:false,message:"Something Wrong!"});
              });
        })
        .catch(err => {
          console.log(err)
          res.json({data:err,status:false,message:"Something Wrong!"});
        });

        
});




// GET EFR TICKET by priority_level AND ADMIN LEVEL
router.get("/getEFRTicketByPriorityLevel/:level/:admin_level/:adminid?",auth,  (req, res) => {
  console.log(req.params.adminid);
  let adminid = req.params.adminid;

  const priority_level = req.params.level;
  const admin_level = req.params.admin_level;
  
    if(adminid === undefined ){
      EFRTicket.find({ $and: [{ priority_level: priority_level},{status : "OPEN"},{admin_level:admin_level}] }).sort({ createdAt: 'desc'}).then(efrTicket => {
        res.json({data:efrTicket,status:true,message:"EFR Ticket Found----- !"});
      })
      .catch(err => {
        console.log(err)
        res.json({data:err,status:false,message:"Something Wrong!"});
      });
    }else{
      
        EFRTicket.find({ $and: [{ priority_level: priority_level},{status : "OPEN"},{assignedAdmin : adminid},{admin_level:admin_level}] }).sort({ createdAt: 'desc'}).then(efrTicket => {
          res.json({data:efrTicket,status:true,message:"EFR Ticket Found !"});
        })
        .catch(err => {
          console.log(err)
          res.json({data:err,status:false,message:"Something Wrong!"});
        });
    }
  

});

// GET SKIP FORVER EFR TICKET by ADMIN LEVEL
router.get("/getSkipForeverEFRTicket/:admin_level/:adminid?",auth,  (req, res) => {
  let adminid = req.params.adminid;
  const admin_level = req.params.admin_level;

  if(adminid === undefined ){
    EFRTicket.find({ $and: [{ status : "SKIPFOREVER"},{admin_level:admin_level}] }).sort({ createdAt: 'desc'}).then(efrTicket => {
      res.json({data:efrTicket,status:true,message:"EFR Ticket Found !"});
    })
    .catch(err => {
      console.log(err)
      res.json({data:err,status:false,message:"Something Wrong!"});
    });
  }else{
   
      EFRTicket.find({ $and: [{ status : "SKIPFOREVER"},{assignedAdmin : adminid},{admin_level:admin_level}] }).sort({ createdAt: 'desc'}).then(efrTicket => {
        console.log(efrTicket);
        res.json({data:efrTicket,status:true,message:"EFR Ticket Found !"});

      })
      .catch(err => {
        console.log(err)
        res.json({data:err,status:false,message:"Something Wrong!"});
      });
  
  }
});

// GET total SKIP FORVER EFR TICKET by ADMIN LEVEL
router.get("/getTotalSkipForeverEFRTicket/:admin_level/:adminid?",auth,  (req, res) => {
  let adminid = req.params.adminid;
  const admin_level = req.params.admin_level;

  if(admin_level === "ADMIN1" ){
    
      EFRTicket.count({ $and: [{ status : "SKIPFOREVER"},{assignedAdmin : adminid},{admin_level:admin_level}] }).then(efrTicket => {
        res.json({data:efrTicket,status:true,message:"EFR Ticket Found !"});
      })
      .catch(err => {
        console.log(err)
        res.json({data:err,status:false,message:"Something Wrong!"});
      });

  }else{
    EFRTicket.count({ $and: [{ status : "SKIPFOREVER"},{admin_level:admin_level}] }).then(efrTicket => {
      res.json({data:efrTicket,status:true,message:"EFR Ticket Found !"});
    })
    .catch(err => {
      console.log(err)
      res.json({data:err,status:false,message:"Something Wrong!"});
    });
   
  }
});

// GET efr ticket count by prioprity_level wise.
router.get("/getTotalIssues/:admin_level/:adminid?",auth,  (req, res) => {
  let adminid = req.params.adminid;
  const admin_level = req.params.admin_level;

  if(admin_level === "ADMIN1" ){
        
           let query = [
                {"$match":{ $and: [
                  {"admin_level":admin_level},
                  {"status" : "OPEN"},
                  {"assignedAdmin" : ObjectId(adminid)},
                ]}},
                {"$group" : {_id:"$priority_level", count:{$sum:1}}}
            ];
            EFRTicket.aggregate(query).then(efrTicket => {
              res.json({data:efrTicket,status:true,message:"EFR Ticket Found !"});
            })
            .catch(err => {
              console.log(err)
              res.json({data:err,status:false,message:"Something Wrong!"});
            });

      }else{

        EFRTicket.aggregate([
          {"$match":{ $and: [{"admin_level":admin_level},{status : "OPEN"}]}},
          {"$group" : {_id:"$priority_level", count:{$sum:1}}}
            ]).then(efrTicket => {
              res.json({data:efrTicket,status:true,message:"EFR Ticket Found !"});
            })
            .catch(err => {
              console.log(err)
              res.json({data:err,status:false,message:"Something Wrong!"});
            });
  
      }
});

//----------------------
// @route GET api/efrTicket/closeEFRTicket/:id
router.get("/closeEFRTicket/:id",auth,  (req, res) => {
  const efrTicketId = req.params.id;
   EFRTicket.updateOne({_id: efrTicketId}, 
                     {"$set": { 
                        status:"CLOSE"
                      }}).then(efrTicket => {
                        res.json({data:efrTicket,status:true,message:"EFR Ticket Closed !"});
                      })
                      .catch(err => {
                        console.log(err)
                        res.json({data:err,status:false,message:"Something Wrong!"});
                      });
});


//Get EFR Ticket
router.get("/getOneEFRTicket/:id",auth, (req, res) => {

  EFRTicket.findById(req.params.id).then(efrTicket => {
    res.json({data:efrTicket,status:true,message:"EFR Ticket Found !"});
  })
  .catch(err => {
    console.log(err)
    res.json({data:err,status:false,message:"Something Wrong!"});
  });
});








// @route POST api/efrTicket/updateEFRTicket
router.post("/updateEFRTicket",auth,  (req, res) => {
  const efrTicketId = req.body.id;
  delete req.body.id;
   EFRTicket.updateOne({_id: efrTicketId}, 
                     {"$set": req.body
                    }).then(efrTicket => {
                        res.json({data:efrTicket,status:true,message:"EFR Ticket Updated !"});
                      })
                      .catch(err => {
                        console.log(err)
                        res.json({data:err,status:false,message:"Something Wrong!"});
                      });
});


//Get EFR Ticket responses that admin approved
router.get("/getEFRTicket/:agent_id",auth, (req, res) => {
  EFRTicket.find({  $and: [{status: 'APPROVED'},{agent:req.params.agent_id}] }).then(efrTicket => {
    res.json({data:efrTicket,status:true,message:"EFR Ticket Found !"});
  })
  .catch(err => {
    console.log(err)
    res.json({data:err,status:false,message:"Something Wrong!"});
  });
});

module.exports = router;