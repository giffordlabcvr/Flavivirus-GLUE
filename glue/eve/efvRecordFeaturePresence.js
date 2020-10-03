var subtypes = ["A", "B", "C" ];
var features = ["gag", "pol", "env", "vif", "vpu", "nef"];

_.each(subtypes, function(subtype) {
	_.each(features, function(feature) {
		var almtName = "AL_HIV-1M_"+subtype;
		glue.inMode("module/hivPairsFeaturePresenceRecorder", function() {
			glue.command(["record", "feature-presence", almtName, 
			              "-w", "sequence.source.name like 'ncbi-pairsets-%'", 
			              "-f", feature]);
		});
	});
});

