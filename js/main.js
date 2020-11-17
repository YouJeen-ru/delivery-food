'use strict'
import Swiper from 'https://unpkg.com/swiper/swiper-bundle.esm.browser.min.js'

const RED_COLOR = '#ff0000'

const cartButton = document.querySelector('#cart-button')
const modal = document.querySelector('.modal')
const close = document.querySelector('.close')
const buttonAuth = document.querySelector('.button-auth')
const modalAuth = document.querySelector('.modal-auth')
const closeAuth = document.querySelector('.close-auth')
const logInForm = document.querySelector('#logInForm')
const logInInput = document.querySelector('#login')
const userName = document.querySelector('.user-name')
const buttonOut = document.querySelector('.button-out')
const cardsRestaurants = document.querySelector('.cards-restaurants')
const containerPromo = document.querySelector('.container-promo')
const restaurants = document.querySelector('.restaurants')
const menu = document.querySelector('.menu')
const logo = document.querySelector('.logo')
const cardsMenu = document.querySelector('.cards-menu')

const restaurantTitle = document.querySelector('.restaurant-title')
const restaurantRating = document.querySelector('.rating')
const restaurantPrice = document.querySelector('.price')
const restaurantCategory = document.querySelector('.category')

const inputSearch = document.querySelector('.input-search')


let login = localStorage.getItem('LogDelivery')

const getData = async function (url) {
    const response = await fetch(url)
    if (!response.ok) {
        throw new Error(`Ошибка по адресу ${url}, статус ошибка ${response.status}`)
    }
    return await response.json()
}


const validName = function (str) {
    const regName = /^[a-zA-Z][a-zA-Z0-9-_\.]{1,20}$/
    return regName.test(str)
}


const ModalToggle = function () {
    modal.classList.toggle('is-open')
}

const toggleModalAuth = function () {
    modalAuth.classList.toggle('is-open')
    logInInput.style.borderColor = ''
    if (modalAuth.classList.contains('is-open')) {
        disableScroll()
    } else {
        enableScroll()
    }

}


function authorized() {
    console.log('Authorized')


    function logOut() {
        login = null
        localStorage.removeItem('LogDelivery')
        buttonAuth.style.display = ''
        userName.style.display = ''
        buttonOut.style.display = ''
        cartButton.style.display = ''
        buttonOut.removeEventListener('click', logOut)
        chekAuth()

    }

    userName.textContent = login
    buttonAuth.style.display = 'none'
    userName.style.display = 'inline'
    buttonOut.style.display = 'flex'
    cartButton.style.display = 'flex'
    buttonOut.addEventListener('click', logOut)
}

function notAuthorized() {
    console.log('No authorized')


    function logIn(event) {
        event.preventDefault()
        if (validName(logInInput.value)) {
            login = logInInput.value
            localStorage.setItem('LogDelivery', login)
            toggleModalAuth()


            buttonAuth.removeEventListener('click', toggleModalAuth)
            closeAuth.removeEventListener('click', toggleModalAuth)
            logInForm.removeEventListener('submit', logIn)
            logInForm.reset()
            chekAuth()
        } else {
            logInInput.style.borderColor = RED_COLOR
            logInInput.value = ''
        }

    }

    buttonAuth.addEventListener('click', toggleModalAuth)
    closeAuth.addEventListener('click', toggleModalAuth)
    logInForm.addEventListener('submit', logIn)
    modalAuth.addEventListener('click', function (e) {
        if (e.target.classList.contains('is-open')) {
            toggleModalAuth()

        }
    })


}

function chekAuth() {
    if (login) {
        authorized()
    } else {
        notAuthorized()
    }
}

function createCardRestaurant({image, kitchen, name, price, stars, products, time_of_delivery: timeOfDelivery}) {
    const cardRestaurant = document.createElement('a')
    cardRestaurant.className = 'card card-restaurant'
    cardRestaurant.products = products
    cardRestaurant.info = {kitchen, name, price, stars}


    const card = `
                    
                    <img src=${image} alt=${name} class="card-image"/>
                    <div class="card-text">
                        <div class="card-heading">
                            <h3 class="card-title">${name}</h3>
                            <span class="card-tag tag">${timeOfDelivery}</span>
                        </div>
                        <div class="card-info">
                            <div class="rating">
                                ${stars}
                            </div>
                            <div class="price">От ${price} ₽</div>
                            <div class="category">${kitchen}</div>
                        </div>
                    </div>
                
    `;
    cardRestaurant.insertAdjacentHTML('beforeend', card)
    cardsRestaurants.insertAdjacentElement('beforeend', cardRestaurant)

}


function createCardGood({description, image, name, price,}) {


    const card = document.createElement('div')
    card.className = 'card'

    card.insertAdjacentHTML('beforeend', `
                    <img src=${image} alt=${name} class="card-image"/>
                    <div class="card-text">
                        <div class="card-heading">
                            <h3 class="card-title card-title-reg">${name}</h3>
                        </div>
                        <div class="card-info">
                            <p class="ingredients">
                            ${description}
                            </p>
                        </div>
                        <div class="card-buttons">
                            <button class="button button-primary button-add-cart">
                                <span class="button-card-text">В корзину</span>
                                <span class="button-cart-svg"></span>
                            </button>
                            <strong class="card-price-bold">${price} ₽</strong>
                        </div>
                    </div>
    `);
    cardsMenu.insertAdjacentElement('beforeend', card)
}


function openGoods(event) {
    const target = event.target

    if (login) {
        const restaurant = target.closest('.card-restaurant')
        if (restaurant) {
            cardsMenu.textContent = ''
            containerPromo.classList.add('hide')
            restaurants.classList.add('hide')
            menu.classList.remove('hide')

            const {name, kitchen, price, stars} = restaurant.info

            restaurantTitle.textContent = name
            restaurantRating.textContent = stars
            restaurantPrice.textContent = `От ${price} ₽`
            restaurantCategory.textContent = kitchen


            getData(`./db/${restaurant.products}`).then(function (data) {
                data.forEach(createCardGood)
            })
        }
    } else {
        toggleModalAuth()
    }
}

function init() {
    getData('./db/partners.json').then(function (data) {
        data.forEach(createCardRestaurant)
    })


    cartButton.addEventListener('click', ModalToggle)
    close.addEventListener('click', ModalToggle)
    cardsRestaurants.addEventListener('click', openGoods)
    logo.addEventListener('click', function () {
        containerPromo.classList.remove('hide')
        restaurants.classList.remove('hide')
        menu.classList.add('hide')
    })

    inputSearch.addEventListener('keypress', function (event) {

        if (event.charCode === 13) {
            const value = event.target.value.trim()

            if (!value) {
                event.target.style.backgroundColor = RED_COLOR
                event.target.value = ''
                setTimeout(function () {
                    event.target.style.backgroundColor = ''
                }, 1500)
                return
            }

            getData('./db/partners.json')
                .then(function (data) {
                    return data.map(function (partner) {
                        return partner.products
                    })
                })
                .then(function (linkProducts) {
                    cardsMenu.textContent = '';
                    linkProducts.forEach(function (link) {
                        getData(`./db/${link}`)
                            .then(function (data) {

                                const resultSearch = data.filter(function (item) {
                                    const name = item.name.toLowerCase()
                                    return name.includes(value.toLowerCase())
                                })

                                containerPromo.classList.add('hide')
                                restaurants.classList.add('hide')
                                menu.classList.remove('hide')


                                restaurantTitle.textContent = 'Результат поиска'
                                restaurantRating.textContent = ''
                                restaurantPrice.textContent = ''
                                restaurantCategory.textContent = 'разная кухня'
                                resultSearch.forEach(createCardGood)
                            })
                    })
                })
        }
    })


    chekAuth()

}

init()


// slider

new Swiper('.swiper-container', {
    sliderPerView: 1,
    loop: true,
    autoplay: true,
    grabCursor: true,
    effect: 'coverflow',
    pagination: {
        el: '.swiper-pagination',
        clickable: true,
    },

})

