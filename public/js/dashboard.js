$(document).ready(function () {
  // Load the modal structure
  $("#modal-placeholder").load("components/event_modal.html")
  $("#create-event-modal-placeholder").load(
    "components/create_event_modal.html"
  )

  loadEventCards("")
})

function loadEventCards(query) {
  $("#eventContainer").empty()
  getEvents(query).then(([code, result]) => {
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
  })
}

async function getEvents(searchQuery = "") {
  // Need the uuid of the user to make queries
  const user = getUser()
  return await callAPI(
    "/findEvent.php",
    {
      userId: user.stuId,
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
