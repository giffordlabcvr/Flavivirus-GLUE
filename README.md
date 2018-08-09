# Flaviviridae-GLUE

## Description

This is Flaviviridae-GLUE: a GLUE project for the [flaviviruses](https://viralzone.expasy.org/24?outline=all_by_species) (family Flaviviridae ).

[GLUE](http://tools.glue.cvr.ac.uk) is an open source, data-centric bioinformatics environment specialised for developing virus genome data resources (VGDR).

 This [GLUE](http://tools.glue.cvr.ac.uk) project contains reference information for the flavivirus family, including:

* A set of flavivirus reference sequences linked to auxiliary data.
* A comprehensive list of flavivirus genome features and their specific locations on full genome reference sequences.
* Alignments of flavivirus reference sequences arranged hierarchically by clade.

## Who can use this resource, and for what?

Flaviviridae-GLUE can be used a straightforward data repository, with no requirement for use of the GLUE software framework. 

In addition, the Flaviviridae-GLUE project can be developed within the GLUE framework by extending the core dataset with new data and functionality.
So far we have used Flaviviridae-GLUE to develop the following GLUE extension projects. 

* [Flaviviridae-EVE](https://giffordlabcvr.github.io/Flaviviridae-EVE/) - a GLUE project for endogenous flaviviral elements.

Note that Flaviviridae-GLUE serves as a data repository for circovirus reference data, and these data can be accessed here, without any requirement to install GLUE. 

## Installation

You can install Flaviviridae-GLUE on computers running Windows, MacOSX or Linux.

1. Install [GLUE](http://tools.glue.cvr.ac.uk), based on the [GLUE installation instructions](http://tools.glue.cvr.ac.uk/#/installation). 
2. Once GLUE is installed and working, clone the Flaviviridae-GLUE repository into your `gluetools/projects` directory.
3. Within the `gluetools/projects/Flaviviridae-GLUE` directory, start GLUE and build the Flaviviridae-GLUE extension by issuing the following command in GLUE:

```
Mode path: /
GLUE> run file flaviviridae.glue
```
4. This should run to completion and produce the `OK` result.


## Contributors

Robert J. Gifford (robert.gifford@glasgow.ac.uk)

Josh Singer (josh.singer@glasgow.ac.uk)


## License

The project is licensed under the [GNU Affero General Public License v. 3.0](https://www.gnu.org/licenses/agpl-3.0.en.html)
