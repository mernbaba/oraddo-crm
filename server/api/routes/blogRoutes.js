const express = require("express");
const routes = express.Router();
const blogController = require("../controllers/blogCreationController");

routes.post('/blogsCreation',blogController.createBlog);
routes.post('/postView/:id',blogController.postViewCreate)
routes.get('/blogsCreation',blogController.getAllBlog);
routes.get('/blogsCreationByorganisation/:id',blogController.getAllBlogByOrganization)
routes.put('/updateBlogData/:id',blogController.blogUpdate);
routes.get('/blogsCreation/:id',blogController.blogsIdData);
routes.delete('/blogDelete/:id',blogController.blogDelete);

module.exports = routes;