const express = require("express");
const router = express.Router();
const controllers = require("../controllers/controllers");








router.post("/login", controllers.login);
router.post("/inscrit_user", controllers.inscrit_user);
router.put("/modifier_user/:id", controllers.modifier_user);
router.get("/afficher_seuluser/:id", controllers.afficher_user);
router.get("/afficher_users", controllers.affiche_toususers);
router.post("/delete_user/:id", controllers.deletuser);




module.exports = router;  