// Load flavivirus EVE data from tab file 
var loadResult;
glue.inMode("module/flaviviridaeTabularUtility", function() {
	loadResult = glue.tableToObjects(glue.command(["load-tabular", "tabular/eve/efv-side-data.tsv"]));
	//glue.log("INFO", "load result was:", loadResult);
});

_.each(loadResult, function(eveObj) {

	glue.inMode("custom-table-row/locus_data/"+eveObj.sequenceID, function() {

	    glue.log("INFO", "eveObj result was:", eveObj);


		glue.command(["set", "field", "locus_id", eveObj.locus_numeric_id]);	
		glue.command(["set", "field", "duplicate_id", eveObj.duplicate_id]);	
		glue.command(["set", "field", "scaffold", eveObj.scaffold]);
		glue.command(["set", "field", "start", eveObj.extract_start]);
		glue.command(["set", "field", "end", eveObj.extract_end]);
		glue.command(["set", "field", "orientation", eveObj.orientation]);

	});
	

	glue.inMode("sequence/fasta-digs-eve/"+eveObj.sequenceID, function() {
	
		glue.command(["set", "field", "name", eveObj.sequenceID]);
		glue.command(["set", "field", "full_name", eveObj.sequenceID]);
		glue.command(["set", "field", "species", eveObj.organism]);

		glue.command(["set", "field", "length", eveObj.sequence_length]);
		
	});


});

