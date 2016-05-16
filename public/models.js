var orm = require('orm');
var database_models;
module.exports = {
	create:function(db,models){
		models.Users = db.define("User", {
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


		models.Items = db.define('Item',{
			item_name:String,
			amount:Number,
			type:String
		})

		models.Users.hasMany("Item", models.Items,{
			bought  : Date
		}, {
			key     : true
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
