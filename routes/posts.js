const express = require("express");
const router = express.Router();
const prisma = require("../prisma");
router.get("/", async (req, res) => {
  try {
    const allPosts = await fetchAndSortPosts(prisma);

    res.render("allPosts", { title: "All the Posts", posts: allPosts });
  } catch (error) {
    console.error("Error fetching posts:", error);
    res.json("Server Error");
  }
});

router.get("/create", async (req, res) => {
  res.render("newPost", { title: "Create new post" });
});
router.post("/create", async (req, res) => {
  try {
    const { title, content } = req.body;
    const authorId = req.user.id;

    const newPost = await prisma.post.create({
      data: {
        title,
        content,
        author: {
          connect: {
            id: authorId,
          },
        },
      },
    });

    res.redirect(`/posts/${newPost.id}`);
  } catch (error) {
    console.error(error);
    res.json("Server Error");
  }
});

router.get("/edit/:id", async (req, res) => {
  const postId = req.params.id;
  const editID = await prisma.post.findUnique({
    where: {
      id: postId,
    },
  });
  res.render("editPost", { title: editID.title, posts: editID });
});

router.put("/edit/:id", async (req, res) => {
  try {
    const postId = req.params.id;
    const { title, content } = req.body;

    const postToEdit = await prisma.post.findUnique({
      where: {
        id: postId,
      },
      include: {
        author: true,
      },
    });

    const isAuthor = req.user && req.user.id === postToEdit.author.id;

    if (isAuthor) {
      const editPost = await prisma.post.update({
        where: {
          id: postId,
        },
        data: {
          title,
          content,
        },
      });

      res.redirect(`/posts/${editPost.id}`);
    } else {
      res.status(403).send("Unauthorized: You cannot edit this post.");
    }
  } catch (error) {
    res.json("Server Error");
  }
});

router.get("/delete/:id", async (req, res) => {
  const postId = req.params.id;

  const deleteID = await prisma.post.findUnique({
    where: {
      id: postId,
    },
    include: {
      author: true,
    },
  });
  res.render("deletePost", { title: deleteID.title, posts: deleteID });
});

router.delete("/delete/:id", async (req, res) => {
  try {
    const postId = req.params.id;

    const postToDelete = await prisma.post.findUnique({
      where: {
        id: postId,
      },
      include: {
        author: true,
      },
    });

    const isAuthor = req.user && req.user.id === postToDelete.author.id;

    if (isAuthor) {
      const deletePost = await prisma.post.delete({
        where: {
          id: postId,
        },
      });
      res.redirect("/");
    } else {
      res.status(403).send("Unauthorized: You cannot delete this post.");
    }
  } catch (error) {
    res.json("Server Error");
  }
});

router.get("/:id", async (req, res) => {
  try {
    const postID = await prisma.post.findUnique({
      where: {
        id: req.params.id,
      },
      include: {
        author: true,
      },
    });
    res.render("post", { title: postID.title, posts: postID, user: req.user });
  } catch (error) {
    res.json("Server Error");
  }
});

module.exports = router;