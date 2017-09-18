# Easily publish your javascript and Typescript packages automatically with VSTS

Writing packages in the javascript world historically has been troublesome. The 
javascript community has been troubled with shifting and numerous standards for 
package development. In recent years the introduction of NodeJS has breathed life 
into the javascript community and provided the community with the Node Package 
Manager, NPM. 

Anyone who has been doing any work with front end development (or Node for that 
matter) knows full well the benefits of having a repository of packages that a 
development team can draw on. Many companies publish their common packages openly 
on freely on NPM to be shared with the community. Some companies are required by 
their security needs to keep their packages in an enterprise facing package 
management product like NPM Enterprise.

With VSTS, publishing NPM packages has never been easier! As a case study let's
take for example an open source package developed by myself, CaravanDb, a concise 
tool to allow you to easily create database migration scripts and apply them to a 
given environment.

## The Goal
To store my source in VSTS Git. When a pull request is created for the dev branch,
run the available unit tests and automatically merge it into dev. When merged into
dev, the package should be built and published to NPM under the tag "@dev".

Let's Begin!

## Step 1 - Configuring the Build

Assuming we have our application already in git (either VSTS git or even github), we now need to define a build definition. This will control how our application is built and tested.

