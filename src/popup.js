var DEBUG = 1;
var lists = [];

chrome.storage.local.get(null, function(d) {
    for (var i in d) {
        if (i != "rating") lists.push(i);
    }

    main();
});

function main() {
    if (DEBUG) console.log(lists);

    lists.forEach(function(list) {
        chrome.storage.local.get(list, function(d) {

            for (var id in d[list]) {
                if (DEBUG) console.log("Root item: ", d[list][id]);
                if (DEBUG) console.log("Search options: ", d[list][id].search_options);

                if (d[list][id].search_options) {
                    for (var torrentID in d[list][id]) {
                        if (torrentID != "search_options") {
                            if (DEBUG) console.log("Item: ", d[list][id][torrentID]);
                            if (DEBUG) console.log("Item seen: ", d[list][id][torrentID].seen);

                            if (!d[list][id][torrentID].seen) addItem(torrentID, d[list][id][torrentID], d[list][id].search_options);
                        }
                    }
                } else {
                    if (DEBUG) console.log("Item: ", d[list][id]);
                    if (DEBUG) console.log("Item seen: ", d[list][id].seen);

                    if (!d[list][id].seen) addItem(id, d[list][id], "");
                }
            }
        });
    });

    $('table').on('click', 'a.link', function() {
        chrome.tabs.create({url: $(this).attr('href')});
        return false;
    });
    
    $('#all-seen-button').on('click', function() {
        $(this).attr("disabled", "").attr("aria-pressed", "true").blur();

        chrome.storage.local.get(null, function(d) {
            for (var list in d) {
                if (list === "rating") continue;
                for (var id in d[list]) {
                    if (d[list][id].search_options) {
                        for (var tID in d[list][id]) {
                            if (d[list][id][tID].seen != undefined) {
                                d[list][id][tID].seen = true;
                            }
                        }
                    } else {
                        if (d[list][id].seen != undefined) {
                            d[list][id].seen = true;
                        }
                    }
                }
            }

            chrome.storage.local.set(d);
        });
    });

    setTimeout(function() {
        $('.js-pscroll').each(function(){
            var ps = new PerfectScrollbar(this);
            $(window).on('resize', function(){
                ps.update();
            })
        });
    }, 50);
}

function noSeenAll() {
    lists.forEach(function(list) {
        chrome.storage.local.get(list, function(d) {
            for (var id in d[list]) {
                if (d[list][id].search_options) {
                    for (var torrentID in d[list][id]) {
                        if (torrentID != "search_options") d[list][id][torrentID].seen = false;
                    }
                } else {
                    d[list][id].seen = false;
                }
            }

            chrome.storage.local.set(d);
        });
    });
}

function addItem(id, item, searchOptions) {
    var badge_class;
    var close_visibility;

    /*
    if (item.seen) {
        badge_class = "badge-light";
        close_visibility = "invisible";
    } else {
        badge_class = "badge-secondary";
        close_visibility = "visible";
    }
    */

    $("#all-seen-button").removeAttr("disabled").attr("aria-pressed", "false").blur();
    $("#list").attr("visibility", "visible");
    $("#empty-list").attr("visibility", "hidden");

    if ( $('table > tbody a#a' + id).length < 1 ) {
        $('table > tbody').append('\
                <tr class="row100 body">\
                    <td class="cell100 column1">\
                        <a href="' + item.link + '" id="a' + id + '" so="' + searchOptions + '" class="link badge">' + item.title + '</a>\
                    </td>\
                </tr>');
    }


    /*
    $('table').append('\
            <tr>\
                <td>\
                    <a href="' + item.link + '" id="a' + id + '" so="' + searchOptions + '" class="link badge ' + badge_class + '">' + item.title + '</a>\
                </td>\
                <td>\
                    <button id="' + id + '" type="button" class="close ' + close_visibility + '" aria-label="Close">\
                        <span aria-hidden="true">&times;</span>\
                    </button>\
                </td>\
            </tr>');*/
}

