const Koa = require('koa');
const Router = require('koa-router');
const bodyParser = require('koa-bodyparser');
const views = require('koa-views');
const serve = require('koa-static');
const path = require('path');
const line = require('@line/bot-sdk');
require('dotenv').config();

const { Client, Databases } = require('appwrite');

const app = new Koa();
const router = new Router();

// Line bot configuration
const config = {
    channelAccessToken: process.env.LINE_CHANNEL_ACCESS_TOKEN,
    channelSecret: process.env.LINE_CHANNEL_SECRET
};

const lineClient = new line.Client(config);

// Appwrite configuration
const appwriteClient = new Client()
    .setEndpoint(process.env.APPWRITE_ENDPOINT)
    .setProject(process.env.APPWRITE_PROJECT_ID)
    .setKey(process.env.APPWRITE_API_KEY);

const database = new Databases(appwriteClient);

// Middleware
app.use(bodyParser());
app.use(views(path.join(__dirname, 'views'), { extension: 'ejs' }));
app.use(serve(path.join(__dirname, 'public')));

// Routes
require('./routes')(router, lineClient, database);

app.use(router.routes()).use(router.allowedMethods());

const port = process.env.PORT || 9000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
