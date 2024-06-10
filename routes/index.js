module.exports = (router, lineClient, database) => {
    router.get('/', async (ctx) => {
        await ctx.render('index', { title: 'Line Bot Dashboard' });
    });

    router.post('/webhook', async (ctx) => {
        const events = ctx.request.body.events;
        for (const event of events) {
            await handleEvent(event, lineClient, database);
        }
        ctx.status = 200;
    });

    async function handleEvent(event, client, database) {
        if (event.type === 'message' && event.message.type === 'text') {
            const echo = { type: 'text', text: event.message.text };

            // Save message to Appwrite
            try {
                await database.createDocument(process.env.APPWRITE_COLLECTION_ID, {
                    channelid: event.source.userId,
                    createby: event.source.userId,
                    botid: event.source.userId,
                    webhookurl: `https://your-webhook-url.com/webhook`,
                    timestamp: new Date(),
                    dashboard_id: 'your_dashboard_id'
                });
            } catch (error) {
                console.error('Failed to save document:', error);
            }

            client.replyMessage(event.replyToken, echo);
        }
    }

    require('./dashboard')(router, database);
};
