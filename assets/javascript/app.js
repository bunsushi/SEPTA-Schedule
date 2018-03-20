$(document).ready(function () {

// Current Time (Moment.js Analog Clock Dupe)
$(function() {
    function updateClock() {
      var now = moment(),
        second = now.seconds() * 6,
        minute = now.minutes() * 6 + second / 60,
        hour = (now.hours() % 12) / 12 * 360 + 90 + minute / 12;
  
      $("#hour").css("transform", "rotate(" + hour + "deg)");
      $("#minute").css("transform", "rotate(" + minute + "deg)");
      $("#second").css("transform", "rotate(" + second + "deg)");
    }
  
    function timedUpdate() {
      updateClock();
      setTimeout(timedUpdate, 1000);
    }
  
    timedUpdate();
  });

// Display Curent Date and Time
function displayTime() {
    var time = moment().format("llll");
    $('#display-time').html(time);
    setTimeout(displayTime, 1000);
}

displayTime();

// Initialize Firebase
var config = {
    apiKey: "AIzaSyDpXmCQeDFe-GqWdcuGuow3yhXyPALqJXY",
    authDomain: "septa-schedule.firebaseapp.com",
    databaseURL: "https://septa-schedule.firebaseio.com",
    projectId: "septa-schedule",
    storageBucket: "",
    messagingSenderId: "723045563457"
};

firebase.initializeApp(config);

var database = firebase.database();

// Initial values
var train;
var destination;
var firstTrain;
var frequency;

var currentTime = moment();
var fullYear = moment(currentTime).subtract(1, "years");

// Capture Admin Button Click
$("#add-train").on("click", function (event) {
    event.preventDefault();

    // Store and retrieve admin schedule input
    train = $("#train-name-input").val().trim();
    destination = $("#destination-input").val().trim();
    firstTrain = $("#first-train-input").val().trim();
    frequency = $("#frequency-input").val().trim();

    // Push to Firebase
    database.ref().push({

        train: train,
        destination: destination,
        firstTrain: firstTrain,
        frequency: frequency
    });

    // Clear input field
    $("#train-name-input").val("");
    $("#destination-input").val("");
    $("#first-train-input").val("");
    $("#frequency-input").val("");
});

database.ref().on("child_added", function (childSnapshot) {

    train = childSnapshot.val().train;
    destination = childSnapshot.val().destination;
    firstTrain = childSnapshot.val().firstTrain;
    frequency = childSnapshot.val().frequency;

    var firstTrainConverted = moment(firstTrain, "HH:mm").subtract(1, "years");

    var diffDate = moment(currentTime).diff(moment(fullYear), "minutes");
    var diffTime = moment().diff(moment(firstTrainConverted), "minutes");

    var remainder = (diffTime - diffDate) % frequency;
    var minutesAway = frequency - remainder;

    var nextTrain = moment().add(minutesAway, "minutes");
    nextTrain = moment(nextTrain).format("hh:mm A");

    console.log("First Train: " + firstTrain);
    console.log(moment(firstTrainConverted).format("LLL"));
    console.log(diffDate);
    console.log(diffTime);
    console.log(diffDate - diffTime);
    console.log(remainder);
    console.log("======================");

    var row = $("<tr>");
    row.append("<td>" + train + "</td>");
    row.append("<td><span class='glyphicon glyphicon-circle-arrow-right'></span> " + destination + "</td>");
    row.append("<td> Every " + frequency + " minutes</td>");
    row.append("<td>" + nextTrain + "</td>");
    row.append("<td>" + minutesAway + " minutes</td>");
    $("#train-table").append(row);
    $("#ui-train-table").append(row);

}, function (errorObject) {
    console.log("Errors handled: " + errorObject.code);
});

// HACKY REFRESH
setInterval(function() {
    location.reload();
}, 1000 * 60);

});