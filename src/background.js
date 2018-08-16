var DEBUG = true;
var DELAY = 5;

chrome.alarms.onAlarm.addListener(onAlarm);
chrome.alarms.create('update', {'periodInMinutes': DELAY});

chrome.runtime.onInstalled.addListener(initStorage);

var lists = ["torrents_list", "search_by_title_list", "search_by_links_list"];

function onAlarm(alarm) {
    console.log("Alarm " + alarm['name']);

    if (alarm['name'] == 'update') {
        chrome.alarms.create('update', {'periodInMinutes': DELAY});
        main();
    }
}

function main() {
    lists.forEach(function(list) {
        chrome.storage.local.get(list, function(d) {
            if (DEBUG) console.log("Storage: ", d);

            for (var id in d[list]) {
                switch(list) {
                    case 'torrents_list':
                        if (DEBUG) console.log("Get " + d[list][id].link);

                        $.get(d[list][id].link, function(data) {
                            var info = Parser.getTorrentInfo(data);
                            var id = info.id;

                            if (DEBUG) console.log(id + " info: ", info);

                            if (info.files != d[list][id].files) {
                                console.log("info.files("+ info.files +") != d[" + list + "][id].files(" + d[list][id].files + ") set seen 0");
                                d[list][id].seen = false;
                            }

                            if (DEBUG) console.log("Save to storage", d);
                            chrome.storage.local.set(d);
                        });
                        break;

                    default: // if "search_by_title_list" or "search_by_links_list"
                        if (DEBUG) console.log("Get http://kinozal.tv/browse.php?" + d[list][id].search_options);
                        $.get("http://kinozal.tv/browse.php?" + d[list][id].search_options, function(data) {
                            var allTorrentsInPageList = {};

                            $(data).find("div.content td.nam > a").each(function() {
                                var title = $(this).text();
                                var url = $(this).attr("href");
                                var currentID;

                                if (DEBUG) console.log("default: ", url, title);

                                if (list === "search_by_title_list") currentID = hex_md5(title);
                                if (list === "search_by_links_list") currentID = hex_md5(url);

                                var item = {};

                                item = {
                                    'link': 'http://kinozal.tv' + url,
                                    'title': title,
                                    'seen': false
                                };

                                allTorrentsInPageList[currentID] = item;

                                if (!d[list][id][currentID]) { // if currentID not exist in searchID
                                    d[list][id][currentID] = item;
                                    storage.local.set(d);
                                }
                            });

                            for (var tid in d[list]) {
                                if (!tid === 'search_options') {
                                    if (!allTorrentsInPageList[tid]) {
                                        delete d[list][id][tid];
                                        storage.local.set(d);
                                    }
                                }
                            }
                        });
                }
            }
        });
    });

    updateCounter();
}

function initStorage() {
    //chrome.storage.local.clear();

    lists.forEach(function(list) {
        chrome.storage.local.get(list, function(d) {
            if (!d[list]) {
                d[list] = {};
                chrome.storage.local.set(d);
            }
        });
    });

    chrome.storage.local.set({"rating": true});
}

