document.addEventListener('DOMContentLoaded', function() {
(function(){
let screen = document.querySelector('.screen');
let buttons = document.querySelectorAll('.btn');
let clear = document.querySelector('.btn-clear');
let equal = document.querySelector('.btn-equal');
 
buttons.forEach(function(button){
    button.addEventListener('click',function(e) {
    let value = e.target.dataset.num;
    screen.value+=value;

    });

});
equal.addEventListener('click',function(e){
    if(screen.value==''){
        screen.value='';
    }else{
        let expression = screen.value;
        if(isNaN(expression[expression.length-1])){
                expression=expression.slice(0,-1);
        };
        let answer =eval(expression);
        screen.value=answer;
    }
})
clear.addEventListener('click',function(e){
  screen.value='';  

})

})();
});