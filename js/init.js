//On attend le chargement du DOM car le script est asynchrone
document.addEventListener('DOMContentLoaded', () => {

    new Carousel (document.querySelector('#diaporama'), {
        slidesVisible: 1, 
        slidesToScroll: 1, 
        loop: true
    })
})

//Selectionne le container carte dans le html
let $map = document.querySelector('#carte');

//Initialisation de la map
const initMap = () => {
    let map = new Map();
    map.load($map);
}

if($map !== null) {
    initMap();
}