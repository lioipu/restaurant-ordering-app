import {menuArray} from '/data.js'
import {discountObj} from '/data.js'

const DISCOUNT_RATE = 0.5;
const ITEM_IDS = {
    PIZZA: '0',
    HAMBURGER: '1',
    BEER: '2',
}

let totalItems = []
let isClicked = false
let isOrdered = false


document.addEventListener('click', e => {
    if(e.target.dataset.addItemBtn === ITEM_IDS.PIZZA){
        handleClickAddItemBtn(menuArray[0].name)
    } else if(e.target.dataset.addItemBtn === ITEM_IDS.HAMBURGER){
        handleClickAddItemBtn(menuArray[1].name)
    } else if(e.target.dataset.addItemBtn === ITEM_IDS.BEER){
        handleClickAddItemBtn(menuArray[2].name)
    } else if(e.target.dataset.rmItemBtn === ITEM_IDS.PIZZA){
        handleClickRemoveItemBtn(menuArray[0].name)
    } else if(e.target.dataset.rmItemBtn === ITEM_IDS.HAMBURGER){
        handleClickRemoveItemBtn(menuArray[1].name)
    } else if(e.target.dataset.rmItemBtn === ITEM_IDS.BEER){
        handleClickRemoveItemBtn(menuArray[2].name)
    } else if(e.target.id === "complete-order-btn"){
        handleClickCompleteOrderBtn()
    } else if(!e.target.dataset.cardDetails){
        handleClickAnywhere()
    } else if(e.target.id === 'pay-btn'){
        handleClickPayBtn()
    }
})

// localStorage.clear()
if(localStorage.getItem('totalItems')){
    totalItems = JSON.parse(localStorage.getItem('totalItems'))

} 


function saveToLocalStorage(){
    localStorage.setItem('totalItems', JSON.stringify(totalItems))
}

function discount() {
    const discountableItems = ['Pizza', 'Beer']; // Can be extended 
    const items = discountableItems.map(name => 
        totalItems.find(item => item.name === name)).filter(Boolean);

    if (items.length === 2) {
        const [firstItem, secondItem] = items;
        const minAmount = Math.min(firstItem.amount, secondItem.amount);
        return ((firstItem.price + secondItem.price) * minAmount) * DISCOUNT_RATE;
    }
    return 0;
}

function handleClickAddItemBtn(itemName){
    let tmp = totalItems.find(item => item.name === itemName)
    if(!tmp){
        totalItems.push(menuArray.find(item => item.name === itemName))
        totalItems.find(item => item.name === itemName).amount++
    } else {
        tmp.amount++
    }
    isOrdered = false
    saveToLocalStorage()
    render()
}

function handleClickRemoveItemBtn(itemName){
    let tmp = totalItems.find(item => item.name === itemName)
    if( ( --tmp.amount ) < 1){
        totalItems.splice(totalItems.indexOf(tmp), 1)
    }
    saveToLocalStorage()
    render()
}


function handleClickCompleteOrderBtn(){
    if(isClicked){
        isClicked = false
    } else {
        isClicked = true
    }
    render()    
}

function handleClickAnywhere(){
    isClicked = false
        render()
}

function handleClickPayBtn(){
    const inputCardInfoChildren = document.getElementById('input-card-info').children
    for(const child of inputCardInfoChildren){
        if(child.value === ''){
            document.getElementById('error-message').innerText = 'Please fill in all fields.';
            return
        }
    }
    document.getElementById('error-message').innerText = ''; // Clear error message
    for(const child of inputCardInfoChildren) {
        child.value = ''
    }

    isClicked = false
    isOrdered = true

    while(totalItems.length > 0){
        totalItems.pop().amount = 0
    }
    totalItems = []
    saveToLocalStorage()
    render()
}

function getOrderListHtml() {
    
    let isHidden = 'hidden'
    let discStr = ''
    
    if(isClicked){
        isHidden = ''
    }

    if(discountObj.discount = discount()){
        discStr += `
                <div id="discount" class="item-content-sum">
                    <p id="name">${discountObj.name}</p>
                    <p id="price">- $${discountObj.discount}</p>
                </div>
        `
    }

    let feed = menuArray.map(item => {
            return `<div class="container">
                <p id="logo">${item.emoji}</p>
                <div id="item-info">
                    <h3>${item.name}</h3>
                    <p id="extras">${item.ingredients}</p>
                    <p id="price">$${item.price}</p>
                </div>
                <button id="add-item-btn" data-add-item-btn="${item.id}">+</button>
            </div>`
        }).join('')

        if( ( totalItems.length > 0 ) && !isOrdered){
            feed += `<div id="total-order">
                        <div id="order-items">
                            <h1>Your Order</h1>`
            feed += 
            totalItems.map(item => {
                return `
                        <div class="item-content-sum">
                            <p id="name">${item.name}</p>
                            <button id="remove-btn" data-rm-item-btn="${item.id}">remove</button>
                            <p id="price">$${item.price * item.amount}</p>
                        </div>`
            }).join('')
            let sum =  totalItems.reduce( (accumulator, currentVal) => {
                return accumulator + ( currentVal.price * currentVal.amount ) 
            }, 0)
            feed += discStr
            feed += `
                </div>
                <div class="item-content-sum">
                    <p id="name">Total Price:</p>
                    <p id="price">$${sum - discountObj.discount}</p>
                    </div>
                <div id="complete-order">
                    <button id="complete-order-btn">Complete order</button>
                </div>
            </div>`            
        } else if(isOrdered){
            feed += `<div id="final-msg">
                <p>Thanks, James! Your order is on its way!</p>
            </div>`
        }

        feed += `
        <div id="card-details" class="${isHidden}" data-card-details="card-details">
            <div id="title" data-card-details="card-details">
                <p data-card-details="card-details">Enter card details</p>
            </div>
            <div id="input-card-info" data-card-details="card-details">
                <input placeholder="Enter your name" data-card-details="card-details">
                <input placeholder="Enter your number" data-card-details="card-details">
                <input placeholder="Enter CVV" data-card-details="card-details">
                <div id="error-message"></div>
            </div>
            
            <div data-card-details="card-details">
                <button id="pay-btn" data-card-details="card-details">Pay</button>
            </div>
        </div>`

    return feed
}

function render(){
    document.getElementById('order-list').innerHTML = getOrderListHtml()
}

render()