import express from "express"
import adminAuth from "../middleware/admin/authMiddleware.js";
import { sendEmailVerification, register, login, emailVerification, addCard, sendEmailResetPassword, resetPassword } from "../controllers/main/Auth.js";
import FileUpload from "../services/FileUpload.js";
import { createCard, getCardDetails } from "../controllers/admin/Card.js";
import { addAdminTopup, getAllRedeem, getAllTransaction, redeemStatusUpdate, getTransactionSettings, updateTransactionSettings, get_wallet, add_redeem_transaction, addTransaction } from "../controllers/admin/Transaction.js";
import { getLeads, leadStatusUpdate, createLeadMessage, getLeadMessage } from "../controllers/admin/Leads.js";
import { getProfile, memberList, updateProfile, updateProfileImage, vendorList, userBankInfo } from "../controllers/admin/Profile.js";
import { updateUserStatus } from "../controllers/admin/Users.js";
import { complaintsStatusUpdate, createComplaintMessage, getComplaintMessage, getComplaints } from "../controllers/admin/Complaints.js";
import { getDashboard } from "../controllers/admin/Reports.js";
import { createCategory, editCategory, getCategorys, updateCategory } from "../controllers/admin/category.js";
import { getAllOffers, getAllProduct, updateOfferStatus, updateProductStatus } from "../controllers/admin/product.js";

const router = express.Router()

router.post("/register", register)
router.post("/login", login)
router.post("/send-email-verification", sendEmailVerification)
router.post("/email-verification", emailVerification)
router.post("/send_email_reset_password", sendEmailResetPassword)
router.post("/reset_password", resetPassword)


router.post("/createcard", adminAuth, createCard)
router.get("/get_card_details", adminAuth, getCardDetails)
router.post("/add_card", adminAuth, addCard)
router.get("/get_all_transaction", adminAuth, getAllTransaction)
router.get("/get_all_redeem", adminAuth, getAllRedeem)
router.post("/add_admin_topup", adminAuth, addAdminTopup)
router.post("/redeem-status-update", adminAuth, redeemStatusUpdate)
router.get("/get_transaction_settings", adminAuth, getTransactionSettings)
router.post("/update_transaction_settings", adminAuth, updateTransactionSettings)
router.get("/get_wallet", adminAuth, get_wallet)
router.post("/add_redeem_transaction", adminAuth, add_redeem_transaction)
router.post("/user_bank_info", adminAuth, userBankInfo)
router.post("/add_transaction", adminAuth, addTransaction)

router.get("/get_leads", adminAuth, getLeads)
router.post("/lead_status_update", adminAuth, leadStatusUpdate)
router.get("/member_list", adminAuth, memberList)
router.get("/vendor_list", adminAuth, vendorList)
router.get("/get_complaints", adminAuth, getComplaints)
router.post("/complaints_status_update", adminAuth, complaintsStatusUpdate)
router.get("/get_profile", adminAuth, getProfile)
router.post("/update_profile_image", adminAuth, updateProfileImage)
router.post("/update_profile", adminAuth, updateProfile)
router.get("/get_dashboard", adminAuth, getDashboard)
router.post("/create_category", adminAuth, createCategory)
router.get("/get_categorys", adminAuth, getCategorys)
router.post("/update_category", adminAuth, updateCategory)
router.post("/edit_category", adminAuth, editCategory)
router.post("/update_user_status", adminAuth, updateUserStatus)

router.post("/create_lead_message", adminAuth, createLeadMessage)
router.post("/get_lead_message", adminAuth, getLeadMessage)

router.post("/create_complaint_message", adminAuth, createComplaintMessage)
router.post("/get_complaint_message", adminAuth, getComplaintMessage)

router.get("/get_all_product", adminAuth, getAllProduct)
router.get("/get_all_offers", adminAuth, getAllOffers)
router.post("/update_offer_status", adminAuth, updateOfferStatus)
router.post("/update_product_status", adminAuth, updateProductStatus)



router.post('/upload', adminAuth, FileUpload.single('file'), (req, res) => {
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




//router.get("/memberlist", memberAuth, memberList)
// router.post("/upload", adminAuth, FileUpload.single('file'), (req, res) => {
//   if (!req.file) return res.send('No file uploaded.');
//   res.send(`File uploaded successfully: ${req.file.filename}`);
// });


export default router;