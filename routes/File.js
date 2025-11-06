const express = require("express");
const asyncwrap = require("../utils/wrapasync");
const Joivalidate = require("../utils/Validateerror");
const verifyToken = require("../utils/verifytoken");
const sameUser = require("../utils/sameUser");
const route = express.Router({ mergeParams: true });
const fileController = require("../controllers/fileController");
const multer = require("multer");
const upload = multer({ dest: "uploads/" });
const editUserValidate = require("../utils/userEditValidation");
const edituserController = require("../controllers/editUserController");

route.get("/", asyncwrap(fileController.all));

route.get("/new", verifyToken, fileController.newGet);

route.post("/new", Joivalidate, verifyToken, asyncwrap(fileController.newPost));

route.get("/:id/view", verifyToken, asyncwrap(fileController.view));

route.get(
  "/:id/update",
  verifyToken,
  sameUser,
  asyncwrap(fileController.updateGet)
);

route.post(
  "/:id/update",
  verifyToken,
  sameUser,
  Joivalidate,
  asyncwrap(fileController.updatePost)
);
route.post(
  "/:p/:id/edit-user",
  verifyToken,
  upload.single("image"),
  editUserValidate,
  asyncwrap(edituserController)
);

route.get(
  "/:id/delete",
  verifyToken,
  sameUser,
  asyncwrap(fileController.delete)
);
route.post("/search", fileController.search);
module.exports = route;
