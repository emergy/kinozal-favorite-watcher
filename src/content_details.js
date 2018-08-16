var DEBUG = true;

$(document).ready(function() {
	chrome.storage.local.get("torrents_list", function(d) {	
        var info = Parser.getTorrentInfo();
        var id = info['id'];

        if (DEBUG) console.log("Torrent " + id + " in current window properties: ", info);

        var watchButtonClass;
        var watchButtonAriaPressed;

        if (d.torrents_list[id]) {  // if enabled torrent watch on load page
            d.torrents_list[id].seen = true;
            chrome.storage.local.set(d);
            watchButtonClass = "btn btn-sm btn-outline-warning active";
            watchButtonAriaPressed = "true";
        } else {                    // if disabled torrent watch
            watchButtonClass = "btn btn-sm btn-outline-warning";
            watchButtonAriaPressed = "false";
        }

        // add watch-button button
        $("div.mn1_content > table > tbody > tr > td ~ td").html('\
			<button type="button" id="watch-button" class="' + watchButtonClass + '" data-toggle="button" aria-pressed="' + watchButtonAriaPressed + '" autocomplete="off">\
				Отслеживать раздачу\
			</button>');

        // click action
        $("#watch-button").on("click", function() {
            if ( $(this).attr("aria-pressed") === "false") {
                if (DEBUG) console.log("Enable torrent watch");
                info.seen = false;
                d.torrents_list[id] = info;
            } else {
                if (DEBUG) console.log("Disable torrent watch");
                delete d.torrents_list[id];
            }

            chrome.storage.local.set(d);
            if (DEBUG) console.log(d);

            $(this).blur();
        });
    });

    ["search_by_title_list", "search_by_links_list"].forEach(function(list) {
        chrome.storage.local.get(list, function(d) {
            for (var searchID in d[list]) {
                for (var id in d[list][searchID]) {
                    if (id === "search_options") continue;
                    var info = Parser.getTorrentInfo();
                    if (hex_md5(info.title) === id) d[list][searchID][id].seen = true;
                    if (hex_md5(info.link) === id) d[list][searchID][id].seen = true;
                }
            }
            chrome.storage.local.set(d);
        });
    });
});
