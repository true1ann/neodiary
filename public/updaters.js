function updateSliderBackground(slider) {
    const value = (slider.value - slider.min) / (slider.max - slider.min) * 100;
    slider.style.setProperty('--slider-value', `${value}%`);
}

function attachSliderListeners() {
    const sliders = document.querySelectorAll('.app-progress-card input[type="range"]');
    sliders.forEach(slider => {
        updateSliderBackground(slider);

        slider.addEventListener('input', function () {
            updateSliderBackground(slider);
        });
    });
}

document.addEventListener('DOMContentLoaded', function () {
    attachSliderListeners();

    const observer = new MutationObserver(() => {
        attachSliderListeners();
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
});

function createRipple(event) {
    const button = event.currentTarget;

    if (button.classList.contains('disabled')) {
        return;
    }

    const ripple = document.createElement("span");
    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);

    ripple.style.width = ripple.style.height = `${size}px`;
    ripple.style.left = `${event.clientX - rect.left - size / 2}px`;
    ripple.style.top = `${event.clientY - rect.top - size / 2}px`;

    if (button.classList.contains('danger')) {
        ripple.classList.add('ripple-danger');
    } else {
        ripple.classList.add('ripple');
    }

    button.appendChild(ripple);

    ripple.addEventListener("animationend", function () {
        ripple.remove();
    });
}

function changeActiveMenu(event) {
    const buttons = document.querySelectorAll('#sidebar button');

    buttons.forEach(button => {
        button.classList.remove('active');
    });

    event.currentTarget.classList.add('active');
}

//
// This is made by avelinia on Discord, Thank you.
//
const initMasonry = () => {
    const container = document.querySelector('.app-notes-container');
    const items = Array.from(container.children);
    const minColumnWidth = 150;
    const gap = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--app-ui-margin'));

    function organizeItems() {
        container.style.position = 'relative';
        container.style.width = '100%';

        const containerWidth = container.clientWidth - gap;
        const numColumns = Math.max(1, Math.floor(containerWidth / (minColumnWidth + gap)));

        const columnWidth = Math.floor((containerWidth - (gap * (numColumns - 1))) / numColumns);

        const columnHeights = Array(numColumns).fill(0);

        items.forEach(item => {
            item.style.transform = '';
            item.style.width = `${columnWidth}px`;

            const shortestColumn = columnHeights.indexOf(Math.min(...columnHeights));

            const x = shortestColumn * (columnWidth + gap);
            const y = columnHeights[shortestColumn];

            item.style.position = 'absolute';
            item.style.transform = `translate(${x}px, ${y}px)`;

            columnHeights[shortestColumn] += item.offsetHeight + gap;
        });

        container.style.height = `${Math.max(...columnHeights)}px`;
    }

    if (document.readyState === 'complete') {
        organizeItems();
    } else {
        window.addEventListener('load', organizeItems);
    }

    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(organizeItems, 100);
    });

    const observer = new MutationObserver(() => {
        requestAnimationFrame(organizeItems);
    });

    observer.observe(container, {
        childList: true,
        subtree: true,
        attributes: true
    });
}

document.addEventListener('touchstart', (e) => {
    const target = e.target;
    if (app.ui.sys['DOC-BLUR'].contains(target)) {
        closeBars();
    }
});

function openSideBar() {
    app.ui.sys['DOC-BOTTOMBAR'].remove('open');
    app.ui.sys['DOC-BLUR'].className = 'active'
    app.ui.sys['DOC-SIDEBAR'].className = 'open'
}

function openBottomDock() {
    app.ui.sys['DOC-SIDEBAR'].classList.remove('open');
    app.ui.sys['DOC-BLUR'].className = 'active alt'
    app.ui.sys['DOC-BOTTOMBAR'].className = 'open'
}

function closeBars() {
    app.ui.sys['DOC-BOTTOMBAR'].remove('open');
    app.ui.sys['DOC-SIDEBAR'].classList.remove('open');
    app.ui.sys['DOC-BLUR'].className = 'none'
}

// do this when opening the menu
// const iframe = document.getElementById('my-iframe');
// iframe.style.pointerEvents = 'none'; // Ignore touch
// iframe.style.pointerEvents = 'auto'; // Re-enable touch
