// $.ajax({
// 	url: 'xhr/login.php',
// 	data: {
// 		username: user,
// 		password: pass
// 	},
// 	type: 'post',
// 	dataType: 'json',
// 	success: function(response){
// 		if(response.error){
// 			showLoginError();
// 		}else{
// 			loadApp();
// 		}
// 	}
// 		//return false;
// });

// win.on('click','#btn-lout', function(){
// 	$.get('xhr/logout.php', function(){
// 		loadLanding();
// 	})
// 	return false;
// })

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
			loadApp()
		}else{
			loadLanding();
		}
	}
		//return false;
});

win.on('click','#btn-lout', function(){
	$.get('xhr/logout.php', function(){
		loadLanding();
	})
	return false;
})

//jdbenitez@fullsail.com