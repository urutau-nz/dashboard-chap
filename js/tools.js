

function logTime() {
    var d = new Date();
    console.log(d.getSeconds() + ':' + d.getMilliseconds());
}

function capitalize(string) {
    return string[0].toUpperCase() + string.slice(1).toLowerCase();
}
