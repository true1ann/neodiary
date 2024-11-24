app.ui = {
    sys: {},

    async init() {
        //
        // Prepare
        //

        document.body.innerHTML = '<div id=content></div>';
        const content = document.getElementById('content');

        //
        // Stage one: Set up APP
        //

        const iframe = document.createElement('iframe');
        iframe.srcdoc = `<!DOCTYPE html><html><head><title>Isolated Context</title></head><body></body></html>`;
        iframe.id = 'app-iframe';
        content.appendChild(iframe);

        app.ui.sys['APP-IFRAME'] = iframe;

        iframe.onload = () => {
            try {
                const iframeWindow = iframe.contentWindow;
                const iframeDocument = iframe.contentDocument || iframeWindow.document;

                if (iframeDocument) {
                    iframeDocument.body.innerHTML += app.Strings['WAITING_FOR_JAVASCRIPT'];

                    const link = document.createElement('link');
                    link.rel = 'stylesheet';
                    link.href = 'api/data/themes/app.css';
                    link.onerror = () => console.error('Failed to load style');
                    iframeDocument.head.appendChild(link);

                    console.log('init complete');
                } else {
                    console.error('iframe.document is null or inaccessible');
                }
            } catch (e) {
                console.error('Error interacting with iframe:', e);
            }
        };

        //
        // Second stage: Set up DOC layout
        //

        app.ui.sys['DOC-BLUR'] = document.createElement('div');
        app.ui.sys['DOC-SIDEBAR'] = document.createElement('div');
        app.ui.sys['DOC-BOTTOMBAR'] = document.createElement('div');
        app.ui.sys['DOC-HEADER'] = document.createElement('div');

        app.ui.sys['DOC-BLUR'].id = 'blurdiv'
        app.ui.sys['DOC-SIDEBAR'].id = 'sidebar';
        app.ui.sys['DOC-BOTTOMBAR'].id = 'bottom-dock';
        app.ui.sys['DOC-HEADER'].id = 'header';

        document.body.appendChild(app.ui.sys['DOC-BLUR']);
        document.body.appendChild(app.ui.sys['DOC-SIDEBAR']);
        document.body.appendChild(app.ui.sys['DOC-BOTTOMBAR']);
        content.appendChild(app.ui.sys['DOC-HEADER']);

        //
        // Third stage: Load User preferences, Settings, Locales, etc
        //

        try {
            const response = await fetch(`/api/screens/index.json`);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            app.ui.sys['SCREENS'] = data;
        } catch (error) {
            console.error('There was a problem with the fetch operation:', error);
        }

        let entries = '';

        for (const file in app.ui.sys['SCREENS']) {
            const [screen_string, icon] = app.ui.sys['SCREENS'][file];
            const screen = app.Strings[screen_string];
            const buttonHTML = `<button type="button" onclick="createRipple(event); changeActiveMenu(event); app.ui.loadUi(\`${file}\`)"><span class="material-icons">${icon}</span><span class="text">${screen}</span></button>`;
            entries += buttonHTML;
        }

        app.ui.sys['DOC-SIDEBAR'].innerHTML = entries;

        app.ui.sys['DOC-HEADER'].innerHTML = `<span class="material-icons" onclick="openSideBar()">menu</span><span class="text">${app.Strings['HEADER_STANDART']}</span>`;
    },

    loadUi(js) {
        console.log('placeholder, trying to load', js);
        app.ui.sys['DOC-HEADER'].innerHTML = `<span class="material-icons" onclick="openSideBar()">menu</span><span class="text">${app.Strings[app.ui.sys['SCREENS'][js][0]]}</span>`;
        closeBars();
    },

    createPopup(title, message, actions) {
        console.log('not done');
    }
};