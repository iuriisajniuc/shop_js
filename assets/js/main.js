import { basketContainer, eraseBasket, createBasket } from "./main.min.js";

const contentContainer = document.querySelector("#content-container");
const cartCounterLabel = document.querySelector("#cart-counter");
const basketCartBtn = document.querySelector(".page-header__cart-btn");

let cartCounter = 0;
let cartPrice = 0;
let productInBasketArr = null;
let restoreHTML = null;

const cartCounterLabelPrint = (c) =>
  c > 0
    ? (cartCounterLabel.innerHTML = `${c}`)
    : (cartCounterLabel.style.display = "none");

const incrementCounter = () => {
  cartCounterLabel.innerHTML = `${++cartCounter}`;
  if (cartCounter === 1) cartCounterLabel.style.display = "block";
  // if (cartCounter < 1) cartCounterLabel.style.display = "none";
};

const getMockData = (t) =>
  +t.parentElement.previousElementSibling.innerHTML.replace(
    /^\$(\d+)\s\D+(\d+).*$/,
    "$1.$2"
  );

const getPrice = (t, price) => Math.round((price + getMockData(t)) * 100) / 100;

const getProductName = (t) =>
  t.parentElement.parentElement.querySelector(".item-title").innerHTML;

const disabledControls = (t, fn) => {
  t.disabled = true;
  contentContainer.removeEventListener("click", fn);
};

const enabledControls = (t, fn) => {
  t.disabled = false;
  contentContainer.addEventListener("click", fn);
};

const writeProductToBasket = (t, arr) => {
  let item = null;
  let product = {
    productName: getProductName(t),
    productCode: getProductName(t),
    price: getMockData(t),
    count: 1,
    sum: getMockData(t),
  };
  if (arr !== null) {
    let i = 0;

    while (item === null && i < arr.length) {
      arr[i].productCode === getProductName(t) ? (item = i) : i++;
    }
    if (item === null) arr.push(product);
    else {
      arr[item].count++;
      arr[item].sum = Math.round((arr[item].sum + arr[item].price) * 100) / 100;
    }
  } else arr = [product];

  return arr;
};

const btnClickHandler = (e) => {
  const target = e.target;

  if (target && target.matches(".item-actions__cart")) {
    if (basketContainer !== null) eraseBasket();

    incrementCounter();

    productInBasketArr = writeProductToBasket(target, productInBasketArr);

    restoreHTML = target.innerHTML;

    cartPrice = getPrice(target, cartPrice);
    target.innerHTML = `Added ${cartPrice.toFixed(2)}$`;
    disabledControls(target, btnClickHandler);

    setTimeout(() => {
      target.innerHTML = restoreHTML;
      enabledControls(target, btnClickHandler);
    }, 300);
  }
};

const basketBtnHandler = (e) => {
  const target = e.target;

  if (target) {
    eraseBasket();
    if (!target.classList.contains("basket__btn-next")) {
      if (target.classList.contains("basket__btn-order")) {
        // recieveOrder();
      }
      cartPrice = 0;
      productInBasketArr = null;
      cartCounter = 0;
      cartCounterLabelPrint(cartCounter);
    }
  }
};

const createBasketWork = (c, pArr) => {
  createBasket(c, pArr);
  const basketBtn = document.querySelector("#btn-container");
  basketBtn.addEventListener("click", basketBtnHandler);
  basketContainer.addEventListener("click", delProductHandler);
};

const delProductHandler = (e) => {
  const target = e.target;

  if (target && target.matches(".basket__item-del")) {
    let b = true;
    let i = 0;

    while (b && i < productInBasketArr.length) {
      if (
        productInBasketArr[i].productCode === target.parentElement.dataset.code
      ) {
        cartPrice -= productInBasketArr[i].sum;
        cartCounter -= productInBasketArr[i].count;

        productInBasketArr.splice(i, 1);
        b = false;
      } else i++;
    }
    eraseBasket();
    createBasketWork(cartCounter, productInBasketArr);
    cartCounterLabelPrint(cartCounter);
  }
};

const basketClickHandler = (e) => {
  const target = e.target;
  if (target) {
    createBasketWork(cartCounter, productInBasketArr);
  }
};

const shopInit = () => {
  contentContainer.addEventListener("click", btnClickHandler);
  basketCartBtn.addEventListener("click", basketClickHandler);
};

shopInit();
