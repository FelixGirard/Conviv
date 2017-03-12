import { Meteor } from 'meteor/meteor';
import { Rues } from '../imports/api/data.js'

Meteor.startup(() => {
  Meteor.methods({
	  getRues: function () {
    console.log("getting rues : " + Rues.find().count());
		return Rues.find();
  }});
  Meteor.methods({
	  getColor: function (coordonnes) {
            //console.log(coordonnes);
    var result = [];
    var rues = Rues.find().fetch();
    console.log("starting compare");
    //console.log(coordonnes);
    for(i=0;i< Rues.find().count();i++)
    {
          for(j=0;j<rues[i].geometry.coordinates[0].length;j++)
          {
            for(k=0;k<coordonnes.length;k++)
            {
              //console.log(coordonnes[k]);
              coords = rues[i].geometry.coordinates[0][j];
              //console.log(coords);
              if(Math.sqrt(Math.pow(parseFloat(coords[0]) - parseFloat(coordonnes[k].lng),2) +(Math.pow(parseFloat(coords[1]) - parseFloat(coordonnes[k].lat),2))) < 0.005)
              {
                  //console.log("1 found !");
                  //console.log(coords);
                  //console.log(rues[i].properties.code);
                  if(result[k] == undefined){
                    result[k] = {};
                    result[k].coor = coordonnes[k];
                    result[k].code = rues[i].properties.code;
                  }
              }
           }
        }
    }
		return result;
}
  });
  // Rues.find({}).forEach(rue => {
  //     Rues.remove(rue._id)
  // })
  if(Rues.find().count() == 0)
  {
    var test = JSON.parse(Assets.getText("test.json"));
    for(var i =0;i < test.features.length;i++)
      Rues.insert(test.features[i]);
  }
});
