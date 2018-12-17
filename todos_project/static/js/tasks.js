function Task(description, category) {
	this.description = description;
	this.category = category;
	this.isCompleted = false;
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
	},
	removeCompleted: function() {
		this.tasks = this.tasks.filter(function(task) {
			return (!task.isCompleted);
		});
		this.render();
	},
	findById: function (id) {
		return this.tasks[id];
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
			if(task.isCompleted) {
				liClass += " completed";
				cbChecked = "checked";
			}
			this.domElement.append(
				'<li class="' + liClass + '" data-task="' + i + '">'
				+ '<label><input type="checkbox" class="is-completed" '
				+ cbChecked + '>'
				+ '<span class="description">' + task.description
				+ '</span></label'
				+ '</li>'
			);
		}
	}
};

(function setupEvents() {
	Tasks.setDomElement($('#tasks ul'));
	function addNewTask() {
		var description = $('#txtNewTask').val();
		var category = $('#ddCategory').val();
		if(description.trim() == "") {
			alert("You must enter text");
			return;
		}
		$('#txtNewTask').val('');
		var task = new Task(description, category);
		Tasks.add(task);
	}
	$(document).on("click", "#tasks .is-completed", function() {
		var taskId = $(this).closest('li').data('task');
		var task = Tasks.findById(taskId);
		task.isCompleted = !task.isCompleted;
		Tasks.render();
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
})();