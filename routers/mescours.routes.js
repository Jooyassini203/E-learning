const express = require("express");
const mescoursRouter = express.Router();

mescoursRouter.get("/mescours-details/:id", (req, res) => {
  return res.render("insert-details-json-ec", {
    url: " http://localhost:8002/images/avatar/01.jpg",
  });
});

module.exports = mescoursRouter;
