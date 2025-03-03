$(document).ready(function () {
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

        console.log(`${new Date(`${date}T${time}:00`).toISOString()}`)

        // TODO: Fix this so it only takes `datetime` for the time and date of the event
        createEvent(
          name,
          contactInfo,
          category,
          visibility,
          datetime,
          time,
          location,
          description
        )
      })
    }
  )

  loadEventCards("")
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

async function createEvent(
  name,
  contactInfo,
  category,
  visibility,
  date,
  time,
  location,
  description
) {
  await callAPI(
    "/createEvent.php",
    {
      stu_Id: getUser().stuId,
      name: name,
      contact_info: contactInfo,
      category: category,
      visibility: visibility,
      date: date,
      time: time,
      location: location,
      description: description,
    },
    "POST"
  )
}
