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
console.log("CURRENT TIME: " + moment(currentTime).format("hh:mm LLL"));
var fullYear = moment(currentTime).subtract(1, "years");
console.log("PREVIOUS DAY: " + moment(fullYear).format("hh:mm LLL"));

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
        frequency: frequency,
        currentTime: currentTime
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

    var row = $("<tr>");
    row.append("<td>" + train + "</td>");
    row.append("<td>" + destination + "</td>");
    row.append("<td>" + frequency + "</td>");
    row.append("<td>" + nextTrain + "</td>");
    row.append("<td>" + minutesAway + "</td>");
    $("#train-table").append(row);
    $("#ui-train-table").append(row);

}, function (errorObject) {
    console.log("Errors handled: " + errorObject.code);
});