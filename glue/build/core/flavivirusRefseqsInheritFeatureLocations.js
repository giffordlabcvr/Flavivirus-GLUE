// Get master references
var masterReferences = glue.tableToObjects(glue.command(["list", "reference", "-w", "name like '%MASTER%'"]));
var masterRefseqIDs = {};
_.each(masterReferences, function(refObj) {

	//glue.log("INFO", "RESULT WAS ", refObj);

    var refName = refObj["name"];
    var refSeqID = refObj["sequence.sequenceID"];
    masterRefseqIDs[refSeqID] = refName;
 
});

// glue.log("INFO", "RESULT WAS ", masterRefseqIDs);

// Get alignments and reference sequence IDs
var references = glue.tableToObjects(glue.command(["list", "reference"]));
var refseqIDs = {};
var refseqNames = {};
_.each(references, function(refObj) {

	//glue.log("INFO", "RESULT WAS ", refObj);

    var refName = refObj["name"];
    var refSeqID = refObj["sequence.sequenceID"];
    refseqIDs[refSeqID] = refName;
    refseqNames[refName] = refSeqID;

});



// Get list of alignments and master references to use
var alignments = glue.tableToObjects(glue.command(["list", "alignment", "-w", "name like '%SUBGENUS%'"]));

_.each(alignments,function(msaObj){

	// glue.log("INFO", "RESULT WAS ", msaObj);
    var msaName = msaObj["name"];
    var masterRefName = msaObj["refSequence.name"];
   	glue.log("INFO", "Alignment ", msaName);	 
   		             
	// get the master reference features
	var featuresToInherit = [ ];
	var features = glue.tableToObjects(glue.command(["list", "alignment", "-w", "name like '%SUBGENUS%'"]));
	glue.inMode("/reference/"+masterRefName, function() {

		var featureLocsResult = glue.tableToObjects(glue.command(["list", "feature-location"]));
		//glue.log("INFO", "RESULT WAS ", featureLocsResult);
	
		// iterate through features in master reference, recording each
	   
		_.each(featureLocsResult, function(featureObj) {

		    //glue.log("INFO", "RESULT WAS ", featureObj);
		    var featureName = featureObj["feature.name"];
  			featuresToInherit.push(featureName);
  			
		});

	});

	// Iterate through alignment get list of alignment members to modify
	var membersToModify = {};
	glue.inMode("/alignment/"+msaName, function() {

		var membersResult = glue.tableToObjects(glue.command(["list", "member"]));
		
        // Iterate through alignment members
		_.each(membersResult, function(memberObj) {


		   var refSeqID = memberObj["sequence.sequenceID"];

		   // Inherit all features
		   if (masterRefseqIDs[refSeqID]) {
			   // Skip the master reference
		   }
		   else if (refseqIDs[refSeqID]) {
		       
		       var refName = refseqIDs[refSeqID];
		       membersToModify[refName] = memberObj;		
		   } 
					    
		});

	});
	//glue.log("INFO", "Result WAS ", membersToModify);


	// Iterate through alignment get list of alignment members to modify
	_.each(_.keys(membersToModify), function(memberRefName) {
 
 
   		 glue.log("INFO", "Reference ", memberRefName);	          
 
         if (refseqNames[memberRefName]) {
         
			 glue.inMode("/reference/"+memberRefName, function() {
	 
				 // Iterate through alignment members
				 _.each(featuresToInherit, function(featureName) {

   		             glue.log("INFO", "Feature ", featureName);	 
					 // inherit feature-location --spanGaps AL_GENUS_Flavivirus --relRefName REF_MASTER_YFV premembrane			
					 // inherit feature-location --spanGaps msaName --relRefName masterRefName featureName			
					 glue.command(["inherit", "feature-location", "--spanGaps", msaName, "--relRefName", masterRefName, featureName])

				 });
		 
			 });
		 
		 }
	 
	});

});


