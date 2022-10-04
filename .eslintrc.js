module.exports = {
    env: {
        browser: true,
        amd: true,
        node: true,
        es6: true,
    },

    extends: [
        'eslint:recommended',
        'plugin:jsx-a11y/recommended',
        'plugin:prettier/recommended',
        'next',
        'next/core-web-vitals',
        'prettier',
        'plugin:react-hooks/recommended',
    ],

    plugins: ['prettier', 'vue'],
    rules: {
        'generator-star-spacing': 'off',
        'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
        'prettier/prettier': 'error'
    }
};
