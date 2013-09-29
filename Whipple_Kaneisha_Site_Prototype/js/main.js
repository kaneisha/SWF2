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
				userID = r.user.id;
				loadApp(userID);
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
				var userID = response.user.id;
				loadApp(userID);

			} else {
				console.log('no user');
				//console.log(error);
				//loadLanding();
				$('#error').html('*You put in the wrong information please try again');

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
				$('#register_error').html('*Please input the correct information in all fields');
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
				if(date){


				var yearHTML = $('.year');
				var timeHTML = $('.time');
				var dateHTML = $('.date');


					for(var i = 0; i < response.projects.length; i++){
						var date = response.projects[i].startDate;
						var dueDate = date.split(" ");
						console.log(dueDate);

						var month = dueDate[2] + " " + dueDate[1];
						

						var yearsplit = dueDate[3].split("");
				

						var year = yearsplit[2] + yearsplit[3];
						$(dateHTML[i]).html(month);
						$(yearHTML[i]).html(year);
						// $(year[i]).html(year);
						// $(date[i]).html(date);
					}
					}


			} else {
				console.log('could not get projects');

			}
		}
		//return false;
	});

};

var loadApp = function(id) {
	$('#wrap').empty();

	$.get('templates/template.html?4', function(htmlArg) {

		appTemplate = htmlArg;

		var app = $(htmlArg).find('#app-template').html();
		$.template('apptemplate', app);

		var html = $.render('', 'apptemplate');

		$('#wrap').append(html);

		$('#account_icon').attr("data-userid", id)


		$('#logout').on('click', function(e) {
			//console.log('clicker');
			e.preventDefault();
			logout();
		});

		$(document).on('click', '#delete', function(e){
			e.preventDefault();
			console.log('deleted');
			id = e.target.name;
			deleteProject(id);
		})

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
			var userid = ($(this).attr("data-userid", id));
			user.id = userid
			console.log(userid);
			console.log(id);
			loadViewAccount(id);

		});

		$(document).on('click', '#clients_icon', function(e) {
			e.preventDefault();
			// var userid = ($(this).attr("data-userid", id));
			// user.id = userid
			// console.log(userid);
			// console.log(id);
			loadClients();

		});

		get_projects();

	});

};

//--------------------------------------------Delete Function--------------------------------------------//
var deleteProject = function(id){
	$.ajax({
		url: 'xhr/delete_project.php',
		type: 'post',
		data: {
			projectID: id
		},
		dataType: 'json',
		success : function(response){
			console.log(response);
			loadApp();
		}
	})
}


var deleteTask = function(projectid,id){
	$.ajax({
		url: 'xhr/delete_task.php',
		type: 'post',
		data: {
			projectID: projectid,
			taskID: id
		},
		dataType: 'json',
		success : function(response){
			console.log(response);
			loadApp();
		}
	})
}

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

				if(date){



				var yearHTML = $('.year');
				var timeHTML = $('.time');
				var dateHTML = $('.date');

					for(var i = 0; i < response.tasks.length; i++){
						var date = response.tasks[i].startDate;
						var dueDate = date.split(" ");
						console.log(dueDate);

						var month = dueDate[2] + " " + dueDate[1];
						

						var yearsplit = dueDate[3].split("");
				

						var year = yearsplit[2] + yearsplit[3];
						$(dateHTML[i]).html(month);
						$(yearHTML[i]).html(year);
						// $(year[i]).html(year);
						// $(date[i]).html(date);
					}
					}
				$('#task_wrapper').append(html);
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

	$(document).on('click', '#task_delete', function(e){
			e.preventDefault();
			console.log('deleted');
			id = e.target.name; 
			deleteTask(projectid,id);
		})


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
			changeYear : true,
			dateFormat : "D d M yy"
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

		$('#add_icon').on('click', function(e) {
			//console.log("clicked");
			e.preventDefault();
			loadAddProject();
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
			changeYear : true,
			dateFormat : "D d M yy"
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
			changeYear : true,
			dateFormat : "D d M yy"
		});
	});

	$('.clickable').on('click', function(e) {
		console.log('status click');
		e.preventDefault();
		status = $(this).html();
		console.log(status);
	});

		$('#add_icon').on('click', function(e) {
			//console.log("clicked");
			e.preventDefault();
			loadAddProject();
		});

	$('#logout').on('click', function(e) {
		//console.log('clicker');
		e.preventDefault();
		logout();
	});

	$('#confirm').click(function() {
		update_project(editProjectID,status);

	});

	$.ajax({
		url : 'xhr/get_projects.php',
		data : {
			projectID : editProjectID
			// projectName : name,
			// projectDescription : descrip,
			// updatedDate : date,
			// status: status
		},
		type : 'get',
		dataType : 'json',
		success : function(response) {
			console.log(response);

			if (response) {
				console.log('updated project');
				var project = response.projects[0];

				$("#edit_task_name").val(project.projectName);
				$("#edit_task_description").val(project.projectDescription);
				$('#datepicker').val(project.startDate);

			} else {
				console.log('could not update project');

			}
		}

	});
	console.log(editProjectID);

};


var update_project = function(editProjectID,status) {
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
			startDate : date,
			status: status
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

//----------------------------------------------------View Account Info------------------------------------------------------------//
var loadViewAccount = function(userid) {
	$('#wrap').empty();
	var view_account = $(appTemplate).find('#view_account-template').html();
	$.template('viewaccounttemplate', view_account);

	var html = $.render('', 'viewaccounttemplate');

	$('#wrap').append(html);

	$('#logout').on('click', function(e) {
		//console.log('clicker');
		e.preventDefault();
		logout();
	});

	$(document).on('click','#add_icon', function(e) {
		//console.log("clicked");
		e.preventDefault();
		loadAddProject();
	});

	$('#savebutton').on('click', function(e) {
		e.preventDefault();
		loadAccount(userid);
		//loadApp;
	});

	get_view_account(userid);
};




var get_view_account = function(userid) {
	console.log('runner');

	// var gets_view_account = $(appTemplate).find('#view_account-template').html();
	// $.template('viewsaccounttemplate', gets_view_account);


	//console.log(editProjectID);
	$.ajax({
		url : 'xhr/get_user.php',
		data : {
			userID : userID
		},
		type : 'get',
		dataType : 'json',
		success : function(response) {
			console.log(response);

			if (response) {
				//loadApp();
				// var info = response.user;
				// var html = $.render(info, 'viewsaccounttemplate');
				// console.log(info);

				// $('#wrapper').append(html);

				$('#full_name p').append(response.user.first_name);
				$('#last_name p').append(response.user.last_name);
				$('#email p').append(response.user.email);
				$('#username p').append(response.user.user_n);
				$('#address p').append(response.user.city + "," + response.user.state);
			} else {
				console.log('could not get tasks');

			}
		}
		//return false;
	});
};


//----------------------------------------------------Account Info-----------------------------------------------------------------//

var loadAccount = function(userid) {
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
		edit_account(userid);
		//loadApp;
	});

	$.ajax({
		url : 'xhr/get_user.php',
		data : {
			userID : userid
		},
		type : 'get',
		dataType : 'json',
		success : function(response) {
			console.log(response);

			if (response) {
				console.log('response');
				var user = response.user;

				$("#first_name").val(user.first_name);
				$("#user_email").val(user.last_name);
				$("#user_name").val(user.email);
				$('#user_password').val(user.city);
				$('#user_retype').val(user.state);

			} else {
				console.log('could not update project');

			}
		}

	});
};

var edit_account = function(userid) {
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

	$(function() {
		$("#datepicker").datepicker({
			changeMonth : true,
			changeYear : true,
			dateFormat : "D d M yy"
		});
	});

	$('.clickable').on('click', function(e) {
		console.log('status click');
		e.preventDefault();
		status = $(this).html();
	});

	$('#add_icon').on('click', function(e) {
		//console.log("clicked");
		e.preventDefault();
		loadAddProject();
	});

	$('#confirm_task').on('click', function(e) {
		e.preventDefault();
		edit_task(editTask,status);
		//loadApp;
	});

	$.ajax({
		url : 'xhr/get_tasks.php',
		type : 'get',
		dataType : 'json',
		success : function(response) {

			if (response) {
				console.log(response);
				console.log('edited account');
				//get_projects();

				var tasks = response.tasks;
				console.log(tasks);

				for(var i = 0;  i < tasks.length; i++)
				{
					console.log(tasks[i].id);
					console.log("task ID =" + editTask);

					if(tasks[i].id === editTask){
						console.log('true');
						$('#edit_task_name').val(tasks[i].taskName);
						$('#edit_task_description').val(tasks[i].taskDescription);

						break;

					}
				}

				//loadApp();

			} else {
				console.log('could not update user');

			}
		}
		//return false;
	});

};

var edit_task = function(editTask,status) {

	var name = $('#edit_task_name').val();
	var descrip = $('#edit_task_description').val();
	var date = $('#datepicker').val();
	console.log(date);
	$.ajax({
		url : 'xhr/update_task.php',
		data : {
			taskID : editTask,
			taskName : name,
			taskDescription : descrip,
			status: status,
			startDate: date
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

//---------------------------------------Get Clients-------------------------------------//
var get_clients = function() {
	console.log('run');

	var clients = $(appTemplate).find('#clients-item-template').html();
	$.template('clientsitemtemplate', clients);

	
	$.ajax({
		url : 'xhr/get_clients.php',
		// data : {
		// 	projectID : editProjectID
		// },
		type : 'get',
		dataType : 'json',
		success : function(response) {
			console.log(response);

			if (response) {

				 var clientele = response.clients;
				 var html = $.render(clientele, 'clientsitemtemplate');

				$('#client_phone p').append(response.clients.phone);
				console.log('it worked')
				

				 $('#wrapper').append(html);
			} else {
				console.log('could not get tasks');

			}
		}
		//return false;
	});
};

var loadClients = function() {
	console.log("clients");
	$('#wrap').empty();
	var client = $(appTemplate).find('#clients-template').html();
	$.template('clientstemplate', client);

	var html = $.render('', 'clientstemplate');

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


	$(document).on('click', '#edit_client', function(e) {
		e.preventDefault();
		var editClient = ($(this).attr("data-clientid"));
		loadEditClients(editClient);
	});

	$(document).on('click', '#add_task_icon', function(e) {
		console.log('clicked');
		e.preventDefault();
		var taskID = ($(this).attr("data-addtaskid"));
		loadAddTask(taskID);
	});
	get_clients();
};

//---------------------------------------Update Clients-------------------------------------//
var loadEditClients = function(editClient) {
	$('#wrap').empty();
	var editclient = $(appTemplate).find('#edit-clients-template').html();
	$.template('editclients', editclient);

	var html = $.render('', 'editclients');

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
		edit_clients(editClient);
		//loadApp;
	});

	$.ajax({
		url : 'xhr/get_clients.php',
		data : {
			clientID : editClient
		},
		type : 'get',
		dataType : 'json',
		success : function(response) {
			console.log(response);

			if (response) {
				console.log('response');

				var client = response.clients;
				$("#client_name").val(client[0].clientName);
				$("#client_phone").val(client[0].phone);
				$("#client_address").val(client[0].address);
				$('#client_website').val(client[0].website);


			} else {
				console.log('could not update project');

			}
		}

	});
};

var edit_clients = function(editClient) {
	var name = $('#client_name').val();
	var phone = $('#client_phone').val();
	var address = $('#client_address').val();
	var web = $('#client_website').val();
	$.ajax({
		url : 'xhr/update_client.php',
		data : {
			clientID : editClient,
			clientName : name,
			phone : phone,
			address : address,
			website : web
		},
		type : 'post',
		dataType : 'json',
		success : function(response) {
			if (response.error) {
				//console.log(response);
				console.log('could not update client');
				//get_projects();

			} else {
				console.log('client updated');
				loadApp();

			}
		}
		//return false;
	});
};
