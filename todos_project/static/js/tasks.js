function Task(description, category) {
	this.description = description;
	this.category = category;
	this.completed = false;
	this.dateAdded = null;
}

var Tasks = {
	tasks: [],
	domElement: null,
	add: function (task) {
		this.tasks.push(task);
		this.render();
	},
	remove: function (index) {
		this.tasks.splice(index, 1);
		this.render();
	},
	removeCompleted: function() {
		this.tasks = this.tasks.filter(function(task) {
			return (!task.completed);
		});
		this.render();
	},
	getIndex: function (task) {
		for (var i = 0; i < this.tasks.length; i++) {
			if(this.tasks[i].id == task.id) {
				return i;
			}
		}
		return -1;
	},
	findById: function (id) {
		var filtered = this.tasks.filter(function (task) {
			return (task.id == id);
		});
		if (filtered.length > 0) {
			return filtered[0];
		} else {
			return null;
		}
	},
	setDomElement: function(element) {
		this.domElement = element;
	},
	render: function () {
		this.domElement.empty();
		for(var i = 0; i < this.tasks.length; i++) {
			var task = this.tasks[i];
			var liClass = "task cat-" + task.category;
			var cbChecked = "";
			if(task.completed) {
				liClass += " completed";
				cbChecked = "checked";
			}
			this.domElement.append(
				'<li class="' + liClass + '" data-task="' + task.id + '">'
				+ '<label><input type="checkbox" class="is-completed" '
				+ cbChecked + '>'
				+ '<span class="description">' + task.description
				+ '</span></label'
				+ '</li>'
			);
		}
	}
};

// From https://docs.djangoproject.com/en/2.1/ref/csrf/
(function setupAjax() {
	function getCookie(name) {
		var cookieValue = null;
		if (document.cookie && document.cookie !== '') {
			var cookies = document.cookie.split(';');
			for (var i = 0; i < cookies.length; i++) {
				var cookie = jQuery.trim(cookies[i]);
				// Does this cookie string begin with the name we want?
				if (cookie.substring(0, name.length + 1) === (name + '=')) {
					cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
					break;
				}
			}
		}
		return cookieValue;
	}
	function csrfSafeMethod(method) {
		// these HTTP methods do not require CSRF protection
		return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method));
	}
	$.ajaxSetup({
		beforeSend: function(xhr, settings) {
			if (!csrfSafeMethod(settings.type) && !this.crossDomain) {
				xhr.setRequestHeader("X-CSRFToken", getCookie('csrftoken'));
			}
		}
	});
})();
(function setupEvents() {
	Tasks.setDomElement($('#tasks ul'));

	function getDateString(date) {
		var year = date.getFullYear();
		var month = String(date.getMonth() + 1);
		var day = String(date.getDate());
		var hour = String(date.getHours());
		var minute = String(date.getMinutes());

		if (month.length < 2) {
			month = '0' + month;
		}
		if (day.length < 2) {
			day = '0' + day;
		}
		if (hour.length < 2) {
			hour = '0' + hour;
		}
		if (minute.length < 2) {
			minute = '0' + minute;
		}


		return `${year}-${month}-${day} ${hour}:${minute}`;
	}

	function addNewTask() {
		// TO DO: check if we're waiting for an AJAX response...

		//$('#btnAddTask').prop('disabled', true);
		var description = $('#txtNewTask').val();
		var category = $('#ddCategory').val();
		if(description.trim() == "") {
			alert("You must enter text");
			return;
		}
		var dateString = getDateString(new Date());
		$.post('/todos/',
			{
				task: {
					description: description,
					category: category,
					dateAdded: dateString
				}
			},
			'json'
		)
		.done(function(data) {
			$('#txtNewTask').val('');
			if (data.code == 200) {
				var task = data.task;
				Tasks.add(task);
			}
		})
		.fail(function(data) {
			alert("There was a problem adding your task");
		})
		.always(function() {
			$('#btnAddTask').prop('disabled', false);
		});
	}

	function updateTask(task) {
		if (task.id == null || task.id < 0) {
			throw new Exception("Invalid task");
		}
		var taskIndex = Tasks.getIndex(task);
		if (taskIndex < 0) {
			throw new Exception("Task is not in your list");
		}
		$.post('/todos/' + task.id, { task: task },	'json')
		.done(function(data) {
			if (data.code == 200) {
				Tasks.tasks[taskIndex] = data.task;
				Tasks.render();
			}
		})
		.fail(function(data) {
			alert("There was a problem updating your task");
		})
		.always(function() {
			$('#btnAddTask').prop('disabled', false);
		});
	}

	function loadAllTasks() {
		$.get('/todos/', {}, 'json')
		.done(function(data) {
			if (data.code == 200) {
				var tasks = data.tasks;
				if (!!tasks) {
					Tasks.tasks = tasks;
					Tasks.render();
				}
			}
		})
		.fail(function(data) {
			alert("There was a problem loading the tasks");
		})
		.always(function() {
			$('#btnAddTask').prop('disabled', false);
		});
	}

	$(document).on("click", "#tasks .is-completed", function() {
		var taskId = $(this).closest('li').data('task');
		var task = Tasks.findById(taskId);
		task.completed = !task.completed;
		updateTask(task);
	});
	// Press <Enter> on the text field
	$('#txtNewTask').on('keypress', function(event) {
		if(event.which == 13) {
			event.preventDefault();
			addNewTask();
		}
	});
	// Focus the text input after selecting a category
	$('#ddCategory').on('change', function() {
		$('#txtNewTask').focus();
	});
	$('#btnAddTask').on('click', function() {
		addNewTask();
		$('#txtNewTask').focus();
	});
	$('#btnRemoveCompleted').on('click', function() {
		Tasks.removeCompleted();
	});
	$(document).ready(function() {
		loadAllTasks();
	})
})();