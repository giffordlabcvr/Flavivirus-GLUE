# Flavivirus-GLUE: Phylogenomic Analysis of Flaviviruses

Welcome to Flavivirus-GLUE, a sequence-oriented resource for comparative genomic analysis of flavivirids, developed using the [GLUE software framework](https://github.com/giffordlabcvr/gluetools).

## Overview

The **Flavivirids** (family *Flaviviridae*) comprise enveloped, positive-strand RNA viruses, many of which pose serious risks to human health on a global scale. Arthropod-borne flaviviruses such as Zika virus (ZIKV), Dengue virus (DENV), and yellow fever virus (YFV) are the causative agents of large-scale outbreaks that result in millions of human infections every year, while the bloodborne hepatitis C virus (HCV) is a major cause of chronic liver disease. 

**[GLUE](https://github.com/giffordlabcvr/gluetools)** is an open, integrated software toolkit designed for storing and interpreting sequence data. It supports the creation of bespoke projects, incorporating essential data items for comparative genomic analysis, such as sequences, multiple sequence alignments, genome feature annotations, and other associated data.

Projects are loaded into the GLUE "engine," forming a relational database that represents the semantic relationships between data items. This foundation supports systematic comparative analyses and the development of sequence-based resources.

**Flavivirus-GLUE** contains Flavivirus feature definitions, alignments, and reference sequences for all Flavivirus species.

  - **[Flavivirus-GLUE-EVE](https://github.com/giffordlabcvr/Flavivirus-GLUE-EVE)**: extends Flavivirus-GLUE through the incorporation of endogenous flaviviral elements.

## Table of Contents

- [Overview](#overview)
- [Key Features](#key-features)
- [Installation](#installation)
- [Usage](#usage)
- [Data Sources](#data-sources)
- [Contributing](#contributing)
- [License](#license)
- [Contact](#contact)

## Key Features


- **GLUE Framework Integration**: Built on the GLUE software framework, Flavivirus-GLUE offers an extensible platform for efficient, standardized, and reproducible computational genomic analysis of Flaviviruses.

- **Phylogenetic Structure**: Sequence data in Flavivirus-GLUE is organized in a phylogenetically-structured manner, allowing users to explore evolutionary relationships easily.

- **Rich Annotations**: Annotated reference sequences enable rigorous comparative genomic analysis related to conservation, adaptation, structural context, and genotype-to-phenotype associations.
  
- **Reproducibility**: Ensures fully reproducible analyses through data standards and a relational database.
  
- **Reusable Data Objects**: High-value data items such as multiple sequence alignments are prepared once and reused.
  
- **Validation**: Enforces high data integrity through cross-validation.
  
- **Standardisation of Genomic Coordinates**: All sequences use the coordinate space of a chosen reference sequence.
  
- **Predefined Reference Sequences**: Includes fully-annotated reference sequences for Flavivirus species.
  
- **Alignment Trees**: Links alignments constructed at distinct taxonomic levels, maintaining a standardised coordinate system.
  

## Installation

If you have not done so already, install the GLUE software framework by following the [installation instructions](http://glue-tools.cvr.gla.ac.uk/#/installation) on the GLUE web site: 

Download the Flavivirus-GLUE repository, navigate into the top-level directory, and start the GLUE command line interpreter.

### Steps

1. **Build the Core Project**:
   
```
   Mode path: /
   GLUE> run file buildCoreProject.glue
```

This command builds the core project, representing diversity among the Flavivirus family via a minimal annotated species reference sequences.

## Usage

GLUE contains an interactive command line environment focused on the development and use of GLUE projects by bioinformaticians. This provides a range of productivity-oriented features such as automatic command completion, command history and interactive paging through tabular data. 

For detailed instructions on how to use Flavivirus-GLUE for your comparative genomic analysis, refer to the GLUE's [reference documentation](http://glue-tools.cvr.gla.ac.uk/).

## Data Sources

Flavivirus-GLUE relies on the following data sources:

- [NCBI Nucleotide](https://www.ncbi.nlm.nih.gov/nuccore)


## Contributing

We welcome contributions from the community! If you're interested in contributing to Flavivirus-GLUE, please review our [Contribution Guidelines](./md/CONTRIBUTING.md).

[![Contributor Covenant](https://img.shields.io/badge/Contributor%20Covenant-2.1-4baaaa.svg)](./md/code_of_conduct.md)


## License

The project is licensed under the [GNU Affero General Public License v. 3.0](https://www.gnu.org/licenses/agpl-3.0.en.html)

## Contact

For questions, issues, or feedback, please open an issue on the [GitHub repository](https://github.com/giffordlabcvr/Flavivirus-GLUE/issues).

