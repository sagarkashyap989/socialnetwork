const express = require("express");
const router = express.Router();
const {check, validationResult} = require("express-validator");
const mongoose = require("mongoose");
const auth = require("../../middleware/auth");
const User = require("../../model/User");
const Profile = require("../../model/Profile");
//@route    GET api/profile/me
//@desc     Test route
//@access   private 
router.get("/me", auth, async (req, res) => {
    console.log(req.user.id);
    console.log("^^^");
    try {
        const profile = await Profile.findOne({user : req.user.id}).populate("user", 
        ["name", "avatar"]);
        if(!profile){
            return res.status(400).json({msg: "there is no such  user exist"});
        }
        res.json(profile);
    } catch (error) {
        console.log(error);
        res.status(500).json({msg: "server error"});
    }
});


//@route    POST api/profile
//@desc     to create a user profile and update
//@access   private

router.post("/", 
    [
     auth,
     [
        check("status", "status is required")
        .not()
        .isEmpty(),
        check("skills", "skills is required")
        .not()
        .isEmpty()

     ]
    ], async (req, res) => {
        
             const errors = validationResult(req);
            if(!errors.isEmpty()){
                return res.status(400).json({ errors: errors.array()});
            }
            console.log(req.body);
            
            const { company, website, location, status, skills, bio, githubUsername , date} = req.body;
            const profileFields ={};
            profileFields.user = req.user.id;
            if(company) profileFields.company= company;
            if(website) profileFields.website= website;
            if(location) profileFields.location = location;
            if(status) profileFields.status = status;
            if(bio) profileFields.bio = bio;
            if(githubUsername) profileFields.githubUsername = githubUsername;
            if(skills) profileFields.skills= skills.split(",").map(skill => skill.trim());


            try {
                let profile = await Profile.findOne({user: req.body.user});
                if(profile){
                    //update
                    profile = await Profile.findOneAndUpdate(
                        { user: req.user.id},
                        { $set: profileFields },
                        { new: true}
                    );
                    return res.json(profile);
                }                
                profile = new Profile(profileFields);

                await profile.save();
                res.json(profile);
            } catch (error) {

                console.log(error);
                res.status(500).send("server error");
            }


        }
)

//@route    GET api/profile
//@desc     get all profiles
//@access   public 

router.get("/", async(req, res)=> {
    try {
        const profiles = await Profile.find().populate("user", ["name", "avatar"]);
        res.json(profiles);
    } catch (error) {
        console.log(error.message);
        res.status(500).send("server error");
    }
});



//@route    GET api/profile
//@desc     get all profiles
//@access   public 

router.get("/:user_id", async(req, res)=>{
    try {
        const profile = await Profile.findOne({user: req.params.user_id}).populate("user",["name", "avatar"] );
        if(!profile){
           return res.status(400).json("user not found");
        }
        res.json(profile)
    } catch (error) {
        console.log(error.message);
        if(error.kind == 'ObjectId'){
            return res.status(400).json("user not found");

        }
        res.status(500).send("sever error");
    }

})
module.exports = router;