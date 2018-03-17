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
var train = "";
var destination = "";
var firstTrain;
var frequency;

// Capture Admin Button Click
$("#add-train").on("click", function (event) {
    event.preventDefault();

    // Store and retrieve admin schedule input
    train = $("#train-name-input").val().trim();
    destination = $("#destination-input").val().trim();
    firstTrain = $("#first-train-input").val().trim();
    frequency = $("#frequency-input").val().trim();

    var firstTrainConverted = moment(firstTrain, "HH:mm").subtract(1, "years");
    var timeDifference = moment().diff(moment(firstTrainConverted), "minutes");
    var remainder = timeDifference % frequency;
    var minutesAway = frequency - remainder;
    var nextArrival = moment().add(minutesAway, "minutes");
    var arrivalTime = moment(nextArrival).format("HH:mm");

    console.log("CURRENT TIME:" + moment());
    console.log("TRAIN: " + train);
    console.log("DESTINATION: " + destination);
    console.log("FIRST TRAIN: " + firstTrain);
    console.log("FREQUENCY: " + frequency);
    console.log("ARRIVAL TIME: " + arrivalTime);
    console.log("MINUTES AWAY: " + minutesAway);
    console.log("FIRST TRAIN CONVERTED: " + firstTrainConverted);
    console.log("TIME DIFFERENCE: " + timeDifference);
    console.log("REMAINDER: " + remainder);

    //Push to Firebase
    database.ref().push({

        train: train,
        destination: destination,
        firstTrain: firstTrain,
        frequency: frequency,
        minutesAway: minutesAway,
        nextArrival: arrivalTime
    });
});

database.ref().on("child_added", function (childSnapshot) {

    // ATTN How do you dynamically update the DOM?
    $("#train-table").append("<tr><td>" + childSnapshot.val().train + "</td><td>" + childSnapshot.val().destination + "</td><td>" + childSnapshot.val().frequency + "</td><td>" + childSnapshot.val().nextArrival + "</td><td>" + childSnapshot.val().minutesAway + "</td></tr>");
}, function (errorObject) {
    console.log("Errors handled: " + errorObject.code);
});