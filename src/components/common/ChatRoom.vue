<template> 
  <div>
    <!-- 聊天室開關按鈕 -->
    <div class="chat-toggle-button" v-if="!showChat" @click="showChat = true">
      💬
    </div>

    <!-- 聊天室本體 -->
    <transition name="chatroom-fade">
      <div class="chatroom-wrapper" v-if="showChat">
        <div class="chatroom-box">
          <button class="close-chat-btn" @click="showChat = false">-</button>
          <div class="container pt-5 h-100 ">
            <div class="row rounded-lg overflow-hidden shadow h-100">
              <!-- 使用者列表 -->
              <div class="col-5 px-0 user-list bg-light">
                <div class="bg-gray px-4 py-2">
                  <p class="h5 mb-0 py-1">用戶列表</p>
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

              <!-- 訊息區 -->
              <div class="col-7 px-0 d-flex flex-column h-100">
                <!-- 訊息內容 -->
                <div class="px-4 py-2 chat-box bg-white flex-grow-1 overflow-auto">
                  <div v-for="msg in messages" :key="msg.id"
                    :class="['pb-4', msg.fromMe ? 'chat-message-right' : 'chat-message-left']">
                    <div class="d-flex align-items-start" :class="msg.fromMe ? 'flex-row-reverse' : ''">
                      <img :src="msg.avatar" class="rounded-circle" :class="msg.fromMe ? 'ml-1' : 'mr-1'"
                        :alt="msg.sender" width="40" height="40">
                      <div class="flex-shrink-1 bg-light rounded py-2 px-3" :class="msg.fromMe ? 'mr-3' : 'ml-3'">
                        <div class="font-weight-bold mb-1">{{ msg.fromMe ? 'You' : msg.sender }}</div>
                        <div v-html="msg.text"></div>
                      </div>
                    </div>
                    <div class="text-muted small text-nowrap mt-2">{{ msg.time }}</div>
                  </div>
                </div>

                <!-- 功能選單 -->
                <div class="bot-options px-3 py-2 bg-white">
                  <button class="btn btn-sm btn-outline-secondary mr-2 me-2"
                    @click="botOptionClicked('訂單管理')">訂單管理</button>
                  <button class="btn btn-sm btn-outline-secondary mr-2 me-2"
                    @click="botOptionClicked('客服協助')">客服協助</button>
                  <button class="btn btn-sm btn-outline-secondary" @click="botOptionClicked('常見問題')">常見問題</button>
                </div>

                <!-- 訊息輸入 -->
                <div class="chat-input d-flex p-2 border-top">
                  <textarea class="form-control message-type" placeholder="輸入您的訊息" v-model="messageText" rows="1"
                    @keydown.enter.exact.prevent="sendMessage"></textarea>
                  <button class="btn btn-color ml-2" @click="sendMessage"><i class="bi bi-send"></i></button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
export default {
  name: "ChatRoom",
  data() {
    return {
      showChat: false,
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
        avatar: "https://i.pravatar.cc/40?img=3",
        text: this.messageText,
        time: now.toLocaleTimeString(),
        fromMe: true,
      });
      this.messageText = "";
    },
    botOptionClicked(option) {
      let response = "";
      switch (option) {
        case "訂單管理":
          response = `了解您目前的訂單狀況，請點選下方按鈕前往訂單管理。<br>
        <button class='btn btn-sm btn-warning  mt-2'>前往訂單管理</button>`;
          break;
        case "客服協助":
          response = `我們的客服人員將儘速與您聯繫。<br>
        <button class='btn btn-sm btn-warning mt-2'>聯絡客服</button>`;
          break;
        case "常見問題":
          response = `以下是常見問題集，請選擇您想了解的主題：<br>
        <button class='btn btn-sm btn-warning  mt-2 me-2'>付款問題</button>`;
          break;
      }
      this.messages.push({
        id: Date.now(),
        sender: "系統小幫手",
        avatar: "https://i.pravatar.cc/40?img=4",
        text: response,
        time: new Date().toLocaleTimeString(),
        fromMe: false,
      });
    }
  }
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
  width: 600px;
  height: 600px;
  background: #ffc272;
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.chat-toggle-button {
  position: fixed;
  bottom: 20px;
  right: 20px;
  background-color: #e9a44b;
  color: white;
  font-size: 24px;
  padding: 10px 15px;
  border-radius: 50%;
  cursor: pointer;
  z-index: 1100;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  transition: background-color 0.3s ease;
}

.chat-toggle-button:hover {
  background-color: #ac834e;
}

.close-chat-btn {
  position: absolute;
  top: 10px;
  right: 10px;
  background: transparent;
  border: none;
  font-size: 20px;
  color: #be863d;
  cursor: pointer;
  z-index: 2000;
}

.close-chat-btn:hover {
  color: #000;
}

.chatroom-fade-enter-active,
.chatroom-fade-leave-active {
  transition: all 0.3s ease;
}

.chatroom-fade-enter-from,
.chatroom-fade-leave-to {
  transform: scale(0.7);
  opacity: 0;
  transform-origin: bottom right;
}

.chatroom-fade-enter-to,
.chatroom-fade-leave-from {
  transform: scale(1);
  opacity: 1;
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

.chat-input {
  flex-shrink: 0;
  background-color: #f8f9fa;
}

.user-list {
  border-right: 1px solid #ccc;
}

.btn-color {
  background-color: #e9a44b;
  color: white;
}

.message-type {
  background-color: #f8f9fa;
  border: none;
  outline: none;
  box-shadow: none;
}

.bot-options {

  flex-shrink: 0;
}

.chat-box .flex-shrink-1 {
  max-width: 200px;
  word-wrap: break-word;
  white-space: pre-wrap;
}
</style>
