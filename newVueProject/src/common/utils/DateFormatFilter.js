import Vue from 'vue';

function changeNumStr (v) {
    if (v < 10) {
        return '0' + v;
    }
    return v + '';
}

Vue.filter('date', function (value) {
    let d = new Date(parseInt(value));

    return d.getFullYear() + '-' +
        changeNumStr((d.getMonth() + 1)) + '-' +
        changeNumStr(d.getDate());
});