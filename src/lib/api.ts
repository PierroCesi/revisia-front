import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Intercepteur pour ajouter le token d'authentification
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('access_token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Intercepteur pour gérer les erreurs d'authentification
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('access_token');
            localStorage.removeItem('refresh_token');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export interface User {
    id: number;
    email: string;
    username: string;
    first_name: string;
    last_name: string;
    education_level?: string;
    created_at: string;
}

export interface AuthResponse {
    user: User;
    tokens: {
        access: string;
        refresh: string;
    };
}

export interface LoginData {
    email: string;
    password: string;
}

export interface RegisterData {
    email: string;
    username: string;
    first_name: string;
    last_name: string;
    education_level?: string;
    password: string;
    password_confirm: string;
}

export interface Document {
    id: number;
    title: string;
    file_type: string;
    created_at: string;
}

export interface Answer {
    id: number;
    answer_text: string;
    is_correct: boolean;
}

export interface Question {
    id: number;
    question_text: string;
    question_type: 'qcm' | 'open';
    difficulty: 'easy' | 'medium' | 'hard';
    answers: Answer[];
    created_at: string;
}

export interface Lesson {
    id: number;
    title: string;
    status: 'en_cours' | 'termine' | 'pause';
    difficulty: 'easy' | 'medium' | 'hard';
    total_questions: number;
    completed_questions: number;
    score: number;
    last_score: number;
    total_attempts: number;
    average_score: number;
    progress: number;
    is_completed: boolean;
    last_accessed: string;
    created_at: string;
    document_title: string;
}

export interface LessonStats {
    total_lessons: number;
    completed_lessons: number;
    average_score: number;
    total_study_time: number;
}

export interface CreateLessonData {
    document_id: number;
    title?: string;
    difficulty?: 'easy' | 'medium' | 'hard';
}

export interface SubmitAnswerData {
    question_id: number;
    selected_answer_id?: number;
    open_answer?: string;
}

export interface AISettings {
    questionCount: number;
    difficulty: 'easy' | 'medium' | 'hard';
    questionTypes: ('qcm' | 'open')[];
    educationLevel?: string;
}

export const authAPI = {
    login: async (data: LoginData): Promise<AuthResponse> => {
        const response = await api.post('/auth/login/', data);
        return response.data;
    },

    register: async (data: RegisterData): Promise<AuthResponse> => {
        const response = await api.post('/auth/register/', data);
        return response.data;
    },

    logout: async (): Promise<void> => {
        const refreshToken = localStorage.getItem('refresh_token');
        if (refreshToken) {
            await api.post('/auth/logout/', { refresh: refreshToken });
        }
    },

    getProfile: async (): Promise<User> => {
        const response = await api.get('/auth/profile/');
        return response.data;
    },
};

export const documentsAPI = {
    upload: async (file: File, title?: string, aiSettings?: AISettings): Promise<Document> => {
        const formData = new FormData();
        formData.append('file', file);
        if (title) {
            formData.append('title', title);
        }
        if (aiSettings) {
            formData.append('question_count', aiSettings.questionCount.toString());
            formData.append('difficulty', aiSettings.difficulty);
            formData.append('question_types', JSON.stringify(aiSettings.questionTypes));
            if (aiSettings.educationLevel) {
                formData.append('education_level', aiSettings.educationLevel);
            }
        }

        const response = await api.post('/auth/documents/upload/', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    },

    getAll: async (): Promise<Document[]> => {
        const response = await api.get('/auth/documents/');
        return response.data;
    },

    getQuestions: async (documentId: number): Promise<Question[]> => {
        const response = await api.get(`/auth/documents/${documentId}/questions/`);
        return response.data;
    },
};

export const lessonsAPI = {
    getAll: async (): Promise<Lesson[]> => {
        const response = await api.get('/auth/lessons/');
        return response.data;
    },

    create: async (data: CreateLessonData): Promise<Lesson> => {
        const response = await api.post('/auth/lessons/create/', data);
        return response.data;
    },

    getById: async (lessonId: number): Promise<{ lesson: Lesson; questions: Question[] }> => {
        const response = await api.get(`/auth/lessons/${lessonId}/`);
        return response.data;
    },

    submitAnswer: async (lessonId: number, data: SubmitAnswerData): Promise<{
        is_correct: boolean;
        lesson_progress: number;
        lesson_score: number;
    }> => {
        const response = await api.post(`/auth/lessons/${lessonId}/submit-answer/`, data);
        return response.data;
    },

    reset: async (lessonId: number): Promise<{ message: string }> => {
        const response = await api.post(`/auth/lessons/${lessonId}/reset/`);
        return response.data;
    },

    getAttempts: async (lessonId: number): Promise<{ attempt_number: number; score: number; completed_at: string }[]> => {
        const response = await api.get(`/auth/lessons/${lessonId}/attempts/`);
        return response.data;
    },

    getStats: async (): Promise<LessonStats> => {
        const response = await api.get('/auth/lessons/stats/');
        return response.data;
    },
};

export default api;
