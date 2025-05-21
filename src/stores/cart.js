import { defineStore } from "pinia";
import axios from "axios";
import { useAuthStore } from "./authStore";

function getItemKey(item){
    return `${item.employeeServiceId}-${item.walkStart}`;
}

export const useCartStore = defineStore('cart',{
    state:()=>({
        walkcartitems:[]
    }),
    persist:true,

    getters:{
        cartTotalItems:(state)=>
            state.walkcartitems.reduce((total,item) => total + item.quantity,0),

        cartTotalPrice:(state)=>
            state.walkcartitems.reduce((total,item) => total + item.quantity * item.price, 0),

        walkCartItems: (state) => state.walkcartitems
    },

    actions:{
        addItemToCart(item){
            const existingItem = this.walkcartitems.find(i => getItemKey(i) === getItemKey(item))
            if(existingItem){
                existingItem.quantity += item.quantity
            }else{
                this.walkcartitems.push(item)
            }            
        },

        removeItemByKey(key){
            this.walkcartitems = this.walkcartitems.filter(item => getItemKey(item) !== key);
        },

        updateItemQuantity(serviceId,walkStart,quantity){
            const item = this.walkcartitems.find(i => i.employeeServiceId === serviceId && i.walkStart === walkStart)
            if(item){
                item.quantity = quantity
            }
        },

        clearCart(){
            this.walkcartitems = []
        },

        //非同步串接API 從後端撈購物車資料 符合CreateWalkOrderRequestDTO格式
        prepareWalkOrderPayload(){
            return{
                cartItems: this.walkcartitems.map(item => ({
                    employeeServiceId: item.employeeServiceId,
                    amount: item.quantity,
                    walkStart: item.walkStart,
                    note : item.note
                }))
            }
        },

        //送出訂單
        async submitWalkOrder(){
            try{
                const payload = this.prepareWalkOrderPayload()

                const authStore = useAuthStore();
                const token = authStore.token;

                const response = await axios.post('/api/order/walk/create',payload,{
                    headers:{
                        Authorization:`Bearer ${token}`
                    }
                });
                
                this.clearCart()
                return response.data.orderId
            }catch(error){
                console.error('送出訂單失敗',error)
                throw error;
            }
        }
    }
    
})