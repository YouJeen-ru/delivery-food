const cartButton = document.querySelector('#cart-button')
const modal = document.querySelector('.modal')
const close = document.querySelector('.close')


cartButton.addEventListener('click', ModalToggle)
close.addEventListener('click', ModalToggle)

function ModalToggle () {
    modal.classList.toggle('is-open')
}

new WOW().init();