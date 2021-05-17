
require('babel-register')({ 
    "plugins": [
        // 装饰器
        "transform-decorators-legacy",
        'transform-class-properties',
        'transform-object-rest-spread',
        // 别名
        ["module-resolver", {
            "alias": {
                'libs': './libs',
                'app': './app'
            }
        }]
    ] 
});

class AppBootHook {

    constructor(app) {
        this.app = app;
    }

    async didLoad() {
        // 参数验证
        require('./libs/validator').loader(this.app)
    }
}

module.exports = AppBootHook;