const express = require("express");
const router = express.Router();
const {check, validationResult} = require("express-validator");
const mongoose = require("mongoose");
const auth = require("../../middleware/auth");
const user = require("../../model/User");
const Profile = require("../../model/Profile");
//@route    GET api/profile/me
//@desc     Test route
//@access   private 
router.get("/me", auth, async (req, res) => {
    console.log(req.user.id);
    console.log("^^^");
    try {
        const profile = await Profile.findOne({user : req.body.id}).populate("user", 
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

router.get("/", 
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
            
            const {user, company, website, location, status, skills, bio, githubUsername , date} = req.body;
            const profileFields ={};
            profileFields.user = req.body.id;
            if(company) profileFields.company= req.body.company;
            if(website) profileFields.website= req.body.website;
            if(location) profileFields.location = req.body.location;
            if(status) profileFields.status = req.body.status;
            if(bio) profileFields.bio = req.body.bio;
            if(githubUsername) profileFields.githubUsername = req.body.githubUsername;
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


module.exports = router;