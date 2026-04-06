import { createContext, useContext, useEffect, useMemo, useState } from "react"

const ShopContext = createContext(null)

const CART_KEY = "velora-hair-cart"

function readStoredCart() {
  if (typeof window === "undefined") {
    return []
  }

  const stored = window.localStorage.getItem(CART_KEY)

  if (!stored) {
    return []
  }

  try {
    return JSON.parse(stored)
  } catch {
    return []
  }
}

export function ShopProvider({ children }) {
  const [cartItems, setCartItems] = useState(readStoredCart)
  const [selectedPayment, setSelectedPayment] = useState("stripe")

  useEffect(() => {
    window.localStorage.setItem(CART_KEY, JSON.stringify(cartItems))
  }, [cartItems])

  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0)
  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  )

  const shipping = cartItems.length > 0 ? 19 : 0
  const vat = subtotal * 0.25
  const total = subtotal + shipping + vat

  function addToCart(product, quantity = 1) {
    setCartItems((current) => {
      const existingItem = current.find((item) => item.id === product.id)

      if (existingItem) {
        return current.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item,
        )
      }

      return [
        ...current,
        {
          id: product.id,
          name: product.name,
          price: product.price,
          image: product.image,
          category: product.category,
          length: product.length,
          quantity,
        },
      ]
    })
  }

  function updateQuantity(id, quantity) {
    if (quantity <= 0) {
      removeFromCart(id)
      return
    }

    setCartItems((current) =>
      current.map((item) => (item.id === id ? { ...item, quantity } : item)),
    )
  }

  function removeFromCart(id) {
    setCartItems((current) => current.filter((item) => item.id !== id))
  }

  function clearCart() {
    setCartItems([])
  }

  const value = useMemo(
    () => ({
      addToCart,
      cartCount,
      cartItems,
      clearCart,
      removeFromCart,
      selectedPayment,
      setSelectedPayment,
      shipping,
      subtotal,
      total,
      updateQuantity,
      vat,
    }),
    [cartCount, cartItems, selectedPayment, shipping, subtotal, total, vat],
  )

  return <ShopContext.Provider value={value}>{children}</ShopContext.Provider>
}

export function useShop() {
  const value = useContext(ShopContext)

  if (!value) {
    throw new Error("useShop must be used within ShopProvider")
  }

  return value
}
