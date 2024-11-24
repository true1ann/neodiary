//
// Imports
//
import express from 'express';
import path from 'path';
import fs from 'fs';
import logger from './lib/misc/logger.mjs';

logger.level(process.env.LOGLEVEL || 'DEBUG');
const app = express();

// I hate ES modules
const __filename = new URL(import.meta.url).pathname;
const __dirname = path.dirname(__filename);

//
// Config
//
const Deploy = true;

const PORT = process.env.PORT || 65072;
const HOST = process.env.HOST || Deploy ? '0.0.0.0' : 'localhost';

app.use(express.json());

const settingsPath = path.join(__dirname, 'data', 'user', 'settings.json');
const pluginsPath = path.join(__dirname, 'data', 'user', 'plugins.json');
const publicPath = path.join(__dirname, 'public');
const libPath = path.join(__dirname, 'lib');
const dataPath = path.join(__dirname, 'data');
const screensPath = path.join(__dirname, 'screens');

//
// Log middleware
//
app.use((req, res, next) => {
    logger.info(`${req.method} ${req.url}; IP: ${req.ip}; UA: '${req.get('User-Agent')}'`);
    next();
});

//
// Actual code
//
app.use(express.static(publicPath));
app.use('/api/lib', express.static(libPath));
app.use('/api/data', express.static(dataPath));
app.use('/api/screens', express.static(screensPath));
app.get('/api/test', (req, res) => {
    res.status(200).send('test');
});

app.get('/api/settings/json', (req, res) => {
    fs.readFile(settingsPath, 'utf8', (err, data) => {
        if (err) {
            return res.status(500).send('Error reading settings file');
        }
        res.status(200).json(JSON.parse(data));
    });
});

app.put('/api/settings/update', (req, res) => {
    fs.writeFile(settingsPath, JSON.stringify(req.body, null, 2), (err) => {
        if (err) {
            return res.status(500).send('Error writing settings file');
        }
        res.status(200).send('OK');
    });
});

app.get('/api/plugins/json', (req, res) => {
    fs.readFile(pluginsPath, 'utf8', (err, data) => {
        if (err) {
            return res.status(500).send('Error reading plugins file');
        }
        res.status(200).json(JSON.parse(data));
    });
});

app.put('/api/plugins/update', (req, res) => {
    fs.writeFile(pluginsPath, JSON.stringify(req.body, null, 2), (err) => {
        if (err) {
            return res.status(500).send('Error writing plugins file');
        }
        res.status(200).send('OK');
    });
});

app.listen(PORT, () => {
    logger.info(`Server is UP at ${HOST}:${PORT}.`);
    console.log();

    if (!Deploy) {
        logger.version()
        logger.warn('You are running in Deveveloper mode. No Developer UI are enabled, though');
        logger.warn('Check user settings to enable Developer UIs.');
        console.log();
    }

});
