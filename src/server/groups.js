const express = require('express');
const router = express.Router();

const Group = require('./group');

// Getting All
router.get('/', async (req, res) => {
   const groups = await Group.find();
   console.log(groups);
   res.json(groups);
})

 // Creating one
 router.post('/', async (req, res) => {
   const group = new Group({
      GroupName: req.body.GroupName,
      GroupMembers: req.body.GroupMembers
   })
   try 
   {
      const newGroup = await group.save()
      res.status(201).json(newGroup)
   }
   catch(error) 
   {
      console.log(error);
      res.status(400).json({ message: error.message})
   }
   console.log(req.body);
 })

 // Getting One
router.get('/:groupName', getGroup, async (req, res) => {
   res.send(res.group);
})

  // Updating one
  router.patch('/:groupName', getGroup, async (req, res) => {
   console.log(JSON.stringify(request.body));
})

  // Deleting one
  router.delete('/:groupName', getGroup, async (req, res) => {
   try
   {
      console.log("Deleting group: "+ res.group)
      var deletedGroup = res.group.GroupName
      await res.group.remove()
      console.log("Group "+ deletedGroup +" was deleted successfully")
      res.json({ message: "Group "+ deletedGroup +" was deleted successfully" })
   }
   catch (error)
   {
    
      res.status(500).json({ message: error.message })
   }

})

async function getGroup(req,res,next)
{
  let group
  try 
  {
     group = await Group.find({"GroupName": req.params.groupName})
     if (group == null)
     {
       return res.status(404).json({ message: 'Cannot find group'})
     }
  }
  catch (error)
  {
     console.log(error);
     res.status(500).json({ message: error.message })
  }

  res.group = group[0]
  next()
}

 //export this router to use in our index.js
module.exports = router;
