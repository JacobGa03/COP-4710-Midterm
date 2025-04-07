$(document).ready(function () {
  const event = JSON.parse(localStorage.getItem("event"))
  // Create and load the script for Google Maps
  const script = document.createElement("script")
  script.src = `https://maps.googleapis.com/maps/api/js?key=${CONFIG.GOOGLE_MAPS_API_KEY}&libraries=places`
  script.async = true
  script.defer = true
  script.onload = function () {
    // Ensure the map is initialized only after the script has loaded
    initMap(event)
  }
  document.head.appendChild(script)

  // Grab the start time
  // Adding Z here represents Eastern Time
  const startDate = new Date(event.start_time + "Z")
  const formattedDate = startDate.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  const formattedTime = startDate.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  })

  // Load the event information
  $("#location").text(event.address)
  event.room != null
    ? $("#inRoom").text(`in room ${event.room}`)
    : $("#inRoom").hide()
  $("#eventName").text(`${event.name}`)
  $("#timedate").text(`${formattedDate} at ${formattedTime}`)
  $("#category").text(event.category)
  $("#contactInfo").text(`${event.contact_phone} or ${event.contact_email}`)
  $("#eventDescription").text(event.description || "None added...")
  // Display special info based on event visibility
  switch (event.visibility) {
    case "rso":
      $("#displayVisibility").find("strong").text(`RSO: `)
      getRSO(event.rso_id).then(([code, result]) => {
        if (code == 200) {
          $("#displayVisibility").find("span").text(`${result["name"]}`)
        } else {
          $("#displayVisibility").find("span").text(`Some RSO`)
        }
      })
      break
    case "private":
      $("#displayVisibility").find("strong").text(`Private: `)
      $("#displayVisibility")
        .find("span")
        .text(`Only People at Your University can Attend`)
      break
    case "public":
      $("#displayVisibility").find("strong").text(`Public: `)
      $("#displayVisibility").find("span").text(`Anyone Can Attend`)
      break
  }

  // Enable adding comments
  $("#createComment").click(function (e) {
    e.preventDefault()
    // Grab the text
    const text = $("#comment").val()
    const rating = $('input[name="rating"]:checked').val()

    createComment(event, text, rating).then(([code, result]) => {
      if (code == 200) {
        console.log("Comment created successfully")
        $("#comment").text("")
        loadComments(event)
      } else if (code == 500) {
        console.log()
      }
    })
  })
  // Load the rating bar for the event
  $("#ratingContainer").load("components/start_rating.html", function () {})

  // Load comments
  loadComments(event)
})
// Load the comments from the API, then load them in comment_tile div's
function loadComments(event) {
  getComments(event).then(([code, result]) => {
    // Got the comments
    if (code == 200) {
      $("#commentContainer").empty()
      result["comments"].forEach((comment) => {
        const commentElement = $(
          `<div id="comment-${comment.c_id}" class="mt-3"></div>`
        )
        commentElement.load("components/comment_tile.html", function () {
          $(this).find("h5").text(comment.user_name)
          $(this)
            .find("h6")
            .text(`${comment.user_name} Rates This ${comment.rating}/5`)
          $(this).find("p").text(comment.text)

          // Only YOU can edit your own comment
          const id = getUser().stu_id || getUser().sa_id

          if (comment.u_id == id) {
            // Edit a comment
            $(this)
              .find(".btn-warning")
              .on("click", function (e) {
                console.log("Editing comment...")
                e.preventDefault()
                // Add your edit logic here
                loadEditCommentModal(comment)
              })

            // Delete a comment
            $(this)
              .find(".btn-danger")
              .on("click", function (e) {
                console.log("Deleting comment...")
                e.preventDefault()
                deleteComment(comment.c_id).then(() => {
                  // Remove it from the list of comments
                  $(`#comment-${comment.c_id}`).remove()
                })
              })
          } else {
            // Hide the edit button for users who don't own the comment
            $(this).find(".btn-warning").hide()
            $(this).find(".btn-danger").hide()
          }
        })
        $("#commentContainer").append(commentElement)
      })
    } else {
      console.log("Error getting the events", result)
    }
  })
}
// Write and store a comment
async function createComment(event, text, rating = 3) {
  // Only send create a comment if there is text to send
  if (text == "") return
  const u_id = getUser().stu_id || getUser().sa_id
  return await callAPI(
    "/createComment.php",
    { e_id: event.e_id, u_id: u_id, text: text, rating: rating },
    "POST"
  )
}
// Get all of the comments associated with an event
async function getComments(event) {
  return await callAPI("/getComments.php", { e_id: event.e_id }, "POST")
}

// Initialize Google Maps integrations
function initMap(event) {
  let map
  let marker
  let autocomplete
  // Set a default location for the map to pin point on
  const defaultLocation = { lat: event.latitude, lng: event.longitude }

  // Define a map object
  map = new google.maps.Map(document.getElementById("map"), {
    center: defaultLocation,
    zoom: 17,
    draggable: false,
  })

  marker = new google.maps.Marker({
    position: defaultLocation,
    map: map,
  })
}

async function editComment(c_id, text, rating) {
  return await callAPI(
    "/editComment.php",
    { c_id: c_id, text: text, rating: rating },
    "POST"
  )
}

async function deleteComment(c_id) {
  return await callAPI("/deleteComment.php", { c_id: c_id }, "POST")
}

function loadEditCommentModal(comment) {
  // Load the modal
  $("#editCommentModal").load(
    "components/edit_comment_modal.html",
    function () {
      $("#editCommentText").text(comment.text)
      $("#saveEditComment").on("click", function () {
        console.log(`${comment.text} ${$("#editCommentText").val()}`)
        if (comment.text != $("#editCommentText").val()) {
          // Update the database
          editComment(comment.c_id, $("#editCommentText").val(), comment.rating)
          // Update the comment on the screen
          $(`#comment-${comment.c_id}`)
            .find("p")
            .text($("#editCommentText").val())

          $("#editModal").modal("toggle")
        }
      })

      $("#editModal").modal("show")
    }
  )
}
