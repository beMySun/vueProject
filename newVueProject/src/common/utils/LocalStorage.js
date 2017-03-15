const LS = window.localStorage;
function _checkKey (key) {
    if (!key) {
        // console.warn('key is null or empty');
        return false;
    }
    return true;
}

export default {
    put (key, data) {
        if (!_checkKey(key)) {
            return;
        }
        LS[key] = JSON.stringify(data);
    },
    get (key) {
        if (!_checkKey(key)) {
            return;
        }
        /* eslint no-eval */
        // return eval(LS[key]);
        return null;
    },
    contains (key) {
        if (!_checkKey(key)) {
            return;
        }
        return !!LS[key];
    },
    clear (key) {
        delete LS[key];
    }
};