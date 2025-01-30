document.addEventListener("DOMContentLoaded", () => {
  const allowedEmails = [
    "haitham.mohamed@siemens-healthineers.com",
    "sven.meyburg@siemens-healthineers.com",
    "prateek.nishant@siemens-healthineers.com"
  ];
  const loginPage = document.getElementById("loginPage");
  const dashboard = document.getElementById("dashboard");
  const searchInput = document.getElementById("searchInput");

  if (localStorage.getItem("authenticatedEmail")) {
    showDashboard();
  } else {
    loginPage.style.display = "block";
  }

  window.checkAccess = function () {
    const email = document.getElementById("emailInput").value.trim();
    if (allowedEmails.includes(email)) {
      localStorage.setItem("authenticatedEmail", email);
      showDashboard();
    } else {
      document.getElementById("error-message").style.display = "block";
    }
  };

  function showDashboard() {
    loginPage.style.display = "none";
    dashboard.style.display = "block";
    loadReports();
  }

  window.logout = function () {
    localStorage.removeItem("authenticatedEmail");
    location.reload();
  };

  function loadReports() {
    const reportsContainer = document.getElementById("reports");

    fetch("data.json")
      .then(response => response.json())
      .then(data => {
        reportsContainer.innerHTML = "";
        data.forEach((report, index) => {
          const likeCount = localStorage.getItem(`like-count-${index}`) || 0;
          const dislikeCount = localStorage.getItem(`dislike-count-${index}`) || 0;

          const card = `
            <div class="col-md-4 mb-4 report-card" data-title="${report.title.toLowerCase()}">
              <div class="card">
                <div class="card-body">
                  <h5 class="card-title">${report.title}</h5>
                  <p class="card-text">${report.snippet}</p>
                  <a href="${report.url}" target="_blank" class="btn btn-info">Read More</a>
                  <div class="mt-2">
                    <button class="btn btn-outline-success like-btn" data-index="${index}">👍 <span id="like-count-${index}">${likeCount}</span></button>
                    <button class="btn btn-outline-danger dislike-btn" data-index="${index}">👎 <span id="dislike-count-${index}">${dislikeCount}</span></button>
                  </div>
                  <input type="text" class="form-control mt-2 comment-input" placeholder="Add a comment" />
                </div>
              </div>
            </div>
          `;
          reportsContainer.innerHTML += card;
        });

        attachLikeDislikeListeners();
        searchInput.addEventListener("keyup", filterReports);
      });
  }

  function attachLikeDislikeListeners() {
    document.querySelectorAll(".like-btn").forEach(button => {
      button.addEventListener("click", () => {
        const index = button.getAttribute("data-index");
        let likeCount = parseInt(localStorage.getItem(`like-count-${index}`) || 0);
        likeCount++;
        localStorage.setItem(`like-count-${index}`, likeCount);
        document.getElementById(`like-count-${index}`).textContent = likeCount;
      });
    });

    document.querySelectorAll(".dislike-btn").forEach(button => {
      button.addEventListener("click", () => {
        const index = button.getAttribute("data-index");
        let dislikeCount = parseInt(localStorage.getItem(`dislike-count-${index}`) || 0);
        dislikeCount++;
        localStorage.setItem(`dislike-count-${index}`, dislikeCount);
        document.getElementById(`dislike-count-${index}`).textContent = dislikeCount;
      });
    });
  }

  function filterReports() {
    const searchValue = searchInput.value.toLowerCase();
    const reports = document.querySelectorAll(".report-card");

    reports.forEach(report => {
      const title = report.getAttribute("data-title");
      report.style.display = title.includes(searchValue) ? "block" : "none";
    });
  }
});
