Information on ScanFold results for flavivirus sequences

Each clade has a directory that contains four types of files:

1)An .fna file that contain the GLUE alignments for each clade 
  (name indicated by the prefix)

2) .final_partners_corrected.txt files that contain the "final 
   partners" ScanFold data that have been corrected to reflect
   the sequence alignment (.fna file). The prefix (accession #) 
   indicates each individual sequence that was analyzed.  These 
   files have 6 columns: "i" indicates the nt in the degapped 
   input sequence; bp(i) and bp(j) are the i-j base pairs that
   have been corrected to consider the gaps in the alignment; 
   avgMFE is the average minimum free energy of ScanFold 
   predictions that contain bp(i-j); avgZ is the z-score, which
   measures the unusual stability of bp(i-j) in the actual sequence
   vs. random sequence; avgED is the avg. ensemble diversity, 
   which compares Boltzmann-weighted conformations calculated
   from a partition function (low ED indicates a single structure)

3) A _heatmap.txt file that maps the avgZ values to aligned
   positions from the .fna file. Useful for spotting common trends 
   in stable ordered structure propensity.

4) A _consensus_-1.txt and _consensus_-2.txt file that contain 
   consensus base pairs calculated from all the corrected 
   .final_partners_corrected.txt files. The -1 and -2 indicate
   z-score cutoffs for the bp(i-j) < -1 and < -2, respectively. 
   The four colums in these files contain the bp(i) and bp(j) 
   positions predicted in each .final_partners_corrected.txt file; 
   followed by the % conservation (the percentage of sequences
   predicted to contain bp(i-j); followed by the # of sequences
   containing bp(i-j) and all sequences analyzed. 
   