function calculateCodonBias() {

	// Script to calculate amino acid composition in reference sequences

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

	// get list of reference sequences from GLUE
	var referencesResult = glue.command(["list","reference"]);
	//glue.log("INFO", "RESULT WAS ", referencesResult);

	var listResult = referencesResult["listResult"];
	var referencesList = listResult["row"];
	//glue.log("INFO", "RESULT WAS ", referencesList);


	// iterate through reference list and get AA composition of each coding feature
	codonCompositionResults = {}
	_.each(referencesList, function(refObj) {

		//glue.log("INFO", "RESULT WAS ", refObj);
	
		var refseqResults = {};
		var referenceProperties = refObj["value"];
		var referenceName = referenceProperties[0];
	    var sequenceID = referenceProperties[2];
			
		//glue.log("INFO", "Reference name result was:", referenceName);

		// list all features annotated in this reference 
		// GLUE COMMAND: reference [referenceName] list feature-location
		glue.inMode("/reference/"+referenceName, function() {

			var featuresResult = glue.tableToObjects(glue.command(["list", "feature-location"]));
			//glue.log("INFO", "RESULT WAS ", featuresResult);
			 
			// iterate through features
			_.each(featuresResult, function(featureObj) {

			   //glue.log("INFO", "RESULT WAS ", featureObj);
			   
			   var featureResults = {};
			   var aaCounts = {};
		   
			   // get amino acid sequence
			   var featureName = featureObj["feature.name"];
			   //glue.log("INFO", "Feature name result was:", featureName);
		   
			   // get amino acid sequence of the features
			   if (codingFeatures[featureName]) {

				   glue.inMode("/feature-location/"+featureName, function() {
						  
					   var codonSequenceResult = glue.tableToObjects(glue.command(["amino-acid"]));

					   //glue.log("INFO", "Table result was:", codonSequenceResult);
	 
					   // iterate through and get codon composition of feature
					   var length = 0;
					   _.each(codonSequenceResult, function(codonObj) {
 
						   var codon = codonObj["codonNts"];
					       var aa    = codonObj["aminoAcid"]; 
					    
					       // increment amino acid counts
					       if (aaCounts[aa]) {
					           
					           aaCounts[aa] += 1;
					       
					       } else {
					           aaCounts[aa] = 1;
					       }
					    
						   length += 1;

						   //glue.log("INFO", "Amino acid result:", aa);
						   //glue.log("INFO", " Codon result:", codon);
						   
						   if (featureResults[aa]) {

                               // get the map with codon counts for this aa
                               aaCodonMap = featureResults[aa];							   
							   aaCodonMap[codon] += 1;
	
						   }
						   else {
							   
					           // create a map with all codons for this aa as keys
						       aaCodonMap = create_codon_map(aa);
						       // increment the map for the current codon
						       
						       aaCodonMap[codon] = 1;
						       
						       // associate this data structure with the genome feature map
						       // by using the current aa as a key
						       featureResults[aa] = aaCodonMap;

						   }

					   });
				       
				       // store the counts for each amino acid
				       featureResults["aa_counts"] = aaCounts;
				       
				       // store the total sequence length
					   featureResults["length"] = length;
					   
					   // Store the feature name
					   featureResults["feature_name"] = featureName;
		   
				   });

                  //glue.log("INFO", "FEATURE RESULT WAS ", featureResults); die;
			   
				  // store feature result
				  refseqResults[featureName] = featureResults;
				  refseqResults["reference_name"] = referenceName;
				  refseqResults["sequence_id"] = sequenceID;
			    
				}
				   
			});   

			// store reference result
			codonCompositionResults[referenceName] = refseqResults;
		
		});   
	
	});

	// glue.log("INFO", "FINAL RESULT WAS ", codonCompositionResults);
	var outputArray = [];

	// get each reference
	
	_.each(codonCompositionResults, function(refseqResults) {

		//glue.log("INFO", "RESULT WAS ", refseqResults);
		
		var referenceName = refseqResults["reference_name"];
		var sequenceID = refseqResults["sequence_id"];
		
		// get each feature
	    _.each(refseqResults, function(featureResults) {
	    
			var featureName = featureResults["feature_name"];
			
			// get each amino
			aaCounts = featureResults["aa_counts"];
		    var referenceName = refseqResults["reference_name"];			
			_.each(_.keys(aaCounts), function(aa) {

				var aaCount = aaCounts[aa];						
				// glue.log("INFO", "Got count '"+count+"' for aa character'"+aa+"'");

				var codonCounts = featureResults[aa];
		    	//glue.log("INFO", "RESULT WAS ", codonCounts); die;		    	
				_.each(_.keys(codonCounts), function(codon) {

					var codonCount = codonCounts[codon];						
	                
	                // write line: reference - feature - aa - aa count - codon - codon count					
					outputArray.push({
		
						referenceName: referenceName,
						sequenceID: sequenceID,
						featureName: featureName,
						aa: aa,
						aaCount: aaCount,
						codon: codon,
						codonCount: codonCount
							   
					});
					
				
				});
									
			});
	    	
	    });
	
	});

	return outputArray;
}


function create_codon_map(aa){

	var codonMap = {};
	
	if (aa == 'A') {
	
		codonMap['GCT'] = 0;
		codonMap['GCC'] = 0;
		codonMap['GCA'] = 0;
		codonMap['GCG'] = 0;
	
	} else if (aa == 'C') {
		
		codonMap['TGT'] = 0;
		codonMap['TGC'] = 0;
		
	
	} else if (aa == 'D') {
	
		codonMap['GAT'] = 0;
		codonMap['GAC'] = 0;
		
	} else if (aa == 'E') {

		codonMap['GAA'] = 0;
		codonMap['GAG'] = 0;

	} else if (aa == 'F') {
	
		codonMap['TTT'] = 0;
		codonMap['TTC'] = 0;
	
	} else if (aa == 'G') {
	
		codonMap['GGT'] = 0;
		codonMap['GGC'] = 0;
		codonMap['GGA'] = 0;
		codonMap['GGG'] = 0;
		
	} else if (aa == 'H') {
	
		codonMap['CAT'] = 0;
		codonMap['CAC'] = 0;
	
	} else if (aa == 'I') {
	
		codonMap['ATT'] = 0;
		codonMap['ATC'] = 0;
		codonMap['ATA'] = 0;
		
	} else if (aa == 'K') {
	
		codonMap['AAA'] = 0;
		codonMap['AAG'] = 0;
	
	} else if (aa == 'L') {

		codonMap['CTT'] = 0;
		codonMap['CTC'] = 0;
		codonMap['CTA'] = 0;
		codonMap['CTG'] = 0;
		codonMap['TTA'] = 0;
		codonMap['TTG'] = 0;


	} else if (aa == 'M') {

		codonMap['ATG'] = 0;
	
	} else if (aa == 'N') {

		codonMap['AAT'] = 0;
		codonMap['AAC'] = 0;

	} else if (aa == 'P') {

		codonMap['CCT'] = 0;
		codonMap['CCC'] = 0;
		codonMap['CCA'] = 0;
		codonMap['CCG'] = 0;
	
	} else if (aa == 'Q') {

		codonMap['CAA'] = 0;
		codonMap['CAG'] = 0;

	} else if (aa == 'R') {

		codonMap['CGT'] = 0;
		codonMap['CGC'] = 0;
		codonMap['CGA'] = 0;
		codonMap['CGG'] = 0;
		codonMap['AGA'] = 0;
		codonMap['AGG'] = 0;
	
	} else if (aa == 'S') {
	
		codonMap['TCT'] = 0;
		codonMap['TCC'] = 0;
		codonMap['TCA'] = 0;
		codonMap['TCG'] = 0;
		codonMap['AGT'] = 0;
		codonMap['AGC'] = 0;
	
	} else if (aa == 'T') {
	
		codonMap['ACT'] = 0;
		codonMap['ACC'] = 0;
		codonMap['ACA'] = 0;
		codonMap['ACG'] = 0;
	
	} else if (aa == 'V') {

		codonMap['GTT'] = 0;
		codonMap['GTC'] = 0;
		codonMap['GTA'] = 0;
		codonMap['GTG'] = 0;
	
	} else if (aa == 'W') {

		codonMap['TGG'] = 0;
	
	} else if (aa == 'Y') {

		codonMap['TAT'] = 0;
		codonMap['TAC'] = 0;
	
	} else if (aa == '*') {
	
		codonMap['TAA'] = 0;
		codonMap['TAG'] = 0;
		codonMap['TGA'] = 0;
			
	} else if (aa == 'X') {
	
		codonMap['NNN'] = 0;
			
	} else {
		
		glue.log("INFO", "AMINO RESULT WAS ", aa);
		die;	

		
	} 

    return codonMap;

}



