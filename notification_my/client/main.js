	////Routing configurations////
Router.configure({
	layoutTemplate: 'Mainlayout'
});

Router.route('/',{ 
	name:'website_list',
	path:'/',
	action:function () {
  	this.render('navbar',{to:"navbar"});
  	this.render('website_form',{to:"main1"});
  	this.render('website_list',{to:"main2"});
  }
  
});
Router.route('/Website:_id',{
	name:'website_item',
	path:'/Website:_id',
	action:function () {
	  	this.render('navbar',{to:"navbar"});
	  	this.render('website_item',
	  				{to:"main1",
	  				data:function(){
	  					Session.set("userid",this.params._id.substr(1));
	  					console.log(Session.get("userid"));
	  					return Websites.findOne({_id:this.params._id.substr(1)});
	  				}});
	  	this.render('comment',{to:"main2"});
  	}
});

	////Accounts-ui package configurations////
Accounts.ui.config({
		passwordSignupFields: "USERNAME_AND_EMAIL"
	});


	////Subscribe Module////

  Meteor.subscribe('like');
  Meteor.subscribe('user-like');
  Meteor.subscribe('subscribe');
  Meteor.subscribe('Websites');
  Meteor.subscribe('users');
  Meteor.subscribe('notifications')

						
						////Template helpers////

	////Website-form helpers////
Template.website_form.helpers({
	createUser:function(){
		var user_id=Meteor.user()._id;
		var Username=Meteor.user().username;
		if(!Like.findOne({username:Username})){
			Like.insert({
							id:user_id,
							username:Username,
							like:[]
						});
		}
	}
});

	////Website-list helpers////
Template.website_list.helpers({
		websites:function(){
			return Websites.find({},{sort:{upvote:-1}});
		},
		users:function(){
			return Meteor.users.find().fetch();
		},
		test:function(){
			var id=Meteor.user()._id;
			if(Subscribe.findOne({id:id}))
			{	
				return Like.find({"id": {"$in":Subscribe.findOne({id:id}).subscribe}}).fetch();
			}
		}
		
	});

	////Comment helpers////	
	
Template.comment.helpers({
		array:function(){
			var id=Session.get("userid");
			if(Websites.findOne({_id:id}).array)
			{
				var arr=Websites.findOne({_id:id}).array;
				console.log(arr);	
				//console.log(Meteor.users.findOne({_id:user}));
				//console.log(Meteor.user().username);
				if(arr)
				{
					return true;
				}
				else
				{
					return false;
				}
			}
			else
			{
				return false;
			}

		}
});	

Template.array_list.helpers({
		array_item:function(){
			return Websites.findOne(
					{_id:Session.get("userid")}).array;
			
		}
});

	//// Notification helpers  ////
Template.notifications.helpers({
  notifications: function() {
    return Notifications.find({read: false});
  },
  notificationCount: function(){
    return Notifications.find({read: false}).count();
  }
});

Template.notification.helpers({
  id: function() {
  	var item=Websites.findOne({title:this.likes});
    return item._id;
  }
});



					////template Events/////

	////website-form events////			
	Template.website_form.events({
		"click .js-toggle-website-form":function(event){
			$("#website_form").toggle('slow');
		}, 
		"submit .js-save-website-form":function(event){

			// here is an example of how to get the url out of the form:
			var title,url,description;
			url = event.target.url.value;
			title=event.target.title.value;
			description=event.target.description.value;
			vote=0;
			//console.log(Websites.findOne().vote);
			console.log(event.target.url.value);
			createdOn=new Date();
			//console.log("The url they entered is: "+url + "title is:"+title+ "description: "+description);
			
			if(Meteor.user()){
				Websites.insert({
					title:title,
					url:url,
					description:description,
					vote:vote,
					createdOn:new Date()

				});
			//console.log(Meteor.user());
			}
			$("#website_form").toggle('slow');
			//  put your website saving code in here!	

			return false;// stop the form submit from reloading the page
			
		}
	});
	
	
	
	////website-list events////
	Template.website_list.events({
		"click .js-subscribe":function(event){
			var user_name=Meteor.user().username;
			var user_id=Meteor.user()._id;
			//Find if User exist in Subscribe collection
			if(!Subscribe.findOne({username:user_name}))
			{
				var arr=[];
				arr.push(this._id);
				/*if their is no document of user in Subscribe then
				 create a document of user and insert username, user_id,
				 subscribed details with empty subscriber field*/

				Subscribe.insert({
							id:user_id,
							username:user_name,
							subscribe:arr,
							subscribers:[]
						});
				/*also include a document of subscribed user if it doesn't exist
				and update the document by appending subscribers if doc exist*/
				console.log(this);
				if(!Subscribe.findOne({username:this.username}))
				{
					Subscribe.insert({
							id:this._id,
							username:this.username,
							subscribe:[],
							subscribers:[]
						});
				}	
				var t1=Subscribe.findOne({username:this.username});
				var arr1=t1.subscribers;
				arr1.push(user_id);
				Subscribe.update({_id:t1._id},{$set:{subscribers:arr1}});
				console.log(Subscribe.findOne({username:this.username}));
			}
			else
			{	
				var t1=Subscribe.findOne({username:user_name});
				var arr=t1.subscribe;
					//console.log(this._id);
				if(arr.indexOf(this._id)<0)
				{
					arr.push(this._id);
					Subscribe.update({_id:t1._id},{$set:{subscribe:arr}});
					if(!Subscribe.findOne({username:this.username}))
					{
						Subscribe.insert({
								id:this._id,
								username:this.username,
								subscribe:[],
								subscribers:[]
							});
					}	
					var t1=Subscribe.findOne({username:this.username});
					var arr1=t1.subscribers;
					arr1.push(user_id);
					Subscribe.update({_id:t1._id},{$set:{subscribers:arr1}})
				}
				else
				{
					console.log("already exist");
				}
				console.log(Subscribe.findOne({id:user_id}));
			}
		}
	});
					
					
	////Website-item events////
	Template.website_item.events({
		"click .js-upvote":function(event){
			var website_id = this._id;
			var user_id=Meteor.user()._id;
			var username=Meteor.user().username;
			if(Meteor.user())
			{
				
				if(!Like.findOne({username:username})){
					Like.insert({
							id:user_id,
							username:username,
							like:[]
						});
					console.log(Like.findOne({username:username}));
				}
					var t1=Like.findOne({id:user_id});
					var array=t1.like;
					var flag=false;
					//console.log(arr);
					for(var i=0;i<array.length;i++){
						if(array[i]["data"]==this.title)
						{
							flag=true;
							break;
						}
					}
					if(!flag)
					{
						
						var arr={
								user:username,
								data:this.title
						};
						array.push(arr);
						console.log(Meteor.users.findOne({_id:user_id}));
						Websites.update({_id:website_id},{$inc:{upvote:1}});
						Like.update({_id:t1._id},{$set:{like:array}});
						if((Subscribe.findOne({username:username}))&&
							(Subscribe.findOne({username:username}).subscribers.length))
						{
							var subscribers=Subscribe.findOne({username:username}).subscribers;
							for(var i=0;i<subscribers.length;i++)
							{
								console.log(subscribers[i]);
								Notifications.insert({
									userId:subscribers[i],
									likes:this.title,
									Who_liked:Meteor.user().username,
									read:false
								});
							}
						}
						else
						{
							console.log("Unsuccessful");
						}
					}
					else
					{
						alert("already liked");
					}
					

			return false;
			}
			else{
				alert("login to upvote");
			}
		}, 
		"click .js-downvote":function(event){
			var website_id = this._id;
			//console.log("Down voting website with id "+website_id);
			Websites.update({_id:website_id},{$inc:{downvote:1}});
			return false;
		}
	});

	
	////Comment events////
	Template.comment.events({
		"submit .js-save-comment":function(event){
			Website_id=Session.get("userid");
			//console.log(Website_id);
			var comment=event.target.commentt.value;
			var index=Websites.findOne({_id:Website_id}).array.length;
			//console.log(array);
			//var user=Websites.findOne({_id:Website_id}).array.user;
			//array.push(comment);
			if(index==0)
			{			
				var user="";
				if(Meteor.user()){
					user=Meteor.user().username;
					//console.log(Meteor.user().username);
				}
				else
				{
					user="anno";
					//console.log("anno");
				}

				var arr=[];
				arr.push({
					user:user,
					data:comment
				});
				Websites.update({_id:Website_id},{$set:{array:arr}});
				//console.log(Websites.findOne({_id:Website_id}));
			}
			else
			{
				var array=Websites.findOne({_id:Website_id}).array;
				
				if(Meteor.user()){
					user=Meteor.user().username;
					//console.log(Meteor.user().username);
				}
				else
				{
					user="anno";
					//console.log("anno");
				}
				var arr={
					user:user,
					data:comment
				};
				array.push(arr);
				Websites.update({_id:Website_id},{$set:{array:array}});
				//console.log(Websites.findOne({_id:Website_id}));
				//console.log(Websites.findOne({_id:Website_id}).array);	
			}
			//array.push(arr);
			//array.push("comment");
			//console.log(array);
			
			return false;
		}
	});

	////Notification Events////
Template.notification.events({
  'click a': function() {
    Notifications.update(this._id, {$set: {read: true}});
  }
});