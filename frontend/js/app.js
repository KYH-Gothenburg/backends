getTodos();

window.setInterval(() => {
  getTodos();
}, 1000);

function getTodos() {
  fetch("http://localhost:5000/todos")
    .then(res => res.json())
    .then(todos => {
      const todoList = document.getElementById("myUL");
      emptyList(todoList);
      todos.forEach((todo) => {
        newElement(todo.todo, todo.completed, todo.id);
      });
    });
}

function emptyList(list) {
  while( list.firstChild ) {
    list.removeChild(list.firstChild);
  }
}



// Create a "close" button and append it to each list item
var myNodelist = document.getElementsByTagName("LI");
var i;
for (i = 0; i < myNodelist.length; i++) {
  var span = document.createElement("SPAN");
  var txt = document.createTextNode("\u00D7");
  span.className = "close";
  span.appendChild(txt);
  myNodelist[i].appendChild(span);
}

// Click on a close button to hide the current list item
var close = document.getElementsByClassName("close");
var i;
for (i = 0; i < close.length; i++) {
  close[i].onclick = function() {
    var div = this.parentElement;
    div.style.display = "none";
  }
}

// Add a "checked" symbol when clicking on a list item
var list = document.querySelector('ul');
list.addEventListener('click', function(ev) {
  if (ev.target.tagName === 'LI') {
    ev.target.classList.toggle('checked');

    const checked = ev.target.classList.contains("checked");
    console.log(checked);
    const todoId = ev.target.querySelector(".id").value;
    fetch(`http://localhost:5000/todos/${todoId}`, {
      method: "PATCH",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({completed: checked})
    });
  }
}, false);

// Create a new list item when clicking on the "Add" button
function newElement(todoText = '', completed=false, id=-1) {
  var li = document.createElement("li");
  var inputValue;
  if(todoText === '') {
    inputValue = document.getElementById("myInput").value;
  }
  else {
    inputValue = todoText;
  }

  if(completed) {
    li.classList.add("checked");
  }

  const hiddenId = document.createElement("input");
  hiddenId.setAttribute("type", "hidden");
  hiddenId.setAttribute("value", id);
  hiddenId.classList.add("id");

  li.appendChild(hiddenId);

  var t = document.createTextNode(inputValue);
  li.appendChild(t);
  if (inputValue === '') {
    alert("You must write something!");
  } else {
    document.getElementById("myUL").appendChild(li);
  }
  

  var span = document.createElement("SPAN");
  var txt = document.createTextNode("\u00D7");
  span.className = "close";
  span.appendChild(txt);
  li.appendChild(span);

  for (i = 0; i < close.length; i++) {
    close[i].onclick = function() {
      const todoId = this.parentElement.querySelector(".id").value;
      fetch(`http://localhost:5000/todos/${todoId}`, {
        method: "DELETE",
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json"
        }
      });
      var div = this.parentElement;
      div.style.display = "none";
    }
  }
}

function createTodo() {
  const todoText = document.getElementById("myInput").value;
  document.getElementById("myInput").value = "";

  fetch("http://localhost:5000/todos", {
    method: "POST",
    headers: {
      "Accept": "application/json",
      "Content-Type": "application/json"
    },
    body: JSON.stringify({todoText: todoText})
  })
  .then(() => {
    document.getElementById("myInput").value = "";
    getTodos();
  });
}
