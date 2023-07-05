import { useSession } from "next-auth/react";
import { Button } from "./Button";
import { ProfileImage } from "./ProfileImage";
import { useCallback, useLayoutEffect, useRef, useState } from "react";
import type { FormEvent } from "react";
import { api } from "~/utils/api";

function updateTextAreaSize(textArea?: HTMLTextAreaElement) {
  if (!textArea) return;
  textArea.style.height = "0px";
  textArea.style.height = `${textArea.scrollHeight}px`;
}

export function NewPostForm() {
  const session = useSession();
  if (session.status !== "authenticated") return null;

  return <Form />;
}

function Form() {
  const session = useSession();
  const [inputValue, setInputValue] = useState("");
  const textAreaRef = useRef<HTMLTextAreaElement>();
  const inputRef = useCallback((textArea: HTMLTextAreaElement) => {
    updateTextAreaSize(textArea);
    textAreaRef.current = textArea;
  }, []);

  const trcpUtils = api.useContext();

  useLayoutEffect(() => {
    updateTextAreaSize(textAreaRef.current);
  }, [inputValue]);

  const createPost = api.post.create.useMutation({
    onSuccess: (newPost) => {
      setInputValue("");

      if (session.status !== "authenticated") return;

      trcpUtils.post.infiniteFeed.setInfiniteData({}, (oldData) => {
        if (oldData == null || oldData.pages[0] == null) return;

        const newCachedPost = {
          ...newPost,
          likeCount: 0,
          likedByMe: false,
          user: {
            id: session.data.user.id,
            name: session.data.user.name || null,
            image: session.data.user.image || null,
          },
        };

        return {
          ...oldData,
          pages: [
            {
              ...oldData.pages[0],
              data: [newCachedPost, ...oldData.pages[0].data],
            },
            ...oldData.pages.slice(1),
          ],
        };
      });
    },
  });

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    createPost.mutate({ content: inputValue });
  }

  if (session.status !== "authenticated") return null;

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-2 border-b border-dashed border-blue-600 px-4 py-2"
    >
      <div className="flex gap-4">
        <ProfileImage src={session.data.user.image} />
        <textarea
          ref={inputRef}
          style={{ height: 0 }}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          className="flex-grow resize-none overflow-hidden p-4 text-xl outline-none"
          placeholder="What's up?"
        />
      </div>
      <Button className="self-end">POST</Button>
    </form>
  );
}
