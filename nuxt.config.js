const {PrimeVueResolver} = require("unplugin-vue-components/resolvers");
const Components = require('unplugin-vue-components/webpack')
export default {
    // Disable server-side rendering (https://go.nuxtjs.dev/ssr-mode)
    ssr: false,
    server: {
        port: 4000
    },
    // Global page headers (https://go.nuxtjs.dev/config-head)
    head: {
    title: 'Privacy controller',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ]
    },
    // Global CSS (https://go.nuxtjs.dev/config-css)
    css: [
        '@/node_modules/leaflet/dist/leaflet.css',
        '@/node_modules/leaflet.markercluster/dist/MarkerCluster.css',
        '@/node_modules/leaflet.markercluster/dist/MarkerCluster.Default.css',
        '@/node_modules/primevue/resources/primevue.min.css',
        '@/node_modules/primeicons/primeicons.css',
        '@/node_modules/vue-multiselect/dist/vue-multiselect.min.css',
        '@/assets/packages/line-awesome/css/line-awesome.min.css',
        '@/assets/css/tailwind.css',
        '@/assets/css/app.scss'
    ],

    // Plugins to run before rendering page (https://go.nuxtjs.dev/config-plugins)
    plugins: [
        '@/plugins/filters.js',
        '@/plugins/parsers.js',
        '@/plugins/primevue.js',
        '@/plugins/bus.js'
    ],

    // Auto import components (https://go.nuxtjs.dev/config-components)
    components: false,

    // Modules for dev and build (recommended) (https://go.nuxtjs.dev/config-modules)
    buildModules: [
        '@nuxt/postcss8',
    ],

    // primevue: {
    //     theme: 'saga-blue',
    //     ripple: false,
    //     prefix: 'P',
    //     components: ['InputText','Button', 'Toast', 'Checkbox'],
    // },
    axios: {
        baseURL: 'http://192.168.2.1:8888', // Used as fallback if no runtime config is provided
    },

    // Modules (https://go.nuxtjs.dev/config-modules)
    modules: [
        // 'primevue/nuxt',
        '@nuxtjs/axios',
        '@nuxtjs/auth-next'
    ],
    router: {
        middleware: ['auth']
    },
    auth: {
        strategies: {
            local: {
                token: {
                    property: 'token',
                    global: true,
                    // required: true,
                    type: false
                },
                endpoints: {
                    login: { url: '/auth/token', method: 'post' },
                    logout: false,
                    user: { url: '/auth/me', method: 'get' },
                }
            }
        }
    },

    // Build Configuration (https://go.nuxtjs.dev/config-build)
    build: {
        postcss: {
            plugins: {
                tailwindcss: {},
                autoprefixer: {},
            },
        },
        extend(config) {
            config.plugins.push( Components({
                resolvers: [PrimeVueResolver({
                    prefix: 'P'
                })],
            }))
        }
    }
}

