var express=require("express")
var route = express.Router();
var model = require('../orm/model')
const jwt=require("jsonwebtoken");
var sequelize=require('../orm/connection');
const { status } = require("express/lib/response");


route.post("/updateApprovalStatus",async function(request,response){
  const employee_id=request.body.employee_id
  const status=request.body.status==='Approve'?'approved':'rejected'
  const lockstatus=request.body.status==='Approve'?'locked':'rejected'
  try{
    let softlock=await model.softlock.findOne({where:{employee_id:employee_id}})   
    softlock.status =status
     await softlock.save();

     let employee=await model.employee.findOne({where:{employee_id:employee_id}})   
     employee.lockstatus =lockstatus
    await employee.save();
    response.json({status:200})
    }catch(e)
{
 console.log(e)
      response.status(500)
}

})

route.post("/updateLockStatus",async function(request,response){
    const employee_id=request.body.employee_id
    const reqmessage=request.body.reqmessage
   console.log(request.body.employee_id)
    try{
      let employee=await model.employee.findOne({where:{employee_id:employee_id}})
      console.log(employee.name); 
       employee.lockstatus ='request_waiting';
       await employee.save();
       await model.softlock.create({ employee_id:employee_id, manager: "rohit",requestmessage:reqmessage })
       response.json({status:200})
      }catch(e)
{
   console.log(e)
        response.status(500)
}

})

route.post("/signin",async function(request,response){
   const {username,password}=request.body 
try{
  const user = await model.user.findOne({where:{username:username}})
  let result = user.dataValues
  
  if(result.password===password) 
     {
        response.json(
           {
              username: username,
              usertype: result.role,
              token: jwt.sign({username:username,password:password},"node-app-22")
           }
        )
     }
     else
          response.status(401).send("Username or Password incorrect")
}
catch(e)
{
  console.log(e)
       response.status(500)
}

})

route.post("/employeedata",async function(request,response){

   const manager=request.body.manager 
   
   try{
   
  console.log(request.body);
   
  console.log('--------');
   
  const employees = await model.skillmap.findAll({
   
    group: ['employee_id'],
   
       attributes: ['employee_id'],
   
    include: [{
   
   model: model.employee,
   
   attributes: ['name', 'experience', 'manager'],
   
   required: true,
   
   where: { manager: manager,lockstatus:'not_requested' }
   
    }
   
   , {
   
   model: model.skills,
   
   attributes: [[sequelize.fn('GROUP_CONCAT', sequelize.col('skill.name')), 'skills']],
   
   require: true
   
    }
   
    ]
   
  })
   
   
   
   //  console.log('employees:',employees);
   
  let employeeList = [];
   
  employees.map(employee => {
   
    let manager = {
   
   EmployeeId: employee.dataValues.employee_id,
   
   Name: employee.dataValues.employee.name,
   
   Skills: employee.dataValues.skill.dataValues.skills,
   
   Experience: employee.dataValues.employee.experience,
   
   Manager: employee.dataValues.employee.manager
   
    }
   
    employeeList.push(manager)
   
  });
   
   //console.log('managers:',employeeList);
   
  if (employeeList.length > 0) {
   
    response.json(employeeList)
   
  }
   
  else
   
  response.status(500)
   
  }
   
  catch (e) {
   
    console.log(e)
   
    response.status(500)
   
  }
   
   
   
   })

   route.post("/employeeRequestData",async function(request,response){
           
   try{
        const wfm_manager=request.body.wfm_manager 
         const employees = await model.softlock.findAll({
         
         group: ['employee_id'],
            
         attributes: ['employee_id','status','requestmessage','reqdate'],
         where:{status:'waiting'}
         ,
         include: [{
            
         model: model.employee,
            
         attributes: [ 'manager','wfm_manager'],
            
         required: true,
            
         where: { wfm_manager: wfm_manager,lockstatus:'request_waiting' }
            }     
         ]
            
         })
            
        //  console.log('employees:',employees);
         
        let employeeList = [];
         
        employees.map(employee => {
         
          let manager = {
         
            EmployeeId: employee.dataValues.employee_id,

            Manager: employee.dataValues.employee.manager,

            wfm_manager: employee.dataValues.employee.wfm_manager,

            ReqDate:employee.dataValues.reqdate,

            ReqMessage:employee.dataValues.requestmessage
         
          }
         
          employeeList.push(manager)
         
        });
         
         console.log('managers:',employeeList);
         
        if (employeeList.length > 0) {
         
          response.json(employeeList)
         
        }         
        else    
        {
        response.status(500)
        }
   
  }
   
  catch (e) {
   
    console.log(e)
   
    response.status(500)
   
  }

   })


module.exports=  route