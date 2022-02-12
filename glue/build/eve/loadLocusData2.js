var refconDataPath = "tabular/eve/efv-refseq-side-data.tsv";
var source_name = 'fasta-digs-eve';

// Load the refcon data and store relationships between locus and viral taxonomy
var efvRefseqResultMap  = {};
get_refcon_data(efvRefseqResultMap, refconDataPath);
//glue.log("INFO", "RESULT WAS ", efvRefseqResultMap);
 
// Load flavivirus EVE data from tab file 
var loadResult;
glue.inMode("module/flaviviridaeTabularUtility", function() {
	loadResult = glue.tableToObjects(glue.command(["load-tabular", "tabular/eve/efv-side-data.tsv"]));
	//glue.log("INFO", "load result was:", loadResult);
});

_.each(loadResult, function(eveObj) {

    var sequenceID = eveObj.sequenceID;
	glue.inMode("custom-table-row/locus_data/"+sequenceID, function() {

	    //glue.log("INFO", "eveObj result was:", eveObj);

  
		glue.command(["set", "field", "locus_id", eveObj.locus_numeric_id]);	
		glue.command(["set", "field", "duplicate_id", eveObj.duplicate_id]);	
		glue.command(["set", "field", "organism", eveObj.organism]);	
		glue.command(["set", "field", "scaffold", eveObj.scaffold]);
		glue.command(["set", "field", "start", eveObj.extract_start]);
		glue.command(["set", "field", "end", eveObj.extract_end]);
		glue.command(["set", "field", "orientation", eveObj.orientation]);


	});


	if (eveObj.locus_name != 'NK') { // Skip elements that haven't been assigned to a locus
	
		// Get the reference details for this EVE sequences
		var locus_numeric_id = eveObj.locus_numeric_id;
		var locus_name = eveObj.locus_name;
		
		// Does an alignment exist for this locus ID
		//glue.log("INFO", "Getting taxonomic data for sequence:", sequenceID, "locus name:", locus_name);
		
		// Get the taxonomy 
		var efvRefConObj = efvRefseqResultMap[locus_name];
		glue.log("INFO", "LOADED REFCON INFO ", efvRefConObj);
	
		var subfamily   = efvRefConObj.subfamily;
		var genus       = efvRefConObj.genus;
		var supergenus  = efvRefConObj.supergenus;
		var subgenus    = efvRefConObj.subgenus;
		var clade       = efvRefConObj.clade;

		glue.inMode("sequence/"+source_name+"/"+sequenceID, function() {

			glue.command(["set", "field", "name", sequenceID]);
			glue.command(["set", "field", "full_name", sequenceID]);
			glue.command(["set", "field", "length", eveObj.sequence_length]);
			glue.command(["set", "field", "subfamily", subfamily]);
			glue.command(["set", "field", "supergenus", supergenus]);
			glue.command(["set", "field", "genus", genus]);
			glue.command(["set", "field", "subgenus", subgenus]);
			glue.command(["set", "field", "clade", clade]);

		});
			
	}

});


// get a list of sequence IDs from a given source in an alignment
function get_refcon_data(resultMap, refconDataPath) {

  // Load EVE reference data from tab file 
  var loadResult;
  glue.inMode("module/flaviviridaeTabularUtility", function() {
	  loadResult = glue.tableToObjects(glue.command(["load-tabular", refconDataPath]));
	  //glue.log("INFO", "load result was:", loadResult);
  });

  _.each(loadResult, function(eveObj) {

	  var sequenceID = eveObj.sequenceID;
	  //glue.log("INFO", "Setting locus data for EVE reference:", eveObj.sequenceID);
	  resultMap[sequenceID] = eveObj;
	
  });
  
}
