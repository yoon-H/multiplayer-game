const initialHandler = async({socket, userId, payload}) => {
    const {deviceId} = payload;

    addUser(socket, deviceId);

    socket,write("");
};

export default initialHandler;
