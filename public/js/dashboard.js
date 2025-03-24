$(document).ready(function () {
  // Create and load the script for Google Maps
  const script = document.createElement("script")
  script.src = `https://maps.googleapis.com/maps/api/js?key=${CONFIG.GOOGLE_MAPS_API_KEY}&libraries=places`
  script.async = true
  script.defer = true
  script.onload = function () {
    // Ensure the map is initialized only after the script has loaded
    initMap()
  }
  document.head.appendChild(script)

  // Load the modal structure
  $("#modal-placeholder").load("components/event_modal.html")
  $("#create-event-modal-placeholder").load(
    "components/create_event_modal.html",
    function () {
      // Ensure that dates can only be chosen for today or after
      $("#eventDate").attr("min", new Date().toISOString().split("T")[0])
      // Create an event
      $("#createEventButton").on("click", function (e) {
        e.preventDefault()
        const name = $("#eventName").val()
        const contactInfo = $("#eventContactInfo").val()
        const category = $("#eventCategory").val()
        const visibility = $("#eventVisibility").val()
        const date = $("#eventDate").val()
        const time = $("#eventTime").val()
        const location = $("#eventLocation").val()
        const description = $("#eventDescription").val()
        // Send a datetime ISO String which represents the date and time as one string
        const datetime = new Date(`${date}T${time}:00`).toISOString()
        // TODO: Convert the duration to a TIME object which can be recognized by MySQL
        const hours = $("#eventDurationHours").val()
        const minuets = $("#eventDurationMinutes").val()
        //let duration = hours.toString().padStart(2, '0') + ":" + minuets.toString().padStart(2, '0') + ":" + "00"

        createEvent(
          name,
          contactInfo,
          category,
          visibility,
          datetime.replace("T", " "),
          location,
          description
        )
      })
    }
  )

  loadEventCards("")
  document.addEventListener("DOMContentLoaded", initMap)
})

function loadEventCards(query) {
  $("#eventContainer").empty()
  getEvents(query).then(([code, result]) => {
    if (result["Results"] === undefined) {
      $("#eventContainer").append(
        '<p style="display: flex; justify-content: center; align-items: center; height: 100%;">No Events. Go out and Create Some!</p>'
      )
    } else {
      result["Results"].forEach((event) => {
        // Add a container w/ id = uuid of the event.
        // This will make loading info about an event easier.
        $("#eventContainer").append(
          `<div class="eventCard" id="event-${event.e_id}"></div>`
        )

        // Grab the most recently added event card and inject the 'event_card.html' into it.
        // Use the callback to insert anything else into the card that we want to modify
        $(".eventCard")
          .last()
          .load("components/event_card.html", function () {
            // This callback function runs after the content is loaded
            $(this).find("h5").text(event.name)
            $(this).find("h6").text(event.category)
            // Load the modal content for the event card when the link is clicked
            $(this)
              .find(".card-body a")
              .on("click", function () {
                loadEventModal(event)
              })
          })
      })
    }
  })
}

async function getEvents(searchQuery = "") {
  // Need the uuid of the user to make queries
  const user = getUser()
  return await callAPI(
    "/findEvent.php",
    {
      university: user.u_id,
      name: searchQuery,
    },
    "POST"
  )
}

function loadEventModal(event) {
  // Populate the modal with the event information
  $("#event-modal .modal-title").text(event.name)
  $("#event-modal .modal-body").html(`
    <p>Type: ${event.category}</p>
    <p>Description: ${event.description}</p>
  `)

  // Show the modal
  $("#event-modal").modal("show")
}

async function createEvent(
  name,
  contactInfo,
  category,
  visibility,
  date,
  location,
  description
) {
  await callAPI(
    "/createEvent.php",
    {
      u_id: getUser().u_id,
      name: name,
      contact_info: contactInfo,
      category: category,
      visibility: visibility,
      time: date,
      location: location,
      description: description,
    },
    "POST"
  )
}
// Initialize Google Maps integrations
function initMap() {
  let map
  let marker
  let autocomplete
  // Set a default location for the map to pin point on
  const defaultLocation = { lat: 28.5383, lng: -81.3792 }

  // Define a map object
  map = new google.maps.Map(document.getElementById("map"), {
    center: defaultLocation,
    zoom: 13,
  })

  marker = new google.maps.Marker({
    position: defaultLocation,
    map: map,
    draggable: true,
  })

  // Change the location when the user is done dragging
  google.maps.event.addListener(marker, "dragend", function () {
    const position = marker.getPosition()
    document.getElementById("eventLatitude").value = position.lat()
    document.getElementById("eventLongitude").value = position.lng()
  })

  const input = document.getElementById("eventLocation")
  autocomplete = new google.maps.places.AutocompleteService()

  // Bias the input to be relative to the users relative location
  // TODO fix this
  autocomplete.bindTo("AutocompleteService.getPlacePrediction", map)

  autocomplete.addListener("place_changed", function () {
    const place = autocomplete.getPlace()

    if (!place.geometry || !place.geometry.location) {
      console.log("No details for this location")
      return
    }

    map.setCenter(place.geometry.load)
    map.setZoom(15)
    marker.setPosition(place.geometry.location)

    // Update hidden inputs to store the desired location
    document.getElementById("eventLatitude").value =
      place.geometry.location.lat()
    document.getElementById("eventLongitude").value =
      place.geometry.location.lng()
    console.log(
      `Event location changed! ${place.geometry.location.lat()} and ${place.geometry.location.lng()}`
    )
  })
}
