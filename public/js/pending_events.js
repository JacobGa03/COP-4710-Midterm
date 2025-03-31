$(document).ready(function () {
  // Load the pending events that need to be approved
  loadPendingEvents()
})

function loadPendingEvents() {
  $("#pendingEventsContainer").empty()
  getEvents().then(([code, result]) => {
    if (code == 200) {
      result["Results"].forEach((event) => {
        console.log("Adding a pending event")
        // Append a container to put the event in
        $("#pendingEventsContainer").append(
          `<div class="pendingEventCard" id="event-${event.e_id}"></div>`
        )

        $("#pendingEventsContainer")
          .last()
          .load("components/pending_event_list_tile.html", function () {
            // Load the event name and category to the list tile
            $(this).find("h2").text(event.name)
            $(this).find("h3").text(event.category)

            // Set click events for accepting and rejecting
            $(this)
              .find(".btn-success")
              .on("click", function () {
                // Approve the event
                console.log("Approving event")
                changeEventStatus(event.e_id, "approved")
              })
            $(this)
              .find(".btn-danger")
              .on("click", function () {
                // Reject the event
                console.log("Rejecting the event")
                changeEventStatus(event.e_id, "rejected")
              })
          })
      })
    }
    // No events to approve
    else if (code == 404) {
      $("#pendingEventsContainer").append(
        '<p style="display: flex; justify-content: center; align-items: center; height: 100%;">No Events to Approve.</p>'
      )
    }
  })
}

async function getEvents() {
  return await callAPI("/getPendingEvents.php", {}, "POST")
}
// Either approve or reject a public event
async function changeEventStatus(e_id, status) {
  await callAPI(
    "/changeEventStatus.php",
    { e_id: e_id, status: status },
    "POST"
  )
}
