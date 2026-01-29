import Invoice from "../models/Invoice.js";

export const createInvoice = async (req, res) => {
    console.log("HIT createInvoice API");
  try {
    console.log("Data",req.body);
    const invoice = new Invoice(req.body);
    await invoice.save();

    res.status(201).json({
      success: true,
      message: "Invoice saved successfully",
      invoice,
    });
  } catch (error) {
    console.error("Invoice save error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to save invoice",
      error: error.message,
    });
  }
};
