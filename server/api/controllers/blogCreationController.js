const parseRequestFiles = require("../../fileUpload/requestedfile");
const blogServices = require("../services/bolgCreationService");
const cookieParser = require("cookie-parser");

const createBlog = async (req, res) => {
  try {
    let data;
    let files = {};

    // For multipart/form-data (file upload) requests, parse with formidable.
    // For JSON/urlencoded requests the body is already parsed by body-parser,
    // so reading req directly avoids the drained-stream conflict.
    if (req.is("multipart/form-data")) {
      const payload = await parseRequestFiles(req);
      data = {};
      for (const [key, value] of Object.entries(payload.fields)) {
        data[key] = Array.isArray(value) ? value[0] : value;
      }
      files = payload.files;
    } else {
      data = req.body;
    }

    console.log(data, "controllData");
    const blogResponse = await blogServices.blogCreation(data, files);
    res.status(201).json(blogResponse);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to create blog" });
  }
};

// const postViewCreate = async(req,res)=>{
//     const blogId = req.params.id;
//     // const viewId = req.body.ip;

//     try {
//         const existingId = await blogServices.blogView(blogId);
//         res.status(201).json(existingId);
//     } catch (error) {
//         console.log(error);

//     }
// }
const postViewCreate = async (req, res) => {
  const postId = req.params.id;

  const userViews = req.cookies.userViews || {};

  if (userViews[postId]) {
    return res.status(200).json({ message: "Blog already viewed" });
  }

  try {
    const updatedViews = await blogServices.blogView(postId);

    userViews[postId] = true;
    //   res.cookie('userViews', userViews, { maxAge: 24 * 60 * 60 * 1000, httpOnly: true }); // Cookie expires in 1 day

    res.cookie("userViews", userViews, { httpOnly: true });

    res
      .status(200)
      .json({ message: "Blog view count updated", views: updatedViews });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

const getAllBlog = async (req, res) => {
  try {
    const getAllReponse = await blogServices.getblogData();
    res.status(200).json(getAllReponse);
  } catch (error) {
    console.log(error);
  }
};

const getAllBlogByOrganization = async (req, res) => {
  try {
    const getAllReponse = await blogServices.getblogDataByOrganization(
      req.params.id
    );
    res.status(200).json(getAllReponse);
  } catch (error) {
    console.log(error);
  }
};

const blogsIdData = async (req, res) => {
  const { id } = req.params;
  try {
    const blogResponse = await blogServices.getIdBlog(id);
    res.status(200).json(blogResponse);
  } catch (error) {
    console.log(error);
  }
};

const blogUpdate = async (req, res) => {
  const { id } = req.params;
  try {
    let data;
    let files = {};

    if (req.is("multipart/form-data")) {
      const payload = await parseRequestFiles(req);
      data = {};
      for (const [key, value] of Object.entries(payload.fields)) {
        data[key] = Array.isArray(value) ? value[0] : value;
      }
      files = payload.files;
    } else {
      data = req.body;
    }

    console.log(data, "controllData");
    const updateRes = await blogServices.updateBlog(id, data, files);
    res.status(200).json(updateRes);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to update blog" });
  }
};

const blogDelete = async (req, res) => {
  const { id } = req.params;
  try {
    const deleteRes = await blogServices.deleteBlog(id);
    res.status(204).json(deleteRes);
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  createBlog,
  getAllBlog,
  blogsIdData,
  blogUpdate,
  blogDelete,
  postViewCreate,
  getAllBlogByOrganization
};
