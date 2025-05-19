<template>
  <div>
    <div class="chat-toggle-button" v-if="!showChat" @click="openChat">💬</div>

    <transition name="chatroom-fade">
      <div class="chatroom-wrapper" v-if="showChat">
        <div class="chatroom-box" :style="userRole === 'member' ? { width: '350px' } : {}">
          <button class="close-chat-btn" @click="closeChat">-</button>
          <div class="container pt-5 h-100">
            <div class="row rounded-lg overflow-hidden shadow h-100">
              <div class="col-5 px-0 user-list bg-light" v-if="userRole === 'employee'">
                <div class="input-group input-group-sm">
                  <input v-model="searchQuery" type="text" class="form-control" placeholder="搜尋會員名稱" />
                  <button class="btn btn-outline-secondary">搜尋</button>
                </div>
                <div class="bg-gray px-1"><p class="mb-0 py-1">進行中對話</p></div>
                <div class="messages-box">
                  <div class="list-group rounded-0">
                    <a
                      v-for="user in filteredUsers"
                      :key="user.id"
                      @click="selectUser(user)"
                      class="list-group-item list-group-item-action border-0"
                    >
                      <div class="d-flex align-items-start">
                        <img :src="user.avatar || 'https://i.pravatar.cc/40?img=5'" class="rounded-circle mr-1" :alt="user.name" width="40" height="40" />
                        <div class="flex-grow-1 ml-3">
                          {{ user.name }}
                        </div>
                      </div>
                    </a>
                  </div>
                </div>
                <div class="bg-gray px-1"><p class="mb-0 py-1">已結束對話</p></div>
              </div>

              <div :class="userRole === 'member' ? 'col-12' : 'col-7'" class="px-0 d-flex flex-column h-100">
                <div ref="chatBox" class="px-4 py-2 chat-box bg-white flex-grow-1 overflow-auto">
                  <div v-for="msg in messages" :key="msg.id"
                       :class="['pb-4', isMessageFromMe(msg) ? 'chat-message-right' : 'chat-message-left']">
                    <div class="d-flex align-items-start" :class="msg.fromMe ? 'flex-row-reverse' : ''">
                      <img :src="msg.avatar" class="rounded-circle" :class="msg.fromMe ? 'ml-1' : 'mr-1'" :alt="msg.sender" width="40" height="40" />
                      <div class="flex-shrink-1 bg-light rounded py-2 px-3" :class="msg.fromMe ? 'mr-3' : 'ml-3'">
                        <div class="font-weight-bold mb-1">{{ msg.fromMe ? currentUserName : msg.sender }}</div>
                        <div v-html="msg.text" @click="handleInnerClick"></div>
                      </div>
                    </div>
                    <div class="chat-time mt-2">{{ msg.time }}</div>
                  </div>
                </div>

                <div class="bot-options d-flex flex-row overflow-auto px-3 py-2 bg-white" style="white-space: nowrap;" v-if="userRole === 'member'">
                  <button v-for="opt in botOptions" :key="opt.label" class="btn btn-sm btn-outline-secondary me-2" @click="botOptionClicked(opt)">
                    {{ opt.label }}
                  </button>
                </div>

                <div class="bot-options px-3 py-2 bg-white" v-if="userRole === 'employee'">
                  <button class="btn btn-sm btn-outline-secondary" @click="endConversation">結束對話</button>
                </div>
                <div v-if="conversationEnded" class="alert alert-warning text-center">此對話已結束</div>

                <div class="chat-input d-flex p-2 border-top">
                  <textarea class="form-control message-type" placeholder="輸入您的訊息" v-model="messageText" rows="1"
                            @keydown.enter.exact.prevent="sendMessage"></textarea>
                  <button class="btn btn-color ml-2" @click="onClickSend">
                    <i class="bi bi-send"></i>
                  </button>
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
import DOMPurify from 'dompurify';
import * as signalR from "@microsoft/signalr";
import { jwtDecode } from 'jwt-decode';


export default {
  name: "ChatRoom",
  data() {
    return {
      userRole: "employee",
      showChat: false,
      messageText: "",
      messages: [],
      searchQuery: "",
      users: [],
      targetUser: null,
      botOptions: [
        { label: '訂單管理', view: 'OrderManagement' },
        { label: '立即散步', view: 'WalkView' },
        { label: '寵物住宿', view: 'HotelView' },
        { label: '客服協助', view: null },
        { label: '常見問題', view: 'FAQ' }
      ],
      currentUserEmail: '',  // ✅ email 作為 sender
      currentUserName: '',   // ✅ 顯示用名
      currentUserId: null,
      targetUserId: null, // ✅ 目標使用者 ID
      connection: null,
      sessionId: null,
      conversationEnded: false,
      isConnected: false,
      senderId: "",      // 自己的 userId
      receiverId: "",
    };
  },

  computed: {
    filteredUsers() {
      return this.users.filter(u =>
        !this.searchQuery || u.name.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    }
  },

  methods: {
    async openChat() {
      console.log("💬 嘗試開啟聊天室");
      this.showChat = true;
      const token = localStorage.getItem("token");
      if (!token) return alert("未登入，無法開啟聊天室");

      const decoded = jwtDecode(token);
      const email = decoded?.email?.toLowerCase();
      if (!email) return alert("無法從 token 解析出 email");

      this.currentUserEmail = email;
      const employeeList = ["chris@skz.com"];
      this.userRole = employeeList.includes(email) ? "employee" : "member";
      
      try {
        // ✅ 取得顯示名稱
        const infoRes = await fetch(`https://localhost:7089/api/Chat/GetNameByEmail?email=${email}`, {
          headers: { Authorization: "Bearer " + token }
        });
        if (!infoRes.ok) {
          const errorText = await infoRes.text();
          console.error("❌ 取得使用者名稱失敗：", errorText);
          return;
        }
        const info = await infoRes.json();
        console.log("info",info);
        this.currentUserName = info.name;
        this.currentUserId = info.id.toString();
        if (this.userRole === "member") {
        // 假設 chris@skz.com 的 ID 是 1001（依照你的資料庫）
          this.targetUserId = "2";
        }
        else if (this.userRole === "employee") {
        const res = await fetch("https://localhost:7089/api/Chat/GetAllMembers", {
          headers: { Authorization: "Bearer " + token }
        });
        if (!res.ok) throw new Error("取得會員列表失敗");
        this.users = await res.json();
        console.log("📋 載入會員列表：", this.users);
      }
        console.log("👤 使用者名稱：", this.currentUserName);
        console.log("👤 使用者ID：", this.currentUserId);
        
        console.log("🚀 嘗試連線到 SignalR，網址：", `https://localhost:7089/chathub?userId=${this.currentUserId}`);
        
        // ✅ 建立 SignalR 連線
        this.connection = new signalR.HubConnectionBuilder()
          .withUrl(`https://localhost:7089/chathub?userId=${this.currentUserId}`)
          .withAutomaticReconnect()
          .build();
        
        
        this.connection.on("ReceiveMessage", (fromUser, message) => {
          this.messages.push({
            id: Date.now(),
            sender: fromUser,
            avatar: "https://i.pravatar.cc/40?img=5",
            text: DOMPurify.sanitize(message),
            time: new Date().toLocaleTimeString(),
            fromMe: fromUser === this.currentUserName
          });
          console.log("📩 收到訊息：", fromUser, message);
          this.scrollToBottom();
        });

        await this.connection.start();
        // this.isConnected = true;
        // console.log("✅ SignalR 已連線",this.isConnected);

        // // ✅ 建立會話（僅會員）
        // const payload = {
        //   dto: {
        //     fMemberId: this.currentUserId,
        //     fEmployeeId: this.targetUserId,
        //     startTime: new Date().toISOString(),
        //     status: "0",
        //     role: this.userRole,
        //   },
        // };   
        // console.log("✅ 發送資料：", payload);
        //   const res = await fetch("https://localhost:7089/api/Chat/CreateOrGetSession", {
        //   method: "POST",
        //   headers: { "Content-Type": "application/json" },
        //   body: JSON.stringify(payload)
        // });
        // console.log("payload",payload);

        // if (!res.ok) throw new Error("建立會話失敗");
        // const sessionId = await res.json();
        // this.sessionId = sessionId;

      } catch (err) {
        console.error("❌ SignalR 連線失敗：", err);
      }
    },

    onClickSend() {
      console.log("🟢 按下送出");
      this.sendMessage();
    },
    
      async sendMessage() {
        console.log("📨 [sendMessage] 嘗試傳送訊息");
        console.log("👤 使用者名稱：", this.currentUserName);

        const receiver = this.userRole === "member"
          ? "chris@skz.com" // 🔧 測試帳號
          : this.targetUser.email;

        console.log("✅ 傳送對象：", receiver);
        console.log("✅ 訊息內容：", this.messageText);

        const sanitized = DOMPurify.sanitize(this.messageText);

        // this.messages.push({
        //   id: Date.now(),
        //   sender: this.currentUserName,
        //   avatar: "https://i.pravatar.cc/40?img=3",
        //   text: sanitized,
        //   time: new Date().toLocaleTimeString(),
        //   fromMe: true
        // });
        console.log("📤 currentUserId：", this.currentUserId);
        console.log("📤 targetUserId：", this.targetUserId);
        console.log("📤 messageText：", this.messageText);
        try {
          // await this.connection.invoke(
          //   "SendMessage",
          //   this.sessionId,            // ✅ sessionId
          //   this.currentUserId,        // ✅ senderId
          //   receiver,                  // ✅ receiverId
          //   this.userRole,             // ✅ senderRole
          //   this.messageText           // ✅ messageText
          // );
          await this.connection.invoke(
            "SendMessage",
            this.currentUserId,   // 自己
            this.targetUserId,    // 對方
            this.messageText      // 訊息內容
          );
          console.log("📤 訊息已送出");
        } catch (err) {
          console.error("❌ 傳送失敗：", err);
        }

        this.messageText = "";
        this.scrollToBottom();
      },

        selectUser(user) {
      this.targetUser = user;
      this.targetUserId = user.id.toString();
      this.sessionId = user.sessionId;
      this.conversationEnded = user.status === 1;
      this.messages = [];
    },

    async closeChat() {
      if (this.connection) {
        await this.connection.stop();
        this.connection = null;
      }
      this.showChat = false;
    },

    botOptionClicked(option) {
      const textMap = {
        "訂單管理": "了解訂單狀況，請點擊：<br><div class='text-center'><button class='goto-button btn btn-sm btn-warning' data-target='OrderManagement'>前往訂單管理</button></div>",
        "立即散步": "預約散步服務：<br><div class='text-center'><button class='goto-button btn btn-sm btn-warning' data-target='WalkView'>選擇遛寵員</button></div>",
        "客服協助": "點擊後開始線上客服：<br><div class='text-center'><button class='goto-button btn btn-sm btn-warning' data-target='chathelp'>線上客服</button></div>",
        "寵物住宿": "更多住宿資訊：<br><div class='text-center'><button class='goto-button btn btn-sm btn-warning' data-target='HotelView'>旅館介紹</button></div>",
        "常見問題": "請點擊查看常見問題：<br><div class='text-center'><button class='goto-button btn btn-sm btn-warning' data-target='FAQ'>查看 FAQ</button></div>"
      };

      this.messages.push({
        id: Date.now(),
        sender: "系統小幫手",
        avatar: "https://i.pravatar.cc/40?img=4",
        text: DOMPurify.sanitize(textMap[option.label] || ""),
        time: new Date().toLocaleTimeString(),
        fromMe: false
      });

      this.scrollToBottom();
    },

    handleInnerClick(event) {
      const target = event.target;
      const view = target.getAttribute("data-target");
      const routes = {
        WalkView: "/Walk",
        HotelView: "/Hotel",
        chathelp: "/ChatHelp",
        OrderManagement: "/Order",
        FAQ: "/FAQ"
      };
      if (target.classList.contains("goto-button") && routes[view]) {
        this.$router.push(routes[view]);
      }
    },

    scrollToBottom() {
      this.$nextTick(() => {
        const box = this.$refs.chatBox;
        if (box) box.scrollTop = box.scrollHeight;
      });
    },

    isMessageFromMe(msg) {
      return msg.fromMe === true;
    },

    async endConversation() {
      await fetch(`/api/Chat/EndSession/${this.sessionId}`, {
        method: "POST",
        headers: { Authorization: "Bearer " + localStorage.getItem("Token") }
      });
      await this.closeChat();
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
  width: 400px;
  height: 400px;
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

.input-group-sm .btn {
  height: calc(1.8125rem + 2px); /* 和小型輸入框高度一致 */
  font-size: 0.875rem;
  padding: 0.25rem 0.5rem;
}

.chat-time {
  font-size: 0.65rem; /* 或 0.7rem / 10px，依你需求微調 */
  color: #999; /* 保持淡灰色 */
  white-space: nowrap;
}
</style>
