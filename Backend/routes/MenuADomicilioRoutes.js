const express = require("express");
const router = express.Router();
const { getMenusADomicilio, getMenuADomicilioById, createMenuADomicilio, updateMenuADomicilio, deleteMenuADomicilio } = require("../controllers/MenuADomicilioController");

router.get("/", getMenusADomicilio);
router.get("/:id", getMenuADomicilioById);
router.post("/", createMenuADomicilio);
router.put("/:id", updateMenuADomicilio);
router.delete("/:id", deleteMenuADomicilio);

module.exports = router;
