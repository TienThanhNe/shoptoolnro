
function toggleSidebar(){

let s=document.getElementById("sidebar")

if(window.innerWidth<800){
s.classList.toggle("show")
}else{
s.classList.toggle("collapsed")
}

}

function loadHome(){

let html=`

<div class="home">

<div class="title">
ShopToolNRO.com.vn
</div>

<div class="cloud-frame">

<a href="https://shoptoolnro.com.vn" target="_blank">

<img src="images/cloud.jpg">

</a>

</div>

</div>

`

document.getElementById("content").innerHTML=html

}



async function loadTable(name){

let res=await fetch("tables/"+name+".json")

let data=await res.json()

let html=`

<h2>Bảng ID</h2>

<input class="search" placeholder="Tìm ID hoặc tên..." onkeyup="searchTable(this)">

<table id="idtable">

<tr>
<th>ID</th>
<th>Tên</th>
</tr>

`

data.forEach(row=>{

html+=`

<tr>

<td>${row.id}</td>

<td>${row.name}</td>

</tr>

`

})

html+="</table>"

document.getElementById("content").innerHTML=html

}



function searchTable(input){

let filter=input.value.toLowerCase()

let rows=document.querySelectorAll("#idtable tr")

rows.forEach((r,i)=>{

if(i==0)return

let text=r.innerText.toLowerCase()

r.style.display=text.includes(filter)?"":"none"

})

}



async function loadGuide(name){

let res=await fetch("guides/"+name+".json")

let data=await res.json()

let html=""

data.forEach(item=>{

if(item.type=="text")
html+=`<p>${item.value}</p>`

if(item.type=="image")
html+=`<img src="${item.value}">`

})

document.getElementById("content").innerHTML=html

}


loadHome()
