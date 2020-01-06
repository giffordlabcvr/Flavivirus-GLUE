var references = glue.getTableColumn(glue.command(["list", "reference", "name", "sequence.sequenceID"]), "sequence.sequenceID");

for(var i = 0; i < references.length; i++) {

	var sequenceID = references[i];
	glue.log("INFO", sequenceID);

	var resultList = glue.tableToObjects(glue.command(["list", "sequence", "-w", "sequenceID = '"+sequenceID+"'", "sequenceID", "name", "full_name", "subfamily", "genus"]));

	
	var resultMap = {};		
	_.each(resultList,function(resultObj){
	
		var name = resultObj.name ;
		var subfamily = resultObj.subfamily ;
		var genus = resultObj.genus ;
		glue.log("INFO", name);
		glue.log("INFO", subfamily);
		glue.log("INFO", genus);
		
	});


}


