//
// Make app.ui for further UI interactions.
//

app.Strings = null;
app.ui = {
    container: document.createElement('div'),
    content: null,

    load: function () {
        return new Promise((resolve) => {
            app.core.loadScript('api/screens/launch.js')
                .then(() => {
                    resolve();
                });
        });
    }
};

//
// Begin making base UI
//

document.body.innerHTML = '';

app.core.loadStyle('api/data/themes/app.css');

app.ui.container.id = 'main-container';

const sidebar = document.createElement('div');
sidebar.id = 'sidebar';
app.ui.container.appendChild(sidebar);

const bottomDock = document.createElement('div');
bottomDock.id = 'bottom-dock';
app.ui.container.appendChild(bottomDock);

const content = document.createElement('div');
content.id = 'content';
app.ui.container.appendChild(content);

app.ui.content = content;

const buttonContainer = document.createElement('div');

//
// COPY THIS TO THE APPKIT.js
//

for (const [key, value] of Object.entries(app.locales.list)) {
    const button = document.createElement('button');
    button.textContent = value;
    button.onclick = () => app.locales.fetch(key).then(data => {
        app.Strings = data; // Ensure you await the fetch
    });
    buttonContainer.appendChild(button);
}

document.addEventListener('click', (event) => {
    if (!sidebar.contains(event.target)) {
        sidebar.classList.remove('open');
    }
    if (!bottomDock.contains(event.target)) {
        bottomDock.classList.remove('open');
    }
});

document.body.appendChild(app.ui.container);
document.getElementById('bottom-dock').appendChild(buttonContainer);