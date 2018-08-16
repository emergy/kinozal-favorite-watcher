var DEBUG = true;

function updateCounter() {
    var count = 0;

    chrome.storage.local.get(null, function(d) {
        for (var list in d) {
            if (list === "rating") continue;

            for (var id in d[list]) {
                if (!d[list][id].search_options) {
                    if (DEBUG) console.log(id + " d[list][id].seen: ", d[list][id].seen);

                    if (!d[list][id].seen) {
                        count++;
                        if (DEBUG) console.log(i + " count++");
                    }
                } else {
                    for (var i in d[list][id]) {
                        if (i != "search_options") {
                            if (DEBUG) console.log(i + " d[list][id][i].seen: ", d[list][id][i].seen);

                            if (!d[list][id][i].seen) {
                                count++;
                                if (DEBUG) console.log(i + " count++");
                            }
                        }
                    }
                }
            }

            count = count.toString();
            if (DEBUG) console.log("setBadgeText: " + count);

            if (count === '0') {
                chrome.browserAction.setBadgeText({text: ''});
            } else {
                chrome.browserAction.setBadgeText({text: count});
            }
        }
    });
}

