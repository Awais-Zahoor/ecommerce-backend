import { createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import axios from 'axios'

export const ShopContext = createContext()

const ShopContextProvider = (props) => {

     const currency = 'Rs.';
      const delivery_fee = 500;
     const backendUrl = import.meta.env.VITE_BACKEND_URL
     const [search, setSearch] = useState('')
     const [showSearch, setShowSearch] = useState(false);
     const [cartItems, setCartItems] = useState({});
     const [wishlist, setWishlist] = useState(() => {
          try {
               const saved = localStorage.getItem('wishlist');
               return saved ? JSON.parse(saved) : [];
          } catch (e) { return []; }
     });
     const [isDarkMode, setIsDarkMode] = useState(localStorage.getItem('theme') === 'dark');
     const [products, setProducts] = useState([])
     const [sunglasses, setSunglasses] = useState([])
     const [branding, setBranding] = useState(() => {
          try {
               const saved = localStorage.getItem('branding');
               return saved ? JSON.parse(saved) : { logo: "", heroBanner: "" };
          } catch (e) { return { logo: "", heroBanner: "" }; }
     });
     const [token, setToken] = useState('')
     const [couponCode, setCouponCode] = useState('')
     const [appliedDiscount, setAppliedDiscount] = useState(null) // { _id, code, name, type, value, discountAmount }
     const [autoDiscounts, setAutoDiscounts] = useState([])   // free_shipping / auto_category
     const navigate = useNavigate();

     // Helper to find any product (clothing or sunglasses)
     const findAnyProduct = (itemId) => {
          return products.find(p => p._id === itemId) || sunglasses.find(s => s._id === itemId);
     }

     // Toggle Wishlist
     const toggleWishlist = (itemId) => {
          setWishlist((prev) => {
               const isAdded = prev.includes(itemId);
               const newWishlist = isAdded
                    ? prev.filter((id) => id !== itemId)
                    : [...prev, itemId];
               localStorage.setItem('wishlist', JSON.stringify(newWishlist));
               if (!isAdded) {
                    toast.success('Added to wishlist');
               } else {
                    toast.info('Removed from wishlist');
               }
               return newWishlist;
          });
     }

     // Sync Theme with DOM
     useEffect(() => {
          if (isDarkMode) {
               document.documentElement.classList.add('dark');
          } else {
               document.documentElement.classList.remove('dark');
          }
     }, [isDarkMode]);

     // Toggle Theme
     const toggleTheme = () => {
          const nextTheme = !isDarkMode;
          setIsDarkMode(nextTheme);
          localStorage.setItem('theme', nextTheme ? 'dark' : 'light');
     }

     const addToCart = async (itemId, size) => {

          if (!size) {
               toast.error('Select Product Size');
               return;
          }

          let cartData = structuredClone(cartItems);
          const product = findAnyProduct(itemId);
          const currentQty = cartData[itemId]?.[size] || 0;

          // Check stock
          const stockQty = product?.stockQuantity !== undefined ? product.stockQuantity : product?.stock;
          if (product && stockQty !== undefined) {
               if (currentQty + 1 > stockQty) {
                    toast.error('Out of stock');
                    return;
               }
          }

          if (cartData[itemId]) {
               if (cartData[itemId][size]) {
                    cartData[itemId][size] += 1;
               }
               else {
                    cartData[itemId][size] = 1;
               }
          }
          else {
               cartData[itemId] = {};
               cartData[itemId][size] = 1;
          }
          setCartItems(cartData);
          toast.success("Product added to cart");

          if (token) {
               try {
                    await axios.post(backendUrl + '/api/cart/add', { itemId, size }, { headers: { token } })

               } catch (error) {
                    console.log(error)
                    toast.error(error.message)

               }

          }
     }


     const getCartCount = () => {
          let totalCount = 0;
          for (const items in cartItems) {
               for (const item in cartItems[items]) {
                    try {
                         if (cartItems[items][item] > 0) {
                              totalCount += cartItems[items][item];
                         }

                    } catch (error) {

                    }

               }
          }
          return totalCount;
     }


     const updateQuantity = async (itemId, size, quantity) => {

          const product = findAnyProduct(itemId);
          const stockQty = product?.stockQuantity !== undefined ? product.stockQuantity : product?.stock;
          
          if (product && stockQty !== undefined && quantity > stockQty) {
               toast.error('Out of stock');
               return;
          }

          let cartData = structuredClone(cartItems);
          cartData[itemId][size] = quantity;
          setCartItems(cartData);

          if (quantity === 0) {
               toast.info("Product removed from cart");
          } else {
               toast.info("Quantity updated");
          }

          if (token) {
               try {
                    await axios.post(backendUrl + '/api/cart/update', { itemId, size, quantity }, { headers: { token } })
               } catch (error) {
                    console.log(error)
                    toast.error(error.message)

               }

          }

     }

     const getCartAmount = () => {
          let totalAmount = 0;
          for (const items in cartItems) {
               let itemInfo = findAnyProduct(items);
               for (const item in cartItems[items]) {
                    try {
                         if (itemInfo && cartItems[items][item] > 0) {
                              totalAmount += itemInfo.price * cartItems[items][item];
                         }

                    } catch (error) {

                    }
               }
          }
          return totalAmount;
     }

     const getProductsData = async () => {
          try {

               const response = await axios.get(backendUrl + '/api/product/list')
               if (response.data.success) {
                    setProducts(response.data.products.reverse())
               } else {
                    toast.error(response.data.message)
               }

          } catch (error) {
               console.log(error)
               toast.error(error.message)
          }
     }

     const getSunglassesData = async () => {
          try {
               const response = await axios.get(backendUrl + '/api/sunglasses/list')
               if (response.data.success) {
                    setSunglasses(response.data.sunglasses.reverse())
               }
          } catch (error) {
               console.log(error)
          }
     }

     const getBrandingData = async () => {
          try {
               const response = await axios.get(backendUrl + '/api/branding/get')
               if (response.data.success && response.data.branding) {
                    setBranding(response.data.branding)
                    localStorage.setItem('branding', JSON.stringify(response.data.branding))
               }
          } catch (error) {
               console.log(error)
          }
     }

     // ── Discount Helpers ──────────────────────────────────────────────────────
     const applyDiscountCode = async (code) => {
          if (!token) { toast.error('Please login to apply coupons.'); return false; }
          try {
               const cartAmt = getCartAmount();
               // Build simple items array for BOGO calculation
               const cartItemsArr = [];
               for (const itemId in cartItems) {
                    const prod = findAnyProduct(itemId);
                    if (!prod) continue;
                    for (const size in cartItems[itemId]) {
                         if (cartItems[itemId][size] > 0) {
                              cartItemsArr.push({ _id: itemId, size, price: prod.price, quantity: cartItems[itemId][size] });
                         }
                    }
               }
               const res = await axios.post(backendUrl + '/api/discounts/validate',
                    { couponCode: code, cartItems: cartItemsArr, cartTotal: cartAmt },
                    { headers: { token } }
               );
               if (res.data.success) {
                    setAppliedDiscount(res.data.discount);
                    setCouponCode(code);
                    toast.success(res.data.message);
                    return true;
               } else {
                    toast.error(res.data.message);
                    return false;
               }
          } catch (error) {
               console.log(error);
               toast.error(error.message);
               return false;
               
          }
     };

     const removeCoupon = () => {
          setAppliedDiscount(null);
          setCouponCode('');
          toast.info('Coupon removed.');
     };

     const fetchAutoDiscounts = async () => {
          try {
               const res = await axios.get(backendUrl + '/api/discount/auto');
               if (res.data.success) setAutoDiscounts(res.data.autoDiscounts);
          } catch (error) { console.log(error); }
     };

     const isDiscountScheduleLive = (ad) => {
          const now = Date.now();
          if (ad.startsAt && now < new Date(ad.startsAt).getTime()) return false;
          if (ad.expiresAt && now > new Date(ad.expiresAt).getTime()) return false;
          return true;
     };

     const getCategoryCartLines = (targetCategory) => {
          const lines = [];
          if (!targetCategory) return lines;
          const t = targetCategory.toLowerCase();
          for (const itemId in cartItems) {
               const prod = findAnyProduct(itemId);
               if (!prod || prod.category?.toLowerCase() !== t) continue;
               for (const size in cartItems[itemId]) {
                    if (cartItems[itemId][size] > 0) {
                         lines.push({ price: prod.price, quantity: cartItems[itemId][size] });
                    }
               }
          }
          return lines;
     };

     const computeBogoDiscountAmount = (lines, bogoConfig) => {
          const buyQty = Number(bogoConfig?.buyQty) || 1;
          const getQty = Number(bogoConfig?.getQty) || 1;
          const getDiscount = Number(bogoConfig?.getDiscount) || 100;
          const flatItems = lines
               .filter((i) => i.price > 0 && i.quantity > 0)
               .sort((a, b) => a.price - b.price);
          const totalQty = flatItems.reduce((sum, i) => sum + i.quantity, 0);
          const sets = Math.floor(totalQty / (buyQty + getQty));
          let freeItemsLeft = sets * getQty;
          let discountAmount = 0;
          for (const item of flatItems) {
               if (freeItemsLeft <= 0) break;
               const applyTo = Math.min(item.quantity, freeItemsLeft);
               discountAmount += applyTo * item.price * (getDiscount / 100);
               freeItemsLeft -= applyTo;
          }
          return Math.round(discountAmount);
     };

     const getOrderDiscountSnapshot = () => {
          const cartAmt = getCartAmount();
          let manualTotal = 0;
          if (appliedDiscount) manualTotal += appliedDiscount.discountAmount || 0;

          let autoCategoryTotal = 0;
          let bogoTotal = 0;
          const bogoIds = [];

          for (const ad of autoDiscounts) {
               if (!ad.isActive) continue;
               if (!isDiscountScheduleLive(ad)) continue;
               if (cartAmt < (ad.minCartValue || 0)) continue;

               if (ad.type === 'auto_category' && ad.value > 0 && ad.categoryTarget) {
                    const hasCategory = Object.keys(cartItems).some((itemId) => {
                         const prod = findAnyProduct(itemId);
                         return prod && prod.category?.toLowerCase() === ad.categoryTarget?.toLowerCase();
                    });
                    if (hasCategory) {
                         autoCategoryTotal += Math.round(cartAmt * (ad.value / 100));
                    }
               }

               if (ad.type === 'bogo' && ad.categoryTarget) {
                    const lines = getCategoryCartLines(ad.categoryTarget);
                    if (lines.length === 0) continue;
                    const amt = computeBogoDiscountAmount(lines, ad.bogoConfig);
                    if (amt > 0) {
                         bogoTotal += amt;
                         bogoIds.push(ad._id);
                    }
               }
          }

          const totalRaw = manualTotal + autoCategoryTotal + bogoTotal;
          const totalDiscount = Math.min(totalRaw, cartAmt);

          const discountIds = [];
          if (appliedDiscount?._id) discountIds.push(appliedDiscount._id);
          bogoIds.forEach((id) => discountIds.push(id));

          let discountType = '';
          if (appliedDiscount?.type) discountType = appliedDiscount.type;
          else if (bogoTotal > 0) discountType = 'bogo';
          else if (autoCategoryTotal > 0) discountType = 'auto_category';

          return {
               cartTotal: cartAmt,
               manualDiscount: manualTotal,
               autoCategoryDiscount: autoCategoryTotal,
               bogoDiscount: bogoTotal,
               totalDiscount,
               discountCode: appliedDiscount?.code || '',
               discountType,
               discountId: discountIds.join(','),
          };
     };

     const getDiscountAmount = () => getOrderDiscountSnapshot().totalDiscount;

     // Free shipping only from Marketing → free_shipping discount rules (schedule + min cart on that rule)
     const isFreeShippingActive = () => {
          const cartAmt = getCartAmount();
          for (const ad of autoDiscounts) {
               if (ad.type !== 'free_shipping' || !ad.isActive) continue;
               if (!isDiscountScheduleLive(ad)) continue;
               if (cartAmt >= Number(ad.minCartValue || 0)) return true;
          }
          return false;
     };

     const getFinalTotal = () => {
          const snap = getOrderDiscountSnapshot();
          const afterDiscount = Math.max(snap.cartTotal - snap.totalDiscount, 0);
          const shipping = isFreeShippingActive() ? 0 : delivery_fee;
          return afterDiscount === 0 ? 0 : afterDiscount + shipping;
     };

     const getUserCart = async ( token ) => {
          try {
               const response = await axios.post(backendUrl + '/api/cart/get',{},{headers:{token}} )
               if (response.data.success) {
                    setCartItems(response.data.cartData)
                    
               }
          } catch (error) {
               console.log(error)
               toast.error(error.message)
               
          }

     }

     useEffect(() => {
          getProductsData()
          getSunglassesData()
          getBrandingData()
          fetchAutoDiscounts()
     }, [])

     useEffect(() => {
          if (!token && localStorage.getItem('token')) {
               setToken(localStorage.getItem('token'))
               getUserCart(localStorage.getItem('token'))

          }
     },[])




     const value = {
          products, sunglasses, currency, delivery_fee,
          search, setSearch, showSearch, setShowSearch,
          cartItems, addToCart, setCartItems,
          getCartCount, updateQuantity,
          getCartAmount, navigate, backendUrl,
          setToken, token, branding,
          wishlist, toggleWishlist, isDarkMode, toggleTheme,
          // Discount
          couponCode, setCouponCode,
          appliedDiscount, autoDiscounts,
          applyDiscountCode, removeCoupon,
          getDiscountAmount, getOrderDiscountSnapshot, isDiscountScheduleLive, isFreeShippingActive, getFinalTotal
     }
     return (
          <ShopContext.Provider value={value}>
               {props.children}
          </ShopContext.Provider>
     )
}

export default ShopContextProvider;