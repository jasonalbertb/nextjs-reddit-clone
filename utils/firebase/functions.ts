

import { GoogleAuthProvider, createUserWithEmailAndPassword, getAuth, signInWithEmailAndPassword, signInWithPopup, signOut } from "firebase/auth";
import {db, auth, storage} from "./config";
import { DocumentData, QueryDocumentSnapshot, QueryFieldFilterConstraint, QueryLimitConstraint, QueryOrderByConstraint, QueryStartAtConstraint, Timestamp, 
    addDoc, arrayRemove, arrayUnion, collection, deleteDoc, doc, getDoc, getDocs, getFirestore, increment, limit, onSnapshot, orderBy, query, 
    runTransaction, setDoc, startAfter, updateDoc, where } from "firebase/firestore";

import {uniqueNamesGenerator, adjectives, colors, animals} from "unique-names-generator";
import { FirebaseError } from "firebase/app";

import {v4 as uuidv4 } from "uuid";


import {
    Comment,
    Community, Post, PostTypes, User, postTypesConst 
} from "./types";
import { resolvePath } from "../helpers";

import { deleteObject, getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { checkImageSelectedFile, handleError } from "../helpers/errors";
import { JoinType, VoteType } from "../constants/votes";



export const getDocumentData = async(path : string)=>{
    const docRef = doc(db, path);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
        return {id: docSnap.id , ...docSnap.data()};
    }else{
        return null;
    }
}

export const getPostData = async(postID: string) =>{
    const data =  await getDocumentData(resolvePath('posts', postID));
    if (data) {
        return data as Post
    }else{
        return null
    }
}
export const listenToDocument = (path: string, setValue: (val: unknown)=>void, 
         setError:(error: string)=>void
        )=>{
    const unsub = onSnapshot(doc(db, path), (doc) => {
       try { 
            if (doc.data()) {
                setValue({id:doc.id, ...doc.data()} )
            }else{
                setValue(null);
            }
       } catch (err: unknown) {
            if (err instanceof FirebaseError) {
                setError(err.code)
            }else if (err instanceof Error){
                setError(err.message)
            }else{
                setError('Something went wrong')
            }            
       }
    });
    return unsub;
}


export const getCollectionData = async(path: string, modifiers: QueryFieldFilterConstraint[])=>{
    const q = query(collection(db, path), ...modifiers);
    const data : Object[] = [];
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
        data.push({id: doc.id, ...doc.data()});
    });
    return data
}

export const getUserData = async(email: string | null)=>{
    if (email) {
        const data = await getDocumentData( resolvePath('users', email));
        return data as User; 
    }

}

export const checkIfUserExists = async (email: string)=>{
    const data = await getUserData(email)
    return !!data;
}

export const generateUsername = ()=>{
    const seed = new Date();
    const randomName = uniqueNamesGenerator({
        dictionaries: [adjectives, colors, animals],
        separator: '-',
        seed: seed.getTime()
    }); // big_red_donkey 
    return `${randomName}-${seed.getMilliseconds()}`;
}

export const userLoginViaGoogle = async()=>{
    const provider = new GoogleAuthProvider();
    const {user} = await signInWithPopup(auth, provider)
    const email = user?.email;
    if(email){
        const exists = await checkIfUserExists(email);
        if (!exists) {
            const docRef = doc(db, 'users', email);
            setDoc(docRef, {username: generateUsername(), createdAt: Timestamp.now()}) 
        }
    }
}

export const userLogout = async()=>{
    await signOut(auth);
 } 


 export const checkIfUsernameExists = async(userName: string)=>{
    const data = await getCollectionData("users",  [where('username', '==', userName)])
    return !!(data?.length > 0)
}



export const createUser = async({email, password, username}: 
        {email: string, password: string, username: string})=>{
    const uname = username.trim();
    //check if username exists
    const exists = await checkIfUserExists(uname);
    if (exists) {
        throw new Error('That username is already taken');
    } 
    
    await createUserWithEmailAndPassword(auth, email, password);
    const docRef = doc(db, 'users', email);
    setDoc(docRef, {username:uname, createdAt: Timestamp.now()}) 
}

export const userLogin = async({email, password}: {email: string, password: string})=>{
    await signInWithEmailAndPassword(auth, email, password);
}

export const listenToUserData = (email: string, setValue: (val: unknown)=>void, 
    setError: (err : string)=>void)=>{
    const path = `users/${email}`;
    const unsub = listenToDocument(path, setValue, setError);
    return unsub;
}

export const checkIfCommunityExists = async(communityID: string)=>{
    const data = await getDocumentData(resolvePath('community', communityID))
    return !!data;
}

export const createCommunity = async({name,communityType , isAdultContent}: Community)=>{
    const email = getAuth().currentUser?.email;
    if (!email) {
        throw new Error('Unauthentication Error');
    }
    // check if community already exists
    if (!name) {
        throw new Error('Invalid community name');
    }
    const flag = await checkIfCommunityExists(name);
    if (flag) {
        throw new Error('Community already exists');
    }

    const db= getFirestore();
    const docRef = doc(db, 'community', name);
    const data : Community = {
        createdAt : Timestamp.now(),
        name,
        communityType,
        isAdultContent,
        moderators: [email], 
    }
    await setDoc(docRef,data , { merge: true });
    await updateJoin(name , 'join');
}   

export const getCommunityData = (id: string)=>{
    const data = getDocumentData(resolvePath('community', id))
    return data;
}

export const listenToCommunityData = (id: string, setValue: (val: unknown)=>void, 
        setError: (err : string)=>void)=>{
    const path = `community/${id}`;
    const unsub = listenToDocument(path, setValue, setError);
    return unsub
}

export const updateJoin = async (communityID: string, type: JoinType )=>{
    //update members and community joined
    const userEmail = auth.currentUser?.email;
    if (!userEmail) {
        return;
    }
    await runTransaction(db, async (transaction) =>{

        const userRef = doc(db, resolvePath('users', userEmail));
        const userDoc = await transaction.get(userRef)
        if (!userDoc.exists()) {
            throw new Error("User does not exist!");
        }
        
        const communityRef = doc(db, resolvePath('community', communityID));
        const communityDoc = await transaction.get(communityRef);
        if (!communityDoc.exists()) {
            throw new Error("Community does not exist!");
        }

        const membersData = communityDoc.data().members || [];
        const communityJoinedData = (userDoc.data() as User).communityJoined || [];
        if (type == 'join') {
            transaction.update(userRef, { communityJoined: [...communityJoinedData, communityID]});
            transaction.update(communityRef, { members: [...membersData, userEmail]});
        }else{
            transaction.update(userRef, { communityJoined: communityJoinedData.filter((item: string)=>item!==communityID)});
            transaction.update(communityRef, { members: membersData.filter((item: string)=>item!==userEmail)});
        }
    })
}

export const getCommunities = async()=>{
    // , orderBy('name'), limit(6)
    const data = await getCollectionData('community', []);
    return data;
} 


export const deletePhoto = async(path: string)=>{
    try {
        if (!path) return;
        const photoRef = ref(storage, path);
        await  deleteObject(photoRef);
    } catch (error) {
        console.log(error);
    }
}
export const uploadPhoto = (
    {selectedFile , setProgressBar,setIsImgLoading, setImgURL , setSelectedFile}: {
        selectedFile: File | null,
        setProgressBar:  React.Dispatch<React.SetStateAction<number>>
        setIsImgLoading:  React.Dispatch<React.SetStateAction<boolean>>,
        setImgURL : React.Dispatch<React.SetStateAction<string>>,
        setSelectedFile: React.Dispatch<React.SetStateAction<File | null>>
    }
)=>{
    
    checkImageSelectedFile(selectedFile);
    if (!selectedFile) return;
     
    const path = `images/${uuidv4()}${selectedFile.name || ""}`;
    const storageRef = ref(storage, path);
    const uploadTask = uploadBytesResumable(storageRef, selectedFile);
    uploadTask.on(
        'state_changed',
        (snapshot)=>{
            //running
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            if (snapshot.state === 'running') {
                setProgressBar(progress);
                setIsImgLoading(true);
            }
        },
        async (error)=>{
            await deletePhoto(path);
            handleError(error)
        },
        async()=>{
            //sucess
            const url = await getDownloadURL(uploadTask.snapshot.ref);
            setImgURL(url)
            setIsImgLoading(false);
        }
    )
}

 
export const createPost = async ({
        communityID, postImage, postTitle, type, postBody, selectedTags, postLink}:{
            communityID: string,
            postImage: string,
            postTitle: string,
            type : PostTypes,
            postBody: string,
            selectedTags : string[],
            postLink : string 
    })=>{
        const email = getAuth().currentUser?.email
        if (!email) {return};
        if (type=== postTypesConst.COMMUNITY) {
            const flag = await checkIfCommunityExists(communityID);
            if (!flag) {
                throw new Error('Community does not exist');
            }
        }
        const colRef = collection(db, 'posts');
        const value : Post = {
            createdAt : Timestamp.now(),
            authorID: email,
            communityID,
            downvoteIDs: [],
            upvoteIDs: [email],
            postImage,
            postTitle,
            type,
            postBody,
            selectedTags,
            postLink,
        }
        await addDoc(colRef, value)

}

export const listenToRedditPost = ({postID, setPostData}: {
        postID: string, 
        setPostData: (data: Post | null)=>void
    })=>{
    const path = `posts/${postID}`;
    const unsub = onSnapshot(doc(db, path), (doc) => {
        try { 
             if (doc.data()) {
                setPostData({id:doc.id, ...doc.data()} as Post)
             }else{
                setPostData(null); 
             }
        } catch (err) {
            handleError(err)         
        }
     });
     return unsub;
}  

export const updateVote = async ({id, type, colName, errMsg}:{
    id: string, type: VoteType, colName: string, errMsg: string
})=>{
    const userEmail = getAuth().currentUser?.email;
    if (!userEmail) {
        return;
    }

    await runTransaction(db, async (transaction) => {
        const toUpdateRef = doc(db, `${colName}/${id}`)
        const toUpdateDoc = await transaction.get(toUpdateRef);
        if (!toUpdateDoc.exists()) {
            throw new Error(errMsg);
        }
        let upvoteData : string[] = toUpdateDoc.data().upvoteIDs || [];
        let downvoteData : string[] = toUpdateDoc.data().downvoteIDs || [];
        const upvote : VoteType = 'upvote';
        if (type === upvote) {
            if (downvoteData.includes(userEmail)) {
                downvoteData = downvoteData.filter(item => item !== userEmail);
            }
            if (upvoteData.includes(userEmail)) {
                upvoteData = upvoteData.filter(item => item !== userEmail);
            }else{
                upvoteData = [...upvoteData, userEmail];
            }
        }else {
            if (upvoteData.includes(userEmail)) {
                upvoteData = upvoteData.filter(item => item !== userEmail);
            }
            if (downvoteData.includes(userEmail)) {
                downvoteData = downvoteData.filter(item => item !== userEmail);
            }else{
                downvoteData = [...downvoteData, userEmail];
            }
        }
        transaction.update(toUpdateRef, { upvoteIDs: upvoteData, downvoteIDs : downvoteData });
    })
}

export const updateRedditPostVote = async ({type , postID}: {
    type: VoteType,
    postID ?: string 
})=>{
    const colName = 'posts';
    const errMsg = 'Post not found';
    postID && await updateVote({
        id: postID, 
        type, 
        colName, 
        errMsg
    })
}
export const updatePostCommentVote = async ({type , commentID}: {
    type: VoteType,
    commentID ?: string 
})=>{
    const colName = 'comments';
    const errMsg = 'Comment not found';
    commentID && await updateVote({
        id: commentID, 
        type, 
        colName, 
        errMsg
    })
}


type paginatorProps = {
        setHasMore : React.Dispatch<React.SetStateAction<boolean>>,
        setStartAfterDoc : React.Dispatch<React.SetStateAction< QueryDocumentSnapshot<DocumentData, DocumentData> | null|null>>,
        startAfterDoc : QueryDocumentSnapshot<DocumentData, DocumentData> | null,
        startPaginate : boolean,
        setStartPaginate :React.Dispatch<React.SetStateAction<boolean>>
};


export const getCommunityPosts = async( {
    communityID,
    paginator: { setHasMore, setStartAfterDoc, startAfterDoc,startPaginate, setStartPaginate}
}: {
    communityID: string,
    paginator : paginatorProps
} 
   )=>{
    const modifiers = [];
    //later modifier filter bt community joined
    modifiers.push(where('type', '==', postTypesConst.COMMUNITY));
    modifiers.push(where('communityID', '==', communityID));
    modifiers.push(orderBy('createdAt'));
    if (startAfterDoc) {
        modifiers.push(startAfter(startAfterDoc))
    }
    modifiers.push(limit(3));

    if (startPaginate) {
        const q = query(collection(db, 'posts'), ...modifiers);
        const data: Post[] = [];
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
            data.push({id: doc.id, ...doc.data()} as Post);
            setStartAfterDoc(querySnapshot.docs[querySnapshot.docs.length-1])
            setHasMore(querySnapshot.docs.length > 0)
            setStartPaginate(false)
        });
        return data
    }
}


export const getProfilePosts = async( {
    authorUname,
    paginator: { setHasMore, setStartAfterDoc, startAfterDoc,startPaginate, setStartPaginate}
}: {
    authorUname: string,
    paginator : paginatorProps
}  
   )=>{
    const userData= await getUserDataByUsername(authorUname);
    
    if (!userData) {
        return
    }
    const modifiers = [];
    //later modifier filter bt community joined
    modifiers.push(where('authorID', '==', userData.id));
    modifiers.push(orderBy('createdAt'));
    if (startAfterDoc) {
        modifiers.push(startAfter(startAfterDoc))
    }
    modifiers.push(limit(3));

    if (startPaginate) {
        const q = query(collection(db, 'posts'), ...modifiers);
        const data: Post[] = [];
        const queryDocs = await getDocs(q);
        queryDocs.forEach((doc) => {
            data.push({id: doc.id, ...doc.data()} as Post);
            setStartAfterDoc(queryDocs.docs[queryDocs.docs.length-1])
            setHasMore(queryDocs.docs.length > 0)
            setStartPaginate(false)
        });
        return data
    }
}

export const getDashboardPosts = async( {
    paginator: { setHasMore, setStartAfterDoc, startAfterDoc,startPaginate, setStartPaginate}
}: {
    paginator : paginatorProps
} 
   )=>{
    //get communities where 
    const email = getAuth().currentUser?.email;
    if (!email) {
        return
    }
    const userData= await getUserData(email);
    
    const modifiers = [];
    //later modifier filter by community joined
    if ((userData?.communityJoined || []).length === 0) {
       return;
    }
    modifiers.push(where('communityID', 'in', userData?.communityJoined));
    modifiers.push(where('type', '==', postTypesConst.COMMUNITY));
    modifiers.push(orderBy('createdAt'));
    if (startAfterDoc) {
        modifiers.push(startAfter(startAfterDoc))
    }
    modifiers.push(limit(3)); 

    if (startPaginate) {
        const q = query(collection(db, 'posts'), ...modifiers);
        const data: Post[] = [];
        const queryDocs = await getDocs(q);
        queryDocs.forEach((doc) => {
            data.push({id: doc.id, ...doc.data()} as Post);
            setStartAfterDoc(queryDocs.docs[queryDocs.docs.length-1])
            setHasMore(queryDocs.docs.length > 0)
            setStartPaginate(false)
        });
        return data
    }
}


export const addPostComment = async({content='', parent='', postID}: {
    content: string, parent ?:  string, postID : string
})=>{
    if (content === '') {
        return
    }
    const user = getAuth()?.currentUser;
    if (user?.email  && content) {
        //this should be transaction
        const colRef = collection(db, 'comments');
        const value : Comment = {
            createdAt: Timestamp.now(),
            commentBy : user.email,
            content, 
            parent, postID, 
            totalChild: 0,
            upvoteIDs : [user.email]
        } 
        await addDoc(colRef, value);
 
        const path = `posts/${postID}`;
        const postRef = doc(db, path);
        await updateDoc(postRef, {
            totalComments: increment(1)
        });
    }
}   

export const listenToPostChildrenComments = ({
    postID, setChildrenComments, limitMax, setHasMore, parent=''
}: {
    postID : string, 
    setChildrenComments :  React.Dispatch<React.SetStateAction<Comment[]>>,
    limitMax ?: number,
    setHasMore ?: React.Dispatch<React.SetStateAction<boolean>>, 
    parent ?: string
})=>{
    const path = `comments`;
 
    const modifiers = [];
    modifiers.push(where('parent', '==', parent));
    modifiers.push(where('postID', '==', postID));
    modifiers.push(orderBy('createdAt'));
    if (limitMax) {
        modifiers.push(limit(limitMax)); 
    };

    const db = getFirestore();
    const q = query(collection(db, path), ...modifiers);
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
        try {
            const data: Comment[] = [];
            querySnapshot.forEach((doc) => {
                const val = {id:doc.id, ...doc.data()} as Comment;
                data.push(val);
            });
            if (setHasMore && limitMax) {
                setHasMore(querySnapshot.docs.length >= limitMax)
            }
            setChildrenComments(data );
        } catch (error) {
            handleError(error);
        }
    });
    return unsubscribe
}

export const listenToCommentData = ({commentID, setCommentData}:{
    commentID: string, setCommentData:  React.Dispatch<React.SetStateAction<Comment | null>>
})=>{
    let unsub;
    if (commentID) {
        const path = `comments/${commentID}`;
        unsub = onSnapshot(doc(db, path), (doc) => {
            try { 
                if (doc.data()) {
                    setCommentData({id:doc.id, ...doc.data()} as Comment)
                }else{
                    setCommentData(null);
                }
            } catch (error) {
                 handleError(error)          
            }
         });
    }
    return unsub;
} 


export const deletePostComment = async({commentID, postID, commentBy}:{
    commentID: string, postID: string, commentBy: string
})=>{
    //need transaction here 
    //collectAllRefs then delete all at once via promise all
    //decrease totalComments via total number of promises
    const currentUser = auth.currentUser?.email;
    if ( !currentUser || currentUser !== commentBy) {
        throw new Error('Invalid Credentials')
    }

    const commentRef = doc(db, "comments", commentID);
    const refs = [commentRef];
    const f = async(parent: string)=>{
        const path = 'comments';
        const q = query(collection(db, path), 
            where('parent', '==', parent)
        );
        const querySnapshot = await getDocs(q);
        for (let index = 0; index < querySnapshot.docs.length; index++) {
            const doc = querySnapshot.docs[index];
            refs.push(doc.ref);
            await f(doc.id)
        }
    }
    await f(commentID)
    //decrease total comments
    const path = `posts/${postID}`;
    const postRef = doc(db, path);
    await updateDoc(postRef, {
        totalComments: increment(-refs.length)
    });
    //delete
    await Promise.all(refs.map(async(ref)=>{
        await deleteDoc(ref)
    }))
}

export const getUserDataByUsername =async(username: string)=>{
    const data = await getCollectionData('users', [where('username', '==', username)]);
    if (data?.length === 1) return data[0] as User;
    return null;
}


export const listenToProfileDataByUsername = ({profileUsername, setValue}: {
    profileUsername ?: string,
    setValue : (val: User | null)=>void
})=>{
    if (!profileUsername) {
        return
    }
    const path = `users`;
    const modifier = where('username', '==', profileUsername);
    const db = getFirestore();
    const q = query(collection(db, path), modifier);
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
        try {
            const data : User[] = [];
            querySnapshot.forEach((doc) => {
                data.push({id:doc.id, ...doc.data()} as User);
            });
            if (data.length > 1) {
                throw new Error('Duplicate usernames!')
            }
            setValue(data.length === 1? data[0]: null);
        } catch (error) {
            handleError(error)
        }
    });
    return unsubscribe 
}

export const updateProfilePic = async({selectedFile, setBtnDisabled, setSelectedFile}:{
    selectedFile : File | null,
    setBtnDisabled: React.Dispatch<React.SetStateAction<boolean>>,
    setSelectedFile: React.Dispatch<React.SetStateAction<File | null>>
})=>{
    
    const email = auth.currentUser?.email
    if (!email) {
        throw new Error('Unauthorized Error');
    }
    checkImageSelectedFile(selectedFile);

    if (!selectedFile) return;
    const path = `images/${uuidv4()}${selectedFile.name || ""}`;
    const storageRef = ref(storage, path);
    const uploadTask = uploadBytesResumable(storageRef, selectedFile);

    uploadTask.on(
        'state_changed',
        (snapshot)=>{
            //running
            if (snapshot.state === 'running') {
                setBtnDisabled(true);
            }
        },
        async (error)=>{
            await deletePhoto(path);
            setSelectedFile(null)
            handleError(error)
        },
        async()=>{
            //sucess
            try {
                const url = await getDownloadURL(uploadTask.snapshot.ref);
                const userRef = doc(db, "users", email);
                await updateDoc(userRef, {
                    display_pic: url
                });
            } catch (error) {
                handleError(error);
            }
            setSelectedFile(null);
            setBtnDisabled(false);
        }
    )
}

export const updateFollowUser = async(targetUserID: string)=>{
    const user = auth.currentUser;
    if (!user || !user?.email) {
        throw new Error('Unauthorized Error');
    }

    const userID = user.email;
    const userRef = doc(db, "users", userID);
    const userData = await getUserData(userID);
    if (!userData) {
        throw new Error("User does not exists!");
    }
    const targetUserRef = doc(db, 'users', targetUserID);
    if (userData.following && userData.following.includes(targetUserID)) {
        await updateDoc(userRef, {
            following: arrayRemove(targetUserID)
        });
        await updateDoc(targetUserRef, {
            followers : arrayRemove(userID)
        }) 
    }else{
        await updateDoc(userRef, {
            following:  arrayUnion(targetUserID)
        });
        await updateDoc(targetUserRef, {
            followers : arrayUnion(userID)
        })
    }

}

export const getSuggestedCommunities = async()=>{
    const email = getAuth().currentUser?.email;
    const userData = email? await getUserData(email): null;
    const joinedCommunities = userData? userData.communityJoined : [];

    const modifiers = [];
    modifiers.push(orderBy('name'));
    if (joinedCommunities && joinedCommunities.length > 0) {
        modifiers.push(where('name', 'not-in', joinedCommunities));
    }
   
    modifiers.push(limit(3));

    const q = query(collection(db, 'community'), ...modifiers);
    const data : Community[] = [];
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
        const val = {id: doc.id, ...doc.data()} as Community;
        data.push(val);
    });
    return data
}

export const getModeratedCommunities = async()=>{
    const email = getAuth().currentUser?.email;

    const modifiers = [];

    modifiers.push(orderBy('moderators'));
    modifiers.push(where('moderators', 'array-contains', email) )

    const q = query(collection(db, 'community'), ...modifiers);
    const data : Community[] = [];
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
        const val = {id: doc.id, ...doc.data()} as Community;
        data.push(val);
    });
    return data
}

export const checkIfModerator = async (communityID: string)=>{
    const email = getAuth().currentUser?.email;
    if (!email) {
        throw new Error("Unauthentication Error");
    }

    const comData = await getCommunityData(communityID) as Community;
    return !!comData.moderators?.includes(email)

}

export const checkIfAuthor = async(postID: string)=>{
    const email = getAuth().currentUser?.email;
    if (!email) {
        throw new Error("Unauthentication Error");
    }
    const postData = await getPostData(postID);
    
    return !!(postData?.authorID=== email)
}

export const updateCommunityDesc = async({description, communityID}: 
    {description: string, communityID: string})=>{

    //check email
    //check if moderator
    //updateDoc

    const email = getAuth().currentUser?.email;
    if (!email) {
        throw new Error("Unauthentication Error");
    }

    const isMod = await checkIfModerator(communityID);
    if (!isMod) {
        throw new Error('Invalid credentials');
    }

    const communityRef = doc(db, "community", communityID);
    
    await updateDoc(communityRef, {
        description
    });

}


export const updateCommunityPic = async({communityID, selectedFile, setBtnDisabled, setSelectedFile}:{
    communityID: string,
    selectedFile : File | null,
    setBtnDisabled: React.Dispatch<React.SetStateAction<boolean>>,
    setSelectedFile: React.Dispatch<React.SetStateAction<File | null>>
})=>{
    //check if mod
    const isMod = await checkIfModerator(communityID);
    if (!isMod) {
        throw new Error('Invalid credentials');
    }
    checkImageSelectedFile(selectedFile);

    if (!selectedFile) return;
    const path = `images/${uuidv4()}${selectedFile.name || ""}`;
    const storageRef = ref(storage, path);
    const uploadTask = uploadBytesResumable(storageRef, selectedFile);

    uploadTask.on(
        'state_changed',
        (snapshot)=>{
            //running
            if (snapshot.state === 'running') {
                setBtnDisabled(true);
            }
        },
        async (error)=>{
            await deletePhoto(path);
            setSelectedFile(null)
            handleError(error)
        },
        async()=>{
            //sucess
            try {
                const url = await getDownloadURL(uploadTask.snapshot.ref);
                const communityRefRef = doc(db, "community", communityID);
                await updateDoc(communityRefRef, {
                    dp: url
                });
            } catch (error) {
                handleError(error);
            }
            setSelectedFile(null);
            setBtnDisabled(false);
        }
    )
}

export const deleteCommunityPost = async({communityID, postID}: {
    communityID: string, postID: string
})=>{
    //check if is mod in community or email author of post
    //delete post

    const email = getAuth().currentUser?.email;
    if (!email) {
        throw new Error("Invalid Credentials: Login")
    }

    const isMod = await checkIfModerator(communityID);
    const isAuthor = await checkIfAuthor(postID);
    
    if (!isMod && !isAuthor) {
        throw new Error('Invalid credentials: Author/Mods');
    }

    await deleteDoc(doc(db, "posts", postID));

}