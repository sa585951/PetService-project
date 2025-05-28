<template> 
  <div>
    <div class="chat-toggle-button" v-if="!showChat" @click="openChat">💬
      <span
        v-if="hasUnread"
        class="position-absolute start-75 translate-middle p-2 bg-danger border border-light rounded-circle"
        style="width: 10px; height: 10px;"
      ></span>
    </div>
    <transition name="chatroom-fade">
      <div class="chatroom-wrapper" v-if="showChat">
        <div class="chatroom-box" :style="userRole === 'member' ? { width: '350px' } : {}">
          <button class="close-chat-btn" @click="closeChat">-</button>
          <div class="container pt-5 h-100">
            <div class="row rounded-lg overflow-hidden shadow h-100">
              <div class="col-4 px-0 user-list bg-light" v-if="userRole === 'employee'">
                <div class="input-group input-group-sm py-1 px-1">
                  <input v-model="searchQuery" type="text" class="form-control" placeholder="搜尋會員名稱" /> 
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
                          <span
                            v-if="unreadUserIds.includes(user.id.toString())"
                            class="dot ms-2"
                          ></span>
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
                    <small class="chat-time text-muted">{{ formatMessageTime(msg.time) }}</small>
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
import dayjs from 'dayjs';
import * as signalR from "@microsoft/signalr";
import { jwtDecode } from 'jwt-decode';
import { isReadonly } from 'vue';



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
      endedUsers: [],
      targetUser: null,
      currentUserAvatarUrl: "",
      botOptions: [
        { label: '客服協助', view: null },
        { label: '訂單管理', view: 'OrderManagement' },
        { label: '立即散步', view: 'WalkView' },
        { label: '寵物住宿', view: 'HotelView' },
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
      showActiveList: true,
      showEndedList: true,
      isReadOnly: false,
      hasStartedConversation: false,
      autoReadIntervalId: null, // ✅ 用來清除 interval
      unreadUserIds: [] ,
    };
  },

  watch: {
    messages: {
      deep: true,
      handler() {
        if (
          this.showChat &&
          this.targetUserId &&
          this.messages.some(m => !m.isRead && !m.fromMe) // 有未讀的對方訊息
        ) {
          this.markCurrentSessionAsRead();
        }
      }
    }
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
    },
      hasUnread() {
      return this.unreadUserIds.length > 0;
    }
  },
    
  

  methods: {
    getAvatarUrl(path) {
        return path
          ? `https://localhost:7089${path}`
          : 'https://localhost:7089/uploads/avatars/default-avatar.jpg';
      },

     async loadEmployeeSessions() {
      const token = localStorage.getItem("token");

      const res = await fetch("/api/Chat/GetActiveSessions", {
        headers: { Authorization: "Bearer " + token }
      });
      const activeList = await res.json();

      const endedRes = await fetch("/api/Chat/GetEndedSessions", {
        headers: { Authorization: "Bearer " + token }
      });
      const endedList = await endedRes.json();

      // ✅ 正確命名：使用 activeList / endedList
      this.users.splice(0, this.users.length, ...activeList);
      this.endedUsers.splice(0, this.endedUsers.length, ...endedList);
    },
    
    async initSignalR() {
      if (this.connection) return;

      this.connection = new signalR.HubConnectionBuilder()
        .withUrl(`https://localhost:7089/chathub?userId=${this.currentUserId}`)
        .withAutomaticReconnect()
        .build();

      this.connection.on("ReceiveMessage", async (msg) => {
        const isMe = msg.senderId.toString() === this.currentUserId.toString();

        // ✅ 判斷是否為員工的未讀訊息通知
        if (this.userRole === "employee" && !isMe) {
          const fromUserId = msg.senderId.toString();
          if (fromUserId !== this.targetUserId) {
            if (!this.unreadUserIds.includes(fromUserId)) {
              this.unreadUserIds.push(fromUserId);
              console.log("🆕 新增未讀訊息標記：", fromUserId);
            }
          }
        }

        this.messages.push({
          id: Date.now(),
          sender: msg.senderName,
          avatar: this.getAvatarUrl(msg.senderAvatar),
          text: DOMPurify.sanitize(msg.messageText),
          time: new Date(),
          fromMe: isMe,
          isRead: isMe ? true : false
        });

        this.scrollToBottom();

        if (this.userRole === "member") {
          await this.checkIfSessionEnded();
          const sessionInfo = this.endedUsers.find(x => x.sessionId == this.sessionId);
          if (sessionInfo) {
            this.isReadOnly = true;
            this.conversationEnded = true;
          }
        }

        if (this.userRole === "employee") {
          await this.loadEmployeeSessions();
        }
      });

      try {
        await this.connection.start();
        console.log("✅ SignalR 已連線");
      } catch (err) {
        console.error("❌ SignalR 連線失敗：", err);
      }
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
        // ✅ 取得顯示名稱與 ID
        const infoRes = await fetch(`https://localhost:7089/api/Chat/GetNameByEmail?email=${email}`, {
          headers: { Authorization: "Bearer " + token }
        });
        if (!infoRes.ok) {
          const errorText = await infoRes.text();
          console.error("❌ 取得使用者名稱失敗：", errorText);
          return;
        }

        const info = await infoRes.json();
        console.log("info", info);
        this.currentUserName = info.name;
        this.currentUserId = info.id.toString();

        // ✅ 會員預設目標客服 ID，並確認是否有已結束對話
        if (this.userRole === "member") {
          this.targetUserId = "2"; // 固定客服 ID
          await this.checkIfSessionEnded();
        }

        // ✅ 員工載入進行中與已結束會話清單，並建立 SignalR 連線
        if (this.userRole === "employee") {
          await this.loadEmployeeSessions();
          await this.initSignalR(); // ✅ 改為抽離的初始化方法
        }

      } catch (err) {
        console.error("❌ openChat 發生錯誤：", err);
      }

      // ✅ 啟用「自動已讀判斷」
      this.autoReadIntervalId = setInterval(() => {
        const hasUnread = this.messages.some(m => !m.isRead && !m.fromMe);
        if (this.showChat && this.sessionId && this.targetUserId && hasUnread) {
          this.markCurrentSessionAsRead();
        }
      }, 1000);
    },

    
    async markCurrentSessionAsRead() {
      try {
        await fetch("/api/Chat/MarkAsRead", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + localStorage.getItem("token")
          },
          body: JSON.stringify({
            sessionId: parseInt(this.sessionId),
            userId: parseInt(this.currentUserId)
          })
        });
        console.log("✅ 自動已讀");
        // 更新前端的已讀狀態
        this.messages = this.messages.map(m => ({
          ...m,
          isRead: m.fromMe ? m.isRead : true
        }));
      } catch (err) {
        console.error("❌ 自動已讀失敗", err);
      }
    },

    formatMessageTime(timestamp) {
      const now = dayjs();
      const time = dayjs(timestamp);

      // 判斷是否同一天
      if (now.isSame(time, 'day')) {
        return time.format('HH:mm');
      } else {
        return time.format('YYYY/MM/DD HH:mm');
      }
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
    
      async markMessagesAsRead(sessionId, userId) {
        try {
          await fetch("https://localhost:7145/api/Chat/MarkAsRead", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
            },
            body: JSON.stringify({ sessionId, userId }),
          });
        } catch (error) {
          console.error("標記已讀失敗:", error);
        }
      },

    async selectUser(user) {
      this.targetUser = user;
      this.targetUserId = user.id.toString();
      this.sessionId = user.sessionId;
      this.isReadOnly = user.status === "1"; 

      this.unreadUserIds = this.unreadUserIds.filter(id => id !== user.id.toString());

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
          time: m.fSendTime ,
          fromMe: isMe,
          isRead: m.fIsRead === true || m.fIsRead === 1 , // ✅ 判斷已讀狀態
        };
        
      });
      console.log("123",this.messages)

      this.$nextTick(() => {
      this.scrollToBottom(); 
      });
      
      console.log("✅ 載入訊息完成，共", this.messages.length, "則");
      
      await fetch("/api/Chat/MarkAsRead", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token
        },
        body: JSON.stringify({
          sessionId: parseInt(this.sessionId),   // <-- 強制轉為數字
          userId: parseInt(this.currentUserId) // <-- 強制轉為數字
        })
      });

      if (this.autoReadIntervalId) clearInterval(this.autoReadIntervalId); // 清除前一次的
        this.autoReadIntervalId = setInterval(() => {
          const hasUnread = this.messages.some(m => !m.isRead && !m.fromMe);
          if (this.showChat && this.sessionId && this.targetUserId && hasUnread) {
            this.markCurrentSessionAsRead();
          }
        }, 1000);
    },

    async closeChat() {
      if (this.userRole === "member" && this.connection) {
        // await this.connection.stop();
        // console.log("signalR 已斷線");
        // this.connection = null;
      } else if (this.userRole === "employee") {
        console.log("保留SignalR連線");
      }
      // this.showChat = false;
      // if (this.autoReadIntervalId) {
      //   clearInterval(this.autoReadIntervalId);
      //   this.autoReadIntervalId = null;
      // }
      this.showChat = false;
      this.targetUser = null;
      this.targetUserId = null;
      this.sessionId = null;
      this.messages = [];
      this.isReadOnly = true;
      this.conversationEnded = false;
      this.hasStartedConversation = false;

      // ✅ 3. 停止已讀監聽計時器
      if (this.autoReadIntervalId) {
        clearInterval(this.autoReadIntervalId);
        this.autoReadIntervalId = null;
      }
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
        "常見問題": "請點擊查看常見問題：<br><div class='text-center'><button class='goto-button btn btn-sm btn-warning' data-target='FAQ'>查看 FAQ</button></div>",
        "客服協助": "<i class='text-muted'>- 開始對話 -</i>"
      };

      this.messages.push({
        id: Date.now(),
        sender: "系統小幫手",
        avatar: 'https://localhost:7089/uploads/avatars/default-avatar.jpg',
        text: DOMPurify.sanitize(textMap[option.label] || ""),
        time: new Date(),
        fromMe: false
      });

      // if (option.label === "客服協助") {
      //   const token = localStorage.getItem("token");
      //   const response = await fetch('/api/Chat/CreateOrGetSession', {
      //     method: 'POST',
      //     headers: {
      //       'Content-Type': 'application/json',
      //       'Authorization': 'Bearer ' + token
      //     },
      //     body: JSON.stringify({
      //       FMemberId: this.currentUserId,
      //       FEmployeeId: this.targetUserId,
      //       Role: this.userRole,
      //     })
      //   });
      //   this.sessionId = await response.json();
      //   this.hasStartedConversation = true;
      //   this.isReadOnly = false;
      //   this.conversationEnded = false;
      //   console.log("✅ 開始對話，解鎖輸入框");
      // }
      if (option.label === "客服協助") {
        const token = localStorage.getItem("token");

        // ✅ 建立 / 取得聊天會話
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

        // ✅ 僅在尚未連線時建立 SignalR
        if (!this.connection) {
          await this.initSignalR();
        }
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

      this.isReadOnly = true;
      

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

      
      // ✅ 重點：清空目前對話對象與訊息
      this.targetUserId = null;
      this.sessionId = null;
      this.messages = [];
      this.isReadOnly = false; // 清掉也可以，或等下次選人再判斷

      await this.loadEmployeeSessions();
    }
  }
};

</script>

<style scoped>
.dot {
  width: 8px;
  height: 8px;
  background-color: red;
  border-radius: 50%;
  display: inline-block;
}

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
