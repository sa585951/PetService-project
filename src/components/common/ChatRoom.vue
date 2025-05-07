<template>
    <div class="chatroom-wrapper">
    <div class="chatroom-box">
        <div class="container py-5 px-4">
      <div class="row rounded-lg overflow-hidden shadow">
        <!-- 使用者列表 -->
        <div class="col-5 px-0">
          <div class="bg-white">
            <div class="bg-gray px-4 py-2 bg-light">
              <p class="h5 mb-0 py-1">Users</p>
            </div>
            <div class="messages-box">
              <div class="list-group rounded-0">
                <a v-for="user in users" :key="user.id" class="list-group-item list-group-item-action border-0">
                  <div class="d-flex align-items-start">
                    <img :src="user.avatar" class="rounded-circle mr-1" :alt="user.name" width="40" height="40">
                    <div class="flex-grow-1 ml-3">
                      {{ user.name }}
                      <div class="small">
                        <span :class="['fas', 'fa-circle', user.online ? 'chat-online' : 'chat-offline']"></span>
                        {{ user.online ? 'Online' : 'Offline' }}
                      </div>
                    </div>
                  </div>
                </a>
              </div>
            </div>
          </div>
        </div>
  
        <!-- 訊息視窗 -->
        <div class="col-7 px-0">
          <div class="px-4 py-5 chat-box bg-white" style="height: 500px; overflow-y: auto;">
            <div v-for="msg in messages" :key="msg.id" :class="['pb-4', msg.fromMe ? 'chat-message-right' : 'chat-message-left']">
              <div class="d-flex align-items-start">
                <img :src="msg.avatar" class="rounded-circle mr-1" :alt="msg.sender" width="40" height="40">
                <div class="flex-shrink-1 bg-light rounded py-2 px-3 ml-3 mr-3">
                  <div class="font-weight-bold mb-1">{{ msg.fromMe ? 'You' : msg.sender }}</div>
                  {{ msg.text }}
                </div>
              </div>
              <div class="text-muted small text-nowrap mt-2">{{ msg.time }}</div>
            </div>
          </div>
  
          <!-- 訊息輸入 -->
          <div class="input-group">
            <input type="text" class="form-control" placeholder="Type your message" v-model="messageText" @keyup.enter="sendMessage">
            <div class="input-group-append">
              <button class="btn btn-primary" @click="sendMessage">Send</button>
            </div>
          </div>
        </div>
      </div>
    </div>
    </div>
  </div>
   
  </template>
  
  <script>
  export default {
    name: "ChatRoom",
    data() {
      return {
        users: [
          { id: 1, name: "Alice", avatar: "https://i.pravatar.cc/40?img=1", online: true },
          { id: 2, name: "Bob", avatar: "https://i.pravatar.cc/40?img=2", online: false },
        ],
        messages: [
          { id: 1, sender: "Alice", avatar: "https://i.pravatar.cc/40?img=1", text: "Hi there!", time: "10:00 AM", fromMe: false },
          { id: 2, sender: "You", avatar: "https://i.pravatar.cc/40?img=3", text: "Hello!", time: "10:01 AM", fromMe: true },
        ],
        messageText: "",
      };
    },
    methods: {
      sendMessage() {
        if (this.messageText.trim() === "") return;
        const now = new Date();
        this.messages.push({
          id: Date.now(),
          sender: "You",
          avatar: "https://i.pravatar.cc/40?img=3", // 預設使用者頭像
          text: this.messageText,
          time: now.toLocaleTimeString(),
          fromMe: true,
        });
        this.messageText = "";
        // 未來這裡可以整合 SignalR 傳送訊息
      },
    },
  };
  </script>
  
  <style scoped>
  .chatroom-wrapper {
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 1000;
}

.chatroom-box {
  width: 400px;
  height: 600px;
  background: white;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}
  .chat-box {
    overflow-y: auto;
  }
  
  .chat-message-left,
  .chat-message-right {
    display: flex;
    flex-direction: column;
  }
  
  .chat-message-right {
    align-items: flex-end;
    text-align: right;
  }
  </style>
  