const { v4: uuidv4 } = require('uuid');

exports.createPost =  async(req, res) => {
    const {urlPic, title, description} = req.body
    const idPost = uuidv4()
    try{
        const writeQuery = `create (n:Post {idNode:${idPost}, urlPic:'${urlPic}',title:'${title}', description:'${description}'})`;
        await session.executeWrite(tx => tx.run(writeQuery,{idPost,urlPic, title, description}));
    } 
    catch(error){
        console.error(`Query Error: ${error}`);
    } 
}

exports.deleteNode = async(req, res) => {
    const {idNode} = req.body
    try{
        const writeQuery = `match(n) where n.idNode=${idNode} detach delete n`;
        await session.executeWrite(tx => tx.run(writeQuery,{idNode}));
    } 
    catch(error){
        console.error(`Query Error: ${error}`);
    } 
}

exports.postAddCategory =  async(req, res) => {
    const {idPost, idCat} = req.body
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

exports.getPostsByCategory =  async(req, res) => {
    const {nameCat} = req.body
    try{
        const readQuery = `match(n:Post) ,(c:Category)
                            where c.nameCat="${nameCat}" and (n)-[:BELONGS_TO]->(c)
                            return n `;
        const posts = await session.executeRead(tx => tx.run(readQuery,{nameCat}));
        return posts;
    } 
    catch(error){
        console.error(`Query Error: ${error}`);
    } 
}

exports.getPostInfo =  async(req, res) => {
    const {idPost} = req.body
    try{
        const readQuery = `match(p:Post{idNode:${idPost}}) 
                            match(p)-[:BELONGS_TO]->(c:Category)  
                            match(u:User)-[:POSTED]->(p)  
                            match(ul:User)-[l:LIKED]-> (p) 
                            match (ud:User)-[d:DISLIKED]->(p)
                            return p.title as postTitle, p.description as postDescription, p.urlPic as postUrlPic, 
                            c.nameCat as postTags, u.idNode as postUserId, 
                            count(distinct l) - Count(distinct d) as numberOfReactions`;
        
        const posts  = await session.executeRead(tx => tx.run(readQuery,{idPost}));
        return posts.records;
    } 
    catch(error){
        console.error(`Query Error: ${error}`);
    }
}


// Recommendation

/** BASED ON CATEGORIES INTRESTED IN */
exports.getRecommendedPostsByCategories = async(req, res) =>{
    const{idUser} = req.body
    try{
        const readQuery =   `match(p:Post)-[:BELONGS_TO]->(c:Category)<-[:INTERESTED_IN]-(u:User{idNode:${idUser}}) 
                            return p as posts`
        const posts = await session.executeRead(tx => tx.run(readQuery, {idUser}));
        return posts.records;
    }
    catch(error){
        console.error(`Query Error: ${error}`);
    }
}

/** BASED ON FOLLOWINGS POSTS */
exports.getRecommendedPostsByFollowings = async(req, res) =>{
    const{idUser} = req.body
    try{
        const readQuery =   `match(p:Post)<-[:POSTED]-(us:User)<-[:FOLLOW]-(u:User{idNode:${idUser}}) 
                            return p as posts`
        const posts = await session.executeRead(tx => tx.run(readQuery, {idUser}));
        return posts.records;
    }
    catch(error){
        console.error(`Query Error: ${error}`);
    }
}

/** LIKED POSTS CATEGORIES */
exports.getRecommendedPostsByLikedPosts = async(req, res) =>{
    const{idUser} = req.body
    try{
        const readQuery =   `match(p:Post)-[:BELONGS_TO]->(c:Category)<-[:BELONGS_TO]-(p1:Post)<-[:LIKED]-(u:User{idNode:${idUser}}) 
                            return p as posts`
        const posts = await session.executeRead(tx => tx.run(readQuery, {idUser}));
        return posts.records;
    }
    catch(error){
        console.error(`Query Error: ${error}`);
    }
}

/** CATEGORIES OF HIS POSTS */
exports.getRecommendedPostsByUserPosts = async(req, res) =>{
    const{idUser} = req.body
    try{
        const readQuery =   `match(p:Post)-[:BELONGS_TO]->(:Category)<-[:BELONGS_TO]-(p2:Post)<-[:POSTED]-(u:User {idNode :${idUser}})
                            return p as posts`
        const posts = await session.executeRead(tx => tx.run(readQuery, {idUser}));
        return posts.records;
    }
    catch(error){
        console.error(`Query Error: ${error}`);
    }
}


// Search
exports.searchPosts = async(req, res) =>{
    const{searchKey} = req.body
    try{
        const readQuery =   `match(p:Post) where p.title contains '${searchKey}' or p.description  contains '${searchKey}' return p as posts
                            union 
                            match(p:Post)-[:BELONGS_TO]->(c:Category) where c.nameCat contains '${searchKey}' return p as posts
                            Union 
                            match(p:Post)<-[:POSTED]-(u:User ) where u.firstName contains '${searchKey}' or u.lastName contains '${searchKey}' return p as posts`
        const posts = await session.executeRead(tx => tx.run(readQuery, {searchKey}));
        return posts.records;
    }
    catch(error){
        console.error(`Query Error: ${error}`);
    }
}