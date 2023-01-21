const { session } = require('neo4j-driver');
const { v4: uuidv4 } = require('uuid');

// Create a User node
exports.createUser = async(req, res) => {
    const {email, password, firstName, lastName, urlProfilePic} = req.body
    const idUser = uuidv4()
    // body = {
    //     "email":""
    // }
    try{
        // Authentification: Sign Up Validation
        const users = await this.getUserByEmailOrUsername({email, firstName});
        if(users.length > 0)    // Email / Username is already used
            return - 1;     
        
        readQuery = `match(n:User{firstName:"${firstName}"}) return n`
        await session.executeRead(tx => tx.run(readQuery,{email}));

        const writeQuery = `create(n:User{idNode:${idUser}, email:'${email}', password:'${password}', 
                        firstName:'${firstName}', lastName:'${lastName}', urlProfilePic:'${urlProfilePic}'})`;
        await session.executeWrite(tx => tx.run(writeQuery,{idUser,email, password, firstName, lastName, urlProfilePic}));
        

        res.header("Access-Control-Allow-Origin", "*");

        localStorage.setItem("idUser", idUser);
        return idUser;
    } 
    catch(error){
        console.error(`Query Error: ${error}`);
    } 
}

exports.createAdmin = async(req, res) => {
    const{firstNameAdmin, lastNameAdmin, emailAdmin, passwordAdmin} = req.body;
    idAdmin = uuidv4();
    try{
        const writeQuery = `create(admin :Admin {idNode : ${idAdmin} , firstNameAdmin:'${firstNameAdmin}' , 
                            lastNameAdmin:'${lastNameAdmin}' , emailAdmin :'${emailAdmin}' , passwordAdmin : '${passwordAdmin}' }) `;
        await session.executeWrite(tx => tx.run(writeQuery,{idAdmin, firstNameAdmin, lastNameAdmin, emailAdmin, passwordAdmin}));
        localStorage.setItem("idUser", idAdmin);
    } 
    catch(error){
        console.error(`Query Error: ${error}`);
    } 
}

exports.signIn = async(req, res) => {
    const{email, password} = req.body;
    try{
        const readQuery = `MATCH (n:User)
                            WHERE n.email="${email}" AND n.password='${password}'
                            RETURN n.idNode
                            UNION MATCH (n:Admin)
                            WHERE n.emailAdmin ="${email}" AND n.passwordAdmin='${password}'
                            RETURN n.idNode as idUser`;
        const idUser =  await session.executeRead(tx => tx.run(readQuery,{email, password}));

        if(idUser.records.length == 0)
            return -1;

        localStorage.setItem("idUser", idUser.records[0].get("idUser"));
    } 
    catch(error){
        console.error(`Query Error: ${error}`);
    } 
}

exports.getUserByEmailOrUsername = async(req, res) => {
    const {email, userName} = req.body;
    try{
        const readQuery = `match(n:User{firstName:"${userName}"})
                            return n as user
                            union match(m:User{email:"${email}"})
                            return m as user`;
        const user =  await session.executeRead(tx => tx.run(readQuery,{email, password}));
        return user.records;
    } 
    catch(error){
        console.error(`Query Error: ${error}`);
    } 

}

// User Infos: numberOfPosts, numberOfFollowings, numberOfFollowers, (+ userName..)
exports.getUserInfoById = async(req, res) => {
    const {idUser} = req.body
    try{
        const readQuery = ` MATCH (a:User {idNode:${idUser}})-[r:POSTED]->(b:Post) return count(r) as numberOfRelations 
                            Union MATCH ((a)-[r:FOLLOW]->(c:User)) RETURN count(r) as numberOfRelations
                            Union MATCH (b:User)-[r:FOLLOW]->(a:User {idNode:${idUser}}) return count(r) as numberOfRelations`;
        const userInfo = await session.executeRead(tx => tx.run(readQuery,{idUser}));        
        let userRealInfo = new Array();
        for (let i = 0; i < userInfo.records.length; i++){
            userRealInfo[i] = userInfo.records[i]._fields[0].low;
        }
        return userRealInfo;
    } 
    catch(error){
        console.error(`Query Error: ${error}`);
    } 
}

// firstName, secondName, urlProfilePic
exports.getUserProfileInfo = async(req, res) => {
    const {idUser} = req.body
    try{
        const readQuery = ` MATCH (a:User {idNode:${idUser}})
                            RETURN a.firstName as firstName, a.lastName as lastName, a.urlProfilePic as urlProfilePic`;
        const userProfileInfo = await session.executeRead(tx => tx.run(readQuery,{idUser}));   
        return userProfileInfo.records;    
    } 
    catch(error){
        console.error(`Query Error: ${error}`);
    } 
}

// SAVED/POSTED posts
exports.getUserPosts = async(req, res) => {
    const{idUser, relation} = req.body;

    if(relation!="SAVED" && relation!="POSTED")
        return;
    try{
        const readQuery = ` MATCH (a:User {idNode:${idUser}})-[:${relation}}]->(b:Post) RETURN b as Posts `;
        const posts = await session.executeRead(tx => tx.run(readQuery,{idUser, relation}));
        return posts.records;
    } 
    catch(error){
        console.error(`Query Error: ${error}`);
    } 
}

// DELETE NODES BY ID
exports.deleteNode = async(req, res) => {
    const{idNode} = req.body;
    try{
        const writeQuery = `match(n) where n.idNode=${idNode} detach delete n`;
        await session.executeWrite(tx => tx.run(writeQuery,{idNode}));
    } 
    catch(error){
        console.error(`Query Error: ${error}`);
    } 
}

exports.userFollowUser = async(res,req) => {
    const{idFollower, idFollowed} = req.body;

    try{
        const writeQuery = `MATCH (a:User) where a.idNode = ${idFollower}
                            MATCH (b:User) where b.idNode = ${idFollowed}
                            with a, b MERGE (a)-[r:FOLLOW]->(b)`;
        await session.executeWrite(tx => tx.run(writeQuery,{idFollower, idFollowed}));
    } 
    catch(error){
        console.error(`Query Error: ${error}`);
    } 
}

// relation: POSTED, SAVED, LIKED, DISLIKED
exports.userPostRelation = async(req, res) => {
    const{idUser, idPost, relation} = req.body;
    
    try{
        const writeQuery = `MATCH (a:User) where a.idNode = ${idUser}
                            MATCH (b:Post) where b.idNode = ${idPost}
                            with a, b MERGE (a)-[r:${relation}]->(b)`;
        await session.executeWrite(tx => tx.run(writeQuery,{idUser, idPost, relation}));

        switch (relation){
            case "LIKED":
                await userPostRemoveRelation(idUser, idPost, "DISLIKED");
                break;
            case "DISLIKED":
                await userPostRemoveRelation(idUser, idPost, "LIKED");
                break;
        }
    } 
    catch(error){
        console.error(`Query Error: ${error}`);
    } 
}

exports.userAddCategory = async(req, res) => {
    const{idUser, idCat} = req.body;

    try{
        const writeQuery = `match(a:User) where a.idNode=${idUser}
                            match(b:Category) where b.idNode=${idCat}
                            with a,b merge (a) -[r:INTERESTED_IN]->(b)`;
        await session.executeWrite(tx => tx.run(writeQuery,{idUser, idCat}));
    } 
    catch(error){
        console.error(`Query Error: ${error}`);
    } 
}

exports.userUnfollowUser = async(req, res) => {
    const{idFollower, idFollowed} = req.body;

    try{
        const writeQuery = `MATCH (a:User{idNode:${idFollower}})-[r:FOLLOW]->(b:User{idNode:${idFollowed}})
                            delete(r)`;
        await session.executeWrite(tx => tx.run(writeQuery,{idFollower, idFollowed}));
    } 
    catch(error){
        console.error(`Query Error: ${error}`);
    } 
}

// Remove: SAVED, LIKED, DISLIKED
exports.userPostRemoveRelation = async(req, res) => {
    const{idUser, idPost, relation} = req.body;
    
    if(relation != "SAVED" && relation != "LIKED" && relation!="DISLIKED")
        return;

    try{
        const writeQuery = `MATCH (a:User{idNode:${idUser}})-[r:${relation}]->(b:Post{idNode:${idPost}})
                            delete(r)`;
        await session.executeWrite(tx => tx.run(writeQuery,{idUser, idPost, relation}));
    } 
    catch(error){
        console.error(`Query Error: ${error}`);
    } 
}

exports.userRemoveCategory = async(req, res) => {
    const{idUser, idCat} = req.body;

    try{
        const writeQuery = `MATCH (a:User{idNode:${idUser}})-[r:INTERESTED_IN]->(b:Category{idNode:${idCat}})
                            delete(r)`;
        await session.executeWrite(tx => tx.run(writeQuery,{idUser, idCat}));
    } 
    catch(error){
        console.error(`Query Error: ${error}`);
    } 
}

exports.editUserInfo = async(req, res) => {
    const{idUser, firstName, lastName, email, password, urlProfilePic} = req.body;

    try{
        const writeQuery = `match(n:User{idNode:${idUser}})
                            set n.firstName ='${firstName}'
                            set n.lastName ='${lastName}'
                            set n.email ='${email}'
                            set n.password ='${password}'
                            set n.urlProfilePic= '${urlProfilePic}'`;
        await session.executeWrite(tx => tx.run(writeQuery,{idUser, firstName, lastName, email, password, urlProfilePic}));
    } 
    catch(error){
        console.error(`Query Error: ${error}`);
    } 
}

/** 
module.exports = {
    createUser,
    getUserInfoById,
    createAdmin,
    deleteNode,
    userFollowUser,
    userPostRelation,
};
*/