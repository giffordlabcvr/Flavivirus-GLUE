// Calculate nucleotide composition in reference sequences
function calculateCompositionNuc() {

    // Get map of all coding features
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
	//var referencesResult = glue.command(["list","reference","-w","name = 'REF_MASTER_YFV'"]);
	var referencesResult = glue.command(["list","reference"]);
	//glue.log("INFO", "RESULT WAS ", referencesResult);
	var listResult = referencesResult["listResult"];
	var referencesList = listResult["row"];
	//glue.log("INFO", "RESULT WAS ", referencesList);


	// Iterate through reference list and use fasta exporter to retrieve the nuc sequence of each segment
	var refSeqNucSequences = {};
	_.each(referencesList, function(refObj) {

		var referenceProperties = refObj["value"];
		
		var referenceName = referenceProperties[0];
        var sequenceID = referenceProperties[2];

		//glue.log("INFO", "Reference name result was:", referenceName);

		// get the whole sequence
		var nucSeq;
		glue.inMode("module/fastaExporter", function() {

			nucSeqResult = glue.command(["export","-w","sequenceID = '"+sequenceID+"'","-p"]);			
			//glue.log("INFO", "NUC RESULT WAS ", nucSeqResult);			
			var list = nucSeqResult.nucleotideFasta.sequences;			
			_.each(list, function(seq) {
			
				nucSeq = seq.sequence;
				refSeqNucSequences[referenceName] = nucSeq;
			
			});			
		});		
	});

  
  
    // get sequences of coding features

	// iterate through reference list and get AA composition of each coding feature
	var codingFeatureSequences = {};
	_.each(referencesList, function(refObj) {

		//glue.log("INFO", "RESULT WAS ", refObj);
        	
		var refseqResults = {};
		var referenceProperties = refObj["value"];
		var referenceName = referenceProperties[0];
	
		//glue.log("INFO", "Reference name result was:", referenceName);

		// list all features annotated in this reference 
		// GLUE COMMAND: reference [referenceName] list feature-location
        var initialised;
		glue.inMode("/reference/"+referenceName, function() {

			var featureLocsResult = glue.tableToObjects(glue.command(["list", "feature-location"]));
			//glue.log("INFO", "RESULT WAS ", featureLocsResult);
			 
			// iterate through features
					
			_.each(featureLocsResult, function(featureObj) {

			   //glue.log("INFO", "RESULT WAS ", featureObj);
			   var featureResults = {};
		   
			   // get amino acid sequence
			   var featureName = featureObj["feature.name"];
		   
			   // Get amino acid output table (contains codons)
			   // Construct nuc sequence from table
			   if (codingFeatures[featureName]) {

     			   //glue.log("INFO", "Coding feature name result was:", featureName);
			       initialised = 'true';
			       var nucSequence = '';
				   glue.inMode("/feature-location/"+featureName, function() {
					   					  

					   var aaTableResult = glue.tableToObjects(glue.command(["amino-acid"]));
					   // iterate through and get amino acid composition of feature
    			       //glue.log("INFO", "RESULT WAS ", aaTableResult);

					   var length = 0;
					   var i = 0;
	 				   _.each(aaTableResult, function(codonObj) {
 
						   //glue.log("INFO", "Codon result was:", codonObj);						   
						   var codonNts = codonObj["codonNts"]; 
						   //glue.log("INFO", "Codon nts :", codonNts);						   
						   nucSequence  = nucSequence + codonNts;
						   length += 3;
						   i++;
						   
					   });
				   
					   featureResults["length"] = length;
					   featureResults["nucSequence"] = nucSequence;
		   
				   });
			   
				  // store feature result
				  refseqResults[featureName] = featureResults;
				  			
				}
				   
			});   

			// store reference result
			if (initialised) {
				codingFeatureSequences[referenceName] = refseqResults;
			}
		
		});   
	
	});
  
    //glue.log("INFO", "SEGMENTS RESULT WAS ", codingFeatureSequences);

  
    
    // Get nuc sequences of non-coding features
	var nonCodingFeatureSequences = {};
	
	// iterate through reference list and get nuc seq of each non-coding feature
	_.each(referencesList, function(refObj) {
		
		var referenceProperties = refObj["value"];
		var referenceName = referenceProperties[0];
	
		//glue.log("INFO", "Reference name result was:", referenceName);

		// list all features annotated in this reference 
		// GLUE COMMAND: reference [referenceName] list feature-location
	
		glue.inMode("/reference/"+referenceName, function() {
        	
		    var refseqResults = {};	
			var featureLocsResult = glue.tableToObjects(glue.command(["list", "feature-location"]));
			//glue.log("INFO", "RESULT WAS ", featureLocsResult);
			 
			// iterate through features
			var initialised;
			_.each(featureLocsResult, function(featureObj) {

			   //glue.log("INFO", "RESULT WAS ", featureObj);
			   var featureResults = {};
		   
			   // get amino acid sequence
			   var featureName = featureObj["feature.name"];
		   
			   // Get amino acid output table	
			   // Construct nuc sequence from table
			   if (codingFeatures[featureName]) {
			      
			   }
			   else {

			       //glue.log("INFO", "Non-coding feature name result was:", featureName);
				   initialised = 'true';
				   
				   // in feature location mode get list of segments
				   var segments = [];
				   var featureSeq = '';
		           glue.inMode("/feature-location/"+featureName, function() {
		           
		               var segmentResult = glue.tableToObjects(glue.command(["list", "segment"]));
					   //glue.log("INFO", "SEG RESULT WAS ", segmentResult);

					   // iterate through segments
					   _.each(segmentResult, function(segmentObj) {
 
 
						   var refStart = segmentObj["refStart"];
						   var refEnd = segmentObj["refEnd"];
					   
						   //glue.log("INFO", "COORDINATES RESULT WAS ", refStart);							   
						   //glue.log("INFO", "REFEND RESULT WAS ", refEnd);							   
						   var nucSeq = refSeqNucSequences[referenceName];
						   var subSeq = nucSeq.slice(refStart, refEnd);
						   //glue.log("INFO", "SUBSEQ RESULT FOR FEATURE "+featureName+"WAS ", subSeq);
						   featureSeq = featureSeq + subSeq;
						   
					   });
	
					   // store feature result
					   var length = featureSeq.length;			   
					   featureResults["length"] = length;
					   featureResults["nucSequence"] = featureSeq;
					          
		          });
		           
		           
				  // store feature result
				  refseqResults[featureName] = featureResults;
			   
				}
				   
			   
			});

			// store reference result
			if (initialised) {
			
				nonCodingFeatureSequences[referenceName] = refseqResults;
			
			}	
		
		});   
	
	});

    //glue.log("INFO", "SEGMENTS RESULT WAS ", nonCodingFeatureSequences);




	// Count dinucleotides in nuc sequences & calculate frequencies
    var outputArray = [];

	_.each(referencesList, function(refObj) {

        
		//glue.log("INFO", "RESULT WAS ", refObj);
        	
		var refseqResults = {};
		var referenceProperties = refObj["value"];
		var referenceName = referenceProperties[0];
	    var sequenceID = referenceProperties[2];
	    
		//glue.log("INFO", "Reference name result was:", referenceName);
        
        var refseqFeatureSeqs = nonCodingFeatureSequences[referenceName];
        
 		_.each(_.keys(refseqFeatureSeqs), function(featureName) {
	
			//glue.log("INFO", "Feature name is "+featureName);
			var featureObj = refseqFeatureSeqs[featureName];
            var seqLength = featureObj["length"];
            var sequence = featureObj["nucSequence"];


			//loop through each position in the current sequence
			var seqNucComposition = {};
			var lastBase;
			for (var i=0; i < sequence.length; i++) {
				var base = sequence.charAt(i);
			
				if (seqNucComposition[base]) {
					seqNucComposition[base] += 1;		
				}
				else {
					seqNucComposition[base] = 1;
				}	
			}


		    var nucCountResults = {};
		    var nucFreqResults = {};
			_.each(_.keys(seqNucComposition), function(nucleotide) {

				var count = seqNucComposition[nucleotide];
					
				var ratio = (count / seqLength) * 100;
				var aaFormatedRatio = ratio.toFixed(2);
				//glue.log("INFO", "Got ratio '"+aaFormatedRatio+"' for nucleotide character'"+nucleotide+"'");
				nucCountResults[nucleotide] = count;
				nucFreqResults[nucleotide] = aaFormatedRatio;
									
			});

			// add results to array to be returned to GLUE
			outputArray.push({
		
				referenceName: referenceName,
				sequenceID: sequenceID,
				featureName: featureName,
				seqLength: seqLength,
				featureType: "non-coding",

				"A#": nucCountResults["A"],
				"T#": nucCountResults["T"],
				"G#": nucCountResults["G"],
				"C#": nucCountResults["C"],
				"A%": nucFreqResults["A"],
				"T%": nucFreqResults["T"],
				"G%": nucFreqResults["G"],
				"C%": nucFreqResults["C"],
			   
			});

		});

        var refseqCodingFeatureSeqs = codingFeatureSequences[referenceName];
 		_.each(_.keys(refseqCodingFeatureSeqs), function(featureName) {
	
			//glue.log("INFO", "Feature name is "+featureName);
			var featureObj = refseqCodingFeatureSeqs[featureName];
            var seqLength = featureObj["length"];
            var sequence = featureObj["nucSequence"];


			//loop through each position in the current sequence
			var seqNucComposition = {};
			var lastBase;
			for (var i=0; i < sequence.length; i++) {
				var base = sequence.charAt(i);
			
				if (seqNucComposition[base]) {
					seqNucComposition[base] += 1;		
				}
				else {
					seqNucComposition[base] = 1;
				}	
			}


		    var nucCountResults = {};
		    var nucFreqResults = {};
			_.each(_.keys(seqNucComposition), function(nucleotide) {

				var count = seqNucComposition[nucleotide];
					
				var ratio = (count / seqLength) * 100;
				var aaFormatedRatio = ratio.toFixed(2);
				//glue.log("INFO", "Got ratio '"+aaFormatedRatio+"' for nucleotide character'"+nucleotide+"'");
				nucCountResults[nucleotide] = count;
				nucFreqResults[nucleotide] = aaFormatedRatio;
									
			});

			// add results to array to be returned to GLUE
			outputArray.push({
		
				referenceName: referenceName,
				sequenceID: sequenceID,
				featureName: featureName,
				seqLength: seqLength,
				featureType: "coding",

				"A#": nucCountResults["A"],
				"T#": nucCountResults["T"],
				"G#": nucCountResults["G"],
				"C#": nucCountResults["C"],
				"A%": nucFreqResults["A"],
				"T%": nucFreqResults["T"],
				"G%": nucFreqResults["G"],
				"C%": nucFreqResults["C"],
			   
			});

		});        

	});




	// Return output
	return outputArray;
}





