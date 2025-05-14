<template>
  <div>
    <div class="chat-toggle-button" v-if="!showChat" @click="showChat = true">💬</div>

    <transition name="chatroom-fade">
      <div class="chatroom-wrapper" v-if="showChat">
        <div class="chatroom-box" :style="userRole === 'member' ? { width: '350px' } : {}">
          <button class="close-chat-btn" @click="showChat = false">-</button>

          <div class="container pt-5 h-100">
            <div class="row rounded-lg overflow-hidden shadow h-100">
              <div class="col-5 px-0 user-list bg-light" v-if="userRole === 'employee'">
                <div class="bg-gray px-4 py-2"><p class="h5 mb-0 py-1">進行中對話</p></div>
                <div class="px-3 py-2">
                  <div class="input-group input-group-sm mb-2">
                    <input v-model="searchQuery" type="text" class="form-control" placeholder="搜尋會員名稱" />
                    <button class="btn btn-outline-secondary">搜尋</button>
                  </div>
                  <div class="input-group input-group-sm">
                    <input v-model="startTime" type="datetime-local" class="form-control" />
                    <input v-model="endTime" type="datetime-local" class="form-control" />
                    <button class="btn btn-outline-secondary">篩選</button>
                  </div>
                </div>
                <div class="messages-box">
                  <div class="list-group rounded-0">
                    <a v-for="user in filteredUsers" :key="user.id" class="list-group-item list-group-item-action border-0">
                      <div class="d-flex align-items-start">
                        <img :src="user.avatar" class="rounded-circle mr-1" :alt="user.name" width="40" height="40" />
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
                <div class="bg-gray px-4 py-2"><p class="h5 mb-0 py-1">已結束對話</p></div>
              </div>

              <div :class="userRole === 'member' ? 'col-12' : 'col-7'" class="px-0 d-flex flex-column h-100">
                <div ref="chatBox" class="px-4 py-2 chat-box bg-white flex-grow-1 overflow-auto">
                  <div v-for="msg in messages" :key="msg.id"
                       :class="['pb-4', isMessageFromMe(msg) ? 'chat-message-right' : 'chat-message-left']">
                    <div class="d-flex align-items-start" :class="msg.fromMe ? 'flex-row-reverse' : ''">
                      <img :src="msg.avatar" class="rounded-circle" :class="msg.fromMe ? 'ml-1' : 'mr-1'" :alt="msg.sender" width="40" height="40" />
                      <div class="flex-shrink-1 bg-light rounded py-2 px-3" :class="msg.fromMe ? 'mr-3' : 'ml-3'">
                        <div class="font-weight-bold mb-1">{{ msg.fromMe ? 'YOU' : msg.sender }}</div>
                        <div v-html="msg.text" @click="handleInnerClick"></div>
                      </div>
                    </div>
                    <div class="text-muted small text-nowrap mt-2">{{ msg.time }}</div>
                  </div>
                </div>

                <div class="bot-options d-flex flex-row overflow-auto px-3 py-2 bg-white" style="white-space: nowrap;" v-if="userRole === 'member'">
                  <button v-for="opt in botOptions" :key="opt.label" class="btn btn-sm btn-outline-secondary me-2" @click="botOptionClicked(opt.label)">
                    {{ opt.label }}
                  </button>
                </div>

                <div class="bot-options px-3 py-2 bg-white" v-if="userRole === 'employee'">
                  <button class="btn btn-sm btn-outline-secondary" @click="endConversation">結束對話</button>
                </div>

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
import DOMPurify from 'dompurify';

export default {
  name: "ChatRoom",
  data() {
    return {
      userRole: 'employee', // 'member' or 'employee'
      showChat: false,
      searchQuery: '',
      startTime: '',
      endTime: '',
      messageText: "",
      users: [],
      messages: [],
      botOptions: [
        { label: '訂單管理', view: 'OrderManagement' },
        { label: '立即散步', view: 'WalkView' },
        { label: '寵物住宿', view: 'HotelView' },
        { label: '客服協助', view: null },
        { label: '常見問題', view: 'FAQ' }
      ]
    };
  },
  computed: {
    filteredUsers() {
      return this.users.filter(u => {
        const nameMatch = this.searchQuery ? u.name.toLowerCase().includes(this.searchQuery.toLowerCase()) : true;
        const timeMatch = (this.startTime && this.endTime)
          ? u.joinedAt >= this.startTime && u.joinedAt <= this.endTime
          : true;
        return nameMatch && timeMatch;
      });
    }
  },
  methods: {
    sendMessage() {
      if (!this.messageText.trim()) return;
      this.messages.push({
        id: Date.now(),
        sender: "you",
        avatar: "https://i.pravatar.cc/40?img=3",
        text: DOMPurify.sanitize(this.messageText),
        time: new Date().toLocaleTimeString(),
        fromMe: true
      });
      this.messageText = "";
      this.scrollToBottom();
    },
    botOptionClicked(option) {
      const now = new Date().toLocaleTimeString();
      const systemAvatar = 'https://i.pravatar.cc/40?img=4';

      const textMap = {
        '訂單管理': '了解您目前的訂單狀況，請點擊下方按鈕前往訂單管理：<br><div class="text-center"><button class="goto-button btn btn-sm btn-warning" data-target="OrderManagement">前往訂單管理</button></div>',
        '立即散步': '了解我們的散步服務，請點擊下方按鈕前往預約：<br><div class="text-center"><button class="goto-button btn btn-sm btn-warning" data-target="WalkView">前往選擇遛寵員</button></div>',
        '寵物住宿': '需要寵物住宿嗎？請點擊下方按鈕查看更多資訊：<br><div class="text-center"><button class="goto-button btn btn-sm btn-warning" data-target="HotelView">前往旅館介紹</button></div>',
        '常見問題': '以下是常見問題集，請點擊下方按鈕查看更多問題：<br><div class="text-center"><button class="goto-button btn btn-sm btn-warning" data-target="FAQ">前往常見問題</button></div>',
        '客服協助': '開始對話。'
      };

      this.messages.push({
        id: Date.now(),
        sender: '系統小幫手',
        avatar: systemAvatar,
        text: DOMPurify.sanitize(textMap[option] || ''),
        time: now,
        fromMe: false
      });

      this.scrollToBottom();
    },
    handleInnerClick(event) {
      const target = event.target;
      const view = target.getAttribute('data-target');
      if (target.classList.contains('goto-button') && view) {
        const routes = {
          'WalkView': '/Walk',
          'HotelView': '/Hotel',
          'OrderManagement': '/Order',
          'FAQ': '/FAQ'
        };
        if (routes[view]) this.$router.push(routes[view]);
      }
    },
    scrollToBottom() {
      this.$nextTick(() => {
        const box = this.$refs.chatBox;
        if (box) box.scrollTop = box.scrollHeight;
      });
    },
    isMessageFromMe(msg) {
      if (this.userRole === 'member') return msg.sender.toLowerCase() === 'alice';
      if (this.userRole === 'employee') return ['you', '系統小幫手'].includes(msg.sender.toLowerCase());
      return false;
    },
    endConversation() {
      alert("對話已結束（可補上轉移至已結束區域的邏輯）");
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

.input-group-sm .btn {
  height: calc(1.8125rem + 2px); /* 和小型輸入框高度一致 */
  font-size: 0.875rem;
  padding: 0.25rem 0.5rem;
}
</style>
