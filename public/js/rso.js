$(document).ready(function () {
  // Load the modal structure
  $("#modal-placeholder").load("components/event_modal.html")
  $("#create-rso-modal-placeholder").load(
    "components/create_rso_modal.html",
    function (e) {
      $("#createRSOButton").on("click", function (e) {
        e.preventDefault()
        // Get the different attributes of the RSO
        rsoName = $("#RSOName").val()
        rsoType = $("#RSOType").val()
        rsoDescription = $("#RSODescription").val()
        // TODO: Add list of potential emails to add

        // Create the RSO
        createRSO(rsoName, rsoType, rsoDescription).then(([code, result]) => {
          if (code == 200) {
            // Copy over the newly joined RSO
            user = getUser()
            newArr = []
            user.rso_admin.forEach((rso_id) => {
              newArr.push(rso_id)
            })
            newArr.push(result["rso_id"])
            user.rso_admin = newArr
            saveUserCookie(user)

            $("#addRSOModal").toggle()
            // Reload to display the events
            loadRSOCards("")
          } else {
            console.log("Error creating RSO...", code, " ", result)
          }
        })
      })
    }
  )

  // On initial load, get ALL (visible) events
  loadRSOCards("")
})

async function getRSO(searchQuery = "") {
  // Need the uuid of the user to make queries
  const user = getUser()
  return await callAPI(
    "/findRSO.php",
    {
      university: user.u_id,
      search: searchQuery,
    },
    "POST"
  )
}

function loadRSOCards(query) {
  $("#rsoContainer").empty()
  getRSO(query).then(([code, result]) => {
    if (result["Results"] === undefined) {
      $("#rsoContainer").append(
        '<p style="display: flex; justify-content: center; align-items: center; height: 100%;">No RSOs. Create Some!</p>'
      )
    } else {
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
            $(this).find("h6").text(rso.category)
            // Add a description
            description =
              rso.description != "" ? rso.description : "No Description..."
            $(this).find("p").text(description)

            // Load the modal content when the link is clicked
            $(this)
              .find(".card-body a")
              .on("click", function () {
                loadRSOModal(rso)
              })
          })
      })
    }
  })
}

function loadRSOModal(rso) {
  category = rso.category != "" ? rso.category : "Not Added"
  description = rso.description != "" ? rso.description : "Not Added"
  // Populate the modal with the RSO information
  $("#event-modal .modal-title").text(rso.name)
  $("#event-modal .modal-body").html(`
    <p>Type: ${category}</p>
    <p>Description: ${description}</p>
  `)

  rsoMember = [...getUser().rso_member, ...getUser().rso_admin]

  // They are already a member so they can't join
  if (rsoMember.includes(rso.rso_id)) {
    $(".btn-success").attr("disabled", true).text("Already a Member")
  }
  // Display a button for them to join
  else {
    $(".btn-success").attr("disabled", false).text("Join")
    $(".btn-success").click(function (e) {
      e.preventDefault()
      joinRSO(getUser().stu_id, rso.rso_id).then(([code, result]) => {
        if (code == 200) {
          // Copy over the newly joined RSO
          user = getUser()
          newArr = []
          user.rso_member.forEach((rso_id) => {
            newArr.push(rso_id)
          })
          newArr.push(result["rso_id"])
          user.rso_member = newArr
          saveUserCookie(user)

          $("#event-modal").toggle()
        } else {
          console.log("Error joining RSO...")
        }
      })
    })
  }

  // Show the modal
  $("#event-modal").modal("show")
}

async function createRSO(name, category, description) {
  user = getUser()
  return await callAPI(
    "/createRSO.php",
    {
      name: name,
      admin_id: user.stu_id,
      university: user.u_id,
      category: category,
      description: description,
    },
    "POST"
  )
}

async function joinRSO(stu_id, rso_id) {
  return await callAPI(
    "/joinRSO.php",
    { stu_id: stu_id, rso_id: rso_id },
    "POST"
  )
}
