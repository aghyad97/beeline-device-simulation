const formId = "form"; // ID of the form
const url = location.href; //  href for the page
const formIdentifier = `${url} ${formId}`; // Identifier used to identify the form
const submitButton = document.querySelector("#submit"); // select save button
let form = document.querySelector(`#${formId}`); // select form
let formElements = form.elements; // get the elements in the form
const alertBox = document.querySelector(".alert"); // select alert display div

const getFormData = () => {
  let data = {
    [formIdentifier]: {}
  }; // create an empty object with the formIdentifier as the key and an empty object as its value
  for (const element of formElements) {
    if (element.name.length > 0) {
      data[formIdentifier][element.name] = element.value;
    }
  }
  return data;
};


submitButton.onclick = event => {
  data = getFormData();
  localStorage.setItem(formIdentifier, JSON.stringify(data[formIdentifier]));
  const message = "Form draft has been saved!";
  displayAlert(message);
};

const displayAlert = message => {
  alertBox.innerText = message;
  alertBox.style.display = "block";
  setTimeout(function () {
    alertBox.style.display = "none";
  }, 1000);
};
var lang;
var lat;
var map;
var currentLocation = new Array();
var destLocation = new Array();
const populateForm = () => {
  var i = 0;
  if (localStorage.key(formIdentifier)) {

    const savedData = JSON.parse(localStorage.getItem(formIdentifier)); // get and parse the saved data from localStorage
    console.log(savedData);
    if(savedData != null){
      for (const element of formElements) {
        if (element.name in savedData) {
          element.value = savedData[element.name];
          if (i < 1) {
            currentLocation.push(savedData[element.name]);
            i++;
          } else {
            destLocation.push(savedData[element.name])
          }
        }
      }
    }
    const message = "Form has been refilled with saved data!";
    currentLocation = String(currentLocation[0]).split(' ');
    destLocation = String(destLocation[0]).split(' ');
    console.log(currentLocation);
    console.log(destLocation);
    displayAlert(message);
  }
};

async function positionAjax(params) {
  var position;
  await $.ajax({
    url: "http://api.ipstack.com/176.204.96.32?access_key=480b880c9a30256f5f70aa7c8d5501bf",
    type: "GET",
    success: function (data) {
      lang = data.longitude;
      lat = data.latitude;
      console.log(lat);
      console.log(lang);
      position = [lat, lang];
    },
    error: function (data) {
      console.error(data);
      position = '';
    }
  });
  return position;
}

async function initializeMap() {
  if (currentLocation[0] === "" || currentLocation.length === 0 || currentLocation[0] === "undefined" || destLocation[0] === "undefined" || destLocation[0] === "" || destLocation.length === 0) {
    var position = await positionAjax();
    map = L.map('map').setView(position, 13);


  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(map);

    $('#currentLocation').val(position[0] + " " + position[1]);
    L.marker([lat, lang]).addTo(map)
      .bindPopup('Please enter your current <br> and destination locations')
      .openPopup();
      console.log('sass');
  } else {
    console.log('21212');
    map = L.map('map').setView(currentLocation, 13);
    var routeControl = L.Routing.control({
      waypoints: [
        L.latLng(currentLocation[0], currentLocation[1]),
        L.latLng(destLocation[0], destLocation[1])
      ],
    }).addTo(map);



  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(map);
    var routeArray = new Array();
    routeArray = routeControl.getWaypoints();
    var json = JSON.stringify(routeArray);
  }


}


var directions;
var chkReadyState = setInterval(function() {
  if (document.readyState == "complete") {
      // clear the interval
      directions = $('.leaflet-routing-alt').children().children().children().children();

      clearInterval(chkReadyState);
      for (let index = 0; index < directions.length; index++) {
        directions[index] = directions[index];
        console.log(directions[index]);
      }
  }
}, 1000);

document.onload = populateForm(); // populate the form when the document is loaded
document.onload = initializeMap();

// function submitForm(event) {
//   let dest = String($('#destLocation').val()).split(' ');
//   let current = String($('#currentLocation').val()).split(' ');
//   console.log(dest);
//   console.log(current);
//   map.invalidateSize(); // should work then

//   var routeControl = L.Routing.control({
//     waypoints: [
//       L.latLng(current[0], current[1]),
//       L.latLng(dest[0], dest[1])
//     ],
//   }).addTo(map);
//   console.log('dsd');

//   var routeArray = new Array();
//   routeArray = routeControl.getWaypoints();
//   var json = JSON.stringify(routeArray);
//   console.log(json);

// }