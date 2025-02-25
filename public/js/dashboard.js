$(document).ready(function () {
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
      .load("components/event_card.html", function () {})
  }
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
