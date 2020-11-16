const baseUrl = "https://api.football-data.org/v2";
const API_KEY = "c65cb2ae0f5b4facbb2a1a95bed15708";
let id_liga = 2014;
let standingsURL = `${baseUrl}/competitions/${id_liga}/standings`;

function getDay(Date) {
  return String(Date.getDate()).padStart(2, "0");
}
function getMonth(Date) {
  return String(Date.getMonth() + 1).padStart(2, "0");
}
function Date2Time(time) {
  return time.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}
function addDays(dateObj, numDays) {
  return dateObj.setDate(dateObj.getDate() + numDays);
}
function toDateTime(secs) {
  let t = new Date(Date.UTC(1970, 0, 1));
  t.setUTCSeconds(secs / 1000);
  return t;
}

const dbPromise = idb.openDB("ligaanDB", 1, {
  upgrade(db) {
    db.createObjectStore("ligaan");
  },
});

const idbLigaan = {
  async get(key) {
    return (await dbPromise).get("ligaan", key);
  },
  async set(key, val) {
    return (await dbPromise).put("ligaan", val, key);
  },
  async delete(key) {
    return (await dbPromise).delete("ligaan", key);
  },
  async clear() {
    return (await dbPromise).clear("ligaan");
  },
  async keys() {
    return (await dbPromise).getAllKeys("ligaan");
  },
  async All() {
    return (await dbPromise).getAll("ligaan");
  },
};

function insertTeamListener(teamId) {
  teamURL = baseUrl + `/teams/${teamId}`;
  data = fecthBALL(teamURL);
  data.then((result) => {
    idbLigaan.set(teamId, result);
    M.toast({ html: "Team Saved", classes: "rounded" });
  });
}

function deleteTeamListener(teamId) {
  idbLigaan.delete(teamId);
  M.toast({ html: "Team Deleted", classes: "rounded" });
  loadFavorites();
}

async function fecthBALL(url) {
  let resp = await fetch(url, {
    method: "GET",
    headers: {
      "X-Auth-Token": API_KEY,
    },
  });

  if (resp.status == 200) {
    let ball = await resp.json();
    return ball;
  }

  throw new Error(response.status);
}

function showLoader() {
  let html = `
              <div class="loading">
              <div class="preloader-wrapper big active">
              <div class="spinner-layer spinner-blue">
                <div class="circle-clipper left">
                  <div class="circle"></div>
                </div><div class="gap-patch">
                  <div class="circle"></div>
                </div><div class="circle-clipper right">
                  <div class="circle"></div>
                </div>
              </div>
        
              <div class="spinner-layer spinner-red">
                <div class="circle-clipper left">
                  <div class="circle"></div>
                </div><div class="gap-patch">
                  <div class="circle"></div>
                </div><div class="circle-clipper right">
                  <div class="circle"></div>
                </div>
              </div>
        
              <div class="spinner-layer spinner-yellow">
                <div class="circle-clipper left">
                  <div class="circle"></div>
                </div><div class="gap-patch">
                  <div class="circle"></div>
                </div><div class="circle-clipper right">
                  <div class="circle"></div>
                </div>
              </div>
        
              <div class="spinner-layer spinner-green">
                <div class="circle-clipper left">
                  <div class="circle"></div>
                </div><div class="gap-patch">
                  <div class="circle"></div>
                </div><div class="circle-clipper right">
                  <div class="circle"></div>
                </div>
              </div>
            </div>
              </div>
              `;
  document.getElementById("body-content").innerHTML = html;
}

function loadFavorites() {
  showLoader();
  let Teams = idbLigaan.All();
  Teams.then((result) => {
    let teams = result;
    var html = "";
    html += '<div style="margin-top:20px;" class="row">';
    teams.forEach((team) => {
      html += `
      <div class="col s12 m6 l6">
        <div class="card">
          <div class="card-content">
            <div class="center" style="cursor:pointer;" onclick="loadTeam(${team.id})"><img width="64" height="64" src="${team.crestUrl}"></div>
            <div class="center flow-text">${team.name}</div>
            <div class="center">${team.area.name}</div>
            <div class="center"><a href="${team.website}" target="_blank">${team.website}</a></div>
          </div>
          <div class="card-action right-align">
              <a class="waves-effect waves-light btn-small red" onclick="deleteTeamListener(${team.id})"><i class="material-icons left">delete</i>Delete</a>
          </div>
        </div>
      </div>
    `;
    });
    document.getElementById("body-content").innerHTML = html;
  });
}

async function fecthschedule(today, day7) {
  let dd = getDay(today);
  let mm = getMonth(today);
  let yyyy = today.getFullYear();
  let dd7 = getDay(day7);
  let mm7 = getMonth(day7);
  let yyyy7 = day7.getFullYear();
  let resp = await fetch(
    `${baseUrl}/competitions/${id_liga}/matches?dateFrom=${yyyy}-${mm}-${dd}&dateTo=${yyyy7}-${mm7}-${dd7}`,
    {
      method: "GET",
      headers: {
        "X-Auth-Token": API_KEY,
      },
    }
  );

  if (resp.status == 200) {
    let ball = await resp.json();
    return ball;
  }

  throw new Error(response.status);
}

async function loadMatches(
  today = new Date(),
  day7 = toDateTime(addDays(new Date(), 7))
) {
  let dd = getDay(today);
  let mm = getMonth(today);
  let yyyy = today.getFullYear();
  let dd7 = getDay(day7);
  let mm7 = getMonth(day7);
  let yyyy7 = day7.getFullYear();
  let dateURL = `${baseUrl}/competitions/${id_liga}/matches?dateFrom=${yyyy}-${mm}-${dd}&dateTo=${yyyy7}-${mm7}-${dd7}`;
  if ("caches" in window) {
    caches.match(dateURL).then((response) => {
      if (response) {
        response.json().then(function (data) {
          return showMatches(data);
        });
      }
    });
  }
  data = await fecthschedule(today, day7);
  return showMatches(data);
}

function changeMatchDate() {
  let s = document.getElementById("start").value;
  let e = document.getElementById("end").value;
  let tanggalAwal = s.split("-");
  let dateAwal = new Date(tanggalAwal[0], tanggalAwal[1] - 1, tanggalAwal[2]);
  let tanggalAkhir = e.split("-");
  let dateAkhir = new Date(
    tanggalAkhir[0],
    tanggalAkhir[1] - 1,
    tanggalAkhir[2]
  );
  loadMatches(dateAwal, dateAkhir);
}

function showMatches(
  data,
  date1 = new Date(),
  date2 = toDateTime(addDays(new Date(), 7))
) {
  showLoader();
  let HEADER = "";
  let ROW = "";
  data.matches.forEach((result) => {
    let tanggal = new Date(result.utcDate);
    let waktu = Date2Time(tanggal);
    let bulan = tanggal.toLocaleString("default", { month: "short" });
    let hari = getDay(tanggal);
    let tahun = tanggal.getFullYear();
    ROW += `<tr>
            <td>${hari + " " + bulan + " " + tahun}</td>
            <td>${waktu}</td>
            <td>${result.status}</td>
            <td class="valign-wrapper"><img class="responsive-img" width="20" height="auto" style="margin-right:5px"" src="https://crests.football-data.org/${result.homeTeam.id
      }.svg"
            }">${result.homeTeam.name}</td>
            <td>${result.score.fullTime.homeTeam == null
        ? "-"
        : result.score.fullTime.homeTeam
      } : ${result.score.fullTime.awayTeam == null
        ? "-"
        : result.score.fullTime.awayTeam
      }</td>
            <td class="valign-wrapper">${result.awayTeam.name}
            <img class="responsive-img" width="20" height="auto" style="margin-left:5px"" src="https://crests.football-data.org/${result.awayTeam.id
      }.svg"
            }"></td>
          </tr>`;
  });
  HEADER +=
    `
        <div class="col s12 m12">
        <label for="start">Start date:</label>
        <input type="date" id="start" name="match-start"
          value="${date1.getFullYear() + "-" + getMonth(date1) + "-" + getDay(date1)}"
        >
        <label for="end">End date:</label>
        <input type="date" id="end" name="match-end"
          value="${date2.getFullYear() + "-" + getMonth(date2) + "-" + getDay(date2)}"
        >
        <button class="btn waves-effect waves-light" type="submit" onClick="changeMatchDate()" > Set Date </button>
        <h5 class="header">Match Schedules</h5>
        <div class="card">
        <div class="card-content">
        <table class="highlight responsive-table">
        <thead>
          <tr id="myHeader">
            <th>Date</th>
            <th>Time</th>
            <th>Status</th>
            <th>Home Team</th>
            <th>Score</th>
            <th>Away Team</th>
          </tr>
        </thead>
        <tbody id="mySchedule">` +
    ROW +
    `</tbody>
        </table>
        </div>
        </div>
        </div>
      `;
  document.getElementById("body-content").innerHTML = HEADER;
}

async function loadTeam(teamID) {
  showLoader();
  let teamURL = baseUrl + `/teams/${teamID}`;
  let teamx;
  let kunci = await idbLigaan.keys();
  if (kunci.includes(teamID)) {
    teamx = idbLigaan.get(teamID);
  } else {
    teamx = fecthBALL(teamURL);
  }

  if ("caches" in window) {
    caches.match(baseUrl + `/teams/${teamID}`).then((response) => {
      if (response) {
        response.json().then(function (data) {
          teamx.then((result) => {
            let HTML = "";
            let AC = "";
            let PLAYERS = "";
            result.activeCompetitions.forEach((competition) => {
              AC += `
              <tr>
                <td>${competition.name} </td>
                <td class="center">${competition.area.name}</td>
                <td class="center">${competition.code}</td>
              </tr>
              
              `;
            });

            result.squad.forEach((player) => {
              tanggal = new Date(player.dateOfBirth);
              if (player.shirtNumber == null) {
                player.shirtNumber = "";
              }
              PLAYERS += `
              <tr>
                <td>${player.name} </td>
                <td class="center">${player.position}</td>
                <td class="center">${player.shirtNumber}</td>
                <td class="center">${player.role}</td>
                <td class="center">${getDay(tanggal) +
                "-" +
                getMonth(tanggal) +
                "-" +
                tanggal.getFullYear()
                }</td>
                <td class="center">${player.nationality}</td>
              </tr>
              
              `;
            });
            HTML +=
              `
            <div class="col s12 m12">
            <h2 class="center-align">${result.name}</h2>
            <img class="center-align" width="200" height="auto" style="margin:50px auto; display:block" src="${result.crestUrl}">
            <div class="card">
            <div class="card-content">
            <span class="card-title">Active Competitions</span>
            <p>
            <table class="responsive-table highlight">
                <thead>
                  <tr id="myHeader">
                    <th class="center">Competition</th>
                    <th class="center">Country</th>
                    <th class="center">Code</th>
                  </tr>
                </thead>
                <tbody id="myCompetitions">` +
              AC +
              `</tbody>
                </table>
            </p>
            </div>
            </div>
        
            <div class="card">
            <div class="card-content">
            <span class="card-title">Squad</span>
            <p>
            <table class="responsive-table highlight">
                <thead>
                  <tr id="myHeader">
                    <th class="center">Name</th>
                    <th class="center">Position</th>
                    <th class="center">Shirt Number</th>
                    <th class="center">Role</th>
                    <th class="center">Birth Date</th>
                    <th class="center">Nationality</th>
                  </tr>
                </thead>
                <tbody id="mySquad">` +
              PLAYERS +
              `</tbody>
                </table>
            </p>
            </div>
            </div>
        
            </div>
        
        
            `;

            document.getElementById("body-content").innerHTML = HTML;
          });
        });
      }
    });
  }
  data = await fecthBALL(baseUrl + `/teams/${teamID}`);

  teamx.then((result) => {
    let HTML = "";
    let AC = "";
    let PLAYERS = "";
    result.activeCompetitions.forEach((competition) => {
      AC += `
      <tr>
        <td>${competition.name} </td>
        <td class="center">${competition.area.name}</td>
        <td class="center">${competition.code}</td>
      </tr>
      
      `;
    });

    result.squad.forEach((player) => {
      tanggal = new Date(player.dateOfBirth);
      if (player.shirtNumber == null) {
        player.shirtNumber = "";
      }
      PLAYERS += `
      <tr>
        <td>${player.name} </td>
        <td class="center">${player.position}</td>
        <td class="center">${player.shirtNumber}</td>
        <td class="center">${player.role}</td>
        <td class="center">${getDay(tanggal) +
        "-" +
        getMonth(tanggal) +
        "-" +
        tanggal.getFullYear()
        }</td>
        <td class="center">${player.nationality}</td>
      </tr>
      
      `;
    });
    HTML +=
      `
    <div class="col s12 m12">
    <h2 class="center-align">${result.name}</h2>
    <img class="center-align" width="200" height="auto" style="margin:50px auto; display:block" src="${result.crestUrl}">
    <div class="card">
    <div class="card-content">
    <span class="card-title">Active Competitions</span>
    <p>
    <table class="responsive-table highlight">
        <thead>
          <tr id="myHeader">
            <th class="center">Competition</th>
            <th class="center">Country</th>
            <th class="center">Code</th>
          </tr>
        </thead>
        <tbody id="myCompetitions">` +
      AC +
      `</tbody>
        </table>
    </p>
    </div>
    </div>

    <div class="card">
    <div class="card-content">
    <span class="card-title">Squad</span>
    <p>
    <table class="responsive-table highlight">
        <thead>
          <tr id="myHeader">
            <th class="center">Name</th>
            <th class="center">Position</th>
            <th class="center">Shirt Number</th>
            <th class="center">Role</th>
            <th class="center">Birth Date</th>
            <th class="center">Nationality</th>
          </tr>
        </thead>
        <tbody id="mySquad">` +
      PLAYERS +
      `</tbody>
        </table>
    </p>
    </div>
    </div>

    </div>


    `;

    document.getElementById("body-content").innerHTML = HTML;
  });
}

async function loadStandings() {
  if ("caches" in window) {
    caches.match(standingsURL).then((response) => {
      if (response) {
        response.json().then(function (data) {
          return showStandings(data);
        });
      }
    });
  }
  data = await fecthBALL(standingsURL);
  return showStandings(data);
}

function showStandings(data) {
  showLoader();
  let HEADER = "";
  data.standings.forEach((standing) => {
    if (standing.type == "TOTAL") {
      let ROW = "";
      standing.table.forEach((result) => {
        ROW += `<tr>
            <td class="center">${result.position}</td>
            <td class="valign-wrapper row m-0" style="margin-right:5px;">
              <div class="col s8 m10" style="cursor:pointer" onclick="loadTeam(${result.team.id})">
                <img class="responsive-img hide-on-small-only" width="30" height="auto" style="margin-right:5px" src="${result.team.crestUrl}">
                <span class="blue-text">${result.team.name}</span>
              </div>
              <div class="center waves-effect waves-teal btn-flat col s4 m2" onclick="insertTeamListener(${result.team.id})" >
                <i style="font-size:20px" class="material-icons">add_box</i>
              </div>
            </td>
            <td class="center">${result.playedGames}</td>
            <td class="center">${result.won}</td>
            <td class="center">${result.draw}</td>
            <td class="center">${result.lost}</td>
            <td class="center">${result.goalsFor}</td>
            <td class="center">${result.goalsAgainst}</td>
            <td class="center">${result.goalDifference}</td>
            <td class="center">${result.points}</td>
          </tr>`;
      });
      HEADER +=
        `
        <div class="col s12 m12">
        <h5 class="header">Primera Division Standings</h5>
        <div class="card">
        <div class="card-content">
        <table class="responsive-table highlight">
        <thead>
          <tr id="myHeader">
            <th class="center">Pos</th>
            <th class="center">Team</th>
            <th class="center">Games</th>
            <th class="center">Wins</th>
            <th class="center">Draws</th>
            <th class="center">Losses</th>
            <th class="center">For</th>
            <th class="center">Against</th>
            <th class="center">+/-</th>
            <th class="center">Points</th>
          </tr>
        </thead>
        <tbody id="myStandings">` +
        ROW +
        `</tbody>
        </table>
        </div>
        </div>
        </div>
      `;
    }
  });
  document.getElementById("body-content").innerHTML = HEADER;
}
