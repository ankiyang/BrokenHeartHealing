window.onload = () => {

    var p1 = document.getElementById('p1');
    var p2 = document.getElementById('p2');
    console.log(p1);
    function myFunction(x) {
        if (x.matches) { // If media query matches
            document.body.style.backgroundColor = "yellow";
            p1.style.display="block";
            p2.style.display="none";
        } else {
            document.body.style.backgroundColor = "pink";
            p2.style.display="block";
            p1.style.display="none";
        }
    }

    var x = window.matchMedia("(max-width: 700px)");
    myFunction(x) // Call listener function at run time

    x.addListener(myFunction) // Attach listener function on state changes
};