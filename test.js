// Requiring module
const mongoose = require('mongoose');

// Connecting to database
mongoose.connect('mongodb://localhost:27017/GFG',
	{
		useNewUrlParser: true,
	});

// Creating Schemas
const bookSchema = new mongoose.Schema({
	title: String,
	model_nos: String
})

const authorSchema = new mongoose.Schema({
	author: String,
	postedBy: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "Book"
	}
})

// Creating models from userSchema and postSchema
const Author = mongoose.model('Author', authorSchema);
const Book = mongoose.model('Book', bookSchema);

sagarkashyap
// Query to find and show all the posts
Book.find()
	.then(p => console.log(p))
	.catch(error => console.log(error));
