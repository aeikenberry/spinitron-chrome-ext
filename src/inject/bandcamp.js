var REDIRECT_URI = 'https://bandcamp.com';
var BUTTON_APPEND_SELECTOR = 'article p';

function getDefaultPlaylistName() {
	return document.title;
}

function getSearchTerms() {
    var searches = [];
    $('.mpalbuminfo').each(function() {
        var album = $(this).find('.mptralbum').text().replace(/[^\w\s]/gi, "");
        var artist = $(this).find('.mpartist').text().replace(/[^\w\s]/gi, "");

        searches.push(artist + ' ' + album);
    });
    return searches;
}

function getSession() {
	return $.cookie(COOKIE_NAME);
}

function setSession(session, expires) {
	return $.cookie(COOKIE_NAME, session, {expires: expires, domain: '.bandcamp.com'});
}

function clearSession() {
	return $.removeCookie(COOKIE_NAME, { path: '/', domain: '.bandcamp.com' });
}