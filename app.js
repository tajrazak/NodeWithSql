var express = require('express');
var bodyParser =  require("body-parser");
var http = require('http');
var orm = require('orm');

var global_models;

var app = express();

app.use(bodyParser.json());

var server = http.createServer(app);

app.get('/',function(req,res){
	res.sendFile('public/demo.html',{ root : __dirname});
})


app.post('/insertData',function(req,res){
	console.log(req.body);

	global_models.Person.exists({name:req.body.name},function(err,exists){
		if(exists)
		{
			res.send({success:false,message:'user already exists'});
		}else{
			global_models.Person.create({name: req.body.name, age: req.body.age, gender:req.body.gender }, function(err) {
				if(err){
					res.send({success:false,message:err.msg});
				}else{
					res.send({success:true});
				}
			});
		}
		
	})
})


app.get('/getUsers',function(req,res){
	console.log(req);
	global_models.Person.find({},function(err,people){
		if(err)
		{
			res.send({success:false});
		}else
		{
			res.send({success:true,people:people});
		}
		
	})
	
})



app.use(orm.express("mysql://root:p@ssword@127.0.0.1/node_mysql",{
	define:function(db,models){
		models.Person = db.define("person", {
			name      : String,
			age       : Number, // FLOAT 
			gender    : Boolean,
			email 	  : String
			// continent : [ "Europe", "America", "Asia", "Africa", "Australia", "Antartica" ], // ENUM type 
			// photo     : Buffer, // BLOB/BINARY 
			// data      : Object // JSON encoded 
		}, {
			methods: {
				fullName: function () {
					return this.name + ' ' + this.surname;
				}
			},
			validations: {
				age: orm.enforce.ranges.number(18, undefined, "under-age")
			}
		});

		db.sync(function(err) {

			if (err) 
				throw err;
			else{
				global_models = models;
				console.log('database created');
			}
		})


	}

}))



server.listen(3001,function(){
	console.log('listening 3001');
})
