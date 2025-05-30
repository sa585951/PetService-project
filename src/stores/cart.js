import { defineStore } from "pinia";
import axios from "axios";
import { useAuthStore } from "./authStore";

function getItemKeyWalk(item){
    return `${item.employeeServiceId}-${item.walkStart}`;
}

function getItemKeyHotel(item){
    return `${item.hotelId}-${item.roomDetailId}-${item.checkIn}-${item.checkOut}`;
}

export function getNights(item) {
    const checkIn = new Date(item.backenedItem.checkIn);
    const checkOut = new Date(item.backenedItem.checkOut);
    const diffMs = checkOut - checkIn;
    const days = Math.floor(diffMs /(1000 * 60 * 60 * 24));
    return days > 0 ? days : 0;
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
            state.hotelcartitems.reduce((t,i)=>t+i.backenedItem.roomQty,0),


        cartTotalPrice:(state)=>{
            const walkTotal = state.walkcartitems.reduce((sum,i) => sum + i.quantity * i.price, 0);

            const hotelTotal = state.hotelcartitems.reduce((sum,i) => {
                const nights = getNights(i);
                return sum + nights * i.backenedItem.roomQty * i.pricePerRoom;
            }, 0);

            return walkTotal + hotelTotal;
        },

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
                
                this.clearCart()
                return response.data.orderId
            }catch(error){
                console.error('送出訂單失敗',error)
                throw error;
            }
        },

        addItemToHotelCart(item){
            const key = getItemKeyHotel(item.backenedItem);
            const exists = this.hotelcartitems.find(i => getItemKeyHotel(i.backenedItem) === key);
            if(exists){
                exists.backenedItem.roomQty += item.backenedItem.roomQty;
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
                    hotelId: item.backenedItem.hotelId,
                    roomDetailId: item.backenedItem.roomDetailId,
                    checkIn: item.backenedItem.checkIn,
                    checkOut: item.backenedItem.checkOut,
                    roomQty:item.backenedItem.roomQty,
                    additionalMessage: item.backenedItem.additionalMessage
                }))
            };
        },

        async submitHotelOrder(){
            try{
                const payload = this.prepareHotelOrderPayload();
                const token = useAuthStore().token;
                const response = await axios.post("/api/order/hotel/create",payload,{
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