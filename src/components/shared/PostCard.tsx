import { useUserContext } from "@/context/AuthContext";
import { formatDateString } from "@/lib/utils";
import { Models } from "appwrite";
import { Link } from "react-router-dom";
import PostStatus from "./PostStatus";
type PostCardProps = {
  post: Models.Document;
};
const PostCard = ({ post }: PostCardProps) => {
  const { user } = useUserContext();
  if (!post) return null;
  return (
    <div className="post-card">
      <div className="flex-between">
        <div className="flex items-center gap-3">
          <Link to={`/profile/${post.creator.$id}`}>
            <img
              className="rounded-full w-12 lg:h-12"
              src={
                post?.creator?.imageUrl || "/public/assets/images/profile.png"
              }
              alt="creator"
            />
          </Link>
          <div className="flex flex-col">
            <p className="base-medium lg:body-bold text-light-1">
              {post?.creator?.name}
            </p>
            <div className="flex-center gap-2 text-light-3">
              <p className="subtle-semibold lg:small-regular">
                {formatDateString(post.$createdAt)}
              </p>
              -
              <p className="subtle-semibold lg:small-regular">
                {post.location}
              </p>
            </div>
          </div>
        </div>
        <Link
          className={`${user.id !== post.creator.$id && "hidden"}`}
          to={`/update-post/${post.$id}`}
        >
          <img
            src="/public/assets/icons/edit.svg"
            alt="edit"
            width={20}
            height={20}
          />
        </Link>
      </div>
      <Link to={`/posts/${post.$id}`}>
      <div className="small-medium lg:base-medium py-5">
        <p>{post.caption}</p>
        <ul className="flex gap-1 mt-2">
            {post.tags.map((tag:string)=>(
                <li key={tag} className="text-light-3">
                    #{tag}
                </li>
            ))}
        </ul>
      </div>
      <img src={post.imageUrl || '/assets/icons/placeholder.png'} alt="profile-pic" className="post-card_img object-top"/>
      </Link>
      <PostStatus post={post} userId={user.id} />
    </div>
  );
};

export default PostCard;
