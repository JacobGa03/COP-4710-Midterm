$(document).ready(function () {
  // Load the modal structure
  $("#modal-placeholder").load("components/event_modal.html")

  for (let i = 0; i < 10; i++) {
    // Give each displayed RSO a unique id so grabbing
    // a specific id will be much easier to do.
    $("#rsoContainer").append(`<div class="rsoCard" id="rso-${i}"></div>`)

    // Load the content into the event card
    $(".rsoCard")
      .last()
      .load("components/event_card.html", function () {
        // This callback function runs after the content is loaded
        $(this).find("h5").text("RSO Name")
        $(this).find("h6").text("RSO Type")

        // Load the modal content when the link is clicked
        $(this)
          .find(".card-body a")
          .on("click", function () {
            const rsoId = $(this).closest(".rsoCard").attr("id")
            loadRSOModal(rsoId)
          })
      })
  }
})

async function getRSO(searchQuery = "") {
  // Need the uuid of the user to make queries
  const user = getUser()
  return await callAPI(
    "/getRSO.php",
    {
      userId: user.stuId,
      query: searchQuery,
    },
    "POST"
  )
}

function loadRSOModal(rsoId) {
  // Fetch the RSO information based on the rsoId
  const rsoInfo = getRSOInfo(rsoId) // Replace with actual function to fetch RSO info

  // Populate the modal with the RSO information
  $("#event-modal .modal-title").text(rsoInfo.name)
  $("#event-modal .modal-body").html(`
    <p>Type: ${rsoInfo.type}</p>
    <p>Description: ${rsoInfo.description}</p>
  `)

  // Show the modal
  $("#event-modal").modal("show")
}

function getRSOInfo(rsoId) {
  // Replace with actual logic to fetch RSO information based on rsoId
  return {
    name: "Sample RSO",
    type: "Sample Type",
    description: "Sample Description",
  }
}
