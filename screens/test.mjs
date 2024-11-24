const isServer = typeof window === 'undefined';

(async () => {
    if (isServer) {
        console.info('Hello from the server!');
    } else {
        console.log('Hello from the client!');
    }
})();
