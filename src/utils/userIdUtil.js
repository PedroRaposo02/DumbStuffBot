exports.trimIds = userId => {
    return isUserId(userId) 
        ? userId.substring(2).substring(0, userId.substring(2).length - 1)
        : undefined;
}

const isUserId = userId => {
    const regex = /^<@\d+>$/;
    return regex.test(userId);
}