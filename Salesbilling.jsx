import React, {useState} from "react";
import {jsPDF} from "jspdf";
import './Salesbilling.css';
function Salesbilling(){
    const [customerName,setCustomerName]=useState("");
    const [phone,setPhone]=useState("");
    const [paymentMethod,setPaymentMethod]=useState("Cash");
    const [cart,setCart]=useState([
        {name:"Iphone 17 pro",price:134400,qty:1,gst:18}
    ]);
    const [productName,setProductName]=useState("");
    const [productPrice,setProductPrice]=useState("");
    const [productGst,setProductGst]=useState(18);
    const addProduct=()=>{
        if(!productName||!productPrice)return;
        setCart([
        ...cart,
        {
        name:productName,
        price:Number(productPrice),
        qty:1,
        gst:Number(productGst),
        },
        ]);
        setProductName("");
        setProductPrice("");
        setProductGst(18);
    };
   const updateQty=(index,qty)=>{
    const newCart=[...cart];
    newCart[index].qty=qty;
    setCart(newCart);
   };
   const removeItem=(index)=>{
    setCart(cart.filter((_,i)=>i!==index));
   };
   const subtotal=cart.reduce((sum,item)=>sum+item.price*item.qty,0);
   const gstAmount=cart.reduce((sum,item)=>sum+(item.price*item.qty*item.gst)/100,0);
   const grandTotal=subtotal+gstAmount;
const generatePDF = async () => {
  try {
    const invoiceData = {
      customerName,
      phone,
      items: cart,
      subtotal,
      gstAmount,
      totalAmount: grandTotal,
      paymentMethod,
    };

    // Save invoice to DB
    await fetch("http://localhost:5000/api/invoice/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(invoiceData),
    });

    const doc = new jsPDF();

    // ===== HEADER =====
    doc.setFontSize(18);
    doc.text("INVOICE", 105, 15, { align: "center" });

    doc.setFontSize(11);
    doc.text(`Customer Name: ${customerName}`, 14, 30);
    doc.text(`Phone: ${phone}`, 14, 37);
    doc.text(`Payment Method: ${paymentMethod}`, 14, 44);
    doc.text(`Date: ${new Date().toLocaleDateString()}`, 150, 30);

    // ===== TABLE HEADER =====
    let startY = 55;
    doc.setFontSize(11);

    doc.text("Product", 14, startY);
    doc.text("Qty", 90, startY,{align:"right"});
    doc.text("Price", 120, startY,{align:"right"});
    doc.text("GST%", 145, startY,{align:"right"});
    doc.text("Total", 190, startY,{align:"right"});

    doc.line(14, startY + 2, 195, startY + 2);

    // ===== TABLE ROWS =====
    let y = startY + 10;

    cart.forEach((item) => {
      const priceTotal = item.price * item.qty;
      const gstValue = (priceTotal * item.gst) / 100;
      const rowTotal = priceTotal + gstValue;

      doc.text(item.name, 14, y);
      doc.text(String(item.qty), 90, y,{align:"right"});
      doc.text(`INR ${item.price.toFixed(2)}`, 120, y,{align:"right"});
      doc.text(`${item.gst}%`, 145, y,{align:"right"});
      doc.text(`INR ${rowTotal.toFixed(2)}`, 190, y,{align:"right"});

      y += 8;
    });

    doc.line(14, y, 195, y);

    // ===== TOTALS =====
    y += 10;
    doc.text(`Subtotal: INR ${subtotal.toFixed(2)}`, 130, y);
    y += 7;
    doc.text(`GST: INR ${gstAmount.toFixed(2)}`, 130, y);
    y += 7;

    doc.setFontSize(13);
    doc.text(`Grand Total: INR ${grandTotal.toFixed(2)}`, 130, y);

    // ===== FOOTER =====
    doc.setFontSize(10);
    doc.text("Thank you for your business!", 105, 285, {
      align: "center",
    }); 

    doc.save(`Invoice_${customerName || "Customer"}.pdf`);
  } catch (error) {
    console.error("Invoice error:", error);
    alert("Failed to generate invoice");
  }
};


    return(
        <div className="billing-container">
            <h2 className="billing-title">Sales&Billing</h2>
            <div className="customer-section">
                <h3>Customer Details</h3>
                <div className="customer-fields">
                    <input type="text" placeholder="Customer Name" value={customerName} onChange={(e)=>setCustomerName(e.target.value)}/>
                    <input type="text" placeholder="Phone Number" value={phone} onChange={(e)=>setPhone(e.target.value)}/>
                </div>
            </div>
            <div className="product-section">
                <h3>Product</h3>
                <div className="product-fields">
                    <input type="text" placeholder="Product Name" value={productName} onChange={(e)=>setProductName(e.target.value)}/>
                    <input type="number" placeholder="Price" value={productPrice} onChange={(e)=>setProductPrice(e.target.value)}></input>
                    <input type="number" placeholder="GST%" value={productGst} onChange={(e)=>setProductGst(e.target.value)} style={{width:"100px"}}></input>
                    <button onClick={addProduct}>Add</button>
                </div>
            </div>
            <table className="cart-table">
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Product</th>
                        <th>Qty</th>
                        <th>Price</th>
                        <th>GST</th>
                        <th>Total</th>
                        <th>Remove</th>
                    </tr>
                </thead>
                <tbody>
  {cart.map((item, index) => {
    const priceTotal = item.price * item.qty;
    const gstValue = (priceTotal * item.gst) / 100;
    const rowTotal = priceTotal + gstValue;

    return (
      <tr key={index}>
        <td>{index + 1}</td>

        <td>{item.name}</td>

        <td>
          <input
            type="number"
            min="1"
            value={item.qty}
            onChange={(e) =>
              updateQty(index, Number(e.target.value))
            }
          />
        </td>

        <td>{item.price}</td>

        <td>{item.gst}%</td>

        <td>{rowTotal}</td>

        <td>
          <button
            className="remove-btn"
            onClick={() => removeItem(index)}
          >
            X
          </button>
        </td>
      </tr>
    );
  })}
</tbody>
            </table>
            <div className="summary-section">
                <div className="summary-left">
                    <p>Subtotal:{subtotal}INR</p>
                    <p>GST:{gstAmount} INR</p>
                    <h3>Grand Total:{grandTotal} INR</h3>
                </div>
                <div className="payments">
                    <h4>Payment Method</h4>
                    <label><input type="radio" name="pay" checked={paymentMethod==="Cash"}onChange={()=>setPaymentMethod("Cash")}/>Cash</label>
                    <label><input type="radio" name="pay" checked={paymentMethod==="UPI"} onChange={()=>setPaymentMethod("UPI")}/>UPI</label>
                    <label><input type="radio" name="pay" checked={paymentMethod==="Card"} onChange={()=>setPaymentMethod("Card")}/>Card</label>
                    <label><input type="radio" name="pay" checked={paymentMethod==="Wallet"}onChange={()=>setPaymentMethod("Wallet")}/>Wallet</label>
                    <label><input type="radio" name="pay"/>Split</label>
                </div>
            </div>
            <div className="buttons">
                <button className="generate-btn" onClick={generatePDF}> Generate Invoice</button>
                <button className="cancel-btn">Cancel</button>
            </div>
        </div>
    );
}
export default Salesbilling;