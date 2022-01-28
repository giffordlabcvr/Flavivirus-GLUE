// Calculate dinucleotide composition in reference sequences
function calculateCompositionDinuc() {

	var dinucCompositionResults = {};
	var lengthResults = {};
    var outputArray = [];

    // Get all coding features
	var codingFeatures = {};
	var resultMap = glue.command(["list", "feature","-w", "featureMetatags.name = 'CODES_AMINO_ACIDS'"]);
	var featureList = resultMap["listResult"];
	var codingFeatureList = featureList["row"];
	_.each(codingFeatureList,function(featureObj){

		//glue.log("INFO", "RESULT WAS ", featureObj);
	
		var valueArray = featureObj["value"];
		var codingFeatureName = valueArray[0];
		//glue.log("INFO", "NAME WAS ", featureName)
		codingFeatures[codingFeatureName] = featureObj;

	
	});	
	//glue.log("INFO", "RESULT WAS ", codingFeatures);



    // calculate for coding features

	// get list of reference sequences from GLUE
	var referencesResult = glue.command(["list","reference"]);
	//glue.log("INFO", "RESULT WAS ", referencesResult);

	var listResult = referencesResult["listResult"];
	var referencesList = listResult["row"];
	//glue.log("INFO", "RESULT WAS ", referencesList);
	
	// iterate through reference list and get AA composition of each coding feature
	var dinucCompositionResultsCoding = {};
	_.each(referencesList, function(refObj) {

		//glue.log("INFO", "RESULT WAS ", refObj);
	
		var refseqResults = {};
		var referenceProperties = refObj["value"];
		var referenceName = referenceProperties[0];
	
		glue.log("INFO", "Reference name result was:", referenceName);

		// list all features annotated in this reference 
		// GLUE COMMAND: reference [referenceName] list feature-location
		glue.inMode("/reference/"+referenceName, function() {

			var featureLocsResult = glue.tableToObjects(glue.command(["list", "feature-location"]));
			//glue.log("INFO", "RESULT WAS ", featureLocsResult);
			 
			// iterate through features
			_.each(featureLocsResult, function(featureObj) {

			   //glue.log("INFO", "RESULT WAS ", featureObj);
			   var featureResults = {};
		   
			   // get amino acid sequence
			   var featureName = featureObj["feature.name"];
			   //glue.log("INFO", "Feature name result was:", featureName);
		   
			   // Get amino acid output table	
			   // Construct nuc sequence from table
			   if (codingFeatures[featureName]) {

			       var nucSequence = '';
				   glue.inMode("/feature-location/"+featureName, function() {
						  
					   var aaSequenceResult = glue.tableToObjects(glue.command(["amino-acid"]));
					   // iterate through and get amino acid composition of feature
					   var length = 0;
					   _.each(aaSequenceResult, function(codonObj) {
 
						   var codonNts = codonObj["codonNts"];
						   nucSequence .= codonNts;
						   length += 3;
						   //glue.log("INFO", "Codon result was:", codonNts);
						   
					   });
				   
					   featureResults["length"] = length;
					   featureResults["nucSequence"] = nucSequence;
		   
				   });
			   
				  // store feature result
				  refseqResults[featureName] = featureResults;
				  			
				}
				   
			});   

			// store reference result
			dinucCompositionResultsCoding[referenceName] = refseqResults;
		
		});   
	
	});

    
    // calculate for non-coding features
	var dinucCompositionResultsNonCoding = {};

	// iterate through reference list and get AA composition of each non-coding feature
	_.each(referencesList, function(refObj) {


		// list all features annotated in this reference 
		// GLUE COMMAND: reference [referenceName] list feature-location
		glue.inMode("/reference/"+referenceName, function() {

			var featureLocsResult = glue.tableToObjects(glue.command(["list", "feature-location"]));
			//glue.log("INFO", "RESULT WAS ", featureLocsResult);
			 
			// iterate through features
			_.each(featureLocsResult, function(featureObj) {

			   //glue.log("INFO", "RESULT WAS ", featureObj);
			   var featureResults = {};
		   
			   // get amino acid sequence
			   var featureName = featureObj["feature.name"];
			   //glue.log("INFO", "Feature name result was:", featureName);
		   
			   // Get amino acid output table	
			   // Construct nuc sequence from table
			   if (codingFeatures[featureName]) {
			       next;
			   }
			   else {

			       var nucSequence = '';
				   
				   // in feature location mode get list of segments
				   // store all segments
			   
				   // use fasta exporter to generate the nuc sequence of each segment
				   // splice all segments together 
				   
				  // store feature result
				  //refseqResults[featureName] = featureResults;
				   		
				}



				   
			});

			// store reference result
			dinucCompositionResultsNonCoding[referenceName] = refseqResults;
		
		});   
	
	});


	// Count dinucleotides in nuc sequence & calculate frequencies


    
	// Return output
	return outputArray;
}


// Subroutine - get sequence and otehr data from from amino acid table 

// Iterate through table rows

// 