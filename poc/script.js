let canvas = document.querySelector("canvas") ;
canvas.height = window.innerHeight;
canvas.width = window.innerWidth ; //canvas puri screen pe aajyega isse

//to specify kya kaam krna hai
const tool = canvas.getContext("2d") ;

// tool.fillRect(0 , 0 ,canvas.width , canvas.height)
// tool.fillStyle = "white"
// tool.strokeStyle="red" ;
// tool.lineWidth = 5 ; 
// tool.strokeRect(10,10, canvas.width/2 , canvas.height/2 )
// tool.fillRect(10 ,10 , canvas.width/2 , canvas.height/2 ) ;

// //to draw line
// tool.beginPath() ;
// tool.moveTo(canvas.width/2 , canvas.height/2 ) ;
// tool.lineTo(canvas.width/2 + 100 , canvas.height/2 +100  ) ;
//tool.stroke() ; 
//to make straight line with mouse

// canvas.addEventListener( "mousedown" , function(e){
//     console.log("x:" , e.clientX , "y: " , e.clientY ) ; 
//     tool.beginPath() ;
//     tool.moveTo(e.clientX , e.clientY ) ; 

// } );
//to make straight line from one point to other jahan mouse leke jyenge
//clientX clientY stores the point of click
// canvas.addEventListener("mouseup" , function(e){
//     tool.lineTo(e.clientX , e.clientY) ;
//     tool.stroke() ; 
// })

//to make curved line according to mouse
let undostack = [] ;
isMouseDown = false;
canvas.addEventListener("mousedown" , function(e){
    tool.beginPath() ;
    let x = e.clientX ;
    let y = getCoordinates(e.clientY) ; 
    tool.moveTo(x,y);
    isMouseDown = true ; 
    pointdesc = {
        x: x ,
        y : y ,
        desc: "md"
    }
    undostack.push(pointdesc) ; 
    
} )

canvas.addEventListener("mousemove" , function(e){
    if(isMouseDown ){
        let x = e.clientX ;
        let y = getCoordinates(e.clientY) ; 
        tool.lineTo(x,y ) ;
        tool.stroke() ;
        pointdesc = {
            x: x ,
            y : y ,
            desc: "mm"
        }
        undostack.push(pointdesc) ; 
    }
   
})
canvas.addEventListener("mouseup" , function(e){
    isMouseDown = false;
})

function getCoordinates(y){
    let bounds = canvas.getBoundingClientRect() ; // to remove problem of curser upar hai draw neeche horha
    return y - bounds.y ; 
}

let tools = document.querySelectorAll(".tool-image") ;
for( let i = 0 ; i < tools.length ; i++ ){
    tools[i].addEventListener("click" , function(e){
        let ctool = e.currentTarget;
        let name = ctool.getAttribute("id") ;
        if(name == "pencil" ){
            tool.strokeStyle="black" ; 
        }else if(name== "eraser"){
            tool.strokeStyle="white" ;
        }else if( name == "sticky"){
            createSticky() ; 
        }else if(name == "undo"){
            undomaker() ; 
        }else if(name == "redo"){
            redomaker() ; 
        }else if(name == "download" ){
            downloadBoard() ; 
        }else if(name == "upload"){
            uploadFile();
        }
    } )
}
//-------------------------------
function createBox(){

    let stickyPad=document.createElement("div") ; 
    let navBar=document.createElement("div") ; 
    let close=document.createElement("div") ; 
    let minimize=document.createElement("div") ; 
    let textArea=document.createElement("div") ; 

    stickyPad.setAttribute("class" , "stickypad") ; 
    navBar.setAttribute("class" , "nav-bar") ; 
    close.setAttribute("class" , "close") ; 
    minimize.setAttribute("class" , "minimize") ; 
    textArea.setAttribute("class" , "text-area") ; 
    

    stickyPad.appendChild(navBar) ;
    stickyPad.appendChild(textArea);
   
    navBar.appendChild(minimize);
    navBar.appendChild(close) ; 

    document.body.appendChild(stickyPad) ; 
    



let initialX = null ; 
let initialY = null ; 
let isStickyDown=false;
let navBarr = document.querySelector(".nav-bar") ;
let stickyPadd = document.querySelector(".stickypad") ; 
navBarr.addEventListener("mousedown" , function(e){
    initialX = e.clientX;
    initialY = e.clientY ;
    isStickyDown = true;
})

canvas.addEventListener("mousemove" , function(e){
    if(isStickyDown){
        let finalX = e.clientX;
        let finalY = e.clientY ;
         let dx = finalX - initialX ;
         let dy = finalY- initialY ; 
         let{top,left} = stickyPad.getBoundingClientRect() ;
         stickyPadd.style.top = top+dy+"px" ;
         stickyPadd.style.left = left+dx+"px" ;
         initialX = finalX ;
         initialY = finalY;
    }
})

window.addEventListener("mouseup" , function() {
    isStickyDown = false;
})

//-------------------------------
//minimize and close

let closee = document.querySelector(".close"); 
let minimizee =document.querySelector(".minimize") ;
let textAreaa =document.querySelector(".text-area"); 
let isMinimized = false;

minimizee.addEventListener("click" , function(){
    if(isMinimized ){
        textAreaa.style.display = "none" ; 

    }else{
        textAreaa.style.display = "block" ; 
    }
    isMinimized= !isMinimized ; 

})

closee.addEventListener("click" , function(){
    stickyPadd.remove() ; 
})

return textArea ; 

}
function createSticky(){

    let textArea = createBox() ; 
    let textBox=document.createElement("textarea") ;

    textBox.setAttribute("class" , "textarea") ; 

    textArea.appendChild(textBox) ; 
    
    


    //sticky pad move krana with mouse




}

//-------for undo-----
let redostack  = [] ; 
const undo = document.querySelector("#undo") ;
// undo.addEventListener("click" , function(){
//     undomaker() ;
// })
function undomaker(){
    tool.clearRect(0,0,canvas.width , canvas.height); // this will remove one point at a time
    //undostack.pop() ;
    //if we make 3 lines , and want to delete oneline at a time then change code
    while(undostack.length > 0 ){  //underflow ka check

        let curObj = undostack[undostack.length - 1] ;
        if( curObj.desc == "md" ){
            redostack.push(undostack.pop() );
            break;
        }else if(curObj.desc = "mm" ){
            redostack.push(undostack.pop()) ; 
        }
    } 

    
    redraw() ; 
}
function redomaker(){
    tool.clearRect(0,0,canvas.width , canvas.height);
    while(redostack.length > 0 ){  //underflow ka check

        let curObj = redostack[redostack.length - 1] ;
        if( curObj.desc == "md" ){
            undostack.push(redostack.pop() );
            break;
        }else if(curObj.desc = "mm" ){
            undostack.push(redostack.pop()) ; 
        }
    } 

    
    redraw() ; 
}
function redraw(){
    for(let i = 0 ; i < undostack.length ; i++ ){

        let{x,y,desc } = undostack[i] ;
        if(desc=="md" ){
            tool.beginPath() ;
            tool.moveTo(x,y) ; 
        }else if(desc=="mm"){
            tool.lineTo(x,y) ;
            tool.stroke() ; 
        }

    }
}

//download board page

function downloadBoard(){

//create anchor
    let a = document.createElement("a") ; 
    
    a.download = "file.png" ; 
    //convert board to url 
    let url = canvas.toDataURL("image/png;base64") ;
    //set as href of anchor
    a.href = url ; 
    //cick the anchor
    a.click() ; 

    a.remove() ; 

}

//upload image 

let imgInput = document.querySelector("#acceptImg") ; 
imgInput.addEventListener("click" , uploadFile()) ;

function uploadFile(){
    imgInput.click() ; 
    imgInput.addEventListener("change" , function(){

        let imgObj = imgInput.files[0] ;
        let imgLink = URL.createObjectURL(imgObj) ; 

        let textBox = createBox() ; 
        let img = document.createElement("img") ; 

        img.setAttribute("class" , "upload-img") ; 
        img.src = imgLink ; //iamge ke src tag mei set krdiya link bnake
        textBox.appendChild(img) ;

    })

}