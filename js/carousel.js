class Carousel {
    /**
     * @param {HTMLElement} element
     * @param {Object} options
     * @param {Object} options.slidesToScroll Nombre d'éléments à faire défiler
     * @param {Object} options.slidesVisible Nombre d'éléments visible dans un slide
     * @param {Boolean} options.loop Indique si le carousel doit boucler 
     */

    constructor(element, options={}) { 
        //Définition
        this.element = element;
        this.options = Object.assign({}, {
            slidesToScroll: 1,
            slidesVisible: 1, 
            loop: false
        }, options)
        let children = [].slice.call(element.children); //accède seulement aux éléments qui sont des enfants
        this.isMobile = true;
        this.currentItem = 0;
        this.moveCallbacks = [];
        //Modification du DOM
        this.root = this.createDivWithClass('carousel');
        this.container = this.createDivWithClass('carousel__container');
        this.root.appendChild(this.container);
        this.element.appendChild(this.root);
        this.items = children.map((child) => {
            let item = this.createDivWithClass('carousel__item');
            item.appendChild(child);
            item.addEventListener('mouseover', this.pause.bind(this))
            item.addEventListener('mouseout', () => this.options.slidesToScroll = 1)
            this.container.appendChild(item);
            return item;
        })
        this.setStyle();
        this.createNavigation();
        this.timer();
        //Evènements
        this.moveCallbacks.forEach(callback => callback(0));
        this.onWindowResize(); //appelle la fonction dès le début 
        window.addEventListener('resize', this.onWindowResize.bind(this));
        this.root.addEventListener('keyup', (e) => {
            if (e.key === 'ArrowRight' || e.key === 'Right') { //gère tous les navigateurs
                this.next();
            } else if (e.key == 'ArrowLeft' || e.key === 'Left') {
                this.prev();
            }
        })
    }

    /**
     * @description Applique les bonnes dimensions aux éléments du carousel
     */
    setStyle() {
        let ratio = this.items.length / this.slidesVisible;
        this.container.style.width = (ratio * 100) + "%";
        this.items.forEach(item => item.style.width = ((100 / this.slidesVisible) / ratio) + "%")
    }

    /**
     * @description Ajoute les boutons de navigation
     */
    createNavigation() {
        let nextButton = this.createDivWithClass('carousel__next');
        let prevButton = this.createDivWithClass('carousel__prev');
        let pauseButton = this.createDivWithClass('carousel__pause');
        this.root.appendChild(nextButton);
        this.root.appendChild(prevButton);
        this.root.appendChild(pauseButton);
        nextButton.addEventListener('click', this.next.bind(this));
        prevButton.addEventListener('click', this.prev.bind(this));
        pauseButton.addEventListener('mouseover', this.pause.bind(this));
        pauseButton.addEventListener('mouseout', () => this.options.slidesToScroll = 1);
        this.onMove(index => {
            if(this.options.loop === true) {
                return
            }
            if(index === 0) {
                prevButton.classList.add('carousel__prev--hidden')
            } else {
                prevButton.classList.remove('carousel__prev--hidden')
            }
            if(this.items[this.currentItem + this.slidesVisible] === undefined){
                nextButton.classList.add('carousel__next--hidden')
            } else {
                nextButton.classList.remove('carousel__next--hidden')
            }
        })
    }

    /**
     * @description Fait défiler les slides vers la droite
     */
    next() {
        this.goToItem(this.currentItem + this.slidesToScroll)
    }

    /**
     * @description Fait défiler les slides vers la gauche
     */
    prev() {
        this.goToItem(this.currentItem - this.slidesToScroll)
    }

    /**
     * @description Pause le défilement
     */
    pause() {
        this.options.slidesToScroll = 0;
    }

    /**
     * Défilement automatique des slides toutes les 5s
     */
    timer() {
        setInterval( () => {
            window.addEventListener('load', this.next())
        }, 5000);
    }
    
    /**
     * Déplace le carousel vers l'élément ciblé
     * @param {number} index
     */
    goToItem(index) {
        if (index < 0) {
            if (this.options.loop) {
                index = this.items.length - this.slidesVisible
            } else {
                return
            }
        } else if (index >= this.items.length || (this.items[this.currentItem + this.slidesVisible] === undefined && index > this.currentItem)) {
            if (this.options.loop) {
                index = 0
            } else {
                return
            }
            index = 0;
        }
        let translateX = index * -100 / this.items.length //nombre négatif pour une translation par la gauche
        this.container.style.transform = 'translate3d(' +translateX + '%, 0, 0)';
        this.currentItem = index;
        this.moveCallbacks.forEach(callback => callback(index)); 
    }

    /** @param {moveCallbacks} callback ...*/
    onMove(callback) {
        this.moveCallbacks.push(callback)
    }

    /**
     * @description Redéfini le style si la fenêtre est redimensionnée
     */
    onWindowResize() {
        let mobile = window.innerWidth < 600; //on est sur mobile si la largeur de la fenêtre est inférieure à 600px
        if (mobile !== this.isMobile) { 
            this.isMobile = mobile;
            this.setStyle();
            this.moveCallbacks.forEach(callback => callback(this.currentItem))
        }
    }

    /**
     * Crée une div avec un nom de classe
     * @param {string} className
     * @returns {HTMLElement}
     */
    createDivWithClass (className) {
        let div = document.createElement('div');
        div.setAttribute('class', className)
        return div
    }

    /**
     * @returns {number} Nombre de slides à faire défiler
     */
    get slidesToScroll() {
        return this.isMobile ? 1 : this.options.slidesToScroll;
    }

    /**
     * @returns {number} Nombre de slides visibles
     */
    get slidesVisible() {
        return this.isMobile ? 1 : this.options.slidesVisible;
    }
}


