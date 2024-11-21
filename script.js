"use-strict";

document.querySelector("form").addEventListener("submit", (e) => {
  e.preventDefault();
  let count = 0;
  if (count < 1) {
    count++;
    getIp();
  } else if (count > 0) {
    err(count);
  }
});

function err(count) {
  let view = document.querySelector("aside");
  let nav = [...document.querySelectorAll("h2")];
  if (count === 1) {
    view.innerHTML = `
  <div style="font-size: 18px" id="info">:( Reload page to search foranother ip 🗺</div>`;
    for (const e of nav) {
      e.innerHTML = `<div>:( Reload page to search foranother ip </div>`;
    }
    return;
  } else if (count === 2) {
    window.location.reload();
  }
}

// Fetch ipdata from ipapi's
async function getIpData(ip) {
  const key = "fb3373efeb05431595ae83c30ec374fe";
  const URI = `https://api.ipgeolocation.io/ipgeo?apiKey=${key}&ip=${ip}`;
  let res = await fetch(URI, {
    method: "GET",
    headers: {
      "Content-Type": "application/json"
    }
  });
  if (!res.ok) {
    throw new Error("cannot fetch data");
  }
  let data = await res.json();

  return data;
}

function loadMap({ lat, lon, loc, name }) {
  // let name;
  let count = 0;
  const mapbox_Token =
    "sk.eyJ1Ijoia29kYWFzIiwiYSI6ImNrbmx3OTk1YzBwM24ydnBtNHdiMzV2eW8ifQ.9hky_C78U1IaitjOVQF7dw";

  name = L.map("mapid");
  name.setView([lat, lon], 15);

  count++;

  L.tileLayer(
    `https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=${mapbox_Token}`,
    {
      attribution:
        'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
      maxZoom: 18,
      id: "mapbox/streets-v11",
      tileSize: 512,
      zoomOffset: -1,
      accessToken: mapbox_Token
    }
  ).addTo(name);

  let marker = L.marker([lat, lon]).addTo(name);
  marker.bindPopup(`${loc}<br>reload page to serch for another ip`).openPopup();

  let circle = L.circle([lat, lon], {
    color: "#5872d9",
    fillColor: "#748be6",
    fillOpacity: 0.5,
    radius: 500
  }).addTo(name);

  console.log(count);
}

function loadNav(
  { ip = "unknown", loc = "unknown", time = "unknown", isp = "unknown", flag },
  get = true
) {
  if (get) {
    let nav = [...document.querySelectorAll("h2")];
    nav[0].innerText = ip;
    nav[1].innerHTML = `${loc} <img src="${flag}" alt="flag" width="50px", height="20px" style="display: inline-block;margin-left: 5px">`;
    nav[2].innerText = time;
    nav[3].innerText = isp;
  }
}

// control entry
function getIp() {
  let inputValue = document.querySelector("#ip-input").value;
  let view = document.querySelector("aside");
  let btn = document.querySelector("#btn");
  let nav = [...document.querySelectorAll("h2")];

  // Adds Loading effect
  view.innerHTML = `
    <div style="font-size: 18px" id="info">
      Loading MAP 🗺
      <div>
        <div style="width: 25px; height: 25px; margin-top: 5px;" id="loader"></div>
      </div>
    </div>`;
  for (const e of nav) {
    e.innerHTML = `<div id="loader"></div>`;
  }

  getIpData(inputValue)
    .then((data) => {
      let {
        ip,
        city,
        isp,
        country_flag: flag,
        country_name: country,
        time_zone: { current_time: time },
        latitude: lat,
        longitude: lon
      } = data;
      let loc = `${city}, ${country}`;
      let name = `${city}`[0].toUpperCase();
      loadNav({ ip, loc, time, isp, flag });
      loadMap({ lat, lon, loc, name });
    })
    .catch((err) => {
      view.innerHTML =
        '<div style="color:red">Failed!! try clicking the black button<div>';
      for (const e of nav) {
        e.innerHTML = `<div style="color:red">Failed!! try clicking the black button<div>`;
      }
      loadNav({}, false);
      console.log(err);
    });
  btn.removeAttribute("onclick");
  btn.setAttribute("onclick", "err(1)");
}
