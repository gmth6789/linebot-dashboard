module.exports = (router, database) => {
    router.get('/dashboard', async (ctx) => {
        try {
            const documents = await database.listDocuments(process.env.APPWRITE_COLLECTION_ID);
            await ctx.render('dashboard', { title: 'Dashboard', data: documents.documents });
        } catch (error) {
            console.error('Failed to retrieve documents:', error);
            ctx.status = 500;
            ctx.body = 'Internal Server Error';
        }
    });
};
