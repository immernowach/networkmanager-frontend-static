$(document).ready(function () {
  function showPopup(message, type) {
    let overlay = document.createElement("div");
    overlay.className = "fixed inset-0 bg-black bg-opacity-40";

    let popup = document.createElement("div");
    // Überprüfen Sie, ob der Typ "error" ist und ändern Sie die Klasse entsprechend
    popup.className =
      type === "error"
        ? "fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 p-5 bg-red-500 text-white rounded"
        : "fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 p-5 bg-green-500 text-white rounded";
    popup.textContent = message;

    let close = document.createElement("button");
    close.className =
      "absolute top-2 right-3 p-1 text-white border-none cursor-pointer text-lg rounded";
    let icon = document.createElement("i");
    icon.className = "fas fa-times";
    close.appendChild(icon);
    close.onclick = function () {
      document.body.removeChild(overlay);
    };

    popup.appendChild(close);
    overlay.appendChild(popup);
    document.body.appendChild(overlay);
  }

  function showLoading() {
    // Erstellen Sie die Überlagerung
    let overlay = document.createElement("div");
    overlay.style.position = "fixed";
    overlay.style.top = "0";
    overlay.style.left = "0";
    overlay.style.width = "100%";
    overlay.style.height = "100%";
    overlay.style.backgroundColor = "rgba(0, 0, 0, 0.5)";
    overlay.id = "overlay";

    // Erstellen Sie die Ladeanimation
    let loader = document.createElement("div");
    loader.className = "loader";

    // Fügen Sie die Ladeanimation zur Überlagerung hinzu
    overlay.appendChild(loader);

    // Fügen Sie die Überlagerung zum Dokument hinzu
    document.body.appendChild(overlay);
  }

  function hideLoading() {
    let overlay = document.getElementById("overlay");
    if (overlay) {
      document.body.removeChild(overlay);
    }
  }

  $.getJSON("favorites.json", function (data) {
    if (data.length === 0) {
      $(".flex-wrap").append(`
        <div class="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
          <h1>Keine Favoriten vorhanden</h1>
        </div>
      `);
    } else {
      console.log(data);
      data.forEach(function (favorite) {
        let favoriteDiv = `
            <div class=" shadow-md rounded px-8 pt-6 pb-8 mb-4">
                <h2 class="font-semibold text-lg">${favorite.nickname}</h2>
                <p class="text-sm">${favorite.mac}</p>
                <button id="mac-fav" class="w-full mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">aufwecken</button>
              </div>
            </div>
          `;
        $("#favorites-list").append(favoriteDiv);
      });
    }
  }).fail(function () {
    showPopup("Fehler beim Laden der Favoriten", "error");
  });


  // Senden einer Anfrage an die /wake Route
  $("#mac-form").on("submit", function (event) {
    event.preventDefault();
    showLoading();
    let macAddress = $("#mac").val();
    $.ajax({
      url: "http://192.168.178.53:4000/wake",
      method: "POST",
      data: JSON.stringify({ macAddress: macAddress }),
      contentType: "application/json",
      success: function (response) {
        hideLoading();
        $("#response-mac").text(response);
        showPopup(response, "success");
      },
      error: function (error) {
        hideLoading();
        $("#response-mac").text("Fehler: " + error.responseText);
        showPopup("Fehler: " + error.responseText, "error");
      },
    });
  });

  // Senden einer Anfrage an die /get-mac Route
  $("#ip-form").on("submit", function (event) {
    event.preventDefault();
    showLoading();
    let ipAddress = $("#ip").val();
    $.ajax({
      url: "http://192.168.178.53:4000/get-mac",
      method: "POST",
      data: JSON.stringify({ ipAddress: ipAddress }),
      contentType: "application/json",
      success: function (response) {
        hideLoading();
        $("#response-ip").text("MAC-Adresse: " + response.mac);
        showPopup("MAC-Adresse: " + response.mac, "success");
      },
      error: function (error) {
        hideLoading();
        $("#response-ip").text("Fehler: " + error.responseText);
        showPopup("Fehler: " + error.responseText, "error");
      },
    });
  });
});
