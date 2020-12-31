var Spotify = new SpotifyWebApi();
var CLIENT_ID = 'c7df358234224cbd9d153e2c7ee3f837';
var COOKIE_NAME = 'spinitron-spotify-ext';
var TRACKS = [];
var MY_USER_ID = null;
var ALL_TRACKS_COUNT = null;

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

function createMakePlaylistButton() {
	var $btn = $('<button class="s-playlist-btn">Make this a Spotify playlist</button>');

	$btn.click(handleMakePlaylistClick);
	$btn.appendTo($(BUTTON_APPEND_SELECTOR).first());
}

function createLoginButton() {
	var $btn = $('<button class="s-login-btn">Sign in with Spotify</button>');

	$btn.click(handleSignInClick);
	$btn.appendTo($('body'));
}

function handleMakePlaylistClick() {
	if (!TRACKS || !TRACKS.length) {
		return alert('Couldnt find any tracks on Spotify :(');
	}

	Spotify.createPlaylist(MY_USER_ID, {name: getDefaultPlaylistName()})
		.then(function(response) {
			Spotify.addTracksToPlaylist(
				response.id,
				TRACKS.map(function(t) { return t.uri; })
			).then(function() {
				$('.s-playlist-btn').remove();
				alert("Playlist '" + getDefaultPlaylistName() + "' created successfully! " +
					TRACKS.length + " of " + ALL_TRACKS_COUNT + " were found on Spotify.");
			})
			.catch(function(err) {
				alert('Sorry, could not add songs to the new playlist');
			});
		})
		.catch(function(err) {
			alert('Sorry, could not make the playlist');
		});
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

function getSession() {
	return $.cookie(COOKIE_NAME);
}

function setSession(session, expires) {
	return $.cookie(COOKIE_NAME, session, {expires: expires });
}

function clearSession() {
	return $.removeCookie(COOKIE_NAME, { path: '/' });
}

// Get the tracks
$(document).ready(function() {
    // auth redirect
    handleQueryParams(setSession);
    
	if (!getSession()) {
		return createLoginButton();
	}

	// Init Spotify client
	Spotify.setAccessToken(getSession());
	// Fetch Me
	Spotify.getMe()
		.then(function(response) {
			MY_USER_ID = response.id;
            
            var searches = getSearchTerms();
			ALL_TRACKS_COUNT = searches.length;
            var searchPromises = searches.map(search => {
                return Spotify.searchTracks(search);
            });

			// Find all the songs in the table
			Promise.all(searchPromises)
				.then(function(responses) {
					responses.forEach(function(response) {
						if (response.tracks.items.length) {
							TRACKS.push(response.tracks.items[0]);
						}
					})
				})
				.then(function() { createMakePlaylistButton(); })
				.catch(console.log);
		})
		.catch(function(err) {
			if (err.status == 401) {
				clearSession();
				createLoginButton();
			} else {
				console.log(err);
			}
		});
});