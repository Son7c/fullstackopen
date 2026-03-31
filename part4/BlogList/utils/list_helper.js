const dummy=(blogs)=>{
    return 1;
}
const totalLikes=(blogs)=>{
    return blogs.reduce((acc,blog)=>acc+blog.likes,0);
}
const favBlog=(blogs)=>{
    if(blogs.length===0) return null;
    let fav=blogs[0];
    blogs.forEach(el => {
        if(el.likes>fav.likes){
            fav=el;
        }
    });
    return fav;
}
module.exports={dummy,totalLikes,favBlog};