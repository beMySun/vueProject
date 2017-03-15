import Promise from 'vue-resource/src/lib/promise';

const NativeHttpName = 'NativeJsHttp';
function Http (request) {
    return new Promise(function (resolve) {
        let response = {
            request: request
        };
        let handler;

        delete request.headers.token;

        handler = function (resp) {
            response.data = resp.data;
            response.status = resp.status;
            resp.headers = resp.headers || {};
            response.headers = (name) => {
                return resp.headers[name];
            };

            resolve(response);
        };

        window.WebViewJavascriptBridge.callHandler(NativeHttpName, request, handler);
    });
}

export default Http;