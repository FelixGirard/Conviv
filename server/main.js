import { Meteor } from 'meteor/meteor';
import { Rues } from '../imports/api/data.js'

Meteor.startup(() => {
  Meteor.methods({
	  getRues: function () {
      console.log("getting rues");
		return Rues.find().fetch();
  }});
  Rues.find({}).forEach(rue => {
      Rues.remove(rue._id)
  })
  var test = JSON.parse(Assets.getText("test.json"));
  for(var i =0;i < test.features.length;i++)
    Rues.insert(test.features[i]);
});
