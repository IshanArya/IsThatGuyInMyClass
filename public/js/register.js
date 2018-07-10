$(function() {
	$('#register').submit(function(e) {
		e.preventDefault();
		// console.log("press");
		if($('#email').val() && $('#password1').val() && $('#name').val()) {
			if($('#password1').val() === $('#password2').val()) {
				if ($('#name').val().split(" ").length > 1) {
					$.post("/api/register", {
						email: $('#email').val().trim(),
						password: forge_sha256($('#password1').val()),
						name: $('#name').val().trim()
					}, function(data) {
						if(data.success) {
							window.location.assign('/registered');
						} else {
							console.log(data.message);
							if(data.message === "Email already in use.") {
								notify("Email already in use. Please use a different one.");
							} else {
								notify('Server error. Please report this @ <a href="mailto:cindrinc@gmail.com" target="_blank">cindrinc@gmail.com</a>');
							}
						}
					});
				} else {
					notify("Please enter a full name.");
				}
			} else {
				notify("Passwords do not match.");
			}
		} else {
			notify("Please fill out all fields.");
		}
	});
});