var REDIRECT_URI = 'https://pitchfork.com/features/lists-and-guides/';
var BUTTON_APPEND_SELECTOR = '.lede-background';

function getDefaultPlaylistName() {
	return document.title;
}

function getSearchTerms() {
    var searches = [];
    $('h2').each(function() {
        var search = $(this).text().replace(/[^\w\s]/gi, "");
        searches.push(search);
    });
    return searches;
}
