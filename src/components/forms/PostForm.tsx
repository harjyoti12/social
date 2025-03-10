import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import FileUploader from "../shared/FileUploader";
import { Input } from "../ui/input";
import { PostValidation } from "@/lib/validation";
import { Models } from "appwrite";
import { useUserContext } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { useCreatePostMutation, useUpdatePost } from "@/lib/react_query/queriesAndMutation";

type PostFormProps = {
  post?: Models.Document;
  action: "Create" | "Update";
};
const PostForm = ({ post, action }: PostFormProps) => {
  const { mutateAsync: createPost, isPending: isLoadingCreate } = useCreatePostMutation();
  const { mutateAsync: updatePost, isPending: isLoadingUpdate } = useUpdatePost();
  const { user } = useUserContext();
  const { toast } = useToast();
  const navigate = useNavigate();

  const form = useForm<z.infer<typeof PostValidation>>({
    resolver: zodResolver(PostValidation),
    defaultValues: {
      caption: post?.caption || "",
      file: post?.file || [],
      location: post?.location || "",
      tags: post?.tags?.join(", ") || "",
    },
  });



  async function onSubmit(values: z.infer<typeof PostValidation>) {
    try {
      if (post && action === "Update") {
        const payload = {
          ...values,
          postId: post.$id,
          imageId: post.imageId,
          imageUrl: post.imageUrl,
        };
        console.log("Update payload:", payload);
  
        const updatedPost = await updatePost(payload);
        if (!updatedPost) throw new Error("Failed to update post");
  
        toast({ title: "Post updated successfully!" });
        return navigate(`/posts/${post.$id}`);
      }
  
      const newPost = await createPost({
        ...values,
        userId: user.id,
      });
      if (!newPost) throw new Error("Failed to create post");
  
      toast({ title: "Post created successfully!" });
      navigate("/");
    } catch (error) {
      console.error("Error in onSubmit:", error);
      toast({
        title: "An error occurred",
        description: error.message || "Please try again",
        variant: "destructive",
      });
    }
  }
  
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-9 w-full max-w-5xl"
      >
        <FormField
          control={form.control}
          name="caption"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="shad-form_label">Caption</FormLabel>
              <FormControl>
                <Textarea
                  className="shad-textarea custom-scrollbar"
                  placeholder="Write your caption here"
                  {...field}
                />
              </FormControl>
              <FormMessage className="shad-form_message" />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="file"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="shad-form_label">Add Image</FormLabel>
              <FormControl>
                <FileUploader
                  fieldChange={field.onChange}
                  mediaUrl={post?.imageUrl}
                />
              </FormControl>
              <FormMessage className="shad-form_message" />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="shad-form_label">Add Location</FormLabel>
              <FormControl>
                <Input type="text" className="shad-input" {...field} />
              </FormControl>
              <FormMessage className="shad-form_message" />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="tags"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="shad-form_label">Add Tags (comma-separated)</FormLabel>
              <FormControl>
                <Input
                  type="text"
                  className="shad-input"
                  placeholder="Art, Expression, Learn"
                  {...field}
                />
              </FormControl>
              <FormMessage className="shad-form_message" />
            </FormItem>
          )}
        />
        <div className="flex gap-4 items-center justify-end">
          <Button
            type="button"
            className="shad-button_dark_4"
            onClick={() => navigate(-1)}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={isLoadingUpdate || isLoadingCreate}
            className="shad-button_primary whitespace-nowrap"
          >
            {isLoadingCreate || isLoadingUpdate ? "LOADING...." : `${action} Post`}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default PostForm;
