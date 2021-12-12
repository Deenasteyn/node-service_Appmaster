const Sequelize = require('sequelize');
var sequelize=require('./connection');

var user=sequelize.define('user',{
    username:{
      type: Sequelize.STRING,
      primaryKey:true
    },
    password:{
      type: Sequelize.TEXT,
      allowNull:false
    },
    name:{
      type: Sequelize.TEXT,
      allowNull:false
    },
    role:{
      type: Sequelize.TEXT,
      allowNull:false
    },
    email:{
      type: Sequelize.TEXT,
      allowNull:false
    }
},{
      //don't add the timestamp attributes (updatedAt, createdAt)
  timestamps: false,

  // If don't want createdAt
  createdAt: false,

  // If don't want updatedAt
  updatedAt: false
}

  );

var employee=sequelize.define('employee',{
  employee_id:{
    type: Sequelize.INTEGER,
    primaryKey:true,
    autoIncrement:true
  },
  name:{
    type:Sequelize.STRING,
    allowNull:false,
  },
  status:{
    type:Sequelize.STRING,
    allowNull:false,
  },
  manager:{
    type:Sequelize.STRING,
    allowNull:true,
  },
  wfm_manager:{
    type:Sequelize.STRING,
    allowNull:true,
  },
  email:{
    type:Sequelize.STRING,
    allowNull:true,
  },
  lockstatus:{
    type:Sequelize.STRING,
    allowNull:true,
  },
  experience:{
    type:Sequelize.DECIMAL(5,0),
    allowNull:true,
  },
  profile_id:{
    type:Sequelize.INTEGER,
    allowNull:true
  }

},{
  //don't add the timestamp attributes (updatedAt, createdAt)
timestamps: false,

// If don't want createdAt
createdAt: false,

// If don't want updatedAt
updatedAt: false
});
employee.sync({force: false}).then(() => {
    
  console.log("employee  tables Synched!!!");
});

var skills=sequelize.define('skills',{
  skillid:{
    type:Sequelize.INTEGER,
    allowNull:false,
    primaryKey:true,   
  },
  name:{
    type:Sequelize.DECIMAL(5,0),
    allowNull:false,
  },
},{
  //don't add the timestamp attributes (updatedAt, createdAt)
timestamps: false,

// If don't want createdAt
createdAt: false,

// If don't want updatedAt
updatedAt: false});

skills.sync({force: false}).then(() => {
    
  console.log("skills  tables Synched!!!");
});

var softlock=sequelize.define('softlocks',{
  employee_id	:{type:Sequelize.INTEGER,allowNull:true},
  manager	:{type:Sequelize.STRING,allowNull:true},
  reqdate	:{type:Sequelize.DATE,allowNull:true,defaultValue:Sequelize.NOW},
  status	:{type:Sequelize.STRING,allowNull:true,defaultValue:'waiting'},
  lastupdated	:{type:Sequelize.DATE,allowNull:true},
  lockid	:{type:Sequelize.INTEGER,allowNull:false,primaryKey:true,autoIncrement:true},
  requestmessage	:{type:Sequelize.TEXT,allowNull:true},
  wfmremark	:{type:Sequelize.TEXT,allowNull:true},
  managerstatus	:{type:Sequelize.STRING,allowNull:true,defaultValue:'awaiting_approval'},
  mgrstatuscomment	:{type:Sequelize.TEXT,allowNull:true},
  mgrlastupdate	:{type:Sequelize.DATE,allowNull:true,defaultValue:Sequelize.NOW} 

},{
  //don't add the timestamp attributes (updatedAt, createdAt)
timestamps: false,

// If don't want createdAt
createdAt: false,

// If don't want updatedAt
updatedAt: false});

softlock.belongsTo(employee,{foreignKey: 'employee_id'});


softlock.sync({force: false}).then(() => {
    
  console.log("softlock  tables Synched!!!");
});

//skillmap model
var skillmap=sequelize.define('skillmap',null,{
 //don't add the timestamp attributes (updatedAt, createdAt)
 timestamps: false,

 // If don't want createdAt
createdAt: false,

updatedAt: false
}
  ); 
  //skillmap table have 2 foreign keys -> skillid and employee_id
skillmap.belongsTo(skills,{foreignKey: 'skillid'});
skillmap.belongsTo(employee,{foreignKey: 'employee_id'});

//As there is no primary key in skillmaps table -> sequelize adds id as primary key by defaultValue-> so removing id from skillmaps table
skillmap.removeAttribute('id'); 

skillmap.sync({force: false}).then(() => {
    
  console.log("softlock  tables Synched!!!");
});



module.exports={user:user,employee:employee,skills:skills,softlock:softlock,skillmap:skillmap};