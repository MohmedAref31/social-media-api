import asyncHandler from "express-async-handler";
import User from "../models/user.model.js";
import { ApiError } from "../utiles/errorClass.js";
import redisClient from "../config/redisClient.config.js";
import { resFormat } from "../utiles/responseFormat.utiles.js";
import Post from "../models/post.model.js";

const searchUsers = async (q) => {
  const regEx = new RegExp(`^.*${q}.*$`, "i");
  return User.find({ $text: { $search: regEx } });
};
const searchPosts = async (q) => {
  return Post.find({ content: { $regex: q, $options: "i" } }).populate(
    "user",
    "firstName lastName profileImage"
  );
};

const paginate = (docs, page, limit, skip) => {
  const result = docs.slice(skip, skip + limit);
  return {
    currentPage: +page,
    totalPages: Math.ceil(docs.length / limit),
    data: result,
  };
};
export const search = asyncHandler(async (req, res, next) => {
  const { q, t } = req.query;
  let page = req.query.page || 1;
  let limit = req.query.limit || 10;
  let skip = (page - 1) * limit;

  if (!q)
    return next(new ApiError("please provide a search query", "fail", 400));

  let cacheKey = `${q}-${t}`;

  const cachedSearch = await redisClient.get(cacheKey);

  if (cachedSearch)
    return res.json(
      resFormat("", "", paginate(JSON.parse(cachedSearch), page, limit, skip))
    );

  let searchResult;

  if (t === "u") {
    searchResult = await searchUsers(q);
  } else {
    searchResult = await searchPosts(q);
  }
  redisClient.setEx(cacheKey, 10, JSON.stringify(searchResult));
  let paginatedData = paginate(searchResult, page, limit, skip);
  res.json(resFormat("", "", paginatedData));
});
