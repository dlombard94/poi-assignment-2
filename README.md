Welcome to the POI - Islands
===========================

A project to demonstrate a simple POI Web Application.

This is an hapi.js project, designed using Webstorm IDE. It includes basic hapi setup, templating, routing and session support + rudimentary user accounts. It is backed by a simple mongodb atlas database.
Uses cloudinary API for picture management.

The app is assignment 1 for Enterprise Web Development

The app was deployed via heroku and can be found at the following:

- https://whispering-thicket-82912.herokuapp.com/

App Summary
-----------

- preloads a list of islands around Ireland
- user/admin can login/register
- can add new islands
- can filter islands on location
- can update island info
- can delete pics
- can delete user account



The following user account has been pre-loaded, so you can log in:

~~~
    {
      "firstName": "homer",
      "lastName": "simpson",
      "email": "homer@simpson.com",
      "password": "secret",
    }
~~~

The following admin account has been pre-loaded, so you can log in:

~~~
    {
      "firstName": "admin",
      "lastName": "admin",
      "email": "admin@admin.com",
      "password": "admin",
    }
~~~


