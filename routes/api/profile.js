const express = require("express");
const router = express.Router();
const {check, validationResult} = require("express-validator");

const config = require("config");
const request = require("request");
const mongoose = require("mongoose");
const auth = require("../../middleware/auth");
const User = require("../../model/User");
const Profile = require("../../model/Profile");
const { findOneAndRemove } = require("../../model/User");
const { compareSync } = require("bcryptjs");
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

//@route    DELETE api/profile/delete
//@desc     delete a user and profile
//@access   private

router.delete("/", auth, async (req, res)=>{
  try {
    await User.findOneAndRemove({_id : req.user.id});
    await Profile.findOneAndDelete({user : req.user.id});
    res.json({msg: "User deleted"}); 

  } catch (error) {
    console.log(error.message);
    res.status(500).send("server error");  
  }

})

//@route    PUT api/profile/experience
//@desc     add experience to the Profile model
//@access   private

router.put("/experience", [ auth , [
                            check("title", "Title is requied")
                                .not()
                                .isEmpty(),
                            check("company", "Company is required")
                                .not()
                                .isEmpty(),
                            check("from", "From date is required")
                                .not()
                                .isEmpty(),
                          ]], 
            async (req, res)=>{
                const errors = validationResult(req);
                if(!errors.isEmpty()){
                    return res.status(400).json({errors : errors.array});
                }
              const {
                title,
                company,
                location, 
                from,
                to,
                current,
                description
              }  = req.body;

              const newExp = {
                title,
                company,
                location,
                from, 
                to, 
                current,
                description
              };

              try {
                const profile = await Profile.findOne({user: req.user.id});
                profile.experience.unshift(newExp);
                await profile.save();
                res.json(profile);
              } catch (error) {
                console.log(error.message);
                res.status(500).send("server error");  
              }

})

//@route    Delete api/profile/experience
//@desc     delete experince route
//@access   private
router.delete("/experience/:exp_id", auth, async (req, res)=>{

    try {
        const profile = await Profile.findOne({user : req.user.id});
        const removeIndex = profile.experience.map(item =>  item._id.valueOf()).indexOf(req.params.exp_id);
            console.log(removeIndex);
        profile.experience.splice(removeIndex,1);
        await profile.save(); 
        res.json(profile);
    } catch (error) {
        console.log(error.message);
        res.status(500).send("server error");
    }

});




//@route    UPDATE api/profile/experience/:exp_id
//@desc     update experince route
//@access   private
router.put("/experience/:exp_id", auth, async (req, res)=>{

    try {
        
        const profile = await Profile.findOne({user : req.user.id});
        const updateIndex = profile.experience
            .map(item => item._id.valueOf())
            .indexOf(req.params.exp_id);
        console.log(updateIndex);
        const {title, company, location, from, to, current, description} = req.body;
        if(title) profile.experience[updateIndex].title = title;
        if(company) profile.experience[updateIndex].company =  company;
        if(location) profile.experience[updateIndex].location = location;
        if(from) profile.experience[updateIndex].from = from;
        if(to) profile.experience[updateIndex].to = to;
        if(current) profile.experience[updateIndex].current = current;
        if(description) profile.experience[updateIndex].description  = description;
        
        console.log(profile);
        

        profile.save();
        res.json(profile);

    } catch (error) {
        console.log(error.message);
        res.status(500).send("servere error");
    }

});




//@route    PUT api/profile/education
//@desc     add education to the Profile model
//@access   private

router.put("/education", [ auth , [
    check("school", "school is requied")
        .not()
        .isEmpty(),
    check("degree", "dergee is required")
        .not()
        .isEmpty(),
    check("from", "From date is required")
        .not()
        .isEmpty(),
    check("fieldOfStudy", "field of study  is required")
        .not()
        .isEmpty(),
  ]], 
async (req, res)=>{
    const errors = validationResult(req);
    if(!errors.isEmpty()){
      return res.status(400).json({errors : errors.array});
    }
    const {
        school,
        degree,
        fieldOfStudy, 
        from,
        to,
        current,
        description
    }  = req.body;

    const newEdu = {
        school,
        degree,
        fieldOfStudy, 
        from, 
        to, 
        current,
        description
    };

    try {
        const profile = await Profile.findOne({user: req.user.id});
        profile.education.unshift(newEdu);
        await profile.save();
        res.json(profile);
    } catch (error) {
        console.log(error.message);
        res.status(500).send("server error");  
    }

})

//@route    Delete api/profile/education
//@desc     delete education route
//@access   private
router.delete("/education/:edu_id", auth, async (req, res)=>{

try {
    const profile = await Profile.findOne({user : req.user.id});
    const removeIndex = profile.education
   .map(item => item._id.valueOf())
    .indexOf(req.params.exp_id);
    profile.education.splice(removeIndex,1);
    await profile.save();
    res.json(profile);
} catch (error) {
    console.log(error.message);
    res.status(500).send("server error");
}

});




//@route    GET api/profile/github/:username
//@desc     get user repos form github
//@access   public
router.get("/github/:username", (req, res)=>{
    try {
        const options = {
            uri: `https://api.github.com/users/${req.params.username}/repos?per_page=5&sort=created:asc&client_id=${config.get("githubClientId")}&client_secret=${config.get("githubSecret")}`,
            method: "GET",
            headers: {"user-agent": "node.js"} 
        };

        request(options, (error, response, body) =>{
            if(error) console.log(error);
    if(response.statusCode !== 200){
        res.status(404).json({msg:"no github profile found"});
    }
    res.json(JSON.parse(body));
        })
    } catch (error) {
        console.log(error.message);
        res.status(500).json({msg: "Server Error"});
    }
})





module.exports = router;