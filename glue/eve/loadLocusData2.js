// Load EVE data from tab file 
var loadResult;
glue.inMode("module/flaviviridaeTabularUtility", function() {
	loadResult = glue.tableToObjects(glue.command(["load-tabular", "tabular/locus/efv-locus-data.tsv"]));
	//glue.log("INFO", "load result was:", loadResult);
});

_.each(loadResult, function(eveObj) {

	glue.inMode("custom-table-row/locus_data/"+eveObj.sequenceID, function() {
	
		glue.command(["set", "field", "scaffold", eveObj.scaffold]);
		glue.command(["set", "field", "start", eveObj.start]);
		glue.command(["set", "field", "end", eveObj.end]);
		glue.command(["set", "field", "orientation", eveObj.orientation]);
		glue.command(["set", "field", "length", eveObj.length]);
		glue.command(["set", "field", "integration", eveObj.integration]);
		glue.command(["set", "field", "fragment", eveObj.fragment]);
		glue.command(["set", "field", "duplicate", eveObj.duplicate]);

	});
});
