import { Meteor } from 'meteor/meteor';
import { Rues, Accidents } from '../imports/api/data.js'

Meteor.startup(() => {

  Meteor.methods({
	  getRues: function () {
      console.log("getting rues");
		return Rues.find().fetch();
    }});
  // Rues.find({}).forEach(rue => {
  //     Rues.remove(rue._id)
  // })
  if(Rues.find().count() == 0)
  {
    var test = JSON.parse(Assets.getText("test.json"));
    for(var i =0;i < test.features.length;i++)
      Rues.insert(test.features[i]);
  }

  Meteor.methods({
    getAccidents: function (name) {
      console.log("getting accidents");
    return Accidents.find({"RUE_ACCDN": name}).fetch();
    }});
  // Rues.find({}).forEach(rue => {
  //     Rues.remove(rue._id)
  // })
  if(Accidents.find().count() == 0)
  {
    var test1 = JSON.parse(Assets.getText("accidents.json"));
    for(var i =0;i < test1.length;i++)
      Accidents.insert(test1[i]);
  }
});
