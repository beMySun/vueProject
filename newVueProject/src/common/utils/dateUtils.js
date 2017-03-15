function to2 (i) {
    i = +i;
    return i > 9 ? i : '0' + i;
}

export function format (date, format = 'yyyy-MM-dd') {
    let res = format;
    res = res.replace(/yyyy|YYYY/, date.getFullYear());

    let month = date.getMonth() + 1;
    res = res.replace(/MM/, to2(month));
    res = res.replace(/M/g, month);

    let d = date.getDate();
    res = res.replace(/dd/, to2(d));
    res = res.replace(/d/g, d);

    let hours = date.getHours();
    res = res.replace(/HH/, to2(hours));
    res = res.replace(/H/g, hours);

    let min = date.getMinutes();
    res = res.replace(/mm/, to2(min));
    res = res.replace(/m/g, min);

    let second = date.getSeconds();
    res = res.replace(/ss/, to2(second));
    res = res.replace(/s/g, second);

    return res;
};