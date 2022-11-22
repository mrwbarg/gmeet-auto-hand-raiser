const STORAGE_KEY = "hand_raiser_patterns";

const readLocalStorage = async (key) => {
  return new Promise((resolve, reject) => {
    chrome.storage.local.get([key], function (result) {
      if (result[key] === undefined) {
        reject();
      } else {
        if (result[key]) {
          resolve(JSON.parse(result[key]));
        } else {
          resolve([]);
        }
      }
    });
  });
};

async function getCurrentStoredData() {
  var items = await readLocalStorage(STORAGE_KEY);
  return items;
}

const capitalizeFirstLetter = ([first, ...rest], locale = navigator.language) =>
  first === undefined ? "" : first.toLocaleUpperCase(locale) + rest.join("");

async function createPatternTable() {
  var parsedCurrentStoredData = await getCurrentStoredData();

  async function deletePattern(event) {
    var storedData = await getCurrentStoredData();

    var row = event.srcElement.closest("div");
    var pattern = row.parentNode.firstChild.innerHTML;
    var patternToDelete = storedData.filter((e) => e.pattern === pattern)[0];

    var indexToPop = storedData.indexOf(patternToDelete);
    console.log(patternToDelete);
    storedData.splice(indexToPop, 1);
    console.log(storedData);

    chrome.storage.local.set({
      hand_raiser_patterns: JSON.stringify(storedData),
    });

    createPatternTable();
  }

  document.getElementById("patternTable")?.remove();

  var headers = ["Pattern", "Match", ""];
  var table = document.createElement("div");
  table.setAttribute("id", "patternTable");
  table.setAttribute("class", "m-3 container");

  var headerRow = document.createElement("div");
  headerRow.setAttribute("class", "row");

  var head1 = document.createElement("div");
  var head2 = document.createElement("div");
  var head3 = document.createElement("div");

  head1.setAttribute("class", "col-7");
  head2.setAttribute("class", "col-2");
  head3.setAttribute("class", "col-1");

  head1.innerHTML = "<b >Pattern</b>";
  head2.innerHTML = "<b>Match</b>";

  headerRow.appendChild(head1);
  headerRow.appendChild(head2);
  headerRow.appendChild(head3);

  table.appendChild(headerRow);

  parsedCurrentStoredData.forEach((e, i) => {
    var row = document.createElement("div");
    row.setAttribute("class", "row");

    var cell1 = document.createElement("div");
    var cell2 = document.createElement("div");
    var cell3 = document.createElement("div");

    cell1.setAttribute("class", "col-7");
    cell2.setAttribute("class", "col-2");
    cell3.setAttribute("class", "col-1");

    cell1.innerHTML = e.pattern;
    cell2.innerHTML = capitalizeFirstLetter(e.type);
    cell3.innerHTML = '<button id="deleteButton" class="btn-close"></button>';

    row.appendChild(cell1);
    row.appendChild(cell2);
    row.appendChild(cell3);

    table.appendChild(row);
  });

  document.body.append(table);
  document.querySelectorAll("#deleteButton").forEach((item) => {
    item.addEventListener("click", deletePattern);
  });
}

document.addEventListener("DOMContentLoaded", function () {
  async function saveMatchPatternToStorage() {
    var parsedCurrentStoredData = await getCurrentStoredData();

    if (!patternInput.value) {
      alert("Type a pattern first!");
      return;
    }

    if (typeInput.value === "Match Type") {
      alert("Select a matching type!");
      return;
    }

    var pattern = { pattern: patternInput.value, type: typeInput.value };

    if (parsedCurrentStoredData.length >= 5) {
      alert("Can only store at most 5 patterns!");
      return;
    }

    if (
      parsedCurrentStoredData.filter((e) => e.pattern === pattern.pattern)
        .length > 0
    ) {
      alert("Pattern is already included!");
      return;
    }
    parsedCurrentStoredData.push(pattern);

    chrome.storage.local.set({
      hand_raiser_patterns: JSON.stringify(parsedCurrentStoredData),
    });

    patternInput.value = null;
    typeInput.value = "Match Type";

    createPatternTable();
  }

  var addButton = document.getElementById("addButton");
  var patternInput = document.getElementById("patternInput");
  var typeInput = document.getElementById("matchTypes");
  addButton.addEventListener("click", saveMatchPatternToStorage);
});

createPatternTable();
