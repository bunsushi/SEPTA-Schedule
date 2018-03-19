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

var currentTime;
// var fullYear = moment(currentTime).subtract(1, "years");

// Capture Admin Button Click
$("#add-train").on("click", function (event) {
    event.preventDefault();

    // Store and retrieve admin schedule input
    train = $("#train-name-input").val().trim();
    destination = $("#destination-input").val().trim();
    firstTrain = $("#first-train-input").val().trim();
    frequency = $("#frequency-input").val().trim();

    currentTime = moment().format("hh:mm A");

    // Push to Firebase
    database.ref().child('trains').push({

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

// ATTN: Error code = moment construction falls back to to js date
// moment is current non-deprecrated
// > moment("2014-04-25T01:32:21.196Z");  // iso string, utc timezone
// > moment("2014-04-25T01:32:21.196+0600");  // iso string with timezone
// > moment("2014 04 25", "YYYY MM DD"); // string with format

// Update minutes away by triggering change in firebase children
function timeUpdater() {
    database.ref().child('trains').once('value', function (snapshot) {
        snapshot.forEach(function (childSnapshot) {
            currentTime = moment().format("hh:mm A");
            database.ref('trains/' + childSnapshot.key).update({
                currentTime: currentTime
            })
        })
    });
};

setInterval(timeUpdater, 1000);

// // Fetch data from Firebase
database.ref().child('trains').on("value", function (childSnapshot) {
    $('tbody').empty();

    childSnapshot.forEach(function (childSnapshot) {

        train = childSnapshot.val().train;
        destination = childSnapshot.val().destination;
        firstTrain = childSnapshot.val().firstTrain;
        frequency = childSnapshot.val().frequency;

//         var firstTrainConverted = moment(firstTrain, "HH:mm").subtract(1, "years");
//         var fullYear = moment(currentTime).subtract(1, "years");


//         var diffDate = moment(currentTime).diff(moment(fullYear), "minutes");
//         var diffTime = moment().diff(moment(firstTrainConverted), "minutes");

//         var remainder = (diffTime - diffDate) % frequency;
//         var minutesAway = frequency - remainder;

//         var nextTrain = moment().add(minutesAway, "minutes");
//         nextTrain = moment(nextTrain).format("hh:mm A");

        var row = $("<tr>");
        row.append("<td>" + train + "</td>");
        row.append("<td>" + destination + "</td>");
        row.append("<td>" + frequency + "</td>");
        // row.append("<td>" + nextTrain + "</td>");
        // row.append("<td>" + minutesAway + "</td>");
        $("#train-table").append(row);
        $("#ui-train-table").append(row);

    });
}, function (errorObject) {
    console.log("Errors handled: " + errorObject.code);
});

// database.ref().child('trains').on("child_changed", function (childSnapshot) {
//     $('tbody').empty();

//     childSnapshot.forEach(function (childSnapshot) {

//         train = childSnapshot.val().train;
//         destination = childSnapshot.val().destination;
//         firstTrain = childSnapshot.val().firstTrain;
//         frequency = childSnapshot.val().frequency;

//         var firstTrainConverted = moment(firstTrain, "HH:mm").subtract(1, "years");
//         var fullYear = moment(currentTime).subtract(1, "years");


//         var diffDate = moment(currentTime).diff(moment(fullYear), "minutes");
//         var diffTime = moment().diff(moment(firstTrainConverted), "minutes");

//         var remainder = (diffTime - diffDate) % frequency;
//         var minutesAway = frequency - remainder;

//         var nextTrain = moment().add(minutesAway, "minutes");
//         nextTrain = moment(nextTrain).format("hh:mm A");

//         var row = $("<tr>");
//         row.append("<td>" + train + "</td>");
//         row.append("<td>" + destination + "</td>");
//         row.append("<td>" + frequency + "</td>");
//         row.append("<td>" + nextTrain + "</td>");
//         row.append("<td>" + minutesAway + "</td>");
//         $("#train-table").append(row);
//         $("#ui-train-table").append(row);

//     });
// }, function (errorObject) {
//     console.log("Errors handled: " + errorObject.code);
// });