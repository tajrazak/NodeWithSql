var orm = require('orm');
var database_models;
module.exports = {
	create:function(db,models){
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
				name:orm.enforce.unique("name already exists"),
				email: orm.enforce.unique("already email exists"),
				age: orm.enforce.ranges.number(18, undefined, "under-age")
			}
		});


		models.Mobile = db.define('Mobile', {
   			 name : String
		});

		models.Mobile.hasOne("person", models.Person,{
 		   key     : true,
 		   reverse : "owners"
		});

		db.sync(function(err) {

			if (err) 
				throw err;
			else{
				database_models = models;
				console.log('created')
			}
		})


	},
	getModels:function(){
		//console.log(database_models)
		return database_models;
	}
}