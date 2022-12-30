const title = document.getElementById("title"),
    price = document.getElementById("price"),
    taxe = document.getElementById("taxes"),
    ads = document.getElementById("ads"),
    discount = document.getElementById("discounts"),
    total = document.getElementById("total"),
    count = document.getElementById("count"),
    category = document.getElementById("category"),
    create = document.getElementById("submit"),
    tbody = document.getElementById("tbody");
let mood = 'create', tmp,
    search = document.getElementById('search');

// Calculate Total
function Total(){
    if (price.value !== ''){
        let res = (+price.value + +taxe.value + +ads.value)- +discount.value;
        total.innerHTML = res;
        total.style.background = '#040';
    }else {
        total.innerHTML = '';
        total.style.background = '#a00d02';
    }
}
// When you click the mouse
price.onkeyup =  Total;
taxe.onkeyup = Total;
ads.onkeyup = Total;
discount.onkeyup = Total;
// Create Product
// Test Array in local storage before push a new prduct
let ls = localStorage.getItem("products"),
    Products;
if (ls !== null){
   Products = JSON.parse(ls);
}else {
    Products = [];
}
create.onclick = () =>{
    let Product = {
        title : title.value,
        price : price.value,
        taxes : taxe.value,
        ads : ads.value,
        discounts : discount.value,
        count : count.value,
        category : category.value
    }
    if (title.value !== '' 
        && price.value !== ''  
        && count.value !== '' 
        && category.value !== ''
        && count.value <= 100){
        // Test the mood create or update
        if (mood === 'create'){
            // Create a new array with count case and then populate it with product
            let CountProduct = Array(+Product.count).fill(Product);
            Products.push(...CountProduct);
        }else {
            Products[tmp] = Product;
            mood = 'create';
            create.innerHTML = 'create';
        }
      // We reset the inputs after adding them to local storage
       ClearData();
    }
    // Add Products In Local Storage
    // The local storage stores a string not an array so you have to transform the array into a string with json.stringfy
    localStorage.setItem('products',JSON.stringify(Products));
    // We refresh the page to add the product to the table
    window.location.reload();
    // ShowData();
}
// Clear Inputs
function ClearData(){
    title.value = '';
    price.value = '';
    taxe.value = '';
    ads.value = '';
    discount.value = '';
    total.innerHTML = '';
    count.value = '';
    category.value = '';
}
// Show Data
function ShowData (){
  Products.forEach((el,i) => {
    tbody.innerHTML += `
        <tr>
            <td>${i+1}</td>
            <td>${el.title}</td>
            <td>${el.price}</td>
            <td>${el.taxes}</td>
            <td>${el.ads}</td>
            <td>${el.discounts}</td>
            <td>${el.category}</td>
            <td><button id="update" onclick="UpdateProduct(${i})">update</button> </td>
            <td><button onclick="DeleteProduct(${i})" id="delete">delete</button></td>
        </tr>
    `
  });
  let btnDeleteAll = document.getElementById('deleteAll');
  if (Products.length > 0){
    btnDeleteAll.innerHTML = `
    <button onclick="DeleteAllProduct()">Delete All Products (${Products.length})</button>
    `;
  }else {
    btnDeleteAll.innerHTML= '';
  }
}
ShowData();
// Delete Product
function DeleteProduct (id){
    Products.splice(id,1);
    // Edit A Products (Array) In Local Storage
    localStorage.products =  JSON.stringify(Products);
    // localStorage.setItem('products',JSON.stringify(Products));
    // We redisplay the products or we refresh the page
    // ShowData();
    window.location.reload();
}
// Delete All Products
function DeleteAllProduct(){
    // Delete All Products In Local Storage
    localStorage.clear();
    // Delete All Products In Table Or Refrech the page
    //  tbody.innerHTML = '';
    window.location.reload();
}
// Update Product
function UpdateProduct(id){
    title.value = Products[id].title;
    price.value = Products[id].price;
    taxe.value = Products[id].taxes;
    ads.value = Products[id].ads;
    discount.value = Products[id].discounts;
    total.innerHTML = Products[id].total;
    count.style.display = 'none';
    category.value = Products[id].category;
    Total();
    create.innerHTML = 'Update';
    mood = 'update';
    // You put the value of i in global variable tmp to use it in other functions.
    tmp = id;
    scroll({
        top:0,
        behavior : 'smooth'
    });
}
// Search Product
function Search(id){
    // if (id === 'searchTitle'){
    //     var res = Products.filter ((p)=> p.title.toLowerCase().startsWith((search.value).toLowerCase()));
    // }else {
    //     var res = Products.filter ((p)=> p.category.toLowerCase().includes((search.value).toLowerCase()));
    // }
    let res = Products.filter((p) => {
        if (id === 'searchTitle'){
          return p.title.toLowerCase().startsWith((search.value).toLowerCase());
        }else {
          return p.category.toLowerCase().includes((search.value).toLowerCase());
        }
    });
    if (res.length > 0 ){
        tbody.innerHTML = '';
      res.forEach((el,i)=> {
        tbody.innerHTML += `
                <tr>
                    <td>${i+1}</td>
                    <td>${el.title}</td>
                    <td>${el.price}</td>
                    <td>${el.taxes}</td>
                    <td>${el.ads}</td>
                    <td>${el.discounts}</td>
                    <td>${el.category}</td>
                    <td><button id="update" onclick="UpdateProduct(${i})">update</button> </td>
                    <td><button onclick="DeleteProduct(${i})" id="delete">delete</button></td>
                </tr>
            `;
        });
    }else{
        tbody.innerHTML = `<p>There are no products.</p>`;
    }   
}