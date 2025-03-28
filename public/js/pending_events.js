$(document).ready(function () {})

function loadPendingEvents() {
  $("#pendingEventsContainer").empty()
  getEvents().then(([code, result]) => {
    // No events to approve
    if (result[""]) {
    } else {
    }
  })
}

async function getEvents(u_id) {
  return await callAPI("/getPendingEvents.php", { u_id: u_id }, "POST")
}
