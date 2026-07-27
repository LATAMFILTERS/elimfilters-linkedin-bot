import fs from 'fs/promises';
import path from 'path';

const DEFAULT_DATA_DIR = './data';

export function createStorage({ dataDir = DEFAULT_DATA_DIR } = {}) {
  const conversationsFile = path.join(dataDir, 'conversations.json');

  async function ensureDir() {
    try {
      await fs.mkdir(dataDir, { recursive: true });
    } catch (error) {
      if (error.code !== 'EEXIST') throw error;
    }
  }

  async function loadConversations() {
    await ensureDir();
    try {
      const data = await fs.readFile(conversationsFile, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      if (error.code === 'ENOENT') return {};
      throw error;
    }
  }

  async function saveConversations(conversations) {
    await ensureDir();
    await fs.writeFile(conversationsFile, JSON.stringify(conversations, null, 2));
  }

  return {
    async getContact(phoneNumber) {
      const conversations = await loadConversations();
      return conversations[phoneNumber] || null;
    },

    async saveContact(phoneNumber, contactData) {
      const conversations = await loadConversations();
      conversations[phoneNumber] = {
        phoneNumber,
        messages: [],
        ...conversations[phoneNumber],
        ...contactData,
        updatedAt: new Date().toISOString()
      };
      await saveConversations(conversations);
      return conversations[phoneNumber];
    },

    async addMessage(phoneNumber, message) {
      const conversations = await loadConversations();
      if (!conversations[phoneNumber]) {
        conversations[phoneNumber] = {
          phoneNumber,
          messages: [],
          state: 'greeting',
          createdAt: new Date().toISOString()
        };
      }

      conversations[phoneNumber].messages.push({
        ...message,
        timestamp: new Date().toISOString()
      });

      conversations[phoneNumber].updatedAt = new Date().toISOString();
      await saveConversations(conversations);
      return conversations[phoneNumber];
    },

    async updateContactState(phoneNumber, state) {
      const conversations = await loadConversations();
      if (conversations[phoneNumber]) {
        conversations[phoneNumber].state = state;
        conversations[phoneNumber].updatedAt = new Date().toISOString();
        await saveConversations(conversations);
      }
      return conversations[phoneNumber];
    },

    async getConversationHistory(phoneNumber, limit = 10) {
      const contact = await this.getContact(phoneNumber);
      if (!contact) return [];
      return (contact.messages || []).slice(-limit);
    }
  };
}
