import React from "react";

function ProfilePage() {
  return (
    <div className="flex flex-col items-center p-5">
      <div className="flex items-center mb-5">
        <img
          src="/images/profile-pic.jpg"
          alt="Profile"
          className="w-24 h-24 rounded-full mr-5"
        />
        <div className="flex flex-col">
          <h2 className="text-white text-xl">사용자 이름</h2>
          <p className="text-gray-400">게시물 6, 팔로워 6, 팔로잉 6</p>
        </div>
      </div>
      <div className="w-full">
        <div className="grid grid-cols-3 gap-2">
          {/* 각 게시물은 이곳에 추가 */}
          <div className="bg-gray-800 h-40"></div>
          <div className="bg-gray-800 h-40"></div>
          <div className="bg-gray-800 h-40"></div>
          {/* 추가 게시물 */}
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;
