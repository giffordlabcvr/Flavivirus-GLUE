// list the circovirus EVE sequences
var listSeqResult = glue.command(["list", "sequence", "-w", "source.name = 'fasta-eve-refseqs'"]);

// extract from the result a list of sequence IDs.
var seqIds = glue.getTableColumn(listSeqResult, "sequenceID");

// for each sequence ID
_.each(seqIds, function(seqId) {

	glue.log("INFO", "Sequence ID:", seqId);

    // create an object in the custom table which uses the sequence ID as the row ID.
    glue.command(["create", "custom-table-row", "eve_refcon_data", seqId]);
    
    // associate the corresponding sequence with this object.
    glue.inMode("sequence/fasta-eve-refseqs/"+seqId, function() {
        glue.command(["set", "link-target", "eve_refcon_data", "custom-table-row/eve_refcon_data/"+seqId]);    
    });

});

