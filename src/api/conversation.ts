import { get, post, put, del } from '../utils/request'

// 添加会话模型接口
export interface Conversation {
  id: number
  title: string
  creator_id: number
  created_at: string
  updated_at: string
}

export interface ConversationData {
  id: number;
  title: string;
  subject: string;
  date: string;
  time: string;
  active: boolean;
  favorited?: boolean;
}

export interface ConversationQuery {
  search?: string
  skip?: number
  limit?: number
}

// 获取会话列表
export function getConversationList(params: ConversationQuery): Promise<ConversationData[]> {
  return get('/api/conversations', params)
    .then(res => res.data.map(item => ({
      id: item.id,
      title: item.title || '新对话',
      subject: item.subject || '',
      date: item.created_at ? new Date(item.created_at).toLocaleDateString() : '',
      time: item.created_at ? new Date(item.created_at).toLocaleDateString() : '',
      favorited: item.favorited || false,
      active: item.active || false,
    })))
    .catch(error => {
      console.error('获取会话列表失败:', error);
      return [];
    });
}

// 创建会话
export function createConversation(data: { title: string }) {
  return post('/api/conversations', data).then(res => ({
    id: res.data.id,
    title: res.data.title,
    subject: res.data.subject || '新对话',
    date: new Date(res.data.created_at).toLocaleDateString(),
    time: new Date(res.data.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
    favorited: res.data.favorited || false,
    active: res.data.active || true,
  }));
}

export function getConversation(id: number) {
  return get(`/api/conversations/${id}`).then(res => ({
    id: res.data.id,
    title: res.data.title,
    subject: res.data.subject || '新对话',
    date: new Date(res.data.created_at).toLocaleDateString(),
    time: new Date(res.data.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
    favorited: res.data.favorited || false,
    active: res.data.active || true,
  }));
}


// 更新会话
export function updateConversation(id: number, data: Partial<Conversation>) {
  return put(`/api/conversations/${id}`, data)
}

// 删除会话
export function deleteConversation(id: number) {
  return del(`/api/conversations/${id}`)
}