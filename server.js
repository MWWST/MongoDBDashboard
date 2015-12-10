var express = require("express");
// Create an Express App
var app = express();

var path = require("path");
// Require body-parser (to recieve post data from clients)
var bodyParser = require("body-parser");

var mongoose = require('mongoose');

// Integrate body-parser with our App
app.use(bodyParser.urlencoded());
// Setting our Static Folder Directory
app.use(express.static(__dirname + "./static"));
// Setting our Views Folder Directory
app.set('views', path.join(__dirname, './views'));
// Setting our View Engine set to EJS
app.set('view engine', 'ejs');
// Routes
// Root Request
app.get('/', function(req, res) {
    // This is where we will retrieve the users from the database and include them in the view page we will be rendering.

    Job.find({})
    .populate('comments')
    .exec(function(err,jobs){
    	if(jobs){
    		res.render('index',{alljobs:jobs});

    	}

   		else if(err){
   			res.render('index',{alljobs:err});
   		}

   		else {
   			res.render('index',{alljobs:'no jobs saved yet'})
   		}
    })
     
})

app.get('/jobs/new',function(req,res){

	res.render('new_job');

})

app.get('/jobs/:id', function(req, res) {
    // This is where we will retrieve the users from the database and include them in the view page we will be rendering.

    Job.find({_id:req.params.id},function(err,jobinfo){
    	if(jobinfo){
    		res.render('job_details',{thejob:jobinfo});

    	}

   		else if(err){
   			res.render('job_details',{thejob:err});
   		}

   		else {
   			res.render('job_details',{thejob:'no jobs saved yet'})
   		}
    })
    
    
})



app.post('/jobs',function(req,res){
	console.log("POST DATA",req.body);

	var job = new Job({title:req.body.title,
		rate:req.body.rate,type:req.body.type,start:req.body.start,due:req.body.due,poster:req.body.poster,description:req.body.description});

	job.save(function(err){
		if(err){
			console.log('something went wrong',err);
		}
		else {
			console.log('successfully added the user');
			res.redirect('/')
		}
	})
	
})

app.get('/jobs/:id/edit',function(req,res){

	Job.find({_id:req.params.id},function(err,jobinfo){
    	if(jobinfo){

    		var startDate= new Date(jobinfo[0].start)
    	

    		
    		var startDateObj = new Date(jobinfo[0].start);
			var startMonth = startDateObj.getUTCMonth(); //months from 1-12
			console.log(startMonth);
			var startDay = startDateObj.getDate();
			
			

			console.log(startDay)
			startDayLen=startDay;
			// console.log(startDay==4);


			var startYear = startDateObj.getUTCFullYear();
			// var hours = startDateObj.getUTCHours();
			// var minutes = startDateObj.getUTCMinutes();
			// var seconds = startDateObj.getUTCSeconds();

			if (startDay<=9){
			        
			var formattedStartDate = startYear + "-" + startMonth + "-" + '0' + startDay;

			}

			else {

				var formattedStartDate = startYear + "-" + startMonth + "-"  + startDay;

			}

			var endDateObj = new Date(jobinfo[0].due);
			var endMonth = endDateObj.getUTCMonth(); //months from 1-12
		
			var endDay = endDateObj.getUTCDate();
			var endYear = endDateObj.getUTCFullYear();


			if (endDay <=9){

			var formattedEndDate = endYear + "-" + endMonth + "-" + '0'+ endDay;
			
			}
			else {
				var formattedEndDate = endYear + "-" + endMonth + "-" + endDay;

			}
			dateObject={
				start: formattedStartDate,
				due: formattedEndDate
			}
    			
    

    		res.render('edit_job',{thejob:jobinfo,dateInfo:dateObject});

    	}

   		else if(err){
   			res.render('edit_job',{thejob:err});
   		}

   		else {
   			res.render('edit_job',{thejob:'no jobs saved yet'})
   		}
    })
})

app.post('/jobs/:id',function(req,res){
	// console.log(req.body);
	console.log(req.body);
	var conditions = {_id: req.params.id},
	update ={title:req.body.title,type:req.body.type,description:req.body.description,rate:req.body.rate,start:req.body.start,due:req.body.due,poster:req.body.poster}
	, options = {};

	Job.update(conditions,update,options,function(err,numAffected){
		if (err){
			console.log("no update",err);
		}
		else {
			console.log(numAffected);
			res.redirect('/');
		}


	})


})

app.post('/jobs/:id/destroy',function(req,res){

	Job.remove({_id:req.body.id},function(err){
    	if(err){

    		res.send(err);

    	}

   		else {
   			res.redirect('/');
   		}
    })

})

app.listen(8009, function() {
    console.log("listening on port 8009");
})





mongoose.connect('mongodb://localhost/dashboard20161');




var JobSchema = new mongoose.Schema({
	title: String,
	rate: Number,
	type: String,
	start: {type: Date},
	due: {type: Date},
	poster: String,
	description: String,
	created_at: {type: Date, default: Date.now},
	updated_at: {type: Date}
})

mongoose.model('Job',JobSchema) // set the schema in our models as User
var Job = mongoose.model('Job');