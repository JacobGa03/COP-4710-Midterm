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
  // Load the modal to create an event
  $("#create-event-modal-placeholder").load(
    "components/create_event_modal.html",
    function () {
      // Ensure that dates can only be chosen for today or after
      $("#eventDate").attr("min", new Date().toISOString().split("T")[0])
      $("#showRSOs").hide()

      // If the event visibility is changed to RSO, display a list of RSOs who can host the event
      $("#eventVisibility").on("change", function () {
        if (this.value == "rso") {
          $("#showRSOs").show()

          // Load RSO drop down and place the names
          $("#showRSOs").load("components/rso_select.html", function () {
            ;[...getUser().rso_admin].forEach((rso) => {
              getRSO(rso).then(([code, result]) => {
                if (code == 200) {
                  $("#chooseRSO").append(
                    `<option value="${rso}">${result["name"]}</option>`
                  )
                }
              })
            })
          })
        } else {
          $("#showRSOs").hide()
        }
      })

      // If the event type drop down is selected, then display list of RSO
      // Create an event
      $("#createEventButton").on("click", function (e) {
        e.preventDefault()
        const name = $("#eventName").val()
        // 2 different kinds of contact information
        const contactPhone = $("#eventContactPhone").val()
        const contactEmail = $("#eventContactEmail").val()
        const category = $("#eventCategory").val()
        const visibility = $("#eventVisibility").val()
        const date = $("#eventDate").val()
        const rso = $("#chooseRSO").val()
        const time = $("#eventTime").val()
        const location = {
          name: $("#locationName").val(),
          lat: $("#eventLatitude").val(),
          lng: $("#eventLongitude").val(),
        }
        // What room in the building will the event take place?
        const room = $("#eventRoom").val()
        const description = $("#eventDescription").val()

        // Send a datetime ISO String which represents the date and time as one string
        const datetime = new Date(`${date}T${time}:00`).toISOString()
        // Convert the duration to a TIME object which can be recognized by MySQL
        const hours = parseInt($("#eventDurationHours").val(), 10)
        const minutes = parseInt($("#eventDurationMinutes").val(), 10)
        // Calculate the end time
        const startTime = new Date(datetime)
        const endTime = new Date(
          startTime.getTime() + (hours * 60 + minutes) * 60000
        )

        createEvent(
          name,
          contactPhone,
          contactEmail,
          category,
          visibility,
          rso,
          convertToDateTime(startTime),
          convertToDateTime(endTime),
          location,
          room,
          description
        ).then(([code, result]) => {
          if (code == 200) {
            console.log("Event created!")
            $("#addEventModal").toggle()
            loadEventCards("")
            // Clear the form of any input
            $("#addEventForm").trigger("reset")
          } else {
            $("#addEventModal").toggle()
            if (result.error.includes("Overlapping")) {
              $("#alert-modal").load(
                "components/alert_popup.html",
                function () {
                  const alertDanger = $("#alert-danger")
                  alertDanger
                    .find("span")
                    .text("Someone Else Reserved This Place at This Time")
                  alertDanger.show()
                }
              )
            }
            console.log("Error", code, " ", result.error)
          }
        })
      })
    }
  )

  loadEventCards("")
  document.addEventListener("DOMContentLoaded", initMap)
})

function loadEventCards(query) {
  $("#eventContainer").empty()
  getEvents(query).then(([code, result]) => {
    if (code == 404) {
      console.log("Error: No events found", code)
      $("#eventContainer").append(
        '<p style="display: flex; justify-content: center; align-items: center; height: 100%;">No Events. Go out and Create Some!</p>'
      )
    } else {
      console.log("Found some events")
      result["events"].forEach((event) => {
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
            $(this).find("p").text(event.description)
            // Load the modal content for the event card when the link is clicked
            $(this)
              .find(".card-body a")
              .on("click", function () {
                // Load event page
                loadEventModal(event)
              })
          })
      })
    }
  })
}

async function getEvents(searchQuery) {
  // Need the uuid of the user to make queries
  const user = getUser()
  return await callAPI(
    "/findEvent.php",
    {
      associated_uni: user.u_id || user.university,
      name: searchQuery,
      // TODO: Need to add way to search on category
      category: "",
    },
    "POST"
  )
}

function loadEventModal(event) {
  // Save the event in local storage on the browser so we can access it on the new page
  localStorage.setItem("event", JSON.stringify(event))
  // Swap to that page
  window.location.replace("event.html")
}

async function createEvent(
  name,
  contactPhone,
  contactEmail,
  category,
  visibility,
  rso = "",
  startTime,
  endTime,
  location,
  room,
  description
) {
  return await callAPI(
    "/createEvent.php",
    {
      u_id: getUser().u_id,
      name: name,
      contact_phone: contactPhone,
      contact_email: contactEmail,
      category: category,
      visibility: visibility,
      rso_id: rso,
      start_time: startTime,
      end_time: endTime,
      location: location,
      room: room,
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

  // Enable location autocomplete search
  const input = document.getElementById("eventLocation")
  const autoCompleteOptions = {
    bounds: {
      north: defaultLocation.lat + 0.1,
      south: defaultLocation.lat - 0.1,
      east: defaultLocation.lng + 0.1,
      west: defaultLocation.lng - 0.1,
    },
    componentRestrictions: { country: "us" },
    fields: ["address_components", "geometry", "icon", "name"],
    strictBounds: false,
  }
  autocomplete = new google.maps.places.Autocomplete(input, autoCompleteOptions)

  autocomplete.bindTo("bounds", map)

  autocomplete.addListener("place_changed", function () {
    const place = autocomplete.getPlace()

    if (!place.geometry || !place.geometry.location) {
      console.log("No details for this location")
      return
    }

    map.setCenter(place.geometry.location)
    map.setZoom(15)
    marker.setPosition(place.geometry.location)

    // Update hidden inputs to store the desired location
    document.getElementById("eventLatitude").value =
      place.geometry.location.lat()
    document.getElementById("eventLongitude").value =
      place.geometry.location.lng()
    document.getElementById("locationName").value = place.name
    console.log(
      `Event location changed! ${place.geometry.location.lat()} and ${place.geometry.location.lng()}\nand name is ${
        place.name
      } `
    )
  })
}
