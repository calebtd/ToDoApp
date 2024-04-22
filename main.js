let lists = JSON.parse(localStorage.getItem("lists"));

function save() {
  localStorage.setItem("lists", JSON.stringify(lists));
}
// localStorage.clear();

function createItemElement(id, value, status) {
  const div = document.createElement("div");
  div.setAttribute("class", "flex items-center mb-2 border border-slate-400");
  div.setAttribute("id", id);

  const checkbox = document.createElement("input");
  checkbox.setAttribute("class", "m-2 peer");
  checkbox.setAttribute("type", "checkbox");
  checkbox.setAttribute("id", "cb" + id);
  checkbox.setAttribute("onclick", `boxChecked('${id}')`);

  const input = document.createElement("input");
  input.setAttribute("id", "i" + id);
  input.setAttribute(
    "class",
    "peer-checked:line-through bg-inherit p-2 w-full outline-none"
  );
  input.setAttribute("type", "text");
  input.setAttribute("disabled", "");
  input.setAttribute("value", value);
  input.setAttribute("onblur", `disableEditItem('${id}')`);

  const editButton = document.createElement("button");
  editButton.setAttribute(
    "class",
    "bg-blue-500 hover:bg-blue-700 text-white p-1.5 px-3 rounded"
  );
  editButton.setAttribute("onclick", `enableEditItem('${id}')`);
  editButton.setAttribute("id", "b" + id);
  editButton.innerText = "Edit";

  const deleteButton = document.createElement("button");
  deleteButton.setAttribute("class", "p-1.5 mx-3 rounded hover:bg-slate-300");
  deleteButton.setAttribute("onclick", `removeItem('${id}')`);
  const icon = document.createElement("i");
  icon.setAttribute("class", "fa-solid fa-x");
  deleteButton.appendChild(icon);

  if (status) {
    checkbox.setAttribute("checked", "");
  }

  div.appendChild(checkbox);
  div.appendChild(input);
  div.appendChild(editButton);
  div.appendChild(deleteButton);

  return div;
}

// function renderLists() {
//   const ul = document.getElementById("lists");
//   if (lists.length > 0) {
//     ul.innerHTML = "";
//     for (let i = 0; i < lists.length; i++) {
//       const li = document.createElement("li");
//       li.appendChild(document.createTextNode(lists[i].name));
//       ul.appendChild(li);
//       console.log(ul);
//     }
//   } else {
//     li.appendChild(document.createTextNode("New List"));
//     ul.appendChild(li);
//   }
// }

// function render() {
//   for (let x in lists) {
//     console.log(lists[x].name);
//   }
// }

function render() {
  // this will hold the html that will be displayed in the sidebar
  let listsHtml = '<ul class="list-group">';
  // iterate through the lists to get their names
  for (let x in lists) {
    listsHtml += `<li class="list-group-item">${lists[x].name}</li>`;
  }
  listsHtml += "</ul>";
  // print out the lists
  document.getElementById("lists").innerHTML = listsHtml;
  // print out the name of the selected list
  document.getElementById("selected-list-name").innerText = selectedList.name;
  // iterate over the todos in the selected list
  let todosDiv = document.getElementById("selected-list-todos");
  for (let x in selectedList.items) {
    let listItem = selectedList.items[x];
    todosDiv.appendChild(
      createItemElement(crypto.randomUUID, listItem.content, listItem.status)
    );
  }
  save();
}

// function renderContent() {
//   if (selected) {
//     const content = document.getElementById("content");
//     content.innerHTML = "";
//     const ul = document.createElement("ul");
//     let listItems = lists.selected.items;
//     for (i = 0; i < listItems.length; i++) {
//       const li = document.creaeElement("li");
//       li.appendChild(document.createTextNode(listItems[i]));
//       listItems[i];
//     }
//   }
// }

let selectedList = lists[1];
render();

// Example usage:
// const golfCourseElement = createGolfCourseElement("01", "Testing Item");
// document.body.appendChild(golfCourseElement);

function boxChecked(id) {
  const checkBox = document.getElementById(`cb${id}`);
  if (checkBox.checked) {
    // inputBox.value = "true";
  } else {
    // inputBox.value = "false";
  }
}

function enableEditItem(id) {
  const inputBox = document.getElementById(`i${id}`);
  inputBox.disabled = false;
  let len = inputBox.value.length;
  inputBox.focus();
  inputBox.setSelectionRange(len, len);
  document.getElementById(`b${id}`).innerHTML = "Save";
}

function disableEditItem(id) {
  document.getElementById(`b${id}`).innerHTML = "Edit";
}

function removeItem(id) {
  document.getElementById(id).remove();
}
