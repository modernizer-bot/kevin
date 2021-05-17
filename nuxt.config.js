import path from 'path';
import Env from './env.js';
const isDev = (process.env.NODE_ENV == 'development');

export default {
    
    buildDir: isDev ? '.nuxt' : 'nuxt_dist',

    // 环境变量
    env: Env,

    generate: {
        fallback: 'index.html',
    },

    // web服务配置
    server: {
        port: 3000,
        host: '0.0.0.0',
    },

    ssr: false,

    vue: {
        productionTip: false
    },

    // Html默认 head
    head: {
        title: '调货需求系统',
        htmlAttrs: {
            lang: 'zh-CN'
        },
        meta: [
            { charset: 'utf-8' },
            { name: 'viewport', content: 'width=device-width, initial-scale=1' },
            { hid: 'description', name: 'description', content: '' },
            { name: 'renderer', content: 'webkit' },
        ],
        link: [
            { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
        ]
    },

    
    // 网格请求
    axios: {
        prefix: '/api',
        proxy: true,
        proxyHeaders: true,
        credentials: true
    },

    proxy: {
        '/api': {
            target: Env.API_BASE_URL,
            changeOrigin: true,
            // pathRewrite: {
            //     '^/backend': ''
            // }
        },
    },

    // 插件
    plugins: [
        '@/plugins/element-ui',
        '@/plugins/async-validator',
        '@/plugins/inject',
        '@/plugins/request',
        '@/plugins/mixins',
        { src: '@/plugins/client-component', ssr: false }
    ],

    // 路由配置
    router: {
        //全局路由权限验证中间件, 
        middleware: 'base',
        routeNameSplitter: '/',
        linkActiveClass: 'is-active',
        linkExactActiveClass: 'is-active'
    },

    // 自动加载组件
    components: false,

    // 网络请求顶部加载条配置
    loading: {
        color: "#3399FF",
        failedColor: "#EB4339",
        height: '3px'
    },

    // 模块
    modules: [
        '@nuxtjs/axios',
        'cookie-universal-nuxt',
    ],

    // 打包模块
    buildModules: [
        '@nuxtjs/style-resources'
    ],

    // 全局样式资源文件
    styleResources: {
        scss: [
            '~scss/variable.scss',
            '~scss/mixins.scss'
        ]
    },

    // 全局样式
    css: [
        '~scss/reset.scss', 
        '~theme/index.css', //主题
        '~scss/element-ui/index.scss',
        '~scss/animation.scss',
    ],

    // 忽略pages目录中components目录下的文件, 不打包到路由
    ignore: [
        'pages/**/components/*'
    ],

    // 打包配置
    build: {
        cache: false,
        analyze: !isDev,
        // 是否生成css map
        cssSourceMap: isDev,
        // 生产环境提取css
        extractCSS: !isDev,
        //配置按需引入规则
        babel:{
            "plugins":[
                [
                    "component",
                    {
                        "libraryName" : "element-ui",
                        // "styleLibraryName": "~theme-chalk/src"
                        'style': false,
                    }
                ]
            ]
        },

        extend(config, context) {
            // 排除 nuxt 原配置的影响,Nuxt 默认有vue-loader,会处理svg,img等
            // 找到匹配.svg的规则,然后将存放svg文件的目录排除
            const svgRule = config.module.rules.find(rule => rule.test.test('.svg'))
            svgRule.exclude = [ path.resolve(__dirname, 'assets/icons/svg') ]
            //添加loader规则
            config.module.rules.push({
                test: /\.svg$/, //匹配.svg
                include: [path.resolve(__dirname, 'assets/icons/svg')], //将存放svg的目录加入到loader处理目录
                use: [{
                    loader: 'svg-sprite-loader',
                    options: {
                        symbolId: 'icon-[name]'
                    }
                }]
            });
        },

        publicPath: '/script/',

        optimization: {
            splitChunks: {
                chunks: 'all',
                maxAsyncRequests: 7,
                cacheGroups: {
                    vendors: {
                        test: /[\\/]node_modules[\\/]/,
                        chunks: 'initial',
                        name: 'vendors',
                    },
                    common: {
                        test: /common/,
                        chunks: "all",
                        name: "common",
                    },
                    // admin: {
                    //     test: /(pages[\\/]admin)/,
                    //     name: 'admin',
                    //     chunks: 'all',           
                    //     enforce: true
                    // },
                    icons: {
                        test: /icons\/svg/,
                        name: 'icons',
                        chunks: 'all',           
                        enforce: true
                    }
                }
            }
        },
        
        // 文件名定义
        filenames: {
            app: ({ isDev }) => isDev ? '[name].js' : '[name].[contenthash:8].js',
            chunk: ({ isDev }) => (isDev ? '[name].js' : '[name].[contenthash:8].js'),
            css: ({ isDev }) => isDev ? '[name].css' : '[name].[contenthash:8].css',
            img: ({ isDev }) => isDev ? '[path][name].[ext]' : 'img/[name].[contenthash:8].[ext]',
            font: ({ isDev }) => isDev ? '[path][name].[ext]' : 'fonts/[name].[contenthash:8].[ext]',
        }
    }
}
