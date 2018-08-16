var DEBUG = true;

$(document).ready(function() {
    if (DEBUG) console.log("content_top init");

    chrome.storage.local.get('rating', function(d) {
        var ratingButtonClass;
        var ratingButtonAriaPressed;

        if (d.rating) {
            showRatings();
            ratingButtonClass = "btn btn-sm btn-outline-warning";
            ratingButtonAriaPressed = "false";
        } else {
            ratingButtonClass = "btn btn-sm btn-outline-warning active";
            ratingButtonAriaPressed = "true";
        }

        $("div.mn1_content > div > ul.lis").append('\
            <button type="button" id="rating-button" class="' + ratingButtonClass + '"\
                     style="float: right; margin-right: 30px;" data-toggle="button" aria-pressed="' + ratingButtonAriaPressed + '" autocomplete="off">\
                Не показывать рейтинги\
            </button>');

        $("#rating-button").on("click", function() {
            if (DEBUG) console.log('On click rating-button');

            if ( $(this).attr("aria-pressed") != "true" ) {
                $("div.ratingbar").each(function() {
                    $(this).hide();
                });

                chrome.storage.local.set({'rating': false});
            } else {
                $("div.ratingbar").each(function() {
                    $(this).show();
                });

                if (! $("div.ratingbar").length ) {
                    showRatings();
                }

                chrome.storage.local.set({'rating': 'yes'});
           }

            $(this).blur();
        });
    });
});

function addRating(name, d) {
    if (DEBUG) console.log("Add rating for " + name + ": ", d);

    var p = d.obj.position();
    d.obj.find('img').after('\
            <div class="ratingbar progress_bar" style="opacity: 0.7; height: 10px; width: 100px; position: absolute; top: ' + p.top + 'px; font-size: 8px;">\
                <div class="pro-bar"></div>\
                <div class="pro-bg" style="background:#f1d29c; width:' + d.score * 10 + '%;">\
                    <div class="progress_bar_title">' + d.score + ' / ' + d.votes + '</div>\
                </div>\
            </div>');
}

function showRatings() {
    $("div.mn1_content > div.bx1.stable a").each(function() {
        obj = $(this);

        var title = $(this).attr('title');
        var name = title.split(" / ")[1];
        var year = title.split(" / ")[2];

        if (year === "РУ") {
            name = cyrillicToTranslit().transform(title.split(" / ")[0]);
            year = title.split(" / ")[1];
        }

        if (DEBUG) {
            console.log("Title: ", name);
            console.log("Year: ", year);
        }

        Parser.getImdbRating(obj, name, year, function(d) {
            if (DEBUG) console.log(name, " ", d);

            if (d.score != 'N/A') {
                addRating(name, d);
            } else {
                Parser.getImdbRating(d.obj, name, "", function(data) {
                    if (DEBUG) console.log(name, " ", data);

                    if (data.score != 'N/A') {
                        addRating(name, data);
                    }
                });
            }
        });
    });
}

