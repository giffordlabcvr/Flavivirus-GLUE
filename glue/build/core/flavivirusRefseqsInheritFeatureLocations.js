// Get a list of all MASTER references
//var referencesResult = glue.command(["list","reference","-w","name = 'REF_MASTER_YFV'"]);
var referencesResult = glue.command(["list","reference"]);
//glue.log("INFO", "RESULT WAS ", referencesResult);
var listResult = referencesResult["listResult"];
var referencesList = listResult["row"];
//glue.log("INFO", "RESULT WAS ", referencesList);



// Iterate through master references






  // Get list of features on master reference
  var featuresToInherit = get_features('REF_MASTER_Dependo_AAV2');

  //list all dependo reference sequences
  var refSeqObjList = glue.tableToObjects(glue.command(["list", "reference", "name"]));


  _.each(refSeqObjList, function(refSeqObj) {

	   for(var k = 0; k < featuresToInherit.length; k++) {
		   var featureID = featuresToInherit[k];
		 
		   glue.logInfo(" Inheriting feature: "+featureID+" from AAV2 to "+refSeqObj.name);		

		   glue.inMode("reference/"+refSeqObj.name, function() {
			   glue.command(["inherit", "feature-location", 			
				   "AL_Dependo3", "-l", "REF_MASTER_Dependo_AAV2", featureID]);
		   });			
		 
	   }
			
  });



// Get feature names for a give reference sequence
function get_features(refseqID) {

	var myFeatures;	
	glue.inMode("reference/"+refseqID, function(){
		myFeatures = glue.getTableColumn(glue.command(["list", "feature-location"]), "feature.name");
	});
	return myFeatures;
}

