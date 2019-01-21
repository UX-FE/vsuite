import Loading from './loading.js';

let loadingInstance;

function getLoadingInstance (render = undefined) {
    loadingInstance = loadingInstance || Loading.newInstance({
        render: render
    });

    return loadingInstance;
}

function loading (options) {
    const render = ('render' in options) ? options.render : undefined;
    let instance  = getLoadingInstance(render);

    instance.show(options);
}

Loading.show = function (props = {}) {
    return loading(props);
};
Loading.hide = function () {
    if (!loadingInstance) return false;

    const instance = getLoadingInstance();

    instance.remove(() => {
        loadingInstance = null;
    });
};

export default Loading;