const blogModelDb = require("../models/blogCreation");
const uploadFile = require("../../fileUpload/fileupload");
const Emp_onboarding = require("../models/Emp_onboarding");

const uploadfiles = async (files) => {
  console.log(files, "helloWorld");

  const uploadpromises = files.map((file) => uploadFile(file));
  try {
    const result = await Promise.all(uploadpromises);
    const uploadedData = {
      imageUrl: result[0].success ? result[0].url : null,
    };
    return uploadedData;
  } catch (err) {
    console.log(err, "ghjgvhjv");
    throw new Error("Image Upload Failed");
  }
};

const blogCreation = async (data, files) => {
  console.log(data, "services data");
  console.log(files, "allllfiles");

  try {
    if (files?.imageUrl?.length > 0) {
      const UploadData = await uploadfiles([files.imageUrl[0]]);
      console.log(UploadData, "jhdbhmn");
      data.imageUrl = UploadData.imageUrl;
    }
    const createResponse = await blogModelDb.create(data);
    return createResponse;
  } catch (error) {
    console.log(error);
  }
};

// const blogView = async (postId) => {
//   try {
//     const blog = await blogModelDb.findByPk(postId);

//     if (!blog) {
//       return res.status(404).json({ message: 'Blog not found' });
//     }
//     blog.views = blog.views + 1;
//     await blog.save();

//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Server error' });
//   }
// };

const blogView = async (postId) => {
  console.log(postId, "bloggggId");

  try {
    const blog = await blogModelDb.findByPk(postId);

    if (!blog) {
      throw new Error("Blog not found");
    }
    blog.views = blog.views + 1;
    await blog.save();
    return blog.views;
  } catch (error) {
    console.error(error);
    throw new Error("Server error");
  }
};

const getblogData = async () => {
  try {
    const getResponse = await blogModelDb.findAll({
      include: [
        {
          model: Emp_onboarding,
          as: "employeeOnId",
        },
      ],
    });
    return getResponse;
  } catch (error) {
    console.log(error);
  }
};

const getblogDataByOrganization = async (id) => {
  try {
    const getResponse = await blogModelDb.findAll({
      where: { organizationID: id },
      include: [
        {
          model: Emp_onboarding,
          as: "employeeOnId",
        },
      ],
    });
    return getResponse;
  } catch (error) {
    console.log(error);
  }
};

const getIdBlog = async (id) => {
  try {
    const idResponse = blogModelDb.findByPk(id, {
      include: [
        {
          model: Emp_onboarding,
          as: "employeeOnId",
        },
      ],
    });
    return idResponse;
  } catch (error) {
    console.log(error);
  }
};

const updateBlog = async (id, data, files) => {
  try {
    if (files?.imageUrl?.length > 0) {
      const UploadData = await uploadfiles([files.imageUrl[0]]);
      console.log(UploadData, "jhdbhmn");
      data.imageUrl = UploadData.imageUrl;
    }
    const updateResponse = await blogModelDb.update(data, {
      where: { id: id },
    });
    return updateResponse;
  } catch (error) {
    console.log(error);
  }
};

const deleteBlog = async (id) => {
  try {
    const deleteResponse = await blogModelDb.destroy({
      where: { id: id },
    });
    return deleteResponse;
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  blogCreation,
  getblogData,
  getIdBlog,
  updateBlog,
  deleteBlog,
  blogView,
  getblogDataByOrganization
};
