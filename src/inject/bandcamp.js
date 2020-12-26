var REDIRECT_URI = 'https://daily.bandcamp.com';
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
