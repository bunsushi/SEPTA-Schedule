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
var arrivalTime;
var minutesAway;

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

    //Push to Firebase
    database.ref().push({

        train: train,
        destination: destination,
        firstTrain: firstTrain,
        frequency: frequency,
    });
});

database.ref().on("child_added", function (childSnapshot) {

    train = childSnapshot.val().train;
    console.log("Train: " + train);
    destination = childSnapshot.val().destination;
    console.log("Destination: " + destination);
    firstTrain = childSnapshot.val().firstTrain;
    console.log("First Train: " + firstTrain);
    frequency = childSnapshot.val().frequency;
    console.log("Departs every " + frequency + " minutes");

    var firstTrainConverted = moment(firstTrain, "HH:mm").subtract(1, "years");

    var diffDate = moment(currentTime).diff(moment(fullYear), "minutes");
    console.log("DIFFERENCE IN DATE: " + diffDate);
    var diffTime = moment().diff(moment(firstTrainConverted), "minutes");
    console.log("DIFFERENCE IN TIME: " + diffTime);

    var remainder = (diffTime - diffDate) % frequency;
    console.log(remainder);
    var minutesAway = frequency - remainder;
    console.log("Next train is " + minutesAway + " minutes away");

    var nextTrain = moment().add(minutesAway, "minutes");
    nextTrain = moment(nextTrain).format("hh:mm A");
    console.log("ARRIVAL TIME: " + nextTrain);
    

    // ATTN How do you dynamically update the DOM?
    $("#train-table").append("<tr><td>" + train + "</td><td>" + destination + "</td><td>" + frequency + "</td><td>" + nextTrain + "</td><td>" + minutesAway + "</td></tr>");
}, function (errorObject) {
    console.log("Errors handled: " + errorObject.code);
});