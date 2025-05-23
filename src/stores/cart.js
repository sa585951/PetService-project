import { defineStore } from "pinia";
import axios from "axios";
import { useAuthStore } from "./authStore";

function getItemKeyWalk(item){
    return `${item.employeeServiceId}-${item.walkStart}`;
}

function getItemKeyHotel(item){
    return `${item.hotelId}-${item.roomDetailId}-${item.checkIn}-${item.checkOut}`;
}

export const useCartStore = defineStore('cart',{
    state:()=>({
        walkcartitems:[],
        hotelcartitems:[],
    }),
    persist:true,

    getters:{
        cartTotalItems:(state)=>
            state.walkcartitems.reduce((total,item) => total + item.quantity,0)+
            state.hotelcartitems.reduce((t,i)=>t+i.qty,0),


        cartTotalPrice:(state)=>
            state.walkcartitems.reduce((total,item) => total + item.quantity * item.price, 0)+
            state.hotelcartitems.reduce((t,i) => t+ i.qty *i.pricePerRoom,0),

        walkCartItems: (state) => state.walkcartitems,

        hotelCartItems: (state) => state.hotelcartitems,
    },

    actions:{
        addItemToWalkCart(item){
            const existingItem = this.walkcartitems.find(i => getItemKeyWalk(i) === getItemKeyWalk(item))
            if(existingItem){
                existingItem.quantity += item.quantity
            }else{
                this.walkcartitems.push(item)
            }            
        },

        removeWalkItemByKey(key){
            this.walkcartitems = this.walkcartitems.filter(item => getItemKeyWalk(item) !== key);
        },

        updateWalkItemQuantity(serviceId,walkStart,quantity){
            const item = this.walkcartitems.find(i => i.employeeServiceId === serviceId && i.walkStart === walkStart)
            if(item){
                item.quantity = quantity
            }
        },

        clearCart(){
            this.walkcartitems = [],
            this.hotelcartitems =[]
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
                
                this.clearWalkCart()
                return response.data.orderId
            }catch(error){
                console.error('送出訂單失敗',error)
                throw error;
            }
        },

        addItemToHotelCart(item){
            const existingItem = this.hotelcartitems.find(i => getItemKeyHotel(i.backenedItem) === getItemKeyHotel(item.backenedItem));
            if(existingItem){
                existingItem.backenedItem.roomQty += item.backenedItem.roomQty;
            }else{
                this.hotelcartitems.push(item);
            }
        },

        removeHotelItemByKey(key){
            this.hotelcartitems = this.hotelcartitems.filter(item => getItemKeyHotel(item.backenedItem) !== key);
        },

        prepareHotelOrderPayload(){
            return{
                cartItems:this.hotelcartitems.map(item =>({
                    hotelId: item.hotelId,
                    roomDetailId: item.roomDetailId,
                    checkIn: item.checkIn,
                    checkOut: item.checkOut,
                    note: item.note
                }))
            };
        },

        async submitHotelOrder(){
            try{
                const payload = this.prepareHotelOrderPayload();
                const token = useAuthStore().token;
                const response = await axios.post("api/order/hotel/create",payload,{
                    headers:{Authorization:`Bearer ${token}`}
                });
                this.hotelcartitems =[];
                return response.data.orderId;
            }catch(error){
                console.error("送出訂單失敗",error);
                throw error;
            }
        }
    }
    
})