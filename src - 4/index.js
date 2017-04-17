window._init_ = function (data) {
    // TODO:加载第一个二级菜单
    window.location.href = data.menus[0].children[0].url;
}
