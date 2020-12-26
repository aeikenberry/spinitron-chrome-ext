var REDIRECT_URI = 'https://spinitron.com';
var BUTTON_APPEND_SELECTOR = '.data';

function getDefaultPlaylistName() {
	var slot = $('.timeslot').text().trim();
	var name = $($('.show-title').children()[0]).text();

	return name + " - " + slot;
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

function getSearchTerms() {
	var terms = [];
	$('.artist').each(function(i, node) {
		terms.push($(node).text() + " - " + $(node).next('.song').text())
	});
	return terms;
}

function createMakePlaylistButton() {
	if ($('.s-playlist-btn').text()) {
		return;
	}
	if (!$('.artist').length || !$('.song').length) {
		return;
	}
	var $btn = $('<button class="s-playlist-btn">Make this a Spotify playlist</button>');

	$btn.click(handleMakePlaylistClick);
	$btn.appendTo($('.data'));

}