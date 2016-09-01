Websites = new Mongo.Collection("websites");
Like=new Mongo.Collection("like");
Subscribe=new Mongo.Collection("Subscribe");
Notifications=new Mongo.Collection("notifications");
Websites.allow({
	insert:function(userId,doc){
		console.log(doc);
		if(Meteor.user()){
			
			//console.log("hello");
			//force the image to be owned by user 
			
			if(doc.url&& doc.description){
				//having url and desc
				console.log("testing security1");
				return true;
			}
			else
			{//url or desc empty
				console.log("url or desc empty");
				return false;
				
			}
		}
		else
		{//user not logged in
			console.log("testing security3");
			return false;
		}
 		console.log("hello");
		return false;
	},
	update:function(userId,doc){
		return true;
	}
});
Like.allow({
	insert:function(userId,doc){
		console.log(doc);
		if(Meteor.user()){
			return true;
		}
		else
		{//user not logged in
			console.log("testing security3");
			return false;
		}
	},
	update:function(userId,doc){
		console.log(doc);
		if(Meteor.user()){
			return true;
		}
		else
		{//user not logged in
			console.log("testing security3");
			return false;
		}
	}
});
Subscribe.allow({
	insert:function(userId,doc){
		console.log(doc);
		if(Meteor.user()){
			return true;
		}
		else
		{//user not logged in
			console.log("testing security3");
			return false;
		}
	},
	update:function(userId,doc){
		console.log(doc);
		if(Meteor.user()){
			return true;
		}
		else
		{//user not logged in
			console.log("testing security3");
			return false;
		}
	}
});
Notifications.allow({
	insert:function(userId,doc){
		console.log(doc);
		if(Meteor.user()){
			return true;
		}
		else
		{//user not logged in
			console.log("testing security3");
			return false;
		}
	},
	update:function(userId,doc){
		console.log(doc);
		if(Meteor.user()){
			return true;
		}
		else
		{//user not logged in
			console.log("testing security3");
			return false;
		}
	}
});