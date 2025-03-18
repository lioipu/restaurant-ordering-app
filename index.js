import {menuArray} from '/data.js'

const _DISCOUNT = 0.5
let totalItems = []
let isClicked = false
let isOrdered = false
let discountObj = {
    name: "meal deal",
    discount: 0
}

document.addEventListener('click', e => {
    if(e.target.dataset.addItemBtn === '0'){
        handlePizzaClickItemBtn()
    } else if(e.target.dataset.addItemBtn === '1'){
        handleHamburgerClickItemBtn()
    } else if(e.target.dataset.addItemBtn === '2'){
        handleBeerClickItemBtn()
    } else if(e.target.dataset.rmItemBtn === '0'){
        handleRemoveClickPizzaBtn()
    } else if(e.target.dataset.rmItemBtn === '1'){
        handleRemoveClickHamburgerBtn()
    } else if(e.target.dataset.rmItemBtn === '2'){
        handleRemoveClickBeerBtn()
    } else if(e.target.id === "complete-order-btn"){
        handleClickCompleteOrderBtn()
    } else if(!e.target.dataset.cardDetails){
        handleClickAnywhere()
    } else if(e.target.id === 'pay-btn'){
        handleClickPayBtn()
    }
})

if(localStorage.getItem('totalItems')){
    totalItems = JSON.parse(localStorage.getItem('totalItems'))

}

function saveToLocalStorage(){
    localStorage.setItem('totalItems', JSON.stringify(totalItems))
}

function discount(){
    let disc
    let firstItem = totalItems.find(item => item.name === 'Pizza')
    let secondItem = totalItems.find(item => item.name === 'Beer')
    if(firstItem && secondItem){
        if(firstItem.amount > secondItem.amount){
            disc =  (( secondItem.price * secondItem.amount ) +
                    ( firstItem.price * secondItem.amount ) ) * 
                    _DISCOUNT
        } else {
            disc =  (( firstItem.price * firstItem.amount ) +
                    ( secondItem.price * firstItem.amount ) ) * 
                    _DISCOUNT
        }
    } else {
        return 0
    }
    return disc
}

function handlePizzaClickItemBtn(){
    menuArray[0].amount++
    if(!totalItems.includes(menuArray[0])){
        totalItems.push(menuArray[0])
    }
    isOrdered = false
    saveToLocalStorage()
    render()
}

function handleHamburgerClickItemBtn(){
    menuArray[1].amount++
    if(!totalItems.includes(menuArray[1])){
        totalItems.push(menuArray[1])
    }
    isOrdered = false
    saveToLocalStorage()
    render()
}

function handleBeerClickItemBtn(){
    menuArray[2].amount++
    if(!totalItems.includes(menuArray[2])){
        totalItems.push(menuArray[2])
    }
    isOrdered = false
    saveToLocalStorage()
    render()
}

function handleRemoveClickPizzaBtn(){
    if( ( --menuArray[0].amount ) < 1){
        totalItems.splice(totalItems.indexOf(menuArray[0]), 1)
    }
    saveToLocalStorage()
    render()
}

function handleRemoveClickHamburgerBtn(){
    if( ( --menuArray[1].amount ) < 1){
        totalItems.splice(totalItems.indexOf(menuArray[1]), 1)
    }
    saveToLocalStorage()
    render()
}

function handleRemoveClickBeerBtn(){
    if( ( --menuArray[2].amount ) < 1){
        totalItems.splice(totalItems.indexOf(menuArray[2]), 1)
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
    isOrdered = true
    isClicked = false
    const inputCardInfoChildrens = document.getElementById('input-card-info').children
    for(const children of inputCardInfoChildrens){
        
        if(children.value === ''){

        }
        children.value = ''
    }

    while(totalItems.length > 0){
        totalItems.pop().amount = 0
    }
    console.log(totalItems.length)
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