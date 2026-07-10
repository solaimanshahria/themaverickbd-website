// Scroll Animation

const sections = document.querySelectorAll("section");

const observer = new IntersectionObserver((entries)=>{

entries.forEach((entry)=>{

if(entry.isIntersecting){

entry.target.classList.add("show");

}

});

});

sections.forEach((section)=>{

observer.observe(section);

});


// Navbar Shadow

window.addEventListener("scroll",()=>{

const nav=document.querySelector(".navbar");

if(window.scrollY>50){

nav.style.boxShadow="0 10px 30px rgba(0,0,0,.35)";

}else{

nav.style.boxShadow="none";

}

});