const API_URL = "https://retoolapi.dev/CvTAYs/data";
// Termékek betöltése
async function loadProducts() {
 try {
   const response = await fetch(API_URL);
   const products = await response.json();
   const list = document.getElementById("product-list");
   list.innerHTML = ""; // Korábbi tartalom törlése
   const availableProducts = products.filter(product => product.stock > 0); // Csak készleten lévő termékek
   if (availableProducts.length === 0) {
     list.innerHTML = "<p>Nincs elérhető termék a raktárban!</p>";
     return;
   }
   availableProducts.forEach((product) => {
     const div = document.createElement("div");
     div.innerHTML = `
<h3>${product.name} (${product.category_name})</h3>
<p>Ár: ${product.price} Ft</p>
<p>Készlet: ${product.stock} db</p>
<button onclick="deleteProduct(${product.id})">Törlés</button>
     `;
     list.appendChild(div);
   });
 } catch (error) {
   alert("Nem sikerült betölteni a termékeket!");
 }
}
// Termék törlése
async function deleteProduct(id) {
 try {
   const response = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
   if (response.ok) {
     alert("Termék törölve!");
     loadProducts();
   } else {
     alert("Hiba történt a törlés során!");
   }
 } catch (error) {
   alert("Nem sikerült törölni a terméket!");
 }
}
// Új termék hozzáadása
document.getElementById("add-product-form").addEventListener("submit", async (e) => {
 e.preventDefault();
 const name = document.getElementById("name").value;
 const category = document.getElementById("category").value;
 const price = parseFloat(document.getElementById("price").value);
 const stock = parseInt(document.getElementById("stock").value);
 if (stock <= 0) {
   alert("A készlet nem lehet 0 vagy kevesebb!");
   return;
 }
 try {
   const response = await fetch(API_URL, {
     method: "POST",
     headers: { "Content-Type": "application/json" },
     body: JSON.stringify({
       name: name,
       category_name: category,
       price: price,
       stock: stock,
     }),
   });
   if (response.ok) {
     alert("Termék hozzáadva!");
     document.getElementById("add-product-form").reset();
     loadProducts();
   } else {
     alert("Nem sikerült a termék hozzáadása!");
   }
 } catch (error) {
   alert("Hiba történt a termék hozzáadása során!");
 }
});
// Termékek betöltése a kezdéskor
loadProducts();