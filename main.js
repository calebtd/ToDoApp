// let oldList = {
//   'uuid': {
//     name: "Initial List",
//     items: [
//       { content: "Add the first item", status: false },
//       { content: "Make the footer blue", status: true },
//     ],
//   },
//   2: {
//     name: "Screens",
//     items: [
//       { content: "Built-in", status: true },
//       { content: "2752H", status: true },
//       { content: "S24E450", status: false },
//     ],
//   },
// };

// Save current 'allLists' object to Local Storage
function save() {
  localStorage.setItem("allLists", JSON.stringify(allLists));
}

// Generate new list object within the 'allLists' object
function createNewList(name) {
  newID = crypto.randomUUID();
  allLists[newID] = { name: name, todos: {} };
  renderLists();
}

// Create a new item object within a given todo object
function createNewItem() {
  newUUID = crypto.randomUUID();
  listID.todos.newUUID = { content: "", status: false };
}

function selectList(listID) {
  selectedListID = listID;
  renderLists();
  renderSelectedList();
}

function renderLists() {
  const sidebarDiv = document.getElementById("sidebar-div");
  sidebarDiv.innerHTML = "";

  for (let listID in allLists) {
    const button = document.createElement("button");
    button.setAttribute(
      "class",
      "px-2 py-1 mb-0.5 rounded w-full text-left hover:bg-neutral-600/25"
    );
    // button.setAttribute("id", listID);
    button.setAttribute("onclick", `selectList('${listID}')`);
    button.innerText = allLists[listID].name;

    if (selectedListID === listID) {
      button.classList.remove("hover:bg-neutral-600/25");
      button.classList.add("bg-neutral-600/45");
    }

    sidebarDiv.appendChild(button);
  }

  save();
}

// This renders the items and such from the list that is selected
function renderSelectedList() {
  let selectedList = allLists[selectedListID];

  let nameDiv = document.getElementById("selected-list-name");

  // Define the span to control the dynamic width of the input box
  let nameSpan = document.createElement("span");
  nameSpan.setAttribute(
    "class",
    "absolute height h-0 overflow-hidden whitespace-pre"
  );

  let nameInput = document.createElement("input");
  nameInput.setAttribute("class", "bg-inherit outline-offset-4");
  nameInput.setAttribute("id", "name_" + selectedListID);
  nameInput.setAttribute("type", "text");
  nameInput.setAttribute("value", selectedList.name);
  nameInput.setAttribute("disabled", "");

  nameDiv.innerHTML = "";
  nameDiv.appendChild(nameSpan);
  nameDiv.appendChild(nameInput);

  nameInput.addEventListener("input", resizeInput);
  resizeInput();
  function resizeInput() {
    nameSpan.textContent = nameInput.value;
    nameInput.style.width = nameSpan.offsetWidth + "px";
  }

  let todosDiv = document.getElementById("selected-list-todos");
  todosDiv.innerHTML = "";
  for (let item in selectedList.todos) {
    itemElement = createItemElement(
      item,
      selectedList.todos[item].content,
      selectedList.todos[item].status
    );
    todosDiv.appendChild(itemElement);
  }
  save();
}

//
function renameSelectedList() {}

// Create the element for each todo item
function createItemElement(id, content, status) {
  const div = document.createElement("div");
  div.setAttribute("class", "flex items-center mb-2 border border-slate-400");
  div.setAttribute("id", id);

  const checkbox = document.createElement("input");
  checkbox.setAttribute("class", "m-2 peer");
  checkbox.setAttribute("id", "checkbox_" + id);
  checkbox.setAttribute("type", "checkbox");
  checkbox.setAttribute("onclick", `handleCheckbox('${id}')`);

  const input = document.createElement("input");
  input.setAttribute(
    "class",
    "peer-checked:line-through bg-inherit m-1 p-1 w-full rounded outline-1"
  );
  input.setAttribute("id", "input_" + id);
  input.setAttribute("type", "text");
  input.setAttribute("value", content);
  input.setAttribute("disabled", "");
  input.setAttribute("onblur", `saveItem('${id}')`);

  const editButton = document.createElement("button");
  editButton.setAttribute(
    "class",
    "bg-blue-500 hover:bg-blue-700 text-white p-1.5 px-3 rounded"
  );
  editButton.setAttribute("id", "editButton_" + id);
  editButton.setAttribute("onclick", `editItem('${id}')`);
  editButton.innerText = "Edit";

  const saveButton = document.createElement("button");
  saveButton.setAttribute(
    "class",
    "bg-blue-500 hover:bg-blue-700 text-white p-1.5 px-3 rounded hidden"
  );
  saveButton.setAttribute("id", "saveButton_" + id);
  saveButton.setAttribute("onclick", `saveItem('${id}')`);
  saveButton.innerText = "Save";

  const deleteButton = document.createElement("button");
  deleteButton.setAttribute("class", "p-1.5 mx-3 rounded hover:bg-slate-300");
  deleteButton.setAttribute("onclick", `removeItem('${id}')`);
  const icon = document.createElement("i");
  icon.setAttribute("class", "fa-solid fa-x");
  deleteButton.appendChild(icon);

  if (status) {
    checkbox.setAttribute("checked", "");
  }
  input.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
      saveButton.click();
    }
  });

  div.appendChild(checkbox);
  div.appendChild(input);
  div.appendChild(editButton);
  div.appendChild(saveButton);
  div.appendChild(deleteButton);

  return div;
}

// Function that runs when a checkbox is checked
function handleCheckbox(itemID) {
  const checkBox = document.getElementById(`checkbox_${itemID}`);
  item = allLists[selectedListID].todos[itemID];
  if (checkBox.checked) {
    item.status = true;
  } else {
    item.status = false;
  }
  save();
}

// Function that runs when the 'Edit' button is pressed
function editItem(itemID) {
  const inputBox = document.getElementById(`input_${itemID}`);
  inputBox.disabled = false;
  let len = inputBox.value.length;
  inputBox.focus();
  inputBox.setSelectionRange(len, len);
  document.getElementById(`editButton_${itemID}`).classList.add("hidden");
  document.getElementById(`saveButton_${itemID}`).classList.remove("hidden");
}

// Function that runs when the 'Save' button is pressed or 'submit' event
function saveItem(itemID) {
  const inputBox = document.getElementById(`input_${itemID}`);
  inputBox.disabled = true;
  document.getElementById(`editButton_${itemID}`).classList.remove("hidden");
  document.getElementById(`saveButton_${itemID}`).classList.add("hidden");

  item = allLists[selectedListID].todos[itemID];
  item.content = inputBox.value;
  save();
}

// Function that runs when the 'X' delete button is pressed
function removeItem(itemID) {
  document.getElementById(itemID).remove();
  delete allLists[selectedListID].todos[itemID];
  save();
}

// -- CODE THAT RUNS --

let passDefaultLists = false;
let passSelectedList = true;

let allLists = JSON.parse(localStorage.getItem("allLists"));

let selectedListID = null;

if (passDefaultLists) {
  allLists = {
    uuid1: {
      name: "New List",
      todos: {
        uuid2: {
          content: "First Item",
          status: true,
        },
      },
    },
    uuid3: {
      name: "Second List",
      todos: {
        uuid4: {
          content: "My Todo Item",
          status: false,
        },
        uuid5: {
          content: "My next todo item",
          status: true,
        },
      },
    },
  };
}

if (passSelectedList) {
  selectedListID = Object.keys(allLists)[1];
  renderSelectedList();
}

if (allLists == null) {
  allLists = {};
  createNewList("New List");
}

renderLists();

// localStorage.clear();
