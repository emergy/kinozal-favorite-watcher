var Parser = {
    getTorrentInfo: function(data) {
        var link;
        var title;
        var files;

        if (data) {
            link = $(data).find(".mn_wrap h1 a").attr("href");
            title = $(data).find(".mn_wrap h1").text();
            files = $(data).find(".content .mn_wrap .mn1_menu a:contains('Список файлов') span").text();
        } else {
            link = $(".mn_wrap h1 a").attr("href");
            title = $(".mn_wrap h1").text();
            files = $(".content .mn_wrap .mn1_menu a:contains('Список файлов') span").text();
        }

        id = /id=(\d+)/.exec(link)[1];

        return {
            'link': link,
            'id': id,
            'title': title,
            'files': files
        };
    },

    getImdbRating: function(obj, name, year, callback) {
        var url = "http://www.omdbapi.com";
        var options = "?apikey=3cdc4906&t=" + name;

        if (year.length) {
            options = options + "&y=" + year;
        }

        $.getJSON(url + "/" + options, function(data) {
            if (data['Response'] === 'False') {
                callback({
                    score: 'N/A',
                    votes: 'N/A',
                    obj: obj
                });
            } else {
                callback({
                    score: data.imdbRating,
                    votes: data.imdbVotes,
                    obj: obj
                });
            }
        });
    }
};

