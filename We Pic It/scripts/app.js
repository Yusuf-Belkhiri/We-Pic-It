//const { types } = require("neo4j-driver-core");
const uri = 'neo4j+s://b352712a.databases.neo4j.io:7687';
const user = 'neo4j';
const password = 'JFXA93MI0snbcfoqW-deluQhQXHCk7Pg7T3ncIQmjOA';
const driver = neo4j.driver(uri, neo4j.auth.basic(user, password));
const session = driver.session({ database: 'neo4j' });

///////////////////////////////////////////////////////// HTML ELEMENTS
// AUTH : SIGN UP
const emailInput = document.querySelector("#email_input");
const firstNameInput = document.querySelector("#firstname_input");   
const lastNameInput = document.querySelector("#lastname_input");   
const passwordInput = document.querySelector("#password_input");   
const confirmPasswordInput = document.querySelector("#confirm_password_input");  

const signUpErrorText = document.querySelector(".sign_up_error_text");   
const signUpButton = document.querySelector(".sign_up_button");


///////////////////////////////////////////////////////// ON CLICK LISTENERS
signUpButton.onclick = signUp;



async function signUp(){
    

    //await createUser(100, "tst@tst.com", "pswrd123", "Hello", "World", "https://images.unsplash.com/photo-1489743342057-3448cc7c3bb9?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=6d284a2efbca5f89528546307f7e7b87&auto=format&fit=crop&w=500&q=60");
    //await createUser(200, "tsttt@tst.com", "pswrd123456", "Bye", "World", "https://images.unsplash.com/photo-1489743342057-3448cc7c3bb9?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=6d284a2efbca5f89528546307f7e7b87&auto=format&fit=crop&w=500&q=60");
    //await createPost(1000, "https://images.unsplash.com/photo-1489743342057-3448cc7c3bb9?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=6d284a2efbca5f89528546307f7e7b87&auto=format&fit=crop&w=500&q=60", "New Post", "Just testing!")
    //await createCategory(23150, "TestCategory")
    //await createAdmin(-1, "ADMIN", "ADMINA", "admin@admin.admin", "admin123")
    
    //await userFollowUser(100, 200);
    //await userPostRelation(100, 1000, "POSTED");
    //await userPostRelation(200, 1000, "DISLIKED");
    //await userPostRelation(200, 1000, "LIKED");
    //await userAddCategory(100, 23150);
    //await postAddCategory(1000, 23150);

    //await userUnfollowUser(100, 200);
    //await userPostRemoveRelation(100, 1000, "POSTED")
    //await userPostRemoveRelation(200, 1000, "LIKED")
    //await userRemoveCategory(100, 23150);

    /*
    await userPostRelation(100, 10, "LIKED");
    await userPostRelation(2, 10, "LIKED");
    await userPostRelation(1, 10, "LIKED");
    await userPostRelation(200, 10, "DISLIKED");    */

    //await deleteNode(23150);

    //window.location.href = "home.html";
    //signUpErrorText.hidden = false;
}





///////////////////////////////////////////////////////// CREATE NODES
// Create a User node
async function createUser(idUser, email, password, firstName, lastName, urlProfilePic){
    try{
        const writeQuery = `create(n:User{idNode:${idUser}, email:'${email}', password:'${password}', 
                        firstName:'${firstName}', lastName:'${lastName}', urlProfilePic:'${urlProfilePic}'})`;
        await session.executeWrite(tx => tx.run(writeQuery,{idUser,email, password, firstName, lastName, urlProfilePic}));
    } 
    catch(error){
        console.error(`Query Error: ${error}`);
    } 
}
// Create a Post node: ADD CATEGORIES
async function createPost(idPost, urlPic, title, description){
    try{
        const writeQuery = `create (n:Post {idNode:${idPost}, urlPic:'${urlPic}',title:'${title}', description:'${description}'})`;
        await session.executeWrite(tx => tx.run(writeQuery,{idPost,urlPic, title, description}));
    } 
    catch(error){
        console.error(`Query Error: ${error}`);
    } 
}
// Create a Category node
async function createCategory(idCat, nameCat){
    try{
        const writeQuery = `create(n:Category {idNode:${idCat} ,nameCat : '${nameCat}'}) `;
        await session.executeWrite(tx => tx.run(writeQuery,{idCat, nameCat}));
    } 
    catch(error){
        console.error(`Query Error: ${error}`);
    } 
}
// Create an Admin node
async function createAdmin(idAdmin, firstNameAdmin, lastNameAdmin, emailAdmin, passwordAdmin){
    try{
        const writeQuery = `create(admin :Admin {idNode : ${idAdmin} , firstNameAdmin:'${firstNameAdmin}' , 
                            lastNameAdmin:'${lastNameAdmin}' , emailAdmin :'${emailAdmin}' , passwordAdmin : '${passwordAdmin}' }) `;
        await session.executeWrite(tx => tx.run(writeQuery,{idAdmin, firstNameAdmin, lastNameAdmin, emailAdmin, passwordAdmin}));
    } 
    catch(error){
        console.error(`Query Error: ${error}`);
    } 
}
// DELETE NODES BY ID
async function deleteNode(idNode){
    try{
        const writeQuery = `match(n) where n.idNode=${idNode} detach delete n`;
        await session.executeWrite(tx => tx.run(writeQuery,{idNode}));
    } 
    catch(error){
        console.error(`Query Error: ${error}`);
    } 
}


///////////////////////////////////////////////////////// CREATE RELATIONS
async function userFollowUser(idFollower, idFollowed){
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
async function userPostRelation(idUser, idPost, relation){
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

async function userAddCategory(idUser, idCat){
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

async function postAddCategory(idPost, idCat){
    try{
        const writeQuery = `match(a:Post) where a.idNode=${idPost}
                            match(b:Category) where b.idNode=${idCat}
                            with a,b merge (a) -[r:BELONGS_TO]->(b)`;
        await session.executeWrite(tx => tx.run(writeQuery,{idPost, idCat}));
    } 
    catch(error){
        console.error(`Query Error: ${error}`);
    } 
}

///////////////////////////////////////////////////////// DELETE RELATIONS
async function userUnfollowUser(idFollower, idFollowed){
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
async function userPostRemoveRelation(idUser, idPost, relation){
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

async function userRemoveCategory(idUser, idCat){
    try{
        const writeQuery = `MATCH (a:User{idNode:${idUser}})-[r:INTERESTED_IN]->(b:Category{idNode:${idCat}})
                            delete(r)`;
        await session.executeWrite(tx => tx.run(writeQuery,{idUser, idCat}));
    } 
    catch(error){
        console.error(`Query Error: ${error}`);
    } 
}



///////////////////////////////////////////////////////// CREATE NODES
// Returns idUser
async function signIn(email, password){
    try{
        const readQuery = `MATCH (n:User)
                            WHERE n.email="${email}" AND n.password='${password}'
                            RETURN n.idNode
                            UNION MATCH (n:Admin)
                            WHERE n.emailAdmin ="${email}" AND n.passwordAdmin='${password}'
                            RETURN n.idNode`;
        await session.executeRead(tx => tx.run(readQuery,{email, password}));
    } 
    catch(error){
        console.error(`Query Error: ${error}`);
    } 
}

async function GetPostsByCategory(nameCat){
    try{
        const readQuery = `match(n:Post) ,(c:Category)
                            where c.nameCat="${nameCat}" and (n)-[:BELONGS_TO]->(c)
                            return n `;
        await session.executeRead(tx => tx.run(readQuery,{nameCat}));
    } 
    catch(error){
        console.error(`Query Error: ${error}`);
    } 
}

///////////////////////////////////////////////////////// USER PROFILE
async function GetUserInfoById(idUser){
    try{
        const readQuery = ` MATCH (a:User {idNode:${idUser}})-[p:POSTED]->(b:Post)
                            MATCH (a:User -[r:FOLLOW]->(b:User)
                            RETURN count(p) as numberOfPosts `;
        await session.executeRead(tx => tx.run(readQuery,{nameCat}));
    } 
    catch(error){
        console.error(`Query Error: ${error}`);
    } 
}

/** 

async function getUserById(id_user){
    try{
        const readQuery = `match(n:User)
                            where n.id_user=${id_user}
                            return n`;
        const readResult = await session.executeRead(tx => tx.run(readQuery,{id_user}));
        return readResult.records;
    } 
    catch(error){
        console.error(`Query Error: ${error}`);
    } 
}

async function deleteUserById(id_user){
    try{
        const writeQuery = `match(n:User)
                            where n.id_user=${id_user}
                            detach delete n`;
        await session.executeWrite(tx => tx.run(writeQuery,{id_user}));
    } 
    catch(error){
        console.error(`Query Error: ${error}`);
    } 
}   */