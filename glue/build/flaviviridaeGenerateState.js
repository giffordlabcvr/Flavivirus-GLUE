// *
// Globals (temporary solution)
var NS3_fasta_aa = [ ];
var NS3_fasta_nt = [ ];
var NS5_fasta_aa = [ ];
var NS5_fasta_nt = [ ];


// Summarise the reference sequences in this project
process_refseqs();

// Summarise the alignments in this project
process_alignment_tree("AL_MASTER_Flaviviridae_ROOT");

// Summarise the virus isolates in this project
//process_virus_isolates();

// Summarise the EVEs in this project
//process_eves();

// *
// TOP-LEVEL SUBROUTINES

// Process reference sequences 
function process_refseqs() {


	// Get a list of all the distinct sources for reference sequences
	var source_names = get_refseq_sources();

	// Process reference sequences in each source
	var featureSummary = {};
	for(var i = 0; i < source_names.length; i++) {

		var sourceName = source_names[i];
		glue.logInfo("Processing source: "+sourceName);

		// Get the names (IDs) of all references in this source	
		var refseq_ids = get_refseq_ids(sourceName);	

		// Iterate through the list of references
		for(var j = 0; j < refseq_ids.length; j++) {

			var refseqID = refseq_ids[j];
			glue.logInfo("Processing source "+sourceName+", Reference: "+refseqID);		

			// Get a list of the features in this reference sequence
			var myFeatures = get_features(refseqID);							// Iterate through the list of features
			for(var k = 0; k < myFeatures.length; k++) {
		
				var featureID = myFeatures[k];		
				process_feature(featureSummary, refseqID, featureID);
			
			}


		}
	}
	
	// Write ORFs as NT and AA fasta
	write_feature_fasta(NS3_fasta_aa, NS5_fasta_aa)
}

// Process alignments non-recursively
function process_alignments() {
 
	// Get alignments
	var myAlignments = get_alignments()
	
	// Iterate through the list of references
	for(var j = 0; j < myAlignments.length; j++) {

		var alignName = myAlignments[j];
		
		glue.logInfo("Processing alignnment "+alignName);
		
		// How many members	
		glue.inMode("alignment/"+alignName, function(){
		
		    var members = glue.tableToObjects(glue.command(["list", "member"]));		

			_.each(members,function(resultObj){		
				glue.logInfo("   Processing member "+resultObj);
			});
		});
	}
	var rootAlignName = "AL_FlaviPesti"
	//process_alignment_tree(rootAlignName);		
}

// Recursively process alignment tree from a given node to tips
function process_alignment_tree(parentAlignName) {
    glue.logInfo("Processing alignment "+parentAlignName);
    
   // Get a list of the alignment members
    var almntMembers;
	glue.inMode("alignment/"+parentAlignName+"/", function(){
	    almntMembers = glue.getTableColumn(glue.command(["list", "member"]), "sequence.sequenceID");	
	});
	
	var numMembers = almntMembers.length; 
    glue.logInfo("\t Total members: "+numMembers);

	// Process alignment members
	//_.each(almntMembers,function(memberName){		
    //	glue.logInfo("Processing member "+memberName);
	//});


    // Get a list of the child alignments
    var childAlignments;
	glue.inMode("alignment/"+parentAlignName+"/", function(){
	    childAlignments = glue.getTableColumn(glue.command(["list", "children"]), "name");	
	});
	// Process child alignments
	_.each(childAlignments,function(childAlignmentName){		
		process_alignment_tree(childAlignmentName);
	});

}

// Process virus isolates sequences 
function process_virus_isolates() {

	// Clade categories		
	// Numbers in each clade category
}

// Process virus isolates sequences 
function process_eves() {


}


// *
// BASE-LEVEL SUBROUTINES

// Process feature 
function process_feature(featureSummary, refseqID, featureID) {
	
	glue.logInfo("  Processing feature: "+featureID+" in reference "+refseqID);

	if (featureID == "NS3" || featureID == "NS5" ) {
		var featureCodons = get_coding_feature_amino_acids(refseqID, featureID);
		create_feature_fasta(refseqID, featureID, featureCodons, featureSummary);
	}	
}

// Create feature fasta 
function create_feature_fasta(refseqID, featureID, featureCodons, featureSummary) {

	var labelledCodons;
	glue.inMode("reference/"+refseqID+"/feature-location/"+featureID, function(){
		labelledCodons = glue.getTableColumn(glue.command(["list", "labeled-codon"]), "codonLabel");
		
	});

	// Iterate through all the codon positions
	var fasta_aa = ">"+refseqID+"\n";
	var fasta_codons = ">"+refseqID+"\n";
	_.each(labelledCodons,function(codonLabel) {
	  
	  var resultObj1 = featureCodons[codonLabel];
	  var amino1   = resultObj1.aminoAcid;	
	  var ref_nuc  = resultObj1.refNt;	
	  var codon    = resultObj1.codonNts;	

	  // glue.logInfo("  amino acid "+amino1+", "+ref_nuc+", "+codon);

	  fasta_aa     = fasta_aa+amino1;
	  fasta_codons = fasta_codons+codon;
	  
	});

 	//glue.logInfo("FASTA amino acid "+fasta_aa);	
	//glue.logInfo("FASTA nucleotide "+fasta_codons);
	
	fasta_aa     = fasta_aa+"\n";
	fasta_codons = fasta_codons+"\n";

	if (featureID == "NS3") {
	  NS3_fasta_aa.push(fasta_aa); 
	  NS3_fasta_nt.push(fasta_codons);
	
	}	
	
	if (featureID == "NS5") {
	  NS5_fasta_aa.push(fasta_aa); 
	  NS5_fasta_nt.push(fasta_codons);
	}	
	
}

// write feature fasta 
function write_feature_fasta(NS3_fasta_aa, NS5_fasta_aa) {

	
	var NS3_fasta_aa_str = NS3_fasta_aa.join("\n");
	glue.command(["file-util", "save-string", NS3_fasta_aa_str, "export/NS3_fasta.faa"]);
	var NS3_fasta_nt_str = NS3_fasta_nt.join("\n");
	glue.command(["file-util", "save-string", NS3_fasta_nt_str, "export/NS3_fasta.fna"]);

	var NS5_fasta_aa_str = NS5_fasta_aa.join("\n");
	glue.command(["file-util", "save-string", NS5_fasta_aa_str, "export/NS5_fasta.faa"]);
	var NS5_fasta_nt_str = NS5_fasta_nt.join("\n");
	glue.command(["file-util", "save-string", NS5_fasta_nt_str, "export/NS5_fasta.fna"]);


}

// Return a map object containing amino-acid summary for a coding feature 
function get_coding_feature_amino_acids(refseqID, featureID) {
	
	glue.logInfo("  Getting amino acids for feature: "+featureID);
	
	var resultMap = {};
	glue.inMode("reference/"+refseqID+"/feature-location/"+featureID, function(){		
		var resultList = glue.tableToObjects(glue.command(["amino-acid"]));		
		_.each(resultList, function(resultObj){
			resultMap[resultObj.codonLabel] = resultObj;
		});
		
	});
	
	/* resultList will look like this.
	 * [
	 * 		{ codonLabel: "1", aminoAcid: "K", nucleotideTriplet:"TAC", ... },
	 *     	{ codonLabel: "2", aminoAcid: "L", ... },
	 *     	{ codonLabel: "3", aminoAcid: "S", ... }
	 * ]
	 */
	
	/* resultMap will look like this:
	 *  {
	 *     "1": { codonLabel: "1", aminoAcid: "K", ...},
	 *     "2": { codonLabel: "2", aminoAcid: "L", ...},
	 *     "3": { codonLabel: "3", aminoAcid: "S", ...},
	 * }
	 * 
	 */

	return resultMap;
}

// Get feature names for a give reference sequence
function get_features(refseqID) {

	var myFeatures;	
	glue.inMode("reference/"+refseqID, function(){
		myFeatures = glue.getTableColumn(glue.command(["list", "feature-location"]), "feature.name");
	});
	return myFeatures;
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
	var myAlignments = glue.getTableColumn(glue.command(["list", "alignment", "-w", "name not like '%UNCONSTRAINED%'"]), "name");
	for(var i = 0; i < myAlignments.length; i++) {
		var alignName = myAlignments[i];
		//glue.logInfo("  Alignment: "+alignName);

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
	var myCodingFeatures = glue.getTableColumn(glue.command(["list", "feature","-w", "feature.featureMetatags.name = 'CODES_AMINO_ACIDS'"]));
	_.each(myCodingFeatures,function(resultObj){
		resultMap[resultObj.feature.name] = resultObj;
	});	
	return resultMap;

}

