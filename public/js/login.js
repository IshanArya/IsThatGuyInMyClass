$(function() {
	$('#login').submit(function(e) {
		e.preventDefault();
		// console.log("press");
		if($('#email').val() && $('#password').val()) {
			console.log("post");
			$.post("/api/authenticate", {
				email: $('#email').val().trim(),
				password: $('#password').val()
			}, function(data) {
				if(data.success) {
					if($('#remember').is(":checked")) {
						localStorage.authToken = data.token;
					} else {
						sessionStorage.authToken = data.token;
					}
					window.location.replace("/profile?token=" + data.token);
				} else {
					console.log(data.message);
					if(data.message === "Authentication failed. User not found.") {
						notify("Email not found.");
					} else if(data.message === "Authentication failed. Wrong password.") {
						notify("Incorrect password");
					} else {
						notify("Server error. Please report this @ cindrinc@gmail.com");
					}
				}
			});
		} else {
			notify("Please fill out all fields.");
		}
		
	});

	function notify(message) {
		console.log(message);
	}
});