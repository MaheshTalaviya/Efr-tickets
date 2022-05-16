const express = require("express");
const router = express.Router();
var mongoose = require('mongoose'); 
const auth = require("../../config/authenticateToken");
const ObjectId = require("mongodb").ObjectID;
// Load EFRTicket model
const EFRTicket = require("../../models/EFRTicket");
const User = require("../../models/User");
const FileRecord = require("../../models/filesrecord");
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
function makeid(length) {
   var result           = '';
   var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
   var charactersLength = characters.length;
   for ( var i = 0; i < length; i++ ) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
   }
   return result;
}
//var timeStamp;
// const upload = multer({
//   //storage: nameStorage,
//   //limits:{fileSize: 1000000},
// storage: multerS3({
//     s3: s3,
//     bucket: 'htvelugwv3tpzippzdc3tcepbfbp8dkno',
//     acl: 'public-read',
//     key: function (request, file, cb) {
//       timeStamp=makeid(10);
//       cb(null, '_'+timeStamp);
//     }
//   })
// });

const nameStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/uploads');
    },
    filename: async function (req, file, cb) {
        let indexOfLastSlash = req.url.lastIndexOf("/");
        let indexofPersonal = req.url.indexOf("personalUpload");
        let name = 'v1';
        let isPersonal = req.url.substring(indexOfLastSlash+1, req.url.length);
        let fileName, extension;

        fileName = file.originalname.split(' ').join('_');

        //Remove special characters except numbers and .
        fileName = fileName.replace(/[^A-Za-z.0-9]/g, "");
        
        let indexOfExtensionString = fileName.lastIndexOf(".");
        extension = fileName.substring(indexOfExtensionString+1, fileName.length);
        fileName = fileName.substring(0, indexOfExtensionString);
       
         if (indexofPersonal !== -1) {
            if (name === 'undefined') {
               cb(null, "Personal" +"_"+fileName+"_"+Date.now()+"."+extension);
            } else {
                cb(null, "Personal" + name+"_"+"_"+fileName+"_"+Date.now()+"."+extension);
            }
            
         } else {
            if (name === 'undefined') {
                cb(null,  fileName+"_"+ Date.now()+"."+extension);
            } else {
                cb(null, name+"_"+"_"+fileName+"_"+Date.now()+"."+extension);
            }
         }        
  }
});

const upload = multer({
  storage: nameStorage,
});

router.post("/updateResponse",auth,  (req, res) => {
  const adminResponse=req.body.data.adminResponse;
  const agentResponse=req.body.data.agentResponse;
 const admin3Name=req.body.data.admin3Name
 //console.log(req.body)
  FileRecord.updateOne({ "_id": ObjectId(req.body.data.id) }, 
  {"$set": { 
    adminResponse:adminResponse,agentResponse:agentResponse,status:'ADMIN2',admin3Name:admin3Name
  }}).then(efrTicket => {
    res.json({data:efrTicket,status:true,message:"Reacord Update"});
  })
  .catch(err => {
    console.log(err)
    res.json({data:err,status:false,message:"Something Wrong!"});
  });
});

router.get("/ueserImages/",auth, async (req, res) => {
   let interviewUser = await User.findOne({_id:req.query.id}, ['userFiles']);


   return res.json({images:interviewUser.userFiles});
})

router.post("/imagesUploads/",upload.any('file',12),auth, async (req, res) => {
  // let interviewUser = await User.findOne({_id:req.query.id}, ['userFiles']);
   
   //userFiles
  // console.log('file',req.file)
  //  console.log('fileds',req.files)
console.log(req.body.email)
  let imageArr = []
  console.log(req.files)
   for (let i = 0; i<req.files.length; i++) {
     imageArr.push(req.files[i].filename)
   }
   console.log(imageArr)
   let insertDataObj={
       userFiles:imageArr,
       agentId:req.body.agentId,
       agentEmail:req.body.agent_email,
       leadEmail:req.body.email,
       threadEmail:req.body.email_thread,
       series:req.body.series,
       status:'AGENT_UPLOAD'
   }
     const newEFRTicket = new FileRecord(insertDataObj);
      newEFRTicket
        .save()
        .then(async (efrTicket) => { 
        
        })
        .catch(err => {
          console.log(err)
     
        });
      
return res.json({images:imageArr,status:true});
})

router.post("/paginateFileData",auth,paginatedResults(), (req, res) => {
 let data = res.json(res.paginatedResults);
 //console.log(data)
   
});


function paginatedResults() {
  return async (req, res, next) => {
    const page = parseInt(req.body.data.page);
    const limit = 1;
    const skipIndex = (page - 1) * limit;
    const results = {};
    let findObj={
      status:req.body.data.status
    }
    // if(req.body.data.city)
    // {
    //   findObj.city=req.body.data.city
    // }
    //  if(req.body.data.agentId)
    // {
    //   findObj.agentId=req.body.data.agentId
    // }

    try {
       let countTotal = await FileRecord.find(findObj).count() 
      results.results = await FileRecord.find(findObj)
       
        .limit(limit)
        .skip(skipIndex)
        .exec();
      results.page=page
      results.total=countTotal
      res.paginatedResults = results;
      next();
    } catch (e) {
      res
        .status(500)
        .json({ message: "Error Occured while fetching the data" });
    }
  };
}

module.exports = router;