import funcUrls from '../../backend/func2url.json';

const API_URLS = {
  auth: funcUrls.auth,
  streams: funcUrls.streams,
  chat: funcUrls.chat,
  donations: funcUrls.donations,
  uploadImage: funcUrls['upload-image'],
  transactions: funcUrls.transactions,
  referrals: funcUrls.referrals
};

export interface User {
  id: number;
  username: string;
  email: string;
  avatar: string;
  boombucks: number;
}

export interface Stream {
  id: number;
  title: string;
  description?: string;
  thumbnail: string;
  category: string;
  isLive: boolean;
  viewers: number;
  ttsEnabled?: boolean;
  ttsVoice?: string;
  username: string;
  avatar: string;
  streamKey?: string;
}

export interface ChatMessage {
  id: number;
  username: string;
  message: string;
  timestamp: string;
}

export interface Donation {
  id: number;
  amount: number;
  message?: string;
  timestamp: string;
  username: string;
}

export const authAPI = {
  register: async (username: string, email: string, password: string) => {
    const response = await fetch(API_URLS.auth, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'register', username, email, password })
    });
    return response.json();
  },

  login: async (email: string, password: string) => {
    const response = await fetch(API_URLS.auth, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'login', email, password })
    });
    return response.json();
  },

  updateProfile: async (email: string, username?: string, avatar?: string) => {
    const response = await fetch(API_URLS.auth, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'update_profile', email, username, avatar })
    });
    return response.json();
  }
};

export const uploadAPI = {
  uploadImage: async (imageFile: File): Promise<{ url: string; filename: string }> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = async () => {
        try {
          const base64 = reader.result as string;
          const response = await fetch(API_URLS.uploadImage, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              image: base64,
              filename: imageFile.name
            })
          });
          const data = await response.json();
          if (data.error) {
            reject(new Error(data.error));
          } else {
            resolve(data);
          }
        } catch (error) {
          reject(error);
        }
      };
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsDataURL(imageFile);
    });
  }
};

export const streamsAPI = {
  getAll: async (): Promise<{ streams: Stream[] }> => {
    const response = await fetch(API_URLS.streams);
    return response.json();
  },

  create: async (userId: number, title: string, category: string, description?: string) => {
    const response = await fetch(API_URLS.streams, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_id: userId, title, category, description })
    });
    return response.json();
  },

  stop: async (streamId: number) => {
    const response = await fetch(API_URLS.streams, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ stream_id: streamId, action: 'stop' })
    });
    return response.json();
  },

  updateViewers: async (streamId: number, viewersCount: number) => {
    const response = await fetch(API_URLS.streams, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ stream_id: streamId, action: 'update_viewers', viewers_count: viewersCount })
    });
    return response.json();
  }
};

export const chatAPI = {
  getMessages: async (streamId: number, limit = 50): Promise<{ messages: ChatMessage[] }> => {
    const response = await fetch(`${API_URLS.chat}?stream_id=${streamId}&limit=${limit}`);
    return response.json();
  },

  sendMessage: async (streamId: number, userId: number, username: string, message: string) => {
    const response = await fetch(API_URLS.chat, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ stream_id: streamId, user_id: userId, username, message })
    });
    return response.json();
  }
};

export const donationsAPI = {
  getDonations: async (streamId: number): Promise<{ donations: Donation[] }> => {
    const response = await fetch(`${API_URLS.donations}?stream_id=${streamId}`);
    return response.json();
  },

  sendDonation: async (streamId: number, fromUserId: number, amount: number, message?: string) => {
    const response = await fetch(API_URLS.donations, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ stream_id: streamId, from_user_id: fromUserId, amount, message })
    });
    return response.json();
  }
};

export const transactionsAPI = {
  getTransactions: async (userId: number) => {
    const response = await fetch(`${API_URLS.transactions}?user_id=${userId}`);
    return response.json();
  },

  createTransaction: async (userId: number, type: string, amount: number, currency: string, description: string) => {
    const response = await fetch(API_URLS.transactions, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_id: userId, type, amount, currency, description })
    });
    return response.json();
  }
};

export const referralsAPI = {
  getReferrals: async (userId: number) => {
    const response = await fetch(`${API_URLS.referrals}?user_id=${userId}`);
    return response.json();
  },

  recordReferral: async (referrerId: number, referredUserId: number, purchaseAmount: number) => {
    const response = await fetch(API_URLS.referrals, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ referrer_id: referrerId, referred_user_id: referredUserId, purchase_amount: purchaseAmount })
    });
    return response.json();
  }
};