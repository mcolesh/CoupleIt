var mongoose = require('mongoose');
 
const membersSchema = new mongoose.Schema({
	name: 
	{
	type:String,
	required: true
	},
	sex: 
	{
	type:String,
	required: true
	}
});

const groupSchema = new mongoose.Schema({
	GroupName:
	{
	 type:String,
         required: true
	},
	GroupMembers: [membersSchema]
});

module.exports = mongoose.model('Groups',groupSchema);