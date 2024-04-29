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
function createNewList() {
  newID = crypto.randomUUID();
  allLists[newID] = { name: "My New List", todos: {} };
  selectList(newID);
}

// Create a new item object within a given todo object
function createNewItem() {
  newID = crypto.randomUUID();
  allLists[selectedListID].todos[newID] = { content: "", status: false };
  renderSelectedList();
  editItem(newID);
}

// Function to set a variable for the current list and rerender the page
function selectList(listID) {
  selectedListID = listID;
  if (selectedListID !== null) {
    localStorage.setItem("selectedListID", listID);
  }
  renderLists();
  renderSelectedList();
}

// Render all the lists into the sidebar
function renderLists() {
  const sidebarDiv = document.getElementById("sidebar-div");
  sidebarDiv.innerHTML = "";

  for (let listID in allLists) {
    const button = document.createElement("button");
    button.setAttribute(
      "class",
      "px-2 py-1 mb-0.5 rounded w-full text-left hover:bg-neutral-600/25 h-8"
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

  const newListDiv = document.createElement("div");
  newListDiv.setAttribute("class", "flex justify-center");
  const newListButton = document.createElement("button");
  newListButton.setAttribute(
    "class",
    "bg-slate-500 hover:bg-slate-600 p-1 px-2 mt-1 rounded"
  );
  newListButton.setAttribute("onclick", `createNewList()`);
  newListButton.innerText = "New List";

  newListDiv.appendChild(newListButton);
  sidebarDiv.appendChild(newListDiv);

  save();
}

// Render the selected list name at the top of the main page
function renderListName() {
  const selectedListDiv = document.getElementById("selected-list-div");
  selectedListDiv.innerHTML = "";

  const nameDiv = document.createElement("div");
  nameDiv.setAttribute("class", "mr-2 font-semibold text-3xl relative");

  const nameSpan = document.createElement("span");
  nameSpan.setAttribute(
    "class",
    "p-1 absolute h-0 overflow-hidden whitespace-pre"
  );
  nameSpan.setAttribute("id", "list-name-span");
  nameDiv.appendChild(nameSpan);

  const nameInput = document.createElement("input");
  nameInput.setAttribute("class", "p-1 min-w-10 bg-inherit opacity-100");
  nameInput.setAttribute("id", "list-name-input");
  nameInput.setAttribute("type", "text");
  nameInput.setAttribute("value", allLists[selectedListID].name);
  nameInput.setAttribute("disabled", "");
  nameDiv.appendChild(nameInput);
  nameInput.addEventListener("input", resizeNameInput);
  requestAnimationFrame(resizeNameInput); // run on the next cycle, otherwise it breaks

  selectedListDiv.appendChild(nameDiv);
}

function resizeNameInput() {
  const nameSpan = document.getElementById("list-name-span");
  const nameInput = document.getElementById("list-name-input");
  nameSpan.textContent = nameInput.value;
  nameInput.style.width = nameSpan.offsetWidth + "px";
}

// Render the Dropdown Menu on the side of the List Name
function renderDropdownMenu() {
  const selectedListDiv = document.getElementById("selected-list-div");

  const dropdownButton = document.createElement("button");
  dropdownButton.setAttribute(
    "class",
    "p-1.5 rounded hover:bg-slate-300 relative"
  );
  const dropdownIcon = document.createElement("i");
  dropdownIcon.setAttribute("class", "fa-solid fa-angle-down");
  dropdownButton.appendChild(dropdownIcon);

  // Dropdown menu container
  const dropdownMenu = document.createElement("div");
  dropdownMenu.setAttribute(
    "class",
    "absolute left-0 mt-2 w-32 bg-white rounded-lg shadow-lg hidden"
  );

  // Dropdown menu options
  const renameOption = document.createElement("button");
  renameOption.setAttribute(
    "class",
    "block p-2 text-gray-800 hover:bg-neutral-600/25 w-full text-left rounded-t-lg"
  );
  renameOption.setAttribute("id", "rename-button");
  renameOption.textContent = "Rename";
  renameOption.addEventListener("click", renameSelectedList);

  const deleteOption = document.createElement("button");
  deleteOption.setAttribute(
    "class",
    "block p-2 text-gray-800 hover:bg-gray-200 w-full text-left rounded-b-lg"
  );
  deleteOption.textContent = "Delete";
  deleteOption.addEventListener("click", deleteSelectedList);

  // Append options to dropdown menu
  dropdownMenu.appendChild(renameOption);
  dropdownMenu.appendChild(deleteOption);

  // Append dropdown menu to button container
  dropdownButton.appendChild(dropdownMenu);

  // Toggle dropdown menu visibility
  dropdownButton.addEventListener("click", () => {
    dropdownMenu.classList.toggle("hidden");
  });

  selectedListDiv.appendChild(dropdownButton);

  // Hide dropdown menu when clicking outside
  document.addEventListener("click", (event) => {
    const isClickInsideDropdown =
      dropdownButton.contains(event.target) ||
      dropdownMenu.contains(event.target);
    if (!isClickInsideDropdown) {
      dropdownMenu.classList.add("hidden");
    }
  });
}

// This renders the main page of items
function renderSelectedList() {
  if (selectedListID == null) {
    const nameDiv = document.getElementById("selected-list-div");
    const todosDiv = document.getElementById("selected-list-todos");
    nameDiv.replaceChildren();
    todosDiv.replaceChildren("Go ahead and select a list");
  } else {
    const selectedList = allLists[selectedListID];

    renderListName();
    renderDropdownMenu();

    const todosDiv = document.getElementById("selected-list-todos");
    todosDiv.innerHTML = "";
    for (let item in selectedList.todos) {
      itemElement = renderItemElements(
        item,
        selectedList.todos[item].content,
        selectedList.todos[item].status
      );
      todosDiv.appendChild(itemElement);
    }

    const newItemButton = document.createElement("button");
    newItemButton.setAttribute(
      "class",
      "bg-blue-500 hover:bg-blue-700 text-white p-1.5 px-3 mt-1 rounded"
    );
    newItemButton.setAttribute("onclick", `createNewItem()`);
    newItemButton.innerText = "New Item";

    todosDiv.appendChild(newItemButton);

    save();
  }
}

//
function renameSelectedList() {
  const selectedList = allLists[selectedListID];
  const inputBox = document.getElementById("list-name-input");
  inputBox.disabled = false;
  let len = inputBox.value.length;
  inputBox.focus();
  inputBox.setSelectionRange(len, len);

  // Listen for the Enter key, and then save
  inputBox.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
      saveListName();
    }
  });

  // Listen for clicking anywhere else
  document.addEventListener("click", (event) => {
    const renameOption = document.getElementById("rename-button");
    const isClickInside =
      inputBox.contains(event.target) || renameOption.contains(event.target);
    if (!isClickInside) {
      saveListName();
    }
  });

  // Disable the box, which in turns blurs, and then save the new name
  function saveListName() {
    inputBox.disabled = true;
    inputBox.value = inputBox.value.trim();
    selectedList.name = inputBox.value;
    save();
    resizeNameInput();
    renderLists();
  }
}

function deleteSelectedList() {
  const modalHTML = `
    <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>
    <div class="fixed inset-0 z-10 flex items-center justify-center">
      <div class="relative bg-white rounded-lg max-w-md w-full p-6 m-2">
        <div class="text-center">
          <h3 class="text-lg font-medium text-gray-900">Delete '${allLists[selectedListID].name}'?</h3>
          <div class="mt-2 text-sm text-gray-500">Are you sure you want to delete this list? This action cannot be undone.</div>
        </div>
        <div class="mt-4 flex justify-center">
          <button id="confirmDeleteButton" class="bg-red-500 text-white py-2 px-4 rounded-md mr-2">Delete</button>
          <button id="cancelDeleteButton" class="bg-gray-200 text-gray-700 py-2 px-4 rounded-md">Cancel</button>
        </div>
      </div>
    </div>
  `;

  // Append modal HTML to body
  const modalContainer = document.createElement("div");
  modalContainer.innerHTML = modalHTML;
  document.body.appendChild(modalContainer);

  // Add event listeners
  const confirmDeleteButton = document.getElementById("confirmDeleteButton");
  const cancelDeleteButton = document.getElementById("cancelDeleteButton");

  confirmDeleteButton.addEventListener("click", () => {
    modalContainer.remove();

    delete allLists[selectedListID];
    selectedListID = null;
    renderLists();
    renderSelectedList();

    save();
    localStorage.removeItem("selectedListID");
  });

  cancelDeleteButton.addEventListener("click", () => {
    // Remove modal from DOM
    modalContainer.remove();
  });
}

// Create the element for each todo item
function renderItemElements(id, content, status) {
  const div = document.createElement("div");
  div.setAttribute(
    "class",
    "flex items-center mb-2 border border-slate-400 rounded"
  );
  div.setAttribute("id", id);

  // Everything for the Checkbox
  const checkbox = document.createElement("input");
  checkbox.setAttribute("class", "m-2 peer min-h-6");
  checkbox.setAttribute("id", "checkbox_" + id);
  checkbox.setAttribute("type", "checkbox");
  checkbox.setAttribute("onclick", `handleCheckbox('${id}')`);

  // Everything for the actual Input box
  const input = document.createElement("input");
  input.setAttribute(
    "class",
    "peer-checked:line-through bg-inherit m-1 p-1 w-full rounded outline-1 opacity-100"
  );
  input.setAttribute("id", "input_" + id);
  input.setAttribute("type", "text");
  input.setAttribute("value", content);
  input.setAttribute("disabled", "");
  input.setAttribute("onblur", `saveItem('${id}')`);

  // Everything for the Edit Button
  const editButton = document.createElement("button");
  editButton.setAttribute(
    "class",
    "bg-blue-500 hover:bg-blue-700 text-white p-1 w-14 rounded"
  );
  editButton.setAttribute("id", "editButton_" + id);
  editButton.setAttribute("onclick", `editItem('${id}')`);
  editButton.innerText = "Edit";

  // Everything for the Save Button
  const saveButton = document.createElement("button");
  saveButton.setAttribute(
    "class",
    "bg-blue-500 hover:bg-blue-700 text-white p-1 w-14 rounded hidden"
  );
  saveButton.setAttribute("id", "saveButton_" + id);
  saveButton.setAttribute("onclick", `saveItem('${id}')`);
  saveButton.innerText = "Save";

  // Everything for the Delete Button
  const deleteButton = document.createElement("button");
  deleteButton.setAttribute("class", "p-1.5 mx-3 rounded hover:bg-slate-300");
  deleteButton.setAttribute("onclick", `removeItem('${id}')`);
  const icon = document.createElement("i");
  icon.setAttribute("class", "fa-solid fa-x");
  deleteButton.appendChild(icon);

  // Check the checkbox if the item's "status" is true
  if (status) {
    checkbox.setAttribute("checked", "");
  }

  // Listen for enter in the Input Box to press the Save Button
  input.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
      saveButton.click();
    }
  });

  // Get everything ready to throw on the page!
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

let allLists = JSON.parse(localStorage.getItem("allLists"));
let selectedListID = localStorage.getItem("selectedListID");

if (allLists == null) {
  allLists = {};
  createNewList("My First List");
}

selectList(selectedListID);

// localStorage.clear();
