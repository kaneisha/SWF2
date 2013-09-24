var loadLanding = function(){
	$('#wrap').empty();
	$.get('templates/template.html',function(htmlArg){
		var landing = $(htmlArg).find('#landing-template').html();
		$.template('landingtemplate', landing);

		var html = $.render('', 'landingtemplate');

		$('#wrap').append(html);

		$('#login_button').on('click', function(e){
		console.log('clicks')
		e.preventDefault();
		login();
	});


		$('#register_button').on('click', function(e){
		console.log('clicks')
		e.preventDefault();
		register();
		});

	});
};

loadLanding();

var checkLogin = function(){
	$.ajax({
		url:'xhr/check_login.php',
		type: 'get',
		dataType: 'json',
		success: function(r){
			if(r.user){
				console.log('user exists');
				//loadApp();
			}else{
				console.log('go home');
				//loadLanding();
			}
		}
	});
}


var login = function(){

var user = $('#username_login').val();
var pass = $('#username_pwd').val();
	$.ajax({
		url: 'xhr/login.php',
		data: {
			username: user,
			password: pass
		},
		type: 'post',
		dataType: 'json',
		success: function(response){
			if(response.user){
				//console.log(response);
				//get_projects();
		
				loadApp();

			}else{
				console.log('no user');
				//console.log(error);
				//loadLanding();
				$('#error').html('*You put in the wrong information please try again')
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
var register = function(){

var user = $('#register_username').val();
var pass = $('#register_pwd').val();
var email = $('#register_email').val();
	$.ajax({
		url: 'xhr/register.php',
		data: {
			username: user,
			password: pass,
			email: email
		},
		type: 'post',
		dataType: 'json',
		success: function(response){
			if(response.user){
				console.log(response);
				loadApp()
			}else{
				console.log('register unsuccessful');
				//loadLanding();
			}
		}
			//return false;
	});

	return false;
};

checkLogin();

//----------------------------------------------Logout---------------------------------------------//

	
var logout = function(){
	$.get('xhr/logout.php', function(){
		window.location.replace("http://localhost:8888");
	});
	return false;
};


//----------------------------------------------Get Project------------------------------------------//
	
var get_projects = function(){
	console.log('run');

	$.get('templates/template.html', function(htmlArg){
		var project_item = $(htmlArg).find('#project_item').html();
		$.template('projectitem', project_item);



		$.ajax({
			url: 'xhr/get_projects.php',
			type: 'get',
			dataType: 'json',
			success: function(response){
				console.log(response);

				if(response){
					//loadApp();
					var projects = response.projects;
					var html = $.render(projects, 'projectitem');

					$('#wrapper').append(html);
				}else{
					console.log('could not get projects');

				}
			}
				//return false;
		});



	})

	
};

var loadApp = function(){
	$('#wrap').empty();
	$.get('templates/template.html',function(htmlArg){
		var app = $(htmlArg).find('#app-template').html();
		$.template('apptemplate', app);

		var html = $.render('', 'apptemplate');

		$('#wrap').append(html);

		$('#logout').on('click', function(e){
			//console.log('clicker');
			e.preventDefault();
			logout();
	});

		$(document).on('click', '#view_tasks', function(e){
			//console.log("clicked");
			var projectid = ($(this).attr("data-id"));
			e.preventDefault();
			loadTasks(projectid);
		})

		$('#add_icon').on('click', function(e){
			//console.log("clicked");
			e.preventDefault();
			loadAddProject();
		})

		$(document).on('click', '#edit', function(e){
			//console.log("clicked");
			var editProjectID = ($(this).attr("data-projectid"));
			e.preventDefault();
			loadEditProject(editProjectID);
		})


	});
	get_projects();
};

//--------------------------------------------Tasks Page--------------------------------------------//

var get_tasks = function(projectid){
	console.log('run');

	$.get('templates/template.html', function(htmlArg){
		var task_item = $(htmlArg).find('#task_item').html();
		$.template('taskitem', task_item);


		$.ajax({
			url: 'xhr/get_tasks.php',
			data: {
				projectID: projectid
			},
			type: 'get',
			dataType: 'json',
			success: function(response){
				console.log(response);

				if(response){
					//loadApp();
					var tasks = response.tasks;
					var html = $.render(tasks, 'taskitem');

					$('#wrapper').append(html);
				}else{
					console.log('could not get tasks');

				}
			}
				//return false;
		});






	})

	
};

var loadTasks = function(projectid){
	$('#wrap').empty();
	$.get('templates/template.html',function(htmlArg){
		var tasks = $(htmlArg).find('#task-template').html();
		$.template('tasktemplate', tasks);

		var html = $.render('', 'tasktemplate');

		$('#wrap').append(html);

		$('#logout').on('click', function(e){
			//console.log('clicker');
			e.preventDefault();
			logout();
	});


	});
	get_tasks(projectid);
};

//----------------------------------Add Project-----------------------------------------//

var loadAddProject = function(){
	var status;
	$('#wrap').empty();
	$.get('templates/template.html',function(htmlArg){
		var adding_project = $(htmlArg).find('#add_project').html();
		$.template('addproject', adding_project);

		var html = $.render('', 'addproject');


		$('#wrap').append(html);

		$('.clickable').on('click', function(e){
			console.log('status click')
			e.preventDefault();
			status = $(this).html();
		});


				$(function() {
				$( "#datepicker" ).datepicker({
				changeMonth: true,
				changeYear: true
				});
				});
			


		$('#button').on('click', function(e){
			console.log('clicker');
			e.preventDefault();
			//loadApp();

			console.log(status);
			new_project(status);
		})

		$('#logout').on('click', function(e){
			//console.log('clicker');
			e.preventDefault();
			logout();
	});


	});
	
};

var new_project = function(status){

var name = $('#project_name').val();
// var status = $('.clickable').on('click', function(e){
// 	e.preventDefault();
// 	console.log($(this).html());
// });
console.log(status);

	//var email = $('#register_email').val();
	$.ajax({
		url: 'xhr/new_project.php',
		data: {
			projectName: name,
			status: status
		},
		type: 'post',
		dataType: 'json',
		success: function(response){
			if(response.newproject){
				console.log(response);
				// loadApp()
				
			}else{
				console.log('project add unsuccessful');
				//loadLanding();
			}
		}
			//return false;
	});

	return false;
};

//--------------------------Update Project-------------------------------------------//
var loadEditProject = function(editProjectID){
	$('#wrap').empty();
	$.get('templates/template.html',function(htmlArg){
		var edit_project = $(htmlArg).find('#edit_project').html();
		$.template('editproject', edit_project);

		var html = $.render('', 'editproject');

		$('#wrap').append(html);

		$('#logout').on('click', function(e){
			//console.log('clicker');
			e.preventDefault();
			logout();
	});

		console.log(editProjectID);


	});
	update_project(editProjectID);
};


var update_project = function(editProjectID){
	console.log('runner');
	console.log(editProjectID);

	// $.get('templates/template.html', function(htmlArg){
	// 	var project_edit = $(htmlArg).find('#task_item').html();
	// 	$.template('taskitem', task_item);

		$(document).on('click', '#add_icon', function(e){
			//console.log("clicked");
			e.preventDefault();
			loadAddProject();
		})


		$.ajax({
			url: 'xhr/update_project.php',
			data: {
				projectID: editProjectID
			},
			type: 'post',
			dataType: 'json',
			success: function(response){
				console.log(response);

				if(response){
					console.log(response);
					//loadApp();
					// var tasks = response.tasks;
					// var html = $.render(tasks, 'taskitem');

					// $('#wrapper').append(html);
				}else{
					console.log('could not update project');

				}
			}
				//return false;
		//});




	});

	};
