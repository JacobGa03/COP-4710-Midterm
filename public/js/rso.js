$(document).ready(function () {
  // Load the modal structure
  $("#modal-placeholder").load("components/event_modal.html")
  // On initial load, get ALL (visible) events
  loadRSOCards("")
})

async function getRSO(searchQuery = "") {
  // Need the uuid of the user to make queries
  const user = getUser()
  return await callAPI(
    "/findRSO.php",
    {
      userId: user.stuId,
      search: searchQuery,
    },
    "POST"
  )
}

function loadRSOCards(query) {
  $("#rsoContainer").empty()
  getRSO(query).then(([code, result]) => {
    result["Results"].forEach((rso) => {
      // Give each displayed RSO a unique id so grabbing
      // a specific id will be much easier to do.
      $("#rsoContainer").append(
        `<div class="rsoCard" id="rso-${rso.rso_id}"></div>`
      )

      // Load the content into the event card
      $(".rsoCard")
        .last()
        .load("components/event_card.html", function () {
          // This callback function runs after the content is loaded
          $(this).find("h5").text(rso.name)
          $(this).find("h6").text("RSO Type")

          // Load the modal content when the link is clicked
          $(this)
            .find(".card-body a")
            .on("click", function () {
              loadRSOModal(rso)
            })
        })
    })
  })
}

function loadRSOModal(rso) {
  // Populate the modal with the RSO information
  $("#event-modal .modal-title").text(rso.name)
  $("#event-modal .modal-body").html(`
    <p>Type: ${rsoInfo.type}</p>
    <p>Description: ${rsoInfo.description}</p>
  `)

  // Show the modal
  $("#event-modal").modal("show")
}
