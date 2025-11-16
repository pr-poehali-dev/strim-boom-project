const API_URLS = {
  auth: 'https://functions.poehali.dev/a9383ee1-ee25-4a83-a066-7f3e8b8c9fac',
  streams: 'https://functions.poehali.dev/daff0434-9d18-4277-8d13-6fe57cf35ba0',
  chat: 'https://functions.poehali.dev/2b97607d-7104-44d4-a96c-c9e1df117443',
  donations: 'https://functions.poehali.dev/32dd2c72-b316-4678-907d-c315427d7b66',
  uploadImage: 'https://functions.poehali.dev/b63e1f86-e77a-4fff-9871-a16f2ad101af'
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