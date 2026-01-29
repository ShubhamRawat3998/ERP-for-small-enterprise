import Customer from "../models/Customer.js";
// Get all customers
export const getCustomers=async(req,res)=>{
    try{
        const customers=await Customer.find();
        res.json(customers);
    }
    catch(err){
        res.status(500).json({message:err.message});
    }
};
// Create customer
export const createCustomer=async(req,res)=>{
    try{
        const customer=await Customer.create(req.body);
        res.status(201).json(customer);
    }
    catch(err){
        res.status(500).json({message:err.message});
    }
};
//update customer
export const updateCustomer=async(req,res)=>{
    try{
        const updateCustomer=await Customer.findByIdAndUpdate(
            req.params.id,
            req.body,
            {new:true}
        );
        res.json(updateCustomer);
    }
    catch(err){
        res.status(500).json({message:err.message});
    }
};
// Delete customer
export const deleteCustomer=async(req,res)=>{
    try{
        await Customer.findByIdAndDelete(req.params.id);
        res.json({message:"Customer deleted"});
    }
    catch(err){
        res.status(500).json({message:err.message});
    }
};