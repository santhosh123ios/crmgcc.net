import express from "express"
import vendorAuth from "../middleware/vendor/authMiddlewareVendor.js";
import { getLeads, leadStatusUpdate, createLeadMessage, getLeadMessage } from "../controllers/vendor/leads.js";
import { getTransaction, addTransaction } from "../controllers/vendor/Transaction.js";
import { adminList, getProfile, memberList, updateProfile, updateProfileImage } from "../controllers/vendor/Profile.js";
import { complaintsStatusUpdate, createComplaint, createComplaintMessage, getComplaintMessage, getComplaints } from "../controllers/vendor/Complaints.js";
import FileUpload from "../services/FileUpload.js";
import { getDashboard } from "../controllers/vendor/Reports.js";
import { addVendorCategory } from "../controllers/vendor/Brand.js";
import { addProduct, deleteProduct, getProduct, updateProductDetails, updateProductImage, updateProductStatus } from "../controllers/vendor/product.js";
import { addOffers, deleteOffer, getOffers, updateOfferDetails, updateOfferImage, updateOfferStatus } from "../controllers/vendor/offers.js";

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
router.post("/add_vendor_category", vendorAuth, addVendorCategory)

router.post("/add_product", vendorAuth, addProduct)
router.get("/get_product", vendorAuth, getProduct)
router.post("/update_product_image", vendorAuth, updateProductImage)
router.post("/update_product_status", vendorAuth, updateProductStatus)
router.post("/update_product_details", vendorAuth, updateProductDetails)
router.post("/delete_product", vendorAuth, deleteProduct)

router.post("/add_offers", vendorAuth, addOffers)
router.get("/get_offers", vendorAuth, getOffers)
router.post("/update_offer_status", vendorAuth, updateOfferStatus)
router.post("/update_offer_image", vendorAuth, updateOfferImage)
router.post("/update_offer_details", vendorAuth, updateOfferDetails)
router.post("/delete_offer", vendorAuth, deleteOffer)

router.post("/create_lead_message", vendorAuth, createLeadMessage)
router.post("/get_lead_message", vendorAuth, getLeadMessage)

router.post("/create_complaint_message", vendorAuth, createComplaintMessage)
router.post("/get_complaint_message", vendorAuth, getComplaintMessage)


router.post('/upload', vendorAuth, FileUpload.single('file'), (req, res) => {
  try {
    console.log("Upload request received");
    console.log("File: ", req.file); // important!
    console.log("Body: ", req.body);

    if (!req.file) {
      console.log("No file found");
      return res.status(400).json({ success: false, message: 'No file uploaded' });
    }

    res.status(200).json({
      success: true,
      message: 'Upload successful',
      filename: req.file.filename,
    });
  } catch (err) {
    console.error('Upload error:', err.message);
    return res.status(500).json({ success: false, message: 'error' });
  }
});

export default router;