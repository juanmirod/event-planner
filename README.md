# Event Meet-up planner

This is a sample project that implements some forms for authentication and event creation.
The app is responsive, all the forms offer feedback to the user about the input and they show
user friendly error messages when required. Input is autocompleted when posible and html5 inputs and geolocation service are used to help the user fill in the required inputs.

The application is built with:

* AngularJS + Bootstrap 
* Gulp for build process, test runner and development mode (live-reloading)
* Firebase Authentication and database services for backend 

## Requirements

You need node and npm installed on the system, also gulp-cli and bower installed globally to run gulp and bower without node_modules/... paths.

## Install and Run instructions

To install the project locally you just have to clone the repository:

```
$> git clone https://github.com/juanmirod/event-planner.git
```

And run npm install and bower install:

```
$> npm install
$> bower install
```

To run build the js and run the server:

```
$> gulp serve:dist
```

To run the server in development mode, watching for changes in js and css just run gulp default task:

```
$> gulp serve
```

Enjoy!

## Requirements of the exercise (as a personal reminder):

You do not need to create a functioning back-end or save user information. Only the form components themselves and their performance will be evaluated.

1) You do not need to create a real back-end or save user information, but the app must provide a form for users to create an account. Account creation should include, but is not limited to:

+ Name
+ Email address
+ Secure password (with character and length requirements)
+ Optional public biographical information (such as employer, job title, birthday, etc)

2) The app should allow users to create a new event. Each event should, at a minimum, allow a user to set:

+ Name of the event
+ Type of the event (birthday party, conference talk, wedding, etc.)
+ Event host (could be an individual’s name or an organization)
+ Event start date and time
+ Event end date and time
+ Guest list
+ Location
+ Optional message to the guests with additional information about the event

3) The app should display events that have been created.

4) Review the evaluation rubric for this project early and often.