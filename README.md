# Trolley Tracker
A transit application that hosts up-to-date (albeit fictitious) trolley timetables for Southeastern Pennsylvania Transportation Authority (SEPTA).

## Summary
Trolley Tracker displays the following information for several trolley schedules for a single station, 40th St. Portal: route number, destination, frequency, next arrival time, and number of minutes until the next trolley. The landing page displays a clean time table; administrators can click on the Admin button on the right-hand corner of the schedule to add trolleys to the schedule.

The Next Arrival and Minutes Away columns update in real time--without refreshing the page--by communicating with the Google Firebase NoSQL database. Whenever the data change, the schedule synchronizes with database.

## Goals

For this application, I would like to add the ability to edit or delete trolley information in the admin panel, as well as add user authentication.

Future goals will be to expand the application to reflect the real-time location of all SEPTA trolleys and the time away from the closest station/stop to the user's geolocation using the SEPTA API (http://www3.septa.org/hackathon/TransitViewAll/).

## Languages & Technologies
Google Firebase (NoSQL), Moment.js jQuery, JavaScript, Bootstrap, HTML/CSS