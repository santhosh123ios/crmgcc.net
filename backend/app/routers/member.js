import express from "express"
import memberAuth from "../middleware/member/authMiddlewareMember.js";
import { createLeads, getLeads, vendorList, createLeadMessage, getLeadMessage } from '../controllers/member/leads.js';
import FileUpload from "../services/FileUpload.js";
import { addRedeem, getRedeem, getTransaction, getTransactionSettings, getWalletDetails } from "../controllers/member/Transaction.js";
import { createComplaint, createComplaintMessage, getComplaintMessage, getComplaints } from "../controllers/member/Complaints.js";
import { getProfile, updateProfile, updateProfileImage } from "../controllers/member/Profile.js";
import { getAllOffers, generateOfferCode, offers_validity_check, markOfferAsUsed } from "../controllers/member/offers.js";
import { getAllProduct } from "../controllers/member/product.js";


const router = express.Router()

// router.post("/register",register)
// router.post("/login", login)
// router.post("/send-email-verification", sendEmailVerification)
// router.post("/email-verification", emailVerification)
//router.get("/memberlist", adminAuth, memberList)

router.get("/vendorlist", memberAuth, vendorList)
router.post("/create-leads", memberAuth, createLeads)
router.get("/getleads", memberAuth, getLeads)
router.get("/get_transaction", memberAuth, getTransaction)
router.get("/get_transaction_settings", memberAuth, getTransactionSettings)
router.post("/add_redeem", memberAuth, addRedeem)
router.get("/get_redeem", memberAuth, getRedeem)
router.get("/get_walletDetails", memberAuth, getWalletDetails)
router.post("/create_complaint", memberAuth, createComplaint)
router.get("/get_complaints", memberAuth, getComplaints)
router.post("/update_profile_image", memberAuth, updateProfileImage)
router.get("/get_profile", memberAuth, getProfile)
router.post("/update_profile", memberAuth, updateProfile)
router.get("/get_all_offers", memberAuth, getAllOffers)
router.post("/generate_offer_code", memberAuth, generateOfferCode)
router.post("/offers_validity_check", memberAuth, offers_validity_check)
router.post("/mark_offer_as_used", memberAuth, markOfferAsUsed)
router.get("/get_all_product", memberAuth, getAllProduct)

router.post("/create_lead_message", memberAuth, createLeadMessage)
router.post("/get_lead_message", memberAuth, getLeadMessage)

router.post("/create_complaint_message", memberAuth, createComplaintMessage)
router.post("/get_complaint_message", memberAuth, getComplaintMessage)



router.post('/upload', memberAuth, FileUpload.single('file'), (req, res) => {
  try {
    console.log("Upload request received");
    console.log("File: ", req.file); // important!
    console.log("Body: ", req.body);

    if (!req.file) {
      console.log("File: ", req.file);
      console.log("No file found");
      return res.status(400).json({ success: false, message: 'No file uploaded' + req.body });
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



// router.post("/create-leads", memberAuth, FileUpload.single('file'), (req, res) => {
//   if (!req.file) return res.send('No file uploaded.');
//   res.send(`File uploaded successfully: ${req.file.filename}`);
// },createLeads);


export default router;