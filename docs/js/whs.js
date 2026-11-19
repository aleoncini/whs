var STORE_ORIGIN = window.location.origin;
var info = {};
const options = { weekday: 'long', year: 'numeric', month: 'short', day: 'numeric' };

function displayAllResults() {
    // check if an array of results is locally saved
    var results = JSON.parse(localStorage.getItem("whsResults") || "[]");
    // order elements by date
    results.sort(function(o1,o2){
        return new Date(o2.date) - new Date(o1.date);
    });
    // create table with loaded results
    displayResults(enrich(results));
};

function displayResults(results) {
    $("#resultsTableBody").empty();

    $.each(results, function (index, result) {
        addResultToTable(result, index);
    });
};

function addResultToTable(result, ndx) {
    var resultDate = new Date(result.date).toLocaleDateString('it-IT', options);
    var rowContent = '<tr';
    if(result.isLatest){
        if(result.isValid){
            rowContent += ' class="table-success"';
        } else {
            rowContent += ' class="table-light"';
        }
    }
    rowContent += '>';
    rowContent += '<td>' + resultDate + '</td>';
    rowContent += '<td>' + result.course + '</td>';
    rowContent += '<td>' + result.tournament + '</td>';
    rowContent += '<td>' + result.stb + '</td>';
    rowContent += '<td>' + result.sd + '</td>';
    rowContent += '<td style="cursor: pointer;" class="delete_result" data-id="' + ndx + '"><img src="img/trash.svg" alt="delete" width="24" height="24"></td>';
    rowContent += '</tr>';
    $('#tbl_results  tbody').append(rowContent);
};

function setAlert(msg) {
    $("#formNotComplete").html(msg);
    $("#formNotComplete").fadeIn();
    window.setTimeout(function() {
        $("#formNotComplete").fadeOut();
    }, 4000);
};

function round(value, precision) {
    var multiplier = Math.pow(10, precision || 0);
    return Math.round(value * multiplier) / multiplier;
}

function isOdd(n) {
    return Math.abs(n % 2) == 1;
};

function enrich(results) {
    var lastTwentySds = [];
    $.each(getTop20Sort(results), function (index, result) {
        lastTwentySds[index] = result.sd;
    });
    var best8Sds = getTop8Sort(lastTwentySds);
    const maxSd = Math.max(...best8Sds);

    var enrichedList=[];
    $.each(results, function (index, result) {
        var element = {};
        element.date = result.date;
        element.course = result.course;
        element.tournament = result.tournament;
        element.stb = result.stb;
        element.sd = result.sd;
        element.isLatest = (index < 20);
        element.isValid = (result.sd < maxSd);
        enrichedList.push(element);
    });

    return enrichedList;
}

function getTop8Sort(arr) {
  return arr.slice().sort((a, b) => a - b).slice(0, 8);
}

function getTop20Sort(arr) {
    return arr.slice().sort((a, b) => b.date - a.date).slice(0, 20);
}