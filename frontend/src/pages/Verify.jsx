import React, { useContext, useEffect } from 'react'
import { ShopContext } from '../context/ShopContext'
import { useSearchParams } from 'react-router-dom'
import { toast } from 'react-toastify';
import axios from 'axios'

const Verify = () => {

    const { navigate, token, setCartItems, backendUrl} = useContext(ShopContext)
    const [searchParams] = useSearchParams()

    const success = searchParams.get('success')
    const orderId = searchParams.get('orderId')


    const verifyPayment = async () => {

        try {
             
            if (!token) {
                return null  
            }

            const response = await axios.post(backendUrl + '/api/order/verifyStripe',{success,orderId},{headers:{token}})

            if (response.data.success) {
                setCartItems({})
                toast.success("Payment successful");
                navigate('/orders')
            }else{
                toast.error("Payment failed");
                navigate('/cart')
            }
        } catch (error) {
            console.log(error)
            toast.error(error.message)
            
        }

    }

    useEffect(()=>{
        verifyPayment()

    },[token])

  return (
    <div>
      
    </div>
  )
}

export default Verify
