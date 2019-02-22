//On attend le chargement du DOM car le script est asynchrone
document.addEventListener('DOMContentLoaded', function() {

    new Carousel (document.querySelector('#diaporama'), {
        slidesVisible: 1, 
        slidesToScroll: 1, 
        loop: false
    })
})


let $map = document.querySelector('#carte');

const initMap = function() {
    let map = new Map();
    map.load($map);
}

if($map !== null) {
    initMap();
}