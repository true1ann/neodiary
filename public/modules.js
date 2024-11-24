// src/modules.js

async function loadPlugin(pluginName) {
    try {
        const pluginPath = `/data/plugins/${pluginName}.js`;
        await loadScript(pluginPath);
        console.log(`${pluginName} loaded successfully!`);
    } catch (error) {
        console.error(`Failed to load plugin: ${pluginName}`, error);
    }
}

async function initializePlugins() {
    // Example: Load the Markdown plugin if enabled in settings
    const enabledPlugins = await getEnabledPlugins(); // Fetch this from user settings
    for (const plugin of enabledPlugins) {
        await loadPlugin(plugin);
    }
}

async function getEnabledPlugins() {
    // This would normally be loaded from user settings (data/user/plugins.json)
    return ['markdown']; // Example: Only Markdown plugin is enabled
}

// Call this to initialize all plugins
initializePlugins();
