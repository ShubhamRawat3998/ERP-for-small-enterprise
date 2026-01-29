import "./Dashboard.css";
function LowStocktable() {
  const products = [
    { name: "iPhone 14", stock: 3 },
    { name: "Samsung Charger", stock: 5 },
    { name: "Boat Airdopes 131", stock: 2 },
    { name: "Laptop Adapter", stock: 4 },
  ];

  return (
    <div className="table-card">
      <h2 className="table-title">Low Stock Alert</h2>

      <table className="low-stock-table">
        <thead>
          <tr>
            <th>Product Name</th>
            <th>Stock</th>
          </tr>
        </thead>

        <tbody>
          {products.map((p) => (
            <tr key={p.name}>
              <td>{p.name}</td>
              <td className="low-stock">{p.stock}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default LowStocktable;
