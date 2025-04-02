$(document).ready(function () {
  const event = JSON.parse(localStorage.getItem("event"))
  console.log(event)

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
  $("#eventName").text(event.name)
  $("#timedate").text(`${formattedDate} at ${formattedTime}`)
  $("#category").text(event.category)
  $("#contactInfo").text(`${event.contact_phone} or ${event.contact_email}`)
  $("#eventDescription").text(event.description || "None added...")

  // Enable adding comments
  $("#createComment").click(function (e) {
    e.preventDefault()
    // Grab the text
    const text = $("#comment").val()

    createComment(event, text, 5).then(([code, result]) => {
      if (code == 200) {
        console.log("Comment created successfully")
        loadComments(event)
      } else if (code == 500) {
        console.log()
      }
    })
  })
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
        $("#commentContainer").append(`<div id="comment-${comment.c_id}></div>`)

        const commentElement = $(`<div id="comment-${comment.c_id}"></div>`)
        commentElement.load("components/comment_tile.html", function () {
          $(this).find("h5").text(comment.user_name)
          $(this)
            .find("h6")
            .text(`${comment.user_name} Rates This ${comment.rating}/5`)
          $(this).find("p").text(comment.text)
        })
        $("#commentContainer").append(commentElement)
      })
    } else {
      console.log("Error getting the events", result)
    }
  })
}
// Write and store a comment
async function createComment(event, text, rating) {
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
