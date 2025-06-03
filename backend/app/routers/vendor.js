import express from "express"
import vendorAuth from "../middleware/vendor/authMiddlewareVendor.js";
import { getLeads, leadStatusUpdate } from "../controllers/vendor/leads.js";
import { getTransaction, addTransaction } from "../controllers/vendor/Transaction.js";
import { adminList, getProfile, memberList, updateProfile, updateProfileImage } from "../controllers/vendor/Profile.js";
import { complaintsStatusUpdate, createComplaint, getComplaints } from "../controllers/vendor/Complaints.js";
import FileUpload from "../services/FileUpload.js";
import { getDashboard } from "../controllers/vendor/Reports.js";

const router = express.Router()

router.get("/getleads", vendorAuth, getLeads)
router.post("/lead-status-update", vendorAuth, leadStatusUpdate)
router.post("/add_transaction", vendorAuth, addTransaction)
router.get("/get_transaction", vendorAuth, getTransaction)
router.get("/member_list", vendorAuth, memberList)
router.get("/admin_list", vendorAuth, adminList)
router.get("/get_complaints", vendorAuth, getComplaints)
router.post("/create_complaint", vendorAuth, createComplaint)
router.post("/complaints_status_update", vendorAuth, complaintsStatusUpdate)

router.post("/update_profile_image", vendorAuth, updateProfileImage)
router.get("/get_profile", vendorAuth, getProfile)
router.post("/update_profile", vendorAuth, updateProfile)
router.get("/get_dashboard", vendorAuth, getDashboard)



router.post("/upload", vendorAuth, FileUpload.single('file'), (req, res) => {
  if (!req.file) return res.json({
  success: false,
  message: "error",
  
});
  //res.send(`File uploaded successfully: ${req.file.filename}`);
  res.json({
  success: true,
  message: "Lead created successfully",
  file: req.file?.filename,
  data: req.body,
});
});


export default router;