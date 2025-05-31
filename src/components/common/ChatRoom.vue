<template> 
  <div>
    <div class="chat-toggle-button" v-if="!showChat" @click="openChat">💬</div>
    <transition name="chatroom-fade">
      <div class="chatroom-wrapper" v-if="showChat">
        <div class="chatroom-box" :style="userRole === 'member' ? { width: '350px' } : {}">
          <button class="close-chat-btn" @click="closeChat">-</button>
          <div class="container pt-5 h-100">
            <div class="row rounded-lg overflow-hidden shadow h-100">
              <div class="col-4 px-0 user-list bg-light" v-if="userRole === 'employee'">
                <div class="input-group input-group-sm">
                  <input v-model="searchQuery" type="text" class="form-control m-1" placeholder="搜尋會員名稱" />
                </div>
                <div class="bg-gray px-1">
                  <button class="talklist btn btn-sm" @click="showActiveList = !showActiveList">
                  {{ showActiveList ? '進行中對話' : '進行中對話' }}
                </button>
                </div>
                
                <div class="messages-box"  v-if="showActiveList">
                  <div class="list-group rounded-0">
                    <a
                      v-for="user in filteredActiveUsers"
                      :key="'active-' + user.sessionId"
                      @click="selectUser(user)"
                      class="list-group-item list-group-item-action border-0"
                    >
                      <div class="d-flex align-items-start">
                        <img
                          :src="`https://localhost:7089${user.avatar}`"
                          @error="e => e.target.src = 'https://localhost:7089/uploads/avatars/default-avatar.jpg'"
                          class="rounded-circle me-2"
                          width="40"
                          height="40"
                          :alt="user.name"
                        />
                        <div class="flex-grow-1 ml-3">
                          {{ user.name }}
                        </div>
                      </div>
                    </a>
                  </div>
                </div>
                <div class="bg-gray px-1 py-1">
                  <button class="talklist btn btn-sm" @click="showEndedList = !showEndedList">
                  {{ showEndedList ? '已結束對話' : '已結束對話' }}
                </button>
                </div>
                <div class="messages-box" v-if="showEndedList">
                  <div class="list-group rounded-0">
                    <a
                      v-for="user in filteredEndedUsers"
                      :key="'ended-' + user.sessionId"
                      @click="selectUser(user)"
                      class="list-group-item list-group-item-action border-0 text-muted"
                    >
                      <div class="d-flex align-items-start">
                        <img
                          :src="`https://localhost:7089${user.avatar}`"
                          @error="e => e.target.src = 'https://localhost:7089/uploads/avatars/default-avatar.jpg'"
                          class="rounded-circle me-2"
                          width="40"
                          height="40"
                          :alt="user.name"
                        />
                        <div class="flex-grow-1 ml-3">
                          {{ user.name }} <span class="badge bg-secondary"></span>
                        </div>
                      </div>
                    </a>
                  </div>
                </div>
              </div>

              <div v-if="shouldShowChatArea" :class="userRole === 'member' ? 'col-12' : 'col-8'" class="px-0 d-flex flex-column h-100">
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
                  <button class="btn btn-sm btn-outline-secondary me-2" @click="endConversation">結束對話</button>
                  <button class="btn btn-sm btn-outline-secondary" @click="downloadHistory">
                    匯出紀錄
                  </button>
                </div>
              
                <div class="chat-input d-flex p-2 border-top">
                  <textarea class="form-control message-type"
                            :placeholder="inputPlaceholder"
                            v-model="messageText"
                            rows="1"
                            :disabled="isInputDisabled"
                            @keydown.enter.exact.prevent="sendMessage">
                  </textarea>
                  <button class="btn btn-color ml-2"
                          @click="onClickSend"
                          :disabled="isInputDisabled">
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
import { isReadonly } from 'vue';
import dayjs from 'dayjs';

export default {
  name: "ChatRoom",
  data() {
    return {
      userRole: 'employee', // 可切換為 'employee' member
      showChat: false,
      messageText: "",
      messages: [],
      searchQuery: "",
      users: [],
      endedUsers: [],
      targetUser: null,
      currentUserAvatarUrl: "",
      botOptions: [
        { label: '客服協助', view: null },
        { label: '訂單管理', view: 'OrderManagement' },
        { label: '立即散步', view: 'WalkView' },
        { label: '寵物住宿', view: 'HotelView' },
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
      showActiveList: true,
      showEndedList: true,
      isReadOnly: false,
      hasStartedConversation: false,
    };
  },

  computed: {
    filteredUsers() {
      const allUsers = [...this.users, ...this.endedUsers]; // 合併兩邊
      return allUsers.filter(u =>
        !this.searchQuery || u.name.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    },
  
    filteredActiveUsers() {
      return this.users.filter(u =>
        !this.searchQuery || u.name.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    },
    filteredEndedUsers() {
      return this.endedUsers.filter(u =>
        !this.searchQuery || u.name.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    },
    inputPlaceholder() {
      if (this.userRole === 'member') {
        // ✅ 如果對話已結束或還沒開始
        if (!this.hasStartedConversation || this.isReadOnly) {
          return '真人客服請按客服協助';
        }
      }

      if (this.userRole === 'employee' && this.isReadOnly) {
        return '已結束對話';
      }

      return '輸入您的訊息';
    },
    isInputDisabled() {
      // 會員未點客服協助 → 禁用
      if (this.userRole === 'member' && (!this.hasStartedConversation || this.isReadOnly)) {
        return true;
      }
      // 員工會話已結束 → 禁用
      if (this.userRole === 'employee' && this.isReadOnly) {
        return true;
      }
      // 其他情況允許輸入
      return false;
    },
    shouldShowChatArea() {
      if (this.userRole === 'member') return true;
      if (this.userRole === 'employee' && this.targetUserId) return true;
      return false;
    }
  },
    

  methods: {
    getAvatarUrl(path) {
        return path
          ? `https://localhost:7089${path}`
          : 'https://localhost:7089/uploads/avatars/default-avatar.jpg';
      },

     async loadEmployeeSessions() {
      // this.users = []; // 先清空 → 強制觸發 reactivity
      // this.endedUsers = [];

      const token = localStorage.getItem("token");
      const res = await fetch("/api/Chat/GetActiveSessions", {
        headers: { Authorization: "Bearer " + token }
      });
      this.users = await res.json();

      const endedRes = await fetch("/api/Chat/GetEndedSessions", {
        headers: { Authorization: "Bearer " + token }
      });
      this.endedUsers = await endedRes.json();
      console.log("🧩 API 回傳進行中清單：", this.users);
    },
    

    async openChat() {
      console.log("💬 嘗試開啟聊天室");
      
      const token = localStorage.getItem("token");
      if (!token) return alert("未登入，無法開啟聊天室");
      this.showChat = true;

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
          await this.checkIfSessionEnded();
        // 假設 chris@skz.com 的 ID 是 1001（依照你的資料庫）
          this.targetUserId = "2";
        }
        
        //2025/520/9
        if (this.userRole === "employee") {
          const token = localStorage.getItem("token");

          // ✅ 取得進行中會員
          const res = await fetch("/api/Chat/GetActiveSessions", {
            headers: {
              Authorization: "Bearer " + token
            }
          });
          if (!res.ok) {
            console.error("❌ 取得進行中會員列表失敗", await res.text());
            return;
          }
          this.users = await res.json(); // 進行中對話清單
          console.log("📋 進行中會員：", this.users);

      
          // ✅ 取得已結束會員
          const endedRes = await fetch("https://localhost:7089/api/Chat/GetEndedSessions", {
            headers: { Authorization: "Bearer " + token }
          });
          if (!endedRes.ok) throw new Error("取得已結束對話失敗");
          this.endedUsers = await endedRes.json();
          console.log("📋 已結束會員：", this.endedUsers);
        }


        // ✅ 建立 SignalR 連線
        this.connection = new signalR.HubConnectionBuilder()
          .withUrl(`https://localhost:7089/chathub?userId=${this.currentUserId}`)
          .withAutomaticReconnect()
          .build();
         
        
        this.connection.on("ReceiveMessage", async(msg) => {
          const isMe = msg.senderId.toString() === this.currentUserId.toString();

          this.messages.push({
            id: Date.now(),
            sender: msg.senderName,
            avatar: this.getAvatarUrl(msg.senderAvatar),
            text: DOMPurify.sanitize(msg.messageText),
            time: new Date().toLocaleTimeString(),
            fromMe: isMe
          });

          this.scrollToBottom();      
          if (this.userRole === "member") {
            await this.checkIfSessionEnded();
          }

          if (this.userRole === "employee") {
            await this.loadEmployeeSessions();
          }

          if (this.userRole === "employee") {
            console.log("🔁 重新載入進行中對話...");
            await this.loadEmployeeSessions(); // ⬅️ 自動刷新對話列表
            console.log("📥 收到訊息：", msg);
          }

        

        // ✅ 會員收到訊息時也去確認 status 是否變成已結束
        if (this.userRole === "member") {
          const sessionInfo = this.endedUsers.find(x => x.sessionId == this.sessionId);
          if (sessionInfo) {
            this.isReadOnly = true;
            this.conversationEnded = true;
          }
        }
        }); 
        await this.connection.start();

        const response = await fetch('/api/Chat/CreateOrGetSession', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
          },
          body: JSON.stringify({
            FMemberId: this.currentUserId,
            FEmployeeId: this.targetUserId,
            Role: this.userRole,
            
          })
        });
        
      const sessionId = await response.json();
      this.sessionId = sessionId;

      } catch (err) {
        console.error("❌ SignalR 連線失敗：", err);
      }
    },
    
    downloadHistory() {
      if (!this.messages.length) {
        alert("目前沒有聊天紀錄可匯出");
        return;
      }

      const formatted = this.messages.map(m => {
        const time = dayjs(m.fSendTime).format("YYYY/MM/DD HH:mm");
        const sender = m.sender;
        const text = m.text.replace(/<[^>]+>/g, ''); // 去掉 HTML 標籤（淨化訊息）
        return `[${time}] ${sender}: ${text}`;
      }).join('\n');

      const blob = new Blob([formatted], { type: "text/plain;charset=utf-8" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;

      const name = this.targetUser?.name?.replace(/\s+/g, '_') || '系統小幫手';
      link.download = `聊天紀錄-${name}-${dayjs().format("YYYYMMDD-HHmmss")}.txt`;
      link.click();
      window.URL.revokeObjectURL(url);

      this.targetUser = null;
      this.targetUserId = null;
      this.sessionId = null;
      this.messages = [];
      this.isReadOnly = false;
      this.conversationEnded = false;
    },

    onClickSend() {
      console.log("🟢 按下送出");
      this.sendMessage();
    },
      async sendMessage() {

        this.messages = this.messages.filter(msg => {
          return !(msg.sender === "方燦" && msg.text.includes("此對話已結束"));
        });
        const receiver = this.userRole === "member"
          ? "chris@skz.com" // 🔧 測試帳號
          : this.targetUser.email;

        const sanitized = DOMPurify.sanitize(this.messageText);
     
        try {
          await this.connection.invoke(
            "SendMessage",
            this.currentUserId,   // 自己
            this.targetUserId,    // 對方
            this.messageText      // 訊息內容
          );
          
          console.log("📤 訊息已送出");
          // ✅ Step2: 呼叫 API 儲存訊息（歷史）
          await fetch("/api/Chat/SaveMessage", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization": "Bearer " + localStorage.getItem("token")
            },
            body: JSON.stringify({
              FSessionId: this.sessionId,
              FSenderId: this.currentUserId,
              FSenderRole: this.userRole,
              FMessageText: this.messageText,
              FAttachmentUrl: "",
              FMessageType: "text"
            })
          });
          if (this.userRole === "employee") {
            await this.loadEmployeeSessions();
          }
        } catch (err) {
          console.error("❌ 傳送失敗：", err);
        }
        this.messageText = "";
        this.scrollToBottom();
      },

    async selectUser(user) {
      this.targetUser = user;
      this.targetUserId = user.id.toString();
      this.sessionId = user.sessionId;
      this.isReadOnly = user.status === "1"; 

      const token = localStorage.getItem("token");

      const res = await fetch(`/api/Chat/messages/${this.sessionId}`, {
        headers: {
          'Authorization': 'Bearer ' + token
        }
      });

      if (!res.ok) {
        console.error("❌ 取得歷史訊息失敗", await res.text());
        return;
      }

      const msgs = await res.json();
      this.messages = msgs.map(m => {
        const isMe = m.fSenderId.toString() === this.currentUserId.toString();
        return {
          id: m.fMessageId,
          sender: m.senderName,
          avatar: this.getAvatarUrl(m.senderAvatar),
          text: DOMPurify.sanitize(m.fMessageText),
          time: new Date(m.fSendTime).toLocaleTimeString(),
          fromMe: isMe
        };
        
      });
      this.$nextTick(() => {
      this.scrollToBottom(); 
      });
      
      console.log("✅ 載入訊息完成，共", this.messages.length, "則");
    },

    async closeChat() {
      if (this.userRole === "member" && this.connection) {
        await this.connection.stop();
        console.log("signalR 已斷線");
        this.connection = null;
      } else if (this.userRole === "employee") {
        console.log("保留SignalR連線");
      }
      this.showChat = false;
    },

    async checkIfSessionEnded() {
      const token = localStorage.getItem("token");
      const res = await fetch("/api/Chat/GetEndedSessions", {
        headers: { Authorization: "Bearer " + token }
      });
      const endedList = await res.json();
      const ended = endedList.find(s => s.sessionId == this.sessionId);
      if (ended) {
        this.isReadOnly = true;
        this.conversationEnded = true;
      } else {
        this.isReadOnly = false;
        this.conversationEnded = false;
      }
    },

    async botOptionClicked(option) {
      const textMap = {
        "訂單管理": "了解訂單狀況，請點擊：<br><div class='text-center'><button class='goto-button btn btn-sm btn-warning' data-target='OrderManagement'>前往訂單管理</button></div>",
        "立即散步": "預約散步服務：<br><div class='text-center'><button class='goto-button btn btn-sm btn-warning' data-target='WalkView'>選擇遛寵員</button></div>",
        "寵物住宿": "更多住宿資訊：<br><div class='text-center'><button class='goto-button btn btn-sm btn-warning' data-target='HotelView'>旅館介紹</button></div>",
        "客服協助": "<i class='text-muted'>- 開始對話 -</i>"
      };

      this.messages.push({
        id: Date.now(),
        sender: "系統小幫手",
        avatar: "https://i.pravatar.cc/40?img=4",
        text: DOMPurify.sanitize(textMap[option.label] || ""),
        time: new Date().toLocaleTimeString(),
        fromMe: false
      });

      if (option.label === "客服協助") {
        const token = localStorage.getItem("token");
        const response = await fetch('/api/Chat/CreateOrGetSession', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
          },
          body: JSON.stringify({
            FMemberId: this.currentUserId,
            FEmployeeId: this.targetUserId,
            Role: this.userRole,
          })
        });
        this.sessionId = await response.json();
        this.hasStartedConversation = true;
        this.isReadOnly = false;
        this.conversationEnded = false;
        console.log("✅ 開始對話，解鎖輸入框");
      }

      this.scrollToBottom();
    },

    handleInnerClick(event) {
      const target = event.target;
      const view = target.getAttribute("data-target");
      const routes = {
        WalkView: "/Walk",
        HotelView: "/Hotel",
        OrderManagement: "/Orders",
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
      await fetch(`https://localhost:7089/api/Chat/EndSession/${this.sessionId}`, {
        method: "POST",
        headers: { Authorization: "Bearer " + localStorage.getItem("token") }
      });
      await this.loadEmployeeSessions();

      if (this.connection && this.targetUserId) {
        try {
          await this.connection.invoke(
            "SendMessage",
            this.currentUserId,
            this.targetUserId,
             "<i class='text-muted'>- 此對話已結束 -</i>",
          );
        } catch (err) {
          console.error("❌ 無法傳送結束訊息：", err);
        }
      }
      this.targetUser = null;
      this.targetUserId = null;
      this.sessionId = null;
      this.messages = [];
      this.isReadOnly = false;
      this.conversationEnded = false;
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

.talklist{
  background-color: #e9a44b;
  color: white;
  font-size: 14px;
  padding: 5px 10px;;
  border-radius: 5px;
  cursor: pointer;
  display: block;
  width: 100%; 
}
</style>
