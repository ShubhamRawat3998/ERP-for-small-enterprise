import PurchaseOrder from "../models/PurchaseOrder.js";

export const createPurchaseOrder = async (req, res) => {
  try {
    const { supplierName, supplierContact, items } = req.body;
    const purchaseOrder=await PurchaseOrder.create({
      supplierName,
      supplierContact,
      items,
    });
    // update inventory stock
    for(const item of items){
    const inventoryItem=await Inventory.findOne({name:item.name});
    if(inventoryItem){
      inventoryItem.stock+=item.quantity;
      await inventoryItem.save();
    }
    else{
      await Inventtory.create({
        sku:`SKU-${Date.now()}`,
        name:item.name,
        stock:item.quantity,
        category:"Uncategorized",
      });
    }
    }
    res.status(201).json(purchaseOrder);
  } catch (err) {
    console.error("Backend error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
};
