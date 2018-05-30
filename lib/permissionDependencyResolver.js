// var tsort = require('tsort') // HINT!!! This is a useful package for one of the methods
let recievedDepencies;
function PermissionDependencyResolver (dependencies) {
	recievedDepencies = null;
	recievedDepencies = dependencies;
}

PermissionDependencyResolver.prototype.canGrant = function(existing, permToBeGranted) {
	let dependencyOk = false;
	let dependency
	
	for(let exist in existing){
		dependency = recievedDepencies[existing[exist]]
		if(dependency!=""){
			if(!existing.includes(dependency.toString())){
				let errMessage = new InvalidBasePermissionsError();
				throw errMessage.message;
			}
		}
	}
	for(let perm in recievedDepencies){
		if(permToBeGranted == perm){
			dependency = recievedDepencies[perm];
			dependencyList = Array.from(dependency)
			for(let dependent in dependencyList){
				if(existing.includes(dependencyList[dependent].toString())){
					dependencyOk = true;
				}else{
					return false;
				}
			}
		}
	}
	return dependencyOk;
}

PermissionDependencyResolver.prototype.canDeny = function(existing, permToBeDenied) {
	let deleteOk = false;
	let dependency = []

	for(let item in existing){
		dependency.push(recievedDepencies[existing[item]].toString())
	}
	
	if(dependency.includes(permToBeDenied)){
		return false;
	}else if(!existing.includes(permToBeDenied)){
		let errMessage = new InvalidBasePermissionsError();
		throw errMessage.message;
	}else{
		deleteOk = true
		}
	return deleteOk;
}

PermissionDependencyResolver.prototype.sort = function(permissions) {
	let tsort = require('tsort');
	let permissionsList = tsort();
	for(dependant in recievedDepencies){
		if(permissions.includes(dependant.toString())){
			let dependantList = Array.from(recievedDepencies[dependant.toString()])
			if(dependantList[0]==null){
				
			}else if(dependantList.length == 1){
				permissionsList.add(dependantList[0], dependant);
			}else{
				permissionsList.add(dependantList[0],dependantList[1], dependant);
			}
		}
	}
	console.dir(permissionsList.sort());
	permissions = permissionsList.sort();
	return permissions;
}

// you'll need to throw this in canGrant and canDeny when the existing permissions are invalid
function InvalidBasePermissionsError() {
  this.name = 'InvalidBasePermissionsError'
  this.message = "Invalid Base Permissions"
  this.stack = Error().stack;
}
InvalidBasePermissionsError.prototype = new Error()

module.exports = PermissionDependencyResolver
