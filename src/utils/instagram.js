// @format
export const normalizeInsProfileData = data => ({
  id: data?.id,
  username: data?.username,
  profilePic: data?.profile_pic_url,
  profilePicHd: data?.profile_pic_url_hd,
  isPrivate: data?.is_private,
  isVerified: data?.is_verified,
  fullName: data?.full_name,
  followerCount: data?.edge_followed_by?.count ?? 0,
  followingCount: data?.edge_follow?.count ?? 0,
  postCount: data?.edge_owner_to_timeline_media?.count ?? 0,
  biography: data?.biography,
  phoneNumber: data?.phone_number,
  email: data?.email,
});

export const normalizeInsPostsData = data =>
  data?.user?.edge_owner_to_timeline_media?.edges.map(d => ({
    id: d?.node?.id,
    thumbnailSrc: d?.node?.thumbnail_src,
    isVideo: d?.node?.is_video,
    likeCount: d?.node?.edge_media_preview_like?.count,
  }));
