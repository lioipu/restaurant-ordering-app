import {menuArray} from '/data.js'

let totalItems = []
let isClicked = false

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
    }
})

function handlePizzaClickItemBtn(){
    menuArray[0].amount++
    if(!totalItems.includes(menuArray[0])){
        totalItems.push(menuArray[0])
    }
    render()
}

function handleHamburgerClickItemBtn(){
    menuArray[1].amount++
    if(!totalItems.includes(menuArray[1])){
        totalItems.push(menuArray[1])
    }
    render()
}

function handleBeerClickItemBtn(){
    menuArray[2].amount++
    if(!totalItems.includes(menuArray[2])){
        totalItems.push(menuArray[2])
    }
    render()
}

function handleRemoveClickPizzaBtn(){
    if( ( --menuArray[0].amount ) < 1){
        totalItems.splice(totalItems.indexOf(menuArray[0]), 1)
    }
    render()
}

function handleRemoveClickHamburgerBtn(){
    if( ( --menuArray[1].amount ) < 1){
        totalItems.splice(totalItems.indexOf(menuArray[1]), 1)
    }
    render()
}

function handleRemoveClickBeerBtn(){
    if( ( --menuArray[2].amount ) < 1){
        totalItems.splice(totalItems.indexOf(menuArray[2]), 1)
    }
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

function getOrderListHtml() {
    let isHidden = 'hidden'
    if(isClicked){
        isHidden = ''
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

        if(totalItems.length > 0){
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
            feed += `
                </div>
                    <div class="item-content-sum">
                    <p id="name">Total Price:</p>
                    <p id="price">$${sum}</p>
                </div>
                <div id="complete-order">
                    <button id="complete-order-btn">Complete order</button>
                </div>
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
            <div id="pay-btn" >
                <button>Pay</button>
            </div>
        </div>`
    return feed
}

function render(){
    document.getElementById('order-list').innerHTML = getOrderListHtml()
}

render()