const API_URL = "https://retoolapi.dev/CvTAYs/data";
async function loadProducts() {
 try {
   const response = await fetch(API_URL);
   const products = await response.json();
   const list = document.getElementById("product-list");
   list.innerHTML = "";
   if (products.length === 0) {
     list.innerHTML = "<p>Nincs elérhető termék!</p>";
     return;
   }
   products.forEach((product) => {
     if (product.stock > 0) {
       const div = document.createElement("div");
       div.innerHTML = `
<h3>${product.name} (${product.category_name})</h3>
<p>Ár: ${product.price} Ft</p>
<p>Készlet: ${product.stock} db</p>
<button onclick="buyProduct(${product.id}, ${product.stock})">Vásárlás</button>
       `;
       list.appendChild(div);
     }
   });
 } catch (error) {
   alert("Nem sikerült lekérni a termékeket!");
 }
}

async function buyProduct(id, stock) {
 const quantity = parseInt(prompt("Add meg a vásárolni kívánt mennyiséget:"));
 if (!quantity || quantity <= 0) {
   return alert("Érvénytelen mennyiség!");
 }
 if (quantity > stock) {
   return alert("Nincs elegendő készlet!");
 }
 try {

   const response = await fetch(`${API_URL}/${id}`);
   const product = await response.json();

   product.stock -= quantity;
   if (product.stock <= 0) {

     const deleteResponse = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
     if (deleteResponse.ok) {
       alert("A termék elfogyott és törölve lett!");
     } else {
       alert("Hiba történt a termék törlése során!");
     }
   } else {

     const updateResponse = await fetch(`${API_URL}/${id}`, {
       method: "PUT",
       headers: { "Content-Type": "application/json" },
       body: JSON.stringify(product),
     });
     if (!updateResponse.ok) {
       alert("Hiba történt a termék frissítése során!");
     } else {
       alert("Vásárlás sikeres!");
     }
   }

   loadProducts();
 } catch (error) {
   alert("Hiba történt a vásárlás során!");
 }
}

loadProducts();