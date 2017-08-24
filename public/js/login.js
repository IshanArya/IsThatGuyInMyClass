$(function() {
	$('#login').submit(function(e) {
		e.preventDefault();
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
					window.location.replace("/schedule?token=" + data.token);
				} else {
					console.log(data.message);
					if(data.message === "Authentication failed. User not found.") {
						notify("Email not found.");
					} else if(data.message === "Authentication failed. Wrong password.") {
						notify("Incorrect password");
					} else {
						notify('Server error. Please report this @ <a href="mailto:cindrinc@gmail.com" target="_blank">');
					}
				}
			});
		} else {
			notify("Please fill out all fields.");
		}
		
	});
});