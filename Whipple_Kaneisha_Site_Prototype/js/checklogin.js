var checkLogin = function(){
	$.ajax({
		url:'xhr/check_login.php',
		type: 'get',
		dataType: 'json',
		success: function(r){
			if(r.user){
				loadApp();
			}else{
				loadLanding();
				$('input, textarea').placeholder();
			}
		}
	});
}