var express = require('express');
var bodyParser =  require("body-parser");
var http = require('http');
var orm = require('orm');

var defined_models = require('./public/models.js');

var database_models;

var app = express();
app.use(bodyParser.json());
var server = http.createServer(app);

app.use(orm.express("mysql://root:p@ssword@127.0.0.1/node_mysql",{
	define :defined_models.create
})
)

app.get('*',function(req,res,next){
	database_models = defined_models.getModels();
	next();
})


app.get('/',function(req,res){
	res.sendFile('public/demo.html',{ root : __dirname});
})


app.post('/insertData',function(req,res){
	console.log(req.body);

	database_models.Users.create({name: req.body.name, age: req.body.age,email:req.body.email, gender:req.body.gender }, function(err) {
		if(err){
			res.send({success:false,message:err.msg});
		}else{

			database_models.Users.find({name:req.body.name},function(err,person){
				database_models.Items.create({item_name:req.body.amount,person_id:person[0].id,type:null},function(err){
					//console.log(person[0].id)
					if(err)
					res.send({success:true,message:err.msg});
					else
					res.send({success:true});
				})
			})
		}
	});
})


app.get('/getUsers',function(req,res){
	console.log(req);
	global_models.Users.find({},function(err,people){
		if(err)
		{
			res.send({success:false});
		}else
		{
			res.send({success:true,people:people});
		}

	})

})




server.listen(3001,function(){
	console.log('listening 3001');
})
