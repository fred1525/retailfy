const router = require("express").Router();
const adController = require("../../controllers/adController");

// routes for adController
router.route("/").get(adController.findAll);

router.route("/:category").get(adController.findByCategory);

router.route("/detail/:id").get(adController.findAdById);

router.route("/adpost").post(adController.create);

//route for getting a user's posted Ads
router.route("/myad/:id").get(adController.findAdsByUserId);


// /route for deleting an ad
router.route("/deletead/:id").delete(adController.remove);

// /route for editing an ad
router.route("/editad/:id").put(adController.edit);

module.exports = router;
