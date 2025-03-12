import {menuArray} from '/data.js'

let totalItems = []
let cnt = 0

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
    }
})

function handlePizzaClickItemBtn(){
    menuArray[0].amount++
    render()
}

function handleHamburgerClickItemBtn(){
    menuArray[1].amount++
    render()
    
}

function handleBeerClickItemBtn(){
    menuArray[2].amount++
    render()

}

function handleRemoveClickPizzaBtn(){
    menuArray[0].amount--
    render()
}
function handleRemoveClickHamburgerBtn(){
    menuArray[1].amount--
    render()
}
function handleRemoveClickBeerBtn(){
    menuArray[2].amount--
    render()
}


function getOrderListHtml() {

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
        
        if(menuArray[0].amount > 0 || menuArray[1].amount > 0 || menuArray[2].amount > 0 ){
            feed += 
            `<div id="total-order">
                <div id="order-items">
                    <h1>Your Order</h1>`
            if(menuArray[0].amount > 0){
                feed += 
                `
                <div class="item-content-sum">
                    <p id="name">${menuArray[0].name}</p>
                    <button id="remove-btn" data-rm-item-btn="${menuArray[0].id}">remove</button>
                    <p id="price">$${menuArray[0].price * menuArray[0].amount}</p>
                </div>`
            } 
            if(menuArray[1].amount > 0){
                feed += 
                `
                <div class="item-content-sum">
                    <p id="name">${menuArray[1].name}</p>
                    <button id="remove-btn" data-rm-item-btn="${menuArray[1].id}">remove</button>
                    <p id="price">$${menuArray[1].price * menuArray[1].amount}</p>
                </div>`
            } 
            if(menuArray[2].amount > 0) {
                feed += 
                `
                <div class="item-content-sum">
                    <p id="name">${menuArray[2].name}</p>
                    <button id="remove-btn" data-rm-item-btn="${menuArray[2].id}">remove</button>
                    <p id="price">$${menuArray[2].price * menuArray[2].amount}</p
                </div>
                </div>`
            }
            let sum =   menuArray[0].price * menuArray[0].amount +
                        menuArray[1].price * menuArray[1].amount +
                        menuArray[2].price * menuArray[2].amount
            feed += `
            <div class="item-content-sum">
                <p>Total Price:${sum}</p>
            </div>
            </div>`
        }
        return feed
}

function render(){
    document.getElementById('order-list').innerHTML = getOrderListHtml()
}

render()