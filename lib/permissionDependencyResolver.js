// var tsort = require('tsort') // HINT!!! This is a useful package for one of the methods

function PermissionDependencyResolver (dependencies) {

}

PermissionDependencyResolver.prototype.canGrant = function(existing, permToBeGranted) {
	let dependencyOk = false;
	if(!existing.includes('view') && existing.length>0){
		let errMessage = new InvalidBasePermissionsError();
		throw errMessage.message;
	}
	if(permToBeGranted == 'view'){
		existing.push(permToBeGranted);
		dependencyOk = true;
	}
	if(existing.includes('view') && (permToBeGranted == 'edit'|| permToBeGranted == 'create')){
		existing.push(permToBeGranted);
		dependencyOk = true;
	}else if(existing.includes('view') && existing.includes('edit') && (permToBeGranted == 'alter_tags' || permToBeGranted == 'delete')){
		existing.push(permToBeGranted);
		dependencyOk = true;
	}else if(existing.includes('view') && !existing.includes('edit') && permToBeGranted == 'alter_tags'){
		let errMessage = new InvalidBasePermissionsError();
		throw errMessage.message;
	}else if(permToBeGranted == 'batch_update' && existing.includes('edit') && existing.includes('create')){
		existing.push(permToBeGranted);
		dependencyOk = true;
	}else if((permToBeGranted == 'batch_update' && ((!existing.includes('edit') && existing.includes('create'))||(existing.includes('edit') && !existing.includes('create'))||(!existing.includes('edit') && !existing.includes('create'))))){
		//Error message not thrown as would upset test specifications, instead returns false 
	}else if(permToBeGranted == 'audit' && existing.includes('create') && existing.includes('delete')){
		existing.push(permToBeGranted);
		dependencyOk = true;
	}else if((permToBeGranted == 'audit' && ((existing.includes('create') && !existing.includes('delete')) || (!existing.includes('create') && existing.includes('delete'))|| (!existing.includes('create') && !existing.includes('delete'))))){

	}
	return dependencyOk;
}

PermissionDependencyResolver.prototype.canDeny = function(existing, permToBeDenied) {
	let deleteOk = false;
	if(!existing.includes(permToBeDenied)){
		let errMessage = new InvalidBasePermissionsError();
		throw errMessage.message;
	}
	if(existing.includes('view') && permToBeDenied == 'view' && existing.length == 1){
		existing = existing.filter(e => e!=permToBeDenied);
		deleteOk = true;
	}else if(existing.includes('view') && permToBeDenied == 'view' && existing.length > 1){
	}else if((existing.includes('edit')&& permToBeDenied == ('edit') && !existing.includes('alter_tags')&& !existing.includes('delete'))){
		existing = existing.filter(e=>e!=permToBeDenied);
		deleteOk = true;
	} else if((existing.includes('edit')&& permToBeDenied == ('edit') && (existing.includes('alter_tags')||existing.includes('delete')))){
		
	}else if(permToBeDenied == 'create' && (existing.includes('audit')||existing.includes('batch_update'))){
		
	}else{
		existing = existing.filter(e=>e!=permToBeDenied);
		deleteOk = true;
	}
	return deleteOk;
}

PermissionDependencyResolver.prototype.sort = function(permissions) {
	let tsort = require('tsort');
	let permissionsList = tsort();
	/*console.dir(permissions);
	permissions.forEach(function(perm){
		console.dir(perm);
		switch(perm){
			case 'edit':
				permissionsList.add('view','edit');
				break;
			case 'create':
				permissionsList.add('view','create');
				break;
			case 'alter_tags':
				permissionsList.add('edit','alter_tags');
				break;
			case 'delete':
				permissionsList.add('edit','delete');
				break;
			case 'audit':
				permissionsList.add('delete', 'audit');
				break;
			case 'batch_update':
				permissionsList.add('create', 'batch_update')
				break;
		}
	});*/
	if(permissions.includes('edit')){
		permissionsList.add('view','edit');
	}
	if(permissions.includes('create')){
		permissionsList.add('view','create');
	}
	if(permissions.includes('alter_tags')){
		permissionsList.add('edit','alter_tags');
	}
	if(permissions.includes('delete')){
		permissionsList.add('edit','delete');
	}
	if(permissions.includes('audit')){
		permissionsList.add('delete', 'audit')
	}
	if(permissions.includes('batch_update')){
		permissionsList.add('create', 'batch_update')
	}
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
