const { PrismaClient } = require('@prisma/Client')

const prisma = new PrismaClient();


const addWatchClientMessage = async (userId, message) => {

    const watchClientMessage = await prisma.watchClientMessages.findFirst({
        where: {
            userId: userId,
            message: message,
        }
    });
    
    if (watchClientMessage != null && watchClientMessage.userId === userId && watchClientMessage.message === message) {
        await prisma.watchClientMessages.updateMany({
            where: {
                userId: userId,
                message: message
            },
            data: {
                count: watchClientMessage.count + 1
            },
        })
    }
    else {
        await prisma.watchClientMessages.create({
            data: {
                userId: userId,
                message: message
            }
        })
    }
}



async function prismaRouter() {
    


    await addWatchClientMessage("SomeID1", "SomeMessage1");
    await addWatchClientMessage("SomeID1", "SomeMessage2");
    await addWatchClientMessage("SomeID2", "SomeMessage1");
    await addWatchClientMessage("SomeID2", "SomeMessage2");
    await addWatchClientMessage("SomeID2", "SomeMessage2");

    await (await prisma.watchClientMessages.findMany()).map( item => console.log(item));
}

prismaRouter().then(async () => {
    await prisma.$disconnect();
})
.catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
})