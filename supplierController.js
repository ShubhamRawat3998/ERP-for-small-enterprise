import Supplier from "../models/Supplier.js";
// Get all suppliers
export const getSuppliers=async(req,res)=>{
    try{
        const suppliers=await Supplier.find();
        res.json(suppliers);
    }
    catch(err){
        res.status(500).json({message:err.message});
    }
};
// create supplier
export const createSupplier=async(req,res)=>{
    try{
        const supplier=await Supplier.create(req.body);
        res.status(201).json(supplier);
    }
    catch(err){
        res.status(500).json({message:err.message});
    }
};
//update supplier
export const updateSupplier=async(req,res)=>{
    try{
        const updated=await Supplier.findByIdAndUpdate(
            req.params.id,
            req.body,
            {new:true}
        );
        res.json(updated);
    }
    catch(err){
        res.status(500).json({message:err.message});
    }
};
//Delete supplier
export const deleteSupplier=async(req,res)=>{
    try{
        await Supplier.findByIdAndDelete(req.params.id);
        res.json({message:"Supplier deleted"});
    }
    catch(err){
        res.status(500).json({message:err.message});
    }
};