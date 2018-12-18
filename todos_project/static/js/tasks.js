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
		this.render();
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
	function addNewTask() {
	    // TO DO: check if we're waiting for an AJAX response...

	    //$('#btnAddTask').prop('disabled', true);
		var description = $('#txtNewTask').val();
		var category = $('#ddCategory').val();
		if(description.trim() == "") {
			alert("You must enter text");
			return;
		}
		$.post('/todos/',
			{
				task: {
					description: description,
					category: category,
					dateAdded: new Date()
				}
			},
			'json'
		)
        .done(function(data) {
            $('#txtNewTask').val('');
            if (data.code == 200) {
                var tasks = data.tasks;
                Tasks.tasks = tasks;
                Tasks.render();
            }
        })
        .fail(function(data) {
            alert("There was a problem adding your task");
        })
        .always(function() {
            $('#btnAddTask').prop('disabled', false);
        });
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