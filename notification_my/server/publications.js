Meteor.publish('like',function(userId){
	//var id=Meteor.user()._id;
	return Like.find({"id": {"$in":Subscribe.findOne({id:this.userId}).subscribe}});
});
Meteor.publish('user-like',function(userId){
	console.log(this.userId);
	return Like.find({id:this.userId});
});
Meteor.publish('notifications',function(userId){
	return Notifications.find({userId:this.userId});
});
Meteor.publish('subscribe',function(){
	return Subscribe.find({});
});
Meteor.publish('Websites',function(){
	return Websites.find({});
});
Meteor.publish('users',function(userId){
	return Meteor.users.find({});
});
