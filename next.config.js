module.exports = {
    reactStrictMode: true,
    async redirects() {
        return [
            {
                source: '/bdv-payment/:id',
                destination:
                    'https://biodemo.ex-cle.com:4443/ipg/Web/PaymentProcess/Token/:id',
                permanent: false,
                basePath: false,
            },
        ];
    },
    images: {
        loader: 'akamai',
        path: '/',
    },
};
