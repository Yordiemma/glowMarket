export type CartItem={productId:string;name:string;brand:string;priceAmount:number;stock:number;quantity:number;imageUrl:string|null;businessId:string;sellerName:string};
export const CART_KEY="glowmarket-cart";
export function readCart():CartItem[]{if(typeof window==="undefined")return[];try{return JSON.parse(localStorage.getItem(CART_KEY)||"[]")}catch{return[]}}
export function writeCart(items:CartItem[]){localStorage.setItem(CART_KEY,JSON.stringify(items));window.dispatchEvent(new Event("glowmarket-cart"))}
