define([], function () {
    /**
     * 全局的缓存，使用时注意：将用到的缓存名称添加到这里，防止其他使用者重复命名使用。
     */
    function appCache() {
        this.conditions = {};
    }

    return new appCache();
});
