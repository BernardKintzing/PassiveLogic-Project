/**
firebase.js

Created by Bernard Kintzing on 2/13/20

This file handles all interactions with Firebase
*/

// Firebase Variables
var auth = firebase.auth();
var database = firebase.database();

// User object
var user = {
	aInternal: null,
	aListener: function(val) {},
	set data(val) {
		this.aInternal = val;
		this.aListener(val);
	},
	get data() {
		return this.aInternal;
	},
	registerListener: function(listener) {
		this.aListener = listener;
	}
};

// Building object
function building() {
	return {
		name: "",
		description: "",
		dateModified: "",
		issues: []
	};
}

// Store all buildings
var buildings = [];
var buildingParameter = "Alphabetically";

// Firebase Auth Functions

// Listener method for state of user
// If user is signed in, their profile is retrieved
// If signed out, user is set to null
auth.onAuthStateChanged(function(updatedUser) {
	user.data = updatedUser;
});

// Sign user in with a given username and email
async function signInWithEmailAndPassword(email, password) {
	return auth
		.signInWithEmailAndPassword(email, password)
		.then(function(result) {
			return result;
		})
		.catch(function(error) {
			return error;
		});
}

// Create a user account with given name, email, and password
async function createUserWithEmailAndPassword(email, password) {
	return auth
		.createUserWithEmailAndPassword(email, password)
		.then(function(result) {
			// User account successfully created
			return result;
		})
		.catch(function(error) {
			return error;
		});
}

// Sign out the current user
async function signOutFirebaseUser() {
	return auth
		.signOut()
		.then(function() {
			// Successfully signed out
			return true;
		})
		.catch(function(error) {
			return error;
		});
}

// Update the users display name in Firebase auth
function updateUserDisplayName(name) {
	user.data.updateProfile({
		displayName: name
	});
}

// Firebase Realtime Database functions

// Retrieve all buildings from the database
async function retrieveBuildingsFromDatabase() {
	if (user.data) {
		return database
			.ref("users/" + user.data.uid + "/buildings/")
			.once("value")
			.then(function(snapshot) {
				// Convert the snapshot into an array
				snapshot.forEach(function(buildingSnapshot) {
					var newBuilding = building();

					// Update information for new building
					newBuilding.name = buildingSnapshot.key;
					newBuilding.description = buildingSnapshot
						.child("description")
						.val();
					newBuilding.dateModified = buildingSnapshot
						.child("dateModified")
						.val();

					// If there are no building issues, set issues to
					// an empty array rather than null
					buildingIssues = buildingSnapshot.child("issues").val();
					if (buildingIssues != null) {
						newBuilding.issues = buildingIssues;
					}

					// Store building in local storage
					buildings.push(newBuilding);
				});

				return [true, buildings];
			})
			.catch(function(error) {
				return [false, error];
			});
	} else {
		return "Unable to retrieve user account";
	}
}

// Attempt to add a building to the database, if the insert
// fails the error message is sent back to the user.
async function addBuildingToDatabase(name, description, issues) {

	if (user.data) {
		// Retrieve current date formateed as yyyy-mm-ddThh:mm:ss
		var now = new Date().toISOString().slice(0, 19);

		return database
			.ref("users/" + user.data.uid + "/buildings/" + name)
			.set({
				description: description,
				dateModified: now,
				issues: issues
			})
			.then(function() {
				// Building successfully added

				// Update local buildings array
				var newBuilding = building();

				newBuilding.name = name;
				newBuilding.description = description;
				newBuilding.issues = issues;
				newBuilding.dateModified = now;

				// Add building to local storage
				buildings.push(newBuilding);
				buildings = sortBuildingsByParameter(
					buildings,
					buildingParameter
				);
				return true;
			})
			.catch(function(error) {
				return error;
			});
	} else {
		return "Unable to retrieve user account";
	}
}

// Attempt to remove building from database. If
// building is successfully removed it is then 
// removed from local storage.
async function removeBuildingFromDatabase(name) {
	return database
		.ref("users/" + user.data.uid + "/buildings/" + name)
		.remove()
		.then(function() {
			// Building successfully removed
			for(i = 0; i < buildings.length; i++) {
				if (buildings[i].name == name) {
					buildings.splice(i, 1);
				}
			}
			return name;
		})
		.catch(function(error) {
			return error;
		});
}

// Sort the buildings alphabetically using merge sort
function sortBuildingsByParameter(unsortedBuildings, parameter) {
	// Set current sort to parameter
	buildingParameter = parameter;

	// No need to sort the array if there is one building or less
	if (unsortedBuildings.length <= 1) {
		return unsortedBuildings;
	}
	// Find middle of buildings array
	var middle = Math.floor(unsortedBuildings.length / 2);

	// Split the building array in half down
	// the middle
	var left = unsortedBuildings.slice(0, middle);
	var right = unsortedBuildings.slice(middle);

	// Recursively sort the buildings depending on
	// the parameter
	if (parameter == "Alphabetically") {
		return mergeBuildingsAlphabetically(
			sortBuildingsByParameter(left, parameter),
			sortBuildingsByParameter(right, parameter)
		);
	} else if (parameter == "Date Modified") {
		return mergeBuildingsByDate(
			sortBuildingsByParameter(left, parameter),
			sortBuildingsByParameter(right, parameter)
		);
	} else if (parameter == "Issues") {
		return mergeBuildingsIssuesCount(
			sortBuildingsByParameter(left, parameter),
			sortBuildingsByParameter(right, parameter)
		);
	}
}

// Sort the building alphabetically by name
function mergeBuildingsAlphabetically(left, right) {
	let resultArray = [];

	// Sort the left and right array
	while (left.length && right.length) {
		if (left[0].name < right[0].name) {
			resultArray.push(left.shift());
		} else {
			resultArray.push(right.shift());
		}
	}

	// Combine final variable left in array
	resultArray = resultArray.concat(left.slice().concat(right.slice()));
	return resultArray;
}

// Sort the buildings by last date modified.
// More recently modified at the start of the
// array.
function mergeBuildingsByDate(left, right) {
	let resultArray = [];

	// Sort the left and right array
	while (left.length && right.length) {
		if (left[0].dateModified > right[0].dateModified) {
			resultArray.push(left.shift());
		} else {
			resultArray.push(right.shift());
		}
	}

	// Combine final variable left in arrays
	resultArray = resultArray.concat(left.slice().concat(right.slice()));
	return resultArray;
}

// Sort the buldings based on the number of
// issues.
// Buildings with more isses come first.
function mergeBuildingsIssuesCount(left, right) {
	let resultArray = [];

	// Sort the left and right array
	while (left.length && right.length) {
		if (left[0].issues.length > right[0].issues.length) {
			resultArray.push(left.shift());
		} else {
			resultArray.push(right.shift());
		}
	}

	// Combine final variable left in arrays
	resultArray = resultArray.concat(left.slice().concat(right.slice()));
	return resultArray;
}

// Return the corrent building base on
// building name. If no building is found
// null is returned
function getBuildingByName(name) {
	for (i = 0; i < buildings.length; i++) {
		if (buildings[i].name == name) {
			return buildings[i];
		}
	}

	// No building exists with given name
	return null;
}
