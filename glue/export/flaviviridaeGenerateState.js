var source_names = get_refseq_sources();
for(var i = 0; i < source_names.length; i++) {

	var sourceName = source_names[i];
	glue.logInfo("Processing source: "+sourceName);
	
	var refseq_ids = get_refseq_ids(sourceName);	
	for(var j = 0; j < refseq_ids.length; j++) {

		var refseqID = refseq_ids[j];
		glue.logInfo("Processing source "+sourceName+", Reference: "+refseqID);		

		// List the features
		var myFeatures = get_features(refseqID);
		
		// Get Gag sequences
		//var gag_aa = get_amino_acids(refseqID, 'Gag');
		// Get Pol sequences
		//var pol_aa = get_amino_acids(refseqID, 'Pol');
		// Get Env sequences
		//var pol_aa = get_amino_acids(refseqID, 'Env');


	}
}

// Get alignments
var myAlignments = get_alignments()


// SUBROUTINES
// Get feature names for a give reference sequence
function get_features(refseqID) {

	var myFeatures;	
	glue.inMode("reference/"+refseqID, function(){
		myFeatures = glue.getTableColumn(glue.command(["list", "feature-location"]), "feature.name");
	});
	
	for(var k = 0; k < myFeatures.length; k++) {
		var featureID = myFeatures[k];
		glue.logInfo("  Processing feature: "+featureID);		
	
	}
}

// Get source names
function get_amino_acids(refseqID, featureName) {

	var labelledCodons;			
	glue.inMode("reference/"+refseqID+"/feature-location/"+featureName, function(){
		labelledCodons = glue.getTableColumn(glue.command(["list", "labeled-codon"]), "codonLabel");
	});

	var results1;	
	results1 = get_feature_amino_acids(refseqID, featureName);

	// Iterate through all the codon positions in this position and compare result for each seq
	_.each(labelledCodons,function(codonLabel){

		var resultObj1 = results1[codonLabel];

		/* resultObj1 will look like this.
		 * { codonLabel: "1", memberNt: 234, relRefNt: 5346, codonNts: "ATG", aminoAcid: "M", ..., ... }
		 */

		if (resultObj1) {

			glue.logInfo("resultObj1", resultObj1);
			var amino1 = resultObj1.aminoAcid;	

		}
	});		
	
	return results1;
}


// Get source names
function get_refseq_sources() {
	glue.logInfo("Getting sources");
	var my_sources = glue.getTableColumn(glue.command(["list","source"]), "name");
	return my_sources;
}

// Get refseq IDs 
function get_refseq_ids(source) {
	glue.logInfo("Getting references");
	var my_refseq_ids = glue.getTableColumn(glue.command(["list","reference","-w", "sequence.source.name = '"+source+"'"]), "name");
	return my_refseq_ids;
}

// Get alignment names
function get_alignments() {

	glue.logInfo("Getting alignments");
	var myAlignments = glue.getTableColumn(glue.command(["list", "alignment"]), "name");
	for(var i = 0; i < myAlignments.length; i++) {
		var alignName = myAlignments[i];
		glue.logInfo("  Alignment: "+alignName);

	}
	return myAlignments;

}

// Get codons + amino acids for a given coding feature
function get_feature_amino_acids(refSeqID, feature) {

	var resultMap = {};
	glue.inMode("reference/"+refSeqID+"/feature-location/"+feature, function() {
	
		var resultList = glue.tableToObjects(glue.command(["amino-acid"]));		
		_.each(resultList,function(resultObj){
			resultMap[resultObj.codonLabel] = resultObj;
		});
	});
		
	return resultMap;
	
}

// Get coding features in a map  
function get_coding_feature_map() {

	var resultMap = {};
	var myCodingFeatures = glue.getTableColumn(glue.command(["list", "feature-location","-w", "feature.featureMetatags.name = 'CODES_AMINO_ACIDS'"]));
	_.each(myCodingFeatures,function(resultObj){
		resultMap[resultObj.feature.name] = resultObj;
	});	
	return resultMap;
	
}

