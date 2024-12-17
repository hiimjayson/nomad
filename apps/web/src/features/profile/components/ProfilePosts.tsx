export function ProfilePosts() {
  return (
    <div className="w-full grid grid-cols-3 gap-1">
      <PostCard />
      <PostCard />
      <PostCard />
      <PostCard />
      <PostCard />
      <PostCard />
      <PostCard />
      <PostCard />
      <PostCard />
      <PostCard />
      <PostCard />
      <PostCard />
      <PostCard />
      <PostCard />
      <PostCard />
    </div>
  );
}

function PostCard() {
  return <div className="bg-gray-800 " style={{ aspectRatio: 1 }}></div>;
}
