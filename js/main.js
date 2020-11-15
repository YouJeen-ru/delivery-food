const cartButton = document.querySelector('#cart-button')
const modal = document.querySelector('.modal')
const close = document.querySelector('.close')


cartButton.addEventListener('click', ModalToggle)
close.addEventListener('click', ModalToggle)

function ModalToggle () {
    modal.classList.toggle('is-open')
}


const buttonAuth = document.querySelector('.button-auth')
const modalAuth = document.querySelector('.modal-auth')
const closeAuth = document.querySelector('.close-auth')
const logInForm = document.querySelector('#logInForm')
const logInInput = document.querySelector('#login')
const userName = document.querySelector('.user-name')
const buttonOut = document.querySelector('.button-out')

let login = localStorage.getItem('LogDelivery')


function toggleModalAuth() {
    modalAuth.classList.toggle('is-open')
}


function authorized() {
    console.log('Authorized')


    function logOut() {
        login = null
        localStorage.removeItem('LogDelivery')
        buttonAuth.style.display = ''
        userName.style.display = ''
        buttonOut.style.display = ''
        buttonOut.removeEventListener('click', logOut)
        chekAuth()

    }

    userName.textContent = login
    buttonAuth.style.display = 'none'
    userName.style.display = 'inline'
    buttonOut.style.display = 'block'
    buttonOut.addEventListener('click', logOut)
}

function notAuthorized() {
    console.log('No authorized')


    function logIn(event) {
        event.preventDefault()
        login = logInInput.value

        localStorage.setItem('LogDelivery', login)

        toggleModalAuth()
        buttonAuth.removeEventListener('click',toggleModalAuth)
        closeAuth.removeEventListener('click',toggleModalAuth)
        logInForm.removeEventListener('submit', logIn)
        logInForm.reset()
        chekAuth()
    }
    buttonAuth.addEventListener('click',toggleModalAuth)
    closeAuth.addEventListener('click',toggleModalAuth)
    logInForm.addEventListener('submit', logIn)



}
function chekAuth() {
    if (login){
        authorized()
    }else {
        notAuthorized()
    }
}
chekAuth()


