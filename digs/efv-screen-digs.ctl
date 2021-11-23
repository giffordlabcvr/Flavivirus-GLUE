# Database integrated genome screening (DIGS) control file for endogenous flaviviral element screen
# DIGS tool: https://giffordlabcvr.github.io/DIGS-tool/


# DIGS screening database connection parameters

Begin SCREENDB;
    db_name=eve_1_flavi;      # Screening database name
    mysql_server=localhost;   # Using local MySQL database server
ENDBLOCK;


# Paths and parameters for in silico screening using DIGS

BEGIN SCREENSETS;
    query_aa_fasta=/home2/giff01r/DIGS/projects/eve/final_fasta/flavi-probes.faa           # Path to polypeptide sequence probe library
    reference_aa_fasta=/home2/giff01r/DIGS/projects/eve/final_fasta/flavi-references.faa   # Path to polypeptide sequence reference library
    output_path=./tmp/;        # Temporary folder for BLAST output parsing
    bitscore_min_tblastn=60;   # Bitscore cut-off for recording tBLASTn hits 
    seq_length_minimum=40;     # Sequence length cut-off for recording BLAST hits 
    defragment_range=100;      # Length of gap (nt) required between hits for them to be regarded as separate
    consolidate_range=3000;
ENDBLOCK;


# List of target genomes to screen
# NOTE: the list below includes only those organisms found to have EFVs in a broader screen 

BEGIN TARGETS;
    Mollusca/Elysia_chlorotica/
    Cnidaria/Craspedacusta_sowerbyi/
    Arthropoda/Aedes_aegypti/
    Arthropoda/Aedes_albopictus/
    Arthropoda/Amphinemura_sulcicollis/
    Arthropoda/Andricus_curvator/
    Arthropoda/Andricus_quercusramuli/
    Arthropoda/Anopheles_minimus/
    Arthropoda/Anopheles_sinensis/
    Arthropoda/Anoplophora_glabripennis/
    Arthropoda/Calycopis_cecrops/
    Arthropoda/Ceratina_australensis/
    Arthropoda/Ceratina_calcarata/
    Arthropoda/Chironomus_riparius/
    Arthropoda/Chironomus_tentans/
    Arthropoda/Condylostylus_patibulatus/
    Arthropoda/Daphnia_magna/
    Arthropoda/Dufourea_novaeangliae/
    Arthropoda/Eufriesea_mexicana/
    Arthropoda/Eurytemora_affinis/
    Arthropoda/Euschistus_heros/
    Arthropoda/Gerris_buenoi/
    Arthropoda/Habropoda_laboriosa/
    Arthropoda/Ixodes_ricinus/
    Arthropoda/Lasioglossum_albipes/
    Arthropoda/Laupala_kohalensis/
    Arthropoda/Lednia_tumana/
    Arthropoda/Lepidurus_arcticus/
    Arthropoda/Megachile_rotundata/
    Arthropoda/Nomia_melanderi/
    Arthropoda/Operophtera_brumata/
    Arthropoda/Osmia_bicornis_bicornis/
    Arthropoda/Tipula_oleracea/
    Arthropoda/Xenocatantops_brachycerus/
    Actinopterygii/Austrofundulus_limnaeus/
    Actinopterygii/Stylephorus_chordatus/
    Actinopterygii/Boleophthalmus_pectinirostris/
    Actinopterygii/Brosme_brosme/
    Actinopterygii/Maccullochella_peelii/
    Actinopterygii/Mora_moro/
    Actinopterygii/Phycis_blennoides/
    Actinopterygii/Phycis_phycis/
    Actinopterygii/Takifugu_bimaculatus/
    Actinopterygii/Takifugu_flavidus/
    Actinopterygii/Takifugu_rubripes/
ENDBLOCK;

