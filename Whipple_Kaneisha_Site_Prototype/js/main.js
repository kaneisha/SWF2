var user = {};
var project = {};
var task = {};

var landingTemplate;
var appTemplate;

var checkLogin = function() {
	$.ajax({
		url : 'xhr/check_login.php',
		type : 'get',
		dataType : 'json',
		success : function(r) {
			if (r.user) {
				console.log('user exists');
				user = r.user;
				loadApp();
			} else {
				console.log('go home');
				loadLanding();
			}
		}
	});
};

checkLogin();

var loadLanding = function() {
	$('#wrap').empty();
	$.get('templates/template.html', function(htmlArg) {

		landingTemplate = htmlArg;

		var landing = $(htmlArg).find('#landing-template').html();
		$.template('landingtemplate', landing);

		var html = $.render('', 'landingtemplate');

		$('#wrap').append(html);

		$('#login_button').on('click', function(e) {
			console.log('clicks');
			e.preventDefault();
			login();
		});

		$('#register_button').on('click', function(e) {
			console.log('clicks');
			e.preventDefault();
			register();
		});

	});
};

var login = function() {

	var user = $('#username_login').val();
	var pass = $('#username_pwd').val();

	$.ajax({
		url : 'xhr/login.php',
		data : {
			username : user,
			password : pass
		},
		type : 'post',
		dataType : 'json',
		success : function(response) {
			if (response.user) {
				//console.log(response);
				//get_projects();

				loadApp();

			} else {
				console.log('no user');
				//console.log(error);
				//loadLanding();
				$('#error').html('*You put in the wrong information please try again');
				// if(user.error){
				// 	console.log(error);
				// 	//user.style.backgroundColor = '#ff0000';
				// 	//$('#username_login').css({'background-color': 'ff0000'});

				// }

			}
		}
		//return false;
	});
};

//------------------------------------------Register------------------------------------------------//

var register = function() {

	var user = $('#register_username').val();
	var pass = $('#register_pwd').val();
	var email = $('#register_email').val();
	$.ajax({
		url : 'xhr/register.php',
		data : {
			username : user,
			password : pass,
			email : email
		},
		type : 'post',
		dataType : 'json',
		success : function(response) {
			if (response.user) {
				console.log(response);
				loadApp();
			} else {
				console.log('register unsuccessful');
				//loadLanding();
			}
		}
		//return false;
	});

	return false;
};

//----------------------------------------------Logout---------------------------------------------//

var logout = function() {
	$.get('xhr/logout.php', function() {
		window.location.replace("http://localhost:8888");
	});
	return false;
};

//----------------------------------------------Get Project------------------------------------------//

var get_projects = function() {
	console.log('run');

	var project_item = $(appTemplate).find('#project_item').html();
	$.template('projectitem', project_item);

	$.ajax({
		url : 'xhr/get_projects.php',
		type : 'get',
		dataType : 'json',
		success : function(response) {
			console.log(response);

			if (response) {
				//loadApp();
				var projects = response.projects;
				var html = $.render(projects, 'projectitem');

				$('#wrapperTwo').append(html);
			} else {
				console.log('could not get projects');

			}
		}
		//return false;
	});

};

var loadApp = function() {
	$('#wrap').empty();
	$.get('templates/template.html?4', function(htmlArg) {

		appTemplate = htmlArg;

		var app = $(htmlArg).find('#app-template').html();
		$.template('apptemplate', app);

		var html = $.render('', 'apptemplate');

		$('#wrap').append(html);

		$('#logout').on('click', function(e) {
			//console.log('clicker');
			e.preventDefault();
			logout();
		});

		$(document).on('click', '#view_tasks', function(e) {
			//console.log("clicked");
			var projectid = ($(this).attr("data-id"));
			project.id = projectid;
			console.log(project.id);
			e.preventDefault();
			loadTasks(projectid);
		});

		$('#add_icon').on('click', function(e) {
			//console.log("clicked");
			e.preventDefault();
			loadAddProject();
		});

		$(document).on('click', '#edit', function(e) {
			//console.log("clicked");
			var editProjectID = ($(this).attr("data-projectid"));
			//project.id = editProjectID;
			e.preventDefault();
			loadEditProject(editProjectID);
		});

		$(document).on('click', '#account_icon', function(e) {
			e.preventDefault();
			loadAccount();
		});

		get_projects();

	});

};

//--------------------------------------------Tasks Page--------------------------------------------//

var get_tasks = function(editProjectID) {
	console.log('run');

	var task_item = $(appTemplate).find('#task_item').html();
	$.template('taskitem', task_item);

	console.log(editProjectID);
	$.ajax({
		url : 'xhr/get_tasks.php',
		data : {
			projectID : editProjectID
		},
		type : 'get',
		dataType : 'json',
		success : function(response) {
			console.log(response);

			if (response) {
				//loadApp();
				var tasks = response.tasks;
				var html = $.render(tasks, 'taskitem');

				$('#wrapper').append(html);
			} else {
				console.log('could not get tasks');

			}
		}
		//return false;
	});
};

var loadTasks = function(projectid) {
	$('#wrap').empty();
	var tasks = $(appTemplate).find('#task-template').html();
	$.template('tasktemplate', tasks);

	var html = $.render('', 'tasktemplate');

	$('#wrap').append(html);

	$('#logout').on('click', function(e) {
		//console.log('clicker');
		e.preventDefault();
		logout();
	});

	$(document).on('click', '#task_edit', function(e) {
		e.preventDefault();
		var editTask = ($(this).attr("data-taskid"));
		loadEditTasks(editTask);
	});

	$(document).on('click', '#add_task_icon', function(e) {
		console.log('clicked');
		e.preventDefault();
		var taskID = ($(this).attr("data-addtaskid"));
		loadAddTask(taskID);
	});
	console.log(projectid);
	get_tasks(projectid);
};

//----------------------------------Add Project-----------------------------------------//

var loadAddProject = function() {
	var status;
	$('#wrap').empty();
	var adding_project = $(appTemplate).find('#add_project').html();
	$.template('addproject', adding_project);

	var html = $.render('', 'addproject');

	$('#wrap').append(html);

	$('.clickable').on('click', function(e) {
		console.log('status click');
		e.preventDefault();
		status = $(this).html();
	});

	$(function() {
		$("#datepicker").datepicker({
			changeMonth : true,
			changeYear : true
		});
	});

	$('#button').on('click', function(e) {
		console.log('clicker');
		e.preventDefault();
		//loadApp();

		console.log(status);
		new_project(status);
	});

	$('#logout').on('click', function(e) {
		//console.log('clicker');
		e.preventDefault();
		logout();
	});

};

var new_project = function(status) {

	var name = $('#project_name').val();
	// var status = $('.clickable').on('click', function(e){
	// 	e.preventDefault();
	// 	console.log($(this).html());
	// });
	console.log(status);

	//var email = $('#register_email').val();
	$.ajax({
		url : 'xhr/new_project.php',
		data : {
			projectName : name,
			status : status
		},
		type : 'post',
		dataType : 'json',
		success : function(response) {
			if (response.newproject) {
				console.log(response);
				// loadApp()

			} else {
				console.log('project add unsuccessful');
				//loadLanding();
			}
		}
		//return false;
	});

	return false;
};

//-----------------------------------------------------Add Task--------------------------------------------------------------//

var loadAddTask = function(taskID) {
	var status;
	$('#wrap').empty();
	var adding_task = $(appTemplate).find('#add_task-template').html();
	$.template('addtask', adding_task);

	var html = $.render('', 'addtask');

	$('#wrap').append(html);

	$('.clickable').on('click', function(e) {
		console.log('status click');
		e.preventDefault();
		status = $(this).html();
	});

	$(function() {
		$("#datepicker").datepicker({
			changeMonth : true,
			changeYear : true
		});
	});

	$('#task_button').on('click', function(e) {
		console.log('clicker');
		e.preventDefault();
		//loadApp();

		console.log(status);
		new_task(status, taskID);
	});

	$('#logout').on('click', function(e) {
		//console.log('clicker');
		e.preventDefault();
		logout();
	});

};

var new_task = function(status, taskID) {

	var name = $('#task_name').val();
	var descrip = $('#second_text_description').val();
	// var status = $('.clickable').on('click', function(e){
	// 	e.preventDefault();
	// 	console.log($(this).html());
	// });
	console.log("status" + status);

	//var email = $('#register_email').val();
	$.ajax({
		url : 'xhr/new_task.php',
		data : {
			projectID : project.id,
			taskName : name,
			taskDescription : descrip,
			status : status
		},
		type : 'post',
		dataType : 'json',
		success : function(response) {
			if (response.task) {
				console.log(response);
				// loadApp()

			} else {
				console.log('project add unsuccessful');
				//loadLanding();
			}
		}
		//return false;
	});

	return false;
};

//------------------------------------------------Update Project----------------------------------------------------------//

var loadEditProject = function(editProjectID) {
	$('#wrap').empty();
	var edit_project = $(appTemplate).find('#edit_project').html();
	$.template('editproject', edit_project);

	var html = $.render('', 'editproject');

	$('#wrap').append(html);

	$(function() {
		$("#datepicker").datepicker({
			changeMonth : true,
			changeYear : true
		});
	});

	$('#logout').on('click', function(e) {
		//console.log('clicker');
		e.preventDefault();
		logout();
	});

	$('#confirm').click(function() {
		update_project(editProjectID);

	});

	console.log(editProjectID);

};

var update_project = function(editProjectID) {
	console.log('runner');
	console.log(editProjectID);

	$(document).on('click', '#add_icon', function(e) {
		//console.log("clicked");
		e.preventDefault();
		loadAddProject();
	});

	$(document).on('click', '#confirm', function(e) {
		//console.log("clicked");
		e.preventDefault();
		loadApp();
	});
	var name = $('#edit_task_name').val();
	var descrip = $('#edit_task_description').val();
	var date = $('#datepicker').val();

	$.ajax({
		url : 'xhr/update_project.php',
		data : {
			projectID : editProjectID,
			projectName : name,
			projectDescription : descrip,
			updatedDate : date
		},
		type : 'post',
		dataType : 'json',
		success : function(response) {
			console.log(response);

			if (response) {
				console.log('updated project');
				//loadApp();
				// var tasks = response.tasks;
				// var html = $.render(tasks, 'taskitem');

				// $('#wrapper').append(html);
			} else {
				console.log('could not update project');

			}
		}
		//return false;
		//});

	});

};

//----------------------------------------------------Account Info-----------------------------------------------------------------//

var loadAccount = function() {
	$('#wrap').empty();
	var account = $(appTemplate).find('#account-template').html();
	$.template('accounttemplate', account);

	var html = $.render('', 'accounttemplate');

	$('#wrap').append(html);

	$('#logout').on('click', function(e) {
		//console.log('clicker');
		e.preventDefault();
		logout();
	});

	$('#add_icon').on('click', function(e) {
		//console.log("clicked");
		e.preventDefault();
		loadAddProject();
	});

	$('#savebutton').on('click', function(e) {
		e.preventDefault();
		edit_account();
		//loadApp;
	});
};

var edit_account = function() {
	var name = $('#full_name').val();
	var email = $('#user_email').val();
	var pass = $('#user_password').val();
	$.ajax({
		url : 'xhr/update_user.php',
		data : {
			first_name : name,
			email : email,
			password : pass
		},
		type : 'post',
		dataType : 'json',
		success : function(response) {
			if (response.error) {
				//console.log(response);
				console.log('could not update user');
				//get_projects();

			} else {
				console.log('edit account');
				loadApp();

			}
		}
		//return false;
	});
};

//----------------------------------------------------Update Task-----------------------------------------------------------------//

var loadEditTasks = function(editTask) {
	$('#wrap').empty();
	var updateTask = $(appTemplate).find('#update_task').html();
	$.template('updatetask', updateTask);

	var html = $.render('', 'updatetask');

	$('#wrap').append(html);

	$('#logout').on('click', function(e) {
		//console.log('clicker');
		e.preventDefault();
		logout();
	});

	$('#add_icon').on('click', function(e) {
		//console.log("clicked");
		e.preventDefault();
		loadAddProject();
	});

	$('#confirm_task').on('click', function(e) {
		e.preventDefault();
		edit_task(editTask);
		//loadApp;
	});

};

var edit_task = function(editTask) {

	var name = $('#edit_task_name').val();
	var descrip = $('#edit_task_description').val();

	$.ajax({
		url : 'xhr/update_task.php',
		data : {
			taskID : editTask,
			taskName : name,
			taskDescription : descrip
		},
		type : 'post',
		dataType : 'json',
		success : function(response) {
			if (response) {
				console.log(response);
				console.log('edited account');
				//get_projects();

				loadApp();

			} else {
				console.log('could not update user');

			}
		}
		//return false;
	});
};
