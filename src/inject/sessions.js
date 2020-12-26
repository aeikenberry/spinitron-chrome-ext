function handleQueryParams(setSession) {
	var urlParams = new URLSearchParams(window.location.hash.substring(1, window.location.hash.length));
	if (urlParams.has('access_token')) {
		setSession(urlParams.get('access_token'), parseInt(urlParams.get('expires_in'), 10));
		if (urlParams.has('state')) {
			window.location.href = urlParams.get('state');
		}
	} else if (urlParams.has('error')) {
		alert('yo dawg why not?');
	}
}

function getSession() {
	return $.cookie(COOKIE_NAME);
}

function setSession(session, expires) {
	return $.cookie(COOKIE_NAME, session, {expires: expires });
}

function clearSession() {
	return $.removeCookie(COOKIE_NAME, { path: '/' });
}

function handleSignInClick() {
	window.location.href = getLoginURL();
}

function getLoginURL() {
	var scopes = 'user-read-private user-read-email playlist-modify-private playlist-read-private playlist-read-collaborative playlist-modify-public';
	return 'https://accounts.spotify.com/authorize' +
		'?response_type=token' +
		'&client_id=' + CLIENT_ID +
		(scopes ? '&scope=' + encodeURIComponent(scopes) : '') +
		'&redirect_uri=' + encodeURIComponent(REDIRECT_URI) +
		'&state=' + encodeURIComponent(document.location)
}

function createLoginButton() {
	var $btn = $('<button class="s-login-btn">Sign in with Spotify</button>');

	$btn.click(handleSignInClick);
	$btn.appendTo($('body'));
}