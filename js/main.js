const allTasks = document.querySelector('#book-list ul');
const countBadge = document.querySelector('#complete-list .title-container > .badge');
const addForm = document.forms['add-list'];
const formInput = addForm.querySelector('input[type="text"]');
const hideListBtn = document.querySelector(".title-container > span.hide-list");
const allCompleteList = document.querySelector("#complete-list > ul");
const expandSpan = document.querySelector("#complete-list > .title-container span.material-icons");
const searchForm = document.forms['search-books'];
const searchInput = searchForm.querySelector('input[type="text"]');

let newTaskDuplicated = false;

const loadFromLocalStorage = () => {
	const localStorageData = localStorage.getItem("data")
	const items = (localStorageData) ? JSON.parse(localStorageData) : [];

	items.forEach(elem => {
		if (elem.read === true) {
			allCompleteList.innerHTML += elem.content
		} else {
			allTasks.innerHTML += elem.content
		}
	})
}

loadFromLocalStorage();

addForm.addEventListener('submit',function(e) {
	e.preventDefault();

	const newTask = formInput.value.trim();
	let taskName = allTasks.querySelectorAll('li > span.name > p');

	taskName.forEach(i => {
		const allTasksValue = i.textContent.toLowerCase();
		const newTaskInput = newTask.toLowerCase();

		//set to true if duplicated found
		if (allTasksValue == newTaskInput) {
			newTaskDuplicated = true;
			errorMsg(newTaskInput.toUpperCase() + " Is already exist", 3000);
		}
	});

	if (!(newTaskDuplicated)) {
		if (newTask != "") {
			const taskRow = document.createElement('li');
			const newTaskName = document.createElement('span');
			const newTaskNameContent = document.createElement('p');
			const deleteTask = document.createElement('span');
			const updateTask = document.createElement('update');
			const chkbox = document.createElement('span');

			// set value
			newTaskNameContent.textContent=newTask;
			deleteTask.textContent='delete';
			updateTask.textContent='update';
			chkbox.textContent ='done';

			// set style 
			newTaskName.classList.add('name');
			deleteTask.classList.add('delete');
			updateTask.classList.add('update');
			chkbox.classList.add('material-icons');
			chkbox.classList.add('markComplete');

			// append chile node
			taskRow.appendChild(chkbox);
			newTaskName.appendChild(newTaskNameContent);
			taskRow.appendChild(newTaskName);
			taskRow.appendChild(updateTask);
			taskRow.appendChild(deleteTask);

			allTasks.appendChild(taskRow);

			saveToLocalStorage();
		} else {
			errorMsg("INPUT Mustn't empty", 3000);
		}
	}

	// clear input value
	formInput.value = "";

	// reset back to false
	newTaskDuplicated = false;
});

allTasks.addEventListener('click', function(e) {
	if (e.target.classList.contains("delete")) {
		let rec = e.target.parentNode;
		allTasks.removeChild(rec);
		saveToLocalStorage();
	}

	if (e.target.classList.contains("markComplete")) {
		let chkbox = e.target;
		let rec = e.target.parentNode;
		let updateTask = e.target.nextElementSibling.nextElementSibling;
		let deleteTask = updateTask.nextElementSibling;
	
		rec.removeChild(chkbox);
		rec.removeChild(updateTask);
		rec.removeChild(deleteTask);
	
		allCompleteList.appendChild(rec);
		countBadge.textContent = allCompleteList.childElementCount;
		
		saveToLocalStorage();
	}

	if (e.target.classList.contains("update")) {
		let updateSpan = e.target;
		let taskName = e.target.previousElementSibling;
		let chkbox = taskName.previousElementSibling;
		let taskNameContent = taskName.children[0];
		const textarea = document.createElement('textarea');
		textarea.value = taskNameContent.textContent;
	
		chkbox.style.display = "none";
		taskNameContent.style.display = "none";
		updateSpan.style.display = "none";
	
		taskName.appendChild(textarea);
		textarea.focus();
		autosize(textarea);
		let taskNameCharCount = taskNameContent.textContent.length;
		textarea.setSelectionRange(taskNameCharCount, taskNameCharCount);
	
		let update = function(e){
			let newTaskName = e.target.value.trim();
			if (newTaskName != "") {
				taskNameContent.textContent = newTaskName;
				autosize.update(textarea);
	
				console.log(taskName)
	
				taskName.removeChild(textarea);
	
				chkbox.removeAttribute("style");
				taskNameContent.removeAttribute("style");
				updateSpan.removeAttribute("style");

				saveToLocalStorage();
			}
			e.preventDefault();
		}
	
		textarea.addEventListener('focusout', function(e){
			update(e);
		});
	
		textarea.addEventListener('keypress', function(e){
			if (e.key == "Enter") {
				update(e);
			}
		});	
	}

});

searchInput.addEventListener('keyup', function(e){
	const searchInputValue = e.target.value.trim().toLowerCase();
	const taskName = allTasks.querySelectorAll("li  > span.name > p");

	taskName.forEach(i => {
		let allTasksValue = i.textContent.toLowerCase();
		let rec = i.parentNode.parentNode;
		if (allTasksValue.indexOf(searchInputValue) < 0) {
			rec.style.display = "none";
		} else {
			rec.style.display = "flex";
		}
	});
});

searchForm.addEventListener('submit', function(e){ e.preventDefault(); });

hideListBtn.addEventListener('click', function(e){
	let style = e.target.parentNode.nextElementSibling.style;
	let hideSpan = e.target.textContent;
	e.target.textContent = (hideSpan == "visibility") ? "visibility_off" : "visibility";
	style.display = (style.display == "block" || style.display == "") ? style.display = "none" : style.display = "block";
});

expandSpan.addEventListener('click', function(e){
	expandArrow = e.target.textContent;
	e.target.textContent = (expandArrow == "expand_more") ? "expand_less" : "expand_more";
	if (allCompleteList.classList.contains("hidden")) {
		allCompleteList.classList.remove("hidden")
	} else {
		allCompleteList.classList.add("hidden");
	}
});

countBadge.textContent = allCompleteList.childElementCount;

const saveToLocalStorage = () => {
	const items = [...allTasks.children];
	const readItems = [...allCompleteList.children];
	let data = []

	items.forEach((item, index) => {
		data.push({
			content: item.outerHTML,
			read: false
		})
	})

	readItems.forEach(element => {
		data.push({
			content: element.outerHTML,
			read: true
		})
	});

	localStorage.setItem("data", JSON.stringify(data));
}

const delay = (function() {
	let timer = 0;
	return function(callback, ms) {
		clearTimeout(timer);
		timer = setTimeout(callback, ms);
	};
})();

const errorMsg = function(msg, timer){
	const error = addForm.querySelector("p.errormsg");

	error.textContent = msg;
	formInput.style.borderColor = "crimson";
	formInput.nextElementSibling.style.background = "crimson";
	formInput.nextElementSibling.style.borderColor = "crimson";

	delay(function(){
		error.innerHTML = "&nbsp;";
		formInput.style.borderColor = "#4A00E0";
		formInput.nextElementSibling.style.background = "#4A00E0";
		formInput.nextElementSibling.style.borderColor = "#4A00E0";
	}, timer);
}
