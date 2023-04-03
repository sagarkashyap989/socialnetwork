const express = require("express");
const router = express.Router();
const {check, validationResult} = require("express-validator");
const auth = require("../../middleware/auth");
const Post = require("../../model/Post");
const Profile = require("../../model/Profile");
const User = require("../../model/User");


// String.prototype.toObjectId = function() {
//   var ObjectId = (require('mongoose').Types.ObjectId);
//   return new ObjectId(this.toString());
// };


//@route    POST api/post
//@desc     post a text
//@access   Public 
router.post("/",[auth,
[
 check("text", "text is required")
 .not()
 .isEmpty()
]], async (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty){
        return res.status(400).json({errors: errors.array() });
    }

  try {

    const user = await User.findById(req.user.id).select("-password");
    const newPost = new Post( {
        text: req.body.text,
        name: user.name,
        avatar: user.avatar,
        user: req.user.id
    })
    const post = await newPost.save();
    res.json(post);

  } catch (error) {
    //console.log(error.message);
    res.status(500).send("server error");
  }
});



//@route    GET api/posts
//@desc     get all posts
//@access   Private
router.get("/", auth,   async(req ,res) => {
  
  try {

    const posts = await Post.find().sort({date:-1})
    res.json(posts);

  } catch (error) {
    //console.log(error.message);
    res.status(500).send("server error");
  }
 


});




//@route    GET api/post/:id
//@desc     get all posts
//@access   Private
router.get("/:id", auth,   async(req ,res) => {
  console.log(req.params.id, "************");

console.log(req.body)

  try {

    const post = await Post.findById(req.params.id);
    if(!post){
     return res.status(404).json({msg: "Post not found"});
    }
    res.json(post);

  } catch (error) {
    //console.log(error.message);
    if(error.kind === "ObjectId"){
     return  res.status(404).json({msg: "Post not found"});
    }
    res.status(500).send("server error");
  }
 


});






//@route    DELETE api/post
//@desc     delete a post 
//@access   Private 
router.delete("/:id", auth,   async(req ,res) => {
  //console.log(req.params.id);
  try {

    const post = await Post.findById(req.params.id);
    if(!post){
      res.status(404).json({msg: "Post not found"});
    }
    if(post.user.toString() !== req.user.id){
      return res.status(401).json({ msg: "user not authorized" });

    }
    post.remove();
    res.json({msg : "post removed"});
  } catch (error) {
    //console.log(error.message);
    if(error.kind === "ObjectId"){
      res.status(404).json({msg: "Post not found"});
    }
    res.status(500).send("server error");
  }
 


});

//@route    PUT api/posts/like/_id
//@desc     like a post 
//@access   Private 

router.put("/like/:id", auth, async (req, res) => {
  // console.log(req.params.id, "   &&&& ", req.params.id.toObjectId())
  console.log(req.params.id, "hellooo");
  try {
     const post = await Post.findById(req.params.id);

    if(!post){
      res.status(404).json({msg: "Post not found"});
    }
    
    if(post.likes.filter(like => like.user.toString() === req.user.id).length > 0){
      return res.status(400).json({msg:"Post already liked"});
    }

    post.likes.unshift({user: req.user.id});

    await post.save();
    res.json(post.likes);

     
  } catch (error) {
    console.log(error.message);
    if(error.kind === "ObjectId"){
     return res.status(404).json({msg: "Post not found"});
    }
    res.status(500).send("server error");
  }
}





);



//@route    PUT api/posts/unlike/_id
//@desc     unlike a post 
//@access   Private 

router.put("/unlike/:id", auth, async (req, res) => {
  try {

   const post = await Post.findById(req.params.id);
   console.log(post);
   if(!post){
    console.log("page notfound")
     res.status(404).json({msg: "Post not found"});
   }
   
   if(post.likes.filter(like => like.user.toString() === req.user.id).length === 0){
     return res.status(400).json({msg:"Post already unliked"});
   }

// get removeIndex
    const removeIndex = post.likes.map(like => like.user.toString()).indexOf(req.user.id);
    post.likes.splice(removeIndex, 1); 


   await post.save();
   res.json(post.likes);

    
 } catch (error) {
   console.log(error.message);
   if(error.kind === "ObjectId"){
     res.status(404).json({msg: "Post not found"});
   }
   res.status(500).send("server error");
 }
}





);





//@route    POST api/post/comment/:id
//@desc     comment on a post
//@access   Private
router.put("/comment/:id",[auth,
  [
   check("text", "text is required")
   .not()
   .isEmpty()
  ]], async (req, res) => {
      const errors = validationResult(req);
      console.log(req.body,'request body......')

      if(!errors.isEmpty){
          return res.status(400).json({errors: errors.array() });
      }
  
    try {
  
      const user = await User.findById(req.user.id).select("-password");
      const post = await Post.findById(req.params.id);
      console.log(user.name)
      const newComment =  {
          text: req.body.text,
          name: user.name,
          avatar: user.avatar,
          user: req.user.id
      }

      post.comments.unshift(newComment);

      await post.save();
      res.json(post.comments);
  
    } catch (error) {
      console.log(error.message);
      res.status(500).send("server error");
    }
  });
  


  
//@route    DELETE api/post/comment/:id/:comment_id
//@desc     delete a post
//@access   Private
router.delete("/comment/:id/:comment_id",auth, async (req, res) => {

  try {
    const post = await Post.findById(req.params.id);

    //find comment to be delete
    const comment = post.comments.find(comment => comment.id === req.params.comment_id);
    //console.log(comment);
    //make sure comment exist
    if(!comment){
      return res.status(404).json({msg: 'comment not found'});

    }
    //check user 
    if(comment.user.toString() !== req.user.id){
      return res.status(401).json({msg: "user not authorized"});
    }

    // get removeIndex
    const removeIndex = post.comments.map(comment => comment.id.toString()).indexOf( req.params.comment_id);
    post.comments.splice(removeIndex, 1); 
    await post.save();
    
    res.json(post.comments);

  } catch (error) {
    //console.log(error.message);
    res.status(500).send("server error");
    
  }


  });



module.exports = router;