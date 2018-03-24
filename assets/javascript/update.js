// Current Time (Moment.js Analog Clock Dupe)
$(function () {
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
    apiKey: "AIzaSyDffk6cn0eHwYkZhqYqehmNibBVLvELX5E",
    authDomain: "trolley-tracker-193fd.firebaseapp.com",
    databaseURL: "https://trolley-tracker-193fd.firebaseio.com",
    projectId: "trolley-tracker-193fd",
    storageBucket: "trolley-tracker-193fd.appspot.com",
    messagingSenderId: "17928785860"
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

    currentTime = moment().format("HH:mm");

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

// The problem occurs when currentTime changes updates

// Update minutes away by triggering change in firebase children
function timeUpdater() {
    database.ref().child('trains').once('value', function (snapshot) {
        snapshot.forEach(function (childSnapshot) {
            currentTime = moment().format();
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

        var firstTrainConverted = moment(firstTrain, "HH:mm").subtract(1, "years");
        var fullYear = moment(currentTime).subtract(1, "years");


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
        row.append("<td>" + firstTrain + "</td>");
        // row.append("<td>" + childSnapshot.val().currentTime + "</td>");
        row.append("<td>" + nextTrain + "</td>");
        row.append("<td>" + minutesAway + "</td>");
        $("#train-table").append(row);
        $("#ui-train-table").append(row);

    });
}, function (errorObject) {
    console.log("Errors handled: " + errorObject.code);
});