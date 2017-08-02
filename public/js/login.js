$(function() {
	$('#login').submit(function(e) {
		e.preventDefault();

		$.post("/api/authenticate", {
			email: $('#email').val(),
			password: $('#password').val()
		}, function(data) {
			if(data.success) {
				if($('#remember').is(":checked")) {
					localStorage.authToken = data.token;
				} else {
					sessionStorage.authToken = data.token;
				}
				window.location.replace("/schedule?token=" + data.token);
			} else {
				if(data.message === "Authentication failed. User not found.") {
					notify("Email not found.");
				} else if(data.message === "Authentication failed. Wrong password.") {
					notify("Incorrect password");
				} else {
					notify("Server error. Please report this @ cindrinc@gmail.com");
				}
			}
		});
	});
});