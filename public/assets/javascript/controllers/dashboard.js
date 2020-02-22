/**
dashboard.js

Created by Bernard Kintzing on 2/17/20
*/

// UI element variables
var dashboardTitle = document.getElementById("dashboard-title");
var searchField = document.getElementById("search-field");
var buildingName = document.getElementById("building-name");
var buildingDescription = document.getElementById("building-description");
var issuesLabel = document.getElementById("issues-label");
var issues = document.getElementById("issues");
var submitBuildingButton = document.getElementById("submit-building");

// Unique identifiers for each issue
var issueID = 0;

// Hold onto all issue elements
var issuesDict = {};

// Safe guard to make sure a user who is not
// signed in can not access the dashboard
user.registerListener(function(val) {
	if (!val) {
		window.location.replace("index.html");
	} else {
		// If user has a displayName, update the
		// dashboard title
		var displayName = val.displayName;
		if (displayName != null) {
			dashboardTitle.innerHTML = displayName + "'s Dashboard";
		}

		// After user is signed in all buildings
		// are retrieved from the database.
		promise = retrieveBuildingsFromDatabase();
		promise.then(function(result) {
			var success = result[0];
			var data = result[1];

			if (success) {
				// Buildings successfully downloaded
				// Update the UI to display buildings
				populateBuildings(buildings);
			} else {
				alert("Unable to retrieve buildings");
			}
		});
	}
});

// Attempt to sign out the user
function signOut() {
	promise = signOutFirebaseUser();
	promise.then(function(result) {
		if (result == true) {
			// User successfully signed out, redirect
			// them to the home page
			window.location.replace("index.html");
		} else {
			alert(result);
		}
	});
}

// Attempt to send a new building to the database
function submitBuilding() {
	// Retrieve building information
	var buildingNameValue = buildingName.value;
	var buildingDescriptionValue = buildingDescription.value;
	var issueValues = [];

	if (modal.data != "create-building") {
		promise = removeBuildingFromDatabase(modal.data);

		promise.then(function(result) {
			if (result == modal.data) {
				modal.data = buildingNameValue;
			}
		});
	} else {
		var checkBuilding = getBuildingByName(buildingNameValue)

		if (checkBuilding != null) {
			alert("A building already exists with that name")
			return
		}
	}

	// Retrive building issues
	issueElements = issues.getElementsByTagName("input");

	for (i = 0; i < issueElements.length; i++) {
		issueValues.push(issueElements[i].value);
	}

	promise = addBuildingToDatabase(
		buildingNameValue,
		buildingDescriptionValue,
		issueValues
	);

	promise.then(function(result) {
		if (result == true) {
			closeModal();
			alert("Building successfully added");
			populateBuildings(buildings);
		} else {
			alert(result);
		}
	});
}

function populateBuildings(content) {
	var buildingsElement = document.getElementById("buildings");
	buildingsElement.innerHTML = "";

	for (i = 0; i < content.length; i++) {
		buildingsElement.innerHTML +=
			'<div class="building"><h2>' +
			content[i].name +
			"</h2><button onclick=\"removeBuilding('" +
			content[i].name +
			"')\">Remove Building</button><button onclick=\"displayPopulatedModal('" +
			content[i].name +
			"')\">View More</button><p>" +
			content[i].description +
			"</p><p>" +
			content[i].issues.length +
			" Issues</p></div>";
	}
}

// Sort the buildings based on user 
// selected parameter
function sortBuildings(select) {
	buildings = sortBuildingsByParameter(
		buildings,
		select.options[select.selectedIndex].text
	);
	populateBuildings(buildings);
}

// Remove the building from database
function removeBuilding(name) {
	promise = removeBuildingFromDatabase(name)
	promise.then(function(result){
		console.log(result)
		if(result == name) {
			console.log("ins")
			populateBuildings(buildings)
		} else {
			alert(error)
		}
	})
}

function searchBuildings() {
	var query = searchField.value;
	var queryResult = [];

	for (i = 0; i < buildings.length; i++) {
		if (buildings[i].name.toLowerCase().includes(query.toLowerCase())) {
			queryResult.push(buildings[i]);
		}
	}

	populateBuildings(queryResult);
}

function displayPopulatedModal(name) {
	var building = getBuildingByName(name);

	if (building != null) {
		// Reset unique issue IDs
		issueID = 0;
		issuesDict = {};
		issues.innerHTML = "";

		buildingName.value = building.name;
		buildingDescription.value = building.description;

		if (building.issues.length > 0) {
			issuesLabel.classList.remove("hidden");
			for (i = 0; i < building.issues.length; i++) {
				var newIssue = document.createElement("div");
				newIssue.classList.add("issue-wrapper");
				newIssue.innerHTML =
					'<input id="issue' +
					issueID +
					'" type="text" placeholder="New Issue" name="issue' +
					issueID +
					'" value="' +
					building.issues[i] +
					'"required> <span class="close" onclick="removeIssueField(' +
					issueID +
					')">&times;</span>';

				issues.appendChild(newIssue);

				issuesDict[issueID] = newIssue;
				issueID++;
			}
		} else {
			issuesLabel.classList.add("hidden");
		}

		modal.data = building.name;
		modal.style.display = "block";
	}
}

// Display an empty modal for user to
// create a new building
function displayBlankModal() {
	// Reset the modal to a blank form
	issueID = 0;
	buildingName.value = "";
	buildingDescription.value = "";
	issues.innerHTML = "";
	issuesLabel.classList.add("hidden");
	issuesDict = {};

	modal.data = "create-building";
	modal.style.display = "block";
}

// Hide the modal when user clicks on X
// in top right
function closeModal() {
	modal.style.display = "none";
}

// Hide modal is user clicks anywhere on
// page besides modal
window.onclick = function(event) {
	if (event.target == modal) {
		modal.style.display = "none";
	}
};

// Add a new issue input field
function addIssueField() {
	// If this is the first issue display the
	// issues label
	if (Object.keys(issuesDict).length == 0) {
		issuesLabel.classList.remove("hidden");
	}

	var newIssue = document.createElement("div");
	newIssue.classList.add("issue-wrapper");
	newIssue.innerHTML =
		'<input id="issue' +
		issueID +
		'" type="text" placeholder="New Issue" name="issue' +
		issueID +
		'" required> <span class="close" onclick="removeIssueField(' +
		issueID +
		')">&times;</span>';
	issues.appendChild(newIssue);

	issuesDict[issueID] = newIssue;
	issueID++;
}

// Remove and issue field given the issue number
function removeIssueField(num) {
	var issue = issuesDict[num];

	// Remove the element
	issue.remove();
	delete issuesDict[num];

	// If all issues are removed, then hide issues label
	if (Object.keys(issuesDict).length == 0) {
		issuesLabel.classList.add("hidden");
	}
}
