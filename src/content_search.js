var DEBUG = true;

$(document).ready(function() {
    makeButtonEnv("search_by_title_list");
    makeButtonEnv("search_by_links_list");
});

function makeButtonEnv(list) {
    chrome.storage.local.get(list, function(d) {
        var searchURI = encodeURI($("div.content > form").serializeArray().map(function(i) {
            return i.name + "=" + i.value;
        }).join("&"));

        var searchID = hex_md5(searchURI);

        var saveSearchByTitleClass;
        var saveSearchByTitleAriaPressed;
        var saveSearchByTitleID;
        var saveSearchByTitleText;

        if (d[list][searchID]) {
            saveSearchByTitleClass = "btn btn-sm btn-outline-warning active";
            saveSearchByTitleAriaPressed = "true";
        } else {
            saveSearchByTitleClass = "btn btn-sm btn-outline-warning";
            saveSearchByTitleAriaPressed = "false";
        }

        if (list === "search_by_title_list") {
            saveSearchByTitleID = "save-search-by-title";
            saveSearchByTitleText = "Отслеживать новые серии";
        } else if (list === "search_by_links_list") {
            saveSearchByTitleID = "save-search-by-torrent";
            saveSearchByTitleText = "Отслеживать новые раздачи";
        }


        $("div.content > form > div > table > tbody input[value='Поиск раздач']").parent().after('\
            <td>\
                <button type="button" id="' + saveSearchByTitleID + '" class="' + saveSearchByTitleClass + '"\
                                    data-toggle="button" aria-pressed="' + saveSearchByTitleAriaPressed + '" autocomplete="off">\
                    ' + saveSearchByTitleText + '\
                </button>\
            </td>');

        $("#" + saveSearchByTitleID).on("click", function() {
            var aList = {};

            if (DEBUG) console.log(saveSearchByTitleID + " click action");

            if ( $(this).attr("aria-pressed") === "false" ) {
                $("div.content td.nam > a").each(function() {
                    var title = $(this).text();
                    var url = $(this).attr("href");
                    var id;

                    if (list === "search_by_title_list") id = hex_md5(title);
                    if (list === "search_by_links_list") id = hex_md5(url);

                    aList[id] = {
                        //'search_options': searchURI,
                        'link': 'http://kinozal.tv' + url,
                        'title': title,
                        'seen': true

                    };
                });

                if (DEBUG) console.log("Save " + list + ": ", aList);
                d[list][searchID] = aList;
                d[list][searchID].search_options = searchURI;
                chrome.storage.local.set(d);
            } else {
                chrome.storage.local.get(list, function(d) {
                    if (d[list][searchID]) {
                        delete d[list][searchID];
                    }

                    chrome.storage.local.set(d);
                });
            }
        });
    });
}

