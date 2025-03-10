import { ID } from "appwrite";
import { INewPost, INewUser, IUpdatePost } from "../types";
import { account, appwriteConfig, avatars, databases, storage } from "./config";
import { Query } from "appwrite";
export async function createUserAccount(user: INewUser) {
  try {
    const newAccount = await account.create(
      ID.unique(),
      user.email,
      user.password,
      user.name
    );
    if (!newAccount) throw Error("Account not created");

    const avatarUrl = avatars.getInitials(user.name);

     await saveUserToDB({
      accountId: newAccount.$id,
      email: user.email,
      name: user.name,
      username: user.username,
      imageUrl: avatarUrl,
    });
    return newAccount;
  } catch (error) {
    console.log(error);
    return error;
  }
}

export async function saveUserToDB(user: {
  accountId: string;
  email: string;
  name: string;
  imageUrl: string;
  username?: string;
}) {
  try {
    const newUser = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      ID.unique(),
      user
    );
    return newUser;
  } catch (error) {
    console.log(error);
  }
}

export async function signInAccount(user: { email: string; password: string }) {
  try {
    const session = await account.createEmailPasswordSession(
      user.email,
      user.password
    );
    return session;
  } catch (error) {
    console.log(error);
  }
}

export async function getCurrentUser() {
  try {
    const currentAccount = await account.get();

    if (!currentAccount) {
      throw Error;
    }

    const currentUser = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      [Query.equal("accountId", currentAccount.$id)]
    );
    return currentUser.documents[0];
  } catch (error) {
    console.log(error);
  }
}
export async function signOutAccount() {
  try {
    const session = await account.deleteSession("current");

    return session;
  } catch (error) {
    console.log(error);
  }
}
export async function createPost(post: INewPost) {
  try {
    // Upload image
    const uploadedFile = await uploadFile(post.file[0]);
    if (!uploadedFile) throw new Error("File upload failed");

    // Get file preview URL
    const fileUrl = await getFilePreview(uploadedFile.$id);
    if (!fileUrl || typeof fileUrl !== 'string' || fileUrl.length > 2000) {
      await deleteFile(uploadedFile.$id);
      throw new Error("Invalid file URL");
    }

    // Parse tags into array
    const tags = post.tags?.split(",").map(tag => tag.trim()).filter(Boolean) || [];

    // Save post in database
    const newPost = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.postCollectionId,
      ID.unique(),
      {
        caption: post.caption,
        location: post.location,
        tags,
        creator: post.userId,
        imageUrl: fileUrl,
        imageId: uploadedFile.$id,
      }
    );

    if (!newPost) {
      await deleteFile(uploadedFile.$id);
      throw new Error("Post creation failed");
    }

    return newPost;
  } catch (error) {
    console.error("Error in createPost:", error);
    throw error; // Optionally rethrow the error for higher-level handling
  }
}

export async function uploadFile(file: File) {
  try {
    const uploadFile = await storage.createFile(
      appwriteConfig.storageId,
      ID.unique(),
      file
    );
    return uploadFile;
  } catch (error) {
    console.log(error);
  }
}
export async function getFilePreview(fileId: string) {
  try {
    const fileUrl = storage.getFilePreview(
      appwriteConfig.storageId,
      fileId,
      2000,
      2000,
      undefined,
      100
    );
    if (!fileUrl) throw Error;

    return fileUrl;
  } catch (error) {
    console.log(error);
  }
}

export async function deleteFile(fileId: string) {
  try {
    await storage.deleteFile(appwriteConfig.storageId, fileId);

    return { status: "ok" };
  } catch (error) {
    console.log(error);
  }
}

export async function getRecentPosts(){
  const posts = await databases.listDocuments(
    appwriteConfig.databaseId,
    appwriteConfig.postCollectionId,
    [Query.orderDesc(`$createdAt`), Query.limit(20)]
  )
  if(!posts) throw Error;
  return posts;
}

export async function likePost(postId:string, likesArray:string[]){
  try {
    const updatedPost = await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.postCollectionId,
      postId,
      {
        likes: likesArray
      }
    )
    if(!updatedPost) throw Error;
    return updatedPost
  } catch (error) {
    console.log(error)
  }
}


export async function savePost(userId: string, postId: string) {
  try {
    const updatedPost = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.savesCollectionId,
      ID.unique(),
      {
        user: userId,
        post: postId,
      }
    );

    if (!updatedPost) throw Error;

    return updatedPost;
  } catch (error) {
    console.log(error);
  }
}
export async function deleteSavedPost(savedRecordId:string){
  try {
    const statusCode = await databases.deleteDocument(
      appwriteConfig.databaseId,
      appwriteConfig.savesCollectionId,
      savedRecordId,
    )
    if(!statusCode) throw Error;
    return statusCode
  } catch (error) {
    console.log(error)
  }
}

export async function getPostById(postId: string){
  try {
    const post = await  databases.getDocument(
      appwriteConfig.databaseId,
      appwriteConfig.postCollectionId,
      postId
    )
    return post
  } catch (error) {
    console.log(error)
  }
}

export async function UpdatePost(post: IUpdatePost) {
  const hasFileUpdate = post.file && post.file.length > 0;

  try {
    // Initialize image data
    let image = {
      imageUrl: post.imageUrl,
      imageId: post.imageId,
    };

    // Handle file upload if file is updated
    if (hasFileUpdate) {
      const uploadedFile = await uploadFile(post?.file[0]);
      if (!uploadedFile) throw new Error("File upload failed");

      const fileUrl = await getFilePreview(uploadedFile.$id);
      if (!fileUrl || typeof fileUrl !== "string" || fileUrl.length > 2000) {
        await deleteFile(uploadedFile.$id);
        throw new Error("Invalid file URL");
      }

      // Update image data with new file details
      image = {
        imageUrl: fileUrl,
        imageId: uploadedFile.$id,
      };
    }

    // Parse tags into an array
    const tags =
      post.tags?.split(",").map((tag) => tag.trim()).filter(Boolean) || [];

    // Update post in the database
    const updatedPost = await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.postCollectionId,
      post.postId,
      {
        caption: post.caption,
        location: post.location,
        tags,
        imageUrl: image.imageUrl,
        imageId: image.imageId,
      }
    );

    if (!updatedPost) {
      if (hasFileUpdate) await deleteFile(image.imageId);
      throw new Error("Post update failed");
    }

    return updatedPost;
  } catch (error) {
    console.error("Error in UpdatePost:", error);
    throw error;
  }
}

export async function deletePost(postId:string, imageId: string){
  if(!postId || !imageId) throw Error;

  try {
    await databases.deleteDocument(
      appwriteConfig.databaseId,
      appwriteConfig.postCollectionId,
      postId
    )
    return {status: 'ok'}
  } catch (error) {
    console.log(error)
  }
}




export async function getInfinitePosts({ pageParam }: { pageParam: number }) {
  const queries: any[] = [Query.orderDesc("$updatedAt"), Query.limit(9)];

  if (pageParam) {
    queries.push(Query.cursorAfter(pageParam.toString()));
  }

  try {
    const posts = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.postCollectionId,
      queries
    );

    if (!posts) throw Error;

    return posts;
  } catch (error) {
    console.log(error);
  }
}



export async function getSearchPosts(searchTerm: string) {
  try {
    const posts = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.postCollectionId,
      [Query.search("caption", searchTerm)]
    );

    if (!posts) {
      throw new Error("No posts found");
    }

    return posts;
  } catch (error) {
    console.error("Error fetching search posts:", error);
    return { documents: [] }; // Fallback to prevent undefined
  }
  
}


export async function getUserPosts(
  userId?: string,
  limit = 10,
  pageParam?: string
) {
  if (!userId) return;

  const queries = [
    Query.equal("creator", userId),
    Query.orderDesc("$createdAt"),
    Query.limit(limit),
  ];

  if (pageParam) {
    queries.push(Query.cursorAfter(pageParam));
  }

  try {
    const post = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.postCollectionId,
      queries
    );

    return {
      documents: post.documents, // ✅ Ensure correct return key (not "document")
      nextPage: post.documents.length ? post.documents.slice(-1)[0]?.$id : null, // ✅ Avoid hardcoded index
    };
  } catch (error) {
    console.error("Error fetching user posts:", error);
    return { documents: [], nextPage: null }; // ✅ Prevent undefined errors
  }
}

export async function getUsers(limit?: number) {
  const queries: any[] = [Query.orderDesc("$createdAt")];

  if (limit) {
    queries.push(Query.limit(limit));
  }

  try {
    const users = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      queries
    );

    if (!users) throw Error;

    return users;
  } catch (error) {
    console.log(error);
  }
}
