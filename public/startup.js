//
// Define app, core features and such
//

let app = {
    core: {
        loadScript: function (src) {
            return new Promise((resolve, reject) => {
                const script = document.createElement('script');
                script.src = src;
                script.onload = resolve;
                script.onerror = () => reject(new Error(`Failed to load script: ${src}`));
                document.head.appendChild(script);
            });
        },

        loadStyle: function (href) {
            return new Promise((resolve, reject) => {
                const link = document.createElement('link');
                link.rel = 'stylesheet';
                link.href = href;
                link.onload = resolve;
                link.onerror = () => reject(new Error(`Failed to load style: ${href}`));
                document.head.appendChild(link);
            });
        },

        fetchUrl: function (url) {
            return new Promise((resolve) => {
                fetch(url)
                    .then(response => {
                        if (!response.ok) {
                            throw new Error('Network response was not ok');
                        }
                        return response.json();
                    })
                    .then(data => {
                        resolve(data);
                        return data;
                    })
                    .catch(error => {
                        console.error('There was a problem with the fetch operation:', error);
                    });
            });
        },

        ui: {}
    },
    locales: {
        list: {},

        add(locale, name) {
            return new Promise((resolve) => {
                this.list[name] = `${locale}.json`;
                console.log(`Locale added: ${name} -> ${locale}.json`);
                resolve();
            });
        },

        fetch(name) {
            return new Promise((resolve) => {
                fetch(`/api/data/locales/${this.list[name]}`)
                    .then(response => {
                        if (!response.ok) {
                            throw new Error('Network response was not ok');
                        }
                        return response.json();
                    })
                    .then(data => {
                        resolve(data);
                        return data;
                    })
                    .catch(error => {
                        console.error('There was a problem with the fetch operation:', error);
                    });
            });
        }
    }
};

//
// Start loading
//

window.addEventListener('DOMContentLoaded', async () => {
    try {
        await app.core.loadStyle('basic.css');

        document.body.innerHTML = '<div id="loading">Loading...</div>';

        await fetch('/api/data/locales/locale-index.json')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                for (const [key, value] of Object.entries(data)) {
                    app.locales.add(key, value);
                }
            })
            .catch(error => {
                console.error('There was a problem with the fetch operation:', error);
            });

        await app.core.loadScript('updaters.js');
        await app.core.loadScript('api/lib/ui/uikit.js');
        app.Strings = await app.locales.fetch((await app.core.fetchUrl('/api/settings/json')).language);
        await app.core.loadStyle('api/data/themes/app.css');
        app.ui.init();
    } catch (error) {
        console.error(error);
        document.body.innerHTML = '<div id="error">An error occurred while loading the application.</div>';
    }
});