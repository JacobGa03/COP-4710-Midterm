$(document).ready(function () {
  // Load the modal structure
  $("#modal-placeholder").load("components/event_modal.html")
  $("#create-event-modal-placeholder").load(
    "components/create_event_modal.html"
  )

  // Load events
  for (let i = 0; i < 10; i++) {
    // TODO: Call API to grab a list of events
    // Add a container w/ id = uuid of the event.
    // This will make loading info about an event easier.
    $("#eventContainer").append(`<div class="eventCard" id="event-${i}"></div>`)

    // Grab the most recently added event card and inject the 'event_card.html' into it.
    // Use the callback to insert anything else into the card that we want to modify
    $(".eventCard")
      .last()
      .load("components/event_card.html", function () {
        // Load the modal content for the event card when the link is clicked
        $(this)
          .find(".card-body a")
          .on("click", function () {
            const eventId = $(this).closest(".eventCard").attr("id")
            loadEventModal(eventId)
          })
      })
  }

  // Load the create event modal to give users the ability to create an event
  $(document).on("submit", "#addEventForm", function (e) {
    e.preventDefault()
    const eventName = $("#eventName").val()
    const eventVisibility = $("#eventVisibility option:selected").val()
    const eventDate = $("#eventDate").val()
    const eventLocation = $("#eventLocation").val()
    const eventDescription = $("#eventDescription").val()

    // Add your logic to save the event here
    console.log("Event added:", {
      eventName,
      eventVisibility,
      eventDate,
      eventLocation,
      eventDescription,
    })

    // Close the modal
    $("#addEventModal").modal("hide")

    // Optionally, refresh the event list or add the new event to the DOM
    // For example, you can call a function to reload the events
    // loadEvents()
  })
})

async function getEvents(searchQuery = "") {
  // Need the uuid of the user to make queries
  user = getUser()
  return await callAPI(
    "/getEvents.php",
    {
      userId: user.stuId,
      query: searchQuery,
    },
    "POST"
  )
}

function loadEventModal(eventId) {
  // Fetch the event information based on the rsoId
  const eventInfo = getEventInfo(eventId) // Replace with actual function to fetch RSO info

  // Populate the modal with the event information
  $("#event-modal .modal-title").text(eventInfo.name)
  $("#event-modal .modal-body").html(`
    <p>Type: ${eventInfo.type}</p>
    <p>Description: ${eventInfo.description}</p>
  `)

  // Show the modal
  $("#event-modal").modal("show")
}

function getEventInfo(eventId) {
  // Generate random event information based on the eventId
  const eventNames = ["Conference", "Workshop", "Seminar", "Meetup", "Webinar"]
  const eventTypes = [
    "Business",
    "Education",
    "Technology",
    "Health",
    "Networking",
  ]
  const eventDescriptions = [
    "An insightful event about the latest trends.",
    "A hands-on workshop to enhance your skills.",
    "A seminar to discuss important topics.",
    "A meetup to network with like-minded individuals.",
    "An online webinar to learn from experts.",
  ]

  const index = parseInt(eventId.split("-")[1]) % eventNames.length

  return {
    name: eventNames[index],
    type: eventTypes[index],
    description: eventDescriptions[index],
  }
}
