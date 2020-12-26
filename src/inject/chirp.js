var Spotify = new SpotifyWebApi();
var CLIENT_ID = 'c7df358234224cbd9d153e2c7ee3f837';
var COOKIE_NAME = 'spinitron-spotify-ext';
var MY_USER_ID = null;

var REDIRECT_URI = 'https://chirpradio.org/charts';

function handleMakePlaylistClick($article) {
    var $a = $article;

    return function() {
        var data = getSearchesForArticle($a);
        
        getSpotifyTracks(data.searches)
            .then(function(tracks) {
                Spotify.createPlaylist(MY_USER_ID, {name: data.title})
                    .then(function(response) {
                        Spotify.addTracksToPlaylist(
                            response.id,
                            tracks.map(function(t) { return t.uri; })
                        ).then(function() {
                            $article.find('.s-playlist-btn').remove();
                            alert("Playlist '" + data.title + "' created successfully! " +
                                tracks.length + " tracks found of " + data.searches.length);
                        })
                        .catch(function(err) {
                            alert('Sorry, could not add songs to the new playlist');
                        });
                    })
                    .catch(function(err) {
                        alert('Sorry, could not create the playlist');
                    });
            })
            .catch(console.log);
    }
}

function addCreatePlaylistButtons() {
    $('section.full section article').each(function() {
        var title = $(this).find('h2 a').text();
        var $btn = $('<button class="s-playlist-btn">Make this a Spotify playlist</button>');

        $btn.click(handleMakePlaylistClick($(this)));
        $btn.appendTo($(this));
    });
}

function getSpotifyTracks(searches) {
    var tracks = [];
    var promises = searches.map(search => Spotify.searchTracks(search));
    return Promise.all(promises)
        .then(function(responses) {
            responses.forEach(response => {
                if (response.tracks.items.length) {
                    tracks.push(response.tracks.items[0]);
                }
            });
        })
        .then(function() { return tracks; })
        .catch(console.log);
}

function getSearchesForArticle($article) {
    var title = $article.find('h2 a').text();
    var tracks = [];
    $article.find('ol li').each(function() {
        var artist = $(this).find('strong').text();
        var song = $(this).find('em').text();
        tracks.push(artist + ' ' + song);
    });
    return { title: title, searches: tracks };
}

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
            addCreatePlaylistButtons();
		})
		.catch(function(err) {
			if (err.status == 401) {
				clearSession();
				createLoginButton();
			}
		});
});
