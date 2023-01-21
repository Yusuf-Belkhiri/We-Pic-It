const { v4: uuidv4 } = require('uuid');

exports.createCategory = async (req, res) => {
    const {nameCat} = req.body
    const idCat = uuidv4()
    try{
        const writeQuery = `create(n:Category {idNode:${idCat} ,nameCat : '${nameCat}'}) `;
        await session.executeWrite(tx => tx.run(writeQuery,{idCat, nameCat}));
    } 
    catch(error){
        console.error(`Query Error: ${error}`);
    } 
}

exports.deleteNode = async (req, res) => {
    const {idNode} = req.body
    try{
        const writeQuery = `match(n) where n.idNode=${idNode} detach delete n`;
        await session.executeWrite(tx => tx.run(writeQuery,{idNode}));
    } 
    catch(error){
        console.error(`Query Error: ${error}`);
    } 
}