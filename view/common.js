
$( document ).ready(function() {
    $.ajax({
        url: "https://raw.githubusercontent.com/Xakki/rubricator/master/rubrics.md",
    }).done(function(data) {
        var rubrics = parseRubrics(data);
        renderRubrics(rubrics);
    });
});

function parseRubrics(txt) {
    var re = /\n/;
    var lines = txt.split(re);

    var rs = /^(\s*)\* (.+)$/i,
        level = 0,
        levelPrev = 0,
        parents = [],
        pLastItem = 0,
        lastData = null,
        data = {'sub': []};
    for (var i=0; i < lines.length; i++) {
        if (lines[i] == '') continue;
        var s = lines[i].match(rs);
        if (!s) {
            console.log(i, lines[i], s);
        }
        else if (!s[1].length) {
            levelPrev = 0;
            data['sub'].push({'name': s[2], 'sub': []});

            parents = [data];
        }
        else {
            level = s[1].length/4;
            pLastItem = parents.length - 1;
            if (levelPrev < level) { //sub
                lastData = parents[pLastItem]['sub'][parents[pLastItem]['sub'].length-1];
                lastData['sub'].push({'name': s[2], 'sub': []});
                parents.push(lastData);
            }
            else if (levelPrev == level) {
                parents[pLastItem]['sub'].push({'name': s[2], 'sub': []});
            }
            else {
                pLastItem = pLastItem - (levelPrev-level);
                parents[pLastItem]['sub'].push({'name': s[2], 'sub': []});
                parents = parents.slice(0, pLastItem+1);
            }
            levelPrev = level;
        }
    }

    return data;
}

function trim( str, charlist ) {
    charlist = !charlist ? ' \\s\xA0' : charlist.replace(/([\[\]\(\)\.\?\/\*\{\}\+\$\^\:])/g, '\$1');
    var re = new RegExp('^[' + charlist + ']+|[' + charlist + ']+$', 'g');
    return str.replace(re, '');
}

function renderRubrics(data) {

}
