//list of parent features which should be transferred - the parent of the list elements is 'whole_genome'
var codingFeaturesToInherit = ["structural_proteins", "flavi-capsid",
                               "premembrane", "flavi-envelope", "non_structural_proteins", 
                               "NS1", "flavi-NS2A", "flavi-NS2B",
                               "NS3", "flavi-NS4A", "flavi-NS4B", "2K", "NS5"];

//list all reference sequences
var refSeqObjs = glue.tableToObjects(glue.command(["list", "reference", "name"]));

_.each(refSeqObjs, function(refSeqObj) {

	for(var k = 0; k < codingFeaturesToInherit.length; k++) {
	
		var featureID = codingFeaturesToInherit[k];
		glue.logInfo(" Inheriting feature: "+featureID+" from REF_YFV to "+refSeqObj.name);		

		glue.inMode("reference/"+refSeqObj.name, function() {
			glue.command(["inherit", "feature-location", 			
				"AL_Flaviviridae_UNCONSTRAINED", "-l", "REF_YFV", featureID]);
		});
	   
	}

});


