# PassiveLogic-Project
A simple online user interface that allows users to create accounts, and manage buildings. The project is built using HTML, CSS, and Javascript. The project integrates with a Firebase backend to manage users, data and hosting. 

## How to use
To view and test the project visit [passivelogic-project.firebaseapp.com/](https://passivelogic-project.firebaseapp.com).

To run the project locally, clone the git repository then follow the steps provided by Firebase to create a project and initialize it locally. To serve on localhost run

```bash
firebase serve
```

## Purpose
This project is designed to mimic the basic functionality of the Passive-Logic dashboard.

## Functionality
This project is capable of creating user accounts and storing them in Firebase auth. A user is then capable of signing in using their username and password. If successful a user is redirected to their dashboard. From there they are able to create new buildings and store them in Firebase realtime database. A user is then able to edit or remove the building. Each building contains a description and a list of building issues. The user also has the option search based on building name or to sort the building alphabetically, by date modified, or by the number of issues. 

