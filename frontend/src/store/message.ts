import {create} from 'zustand';

interface Message {
    id: string;
    message: string;
    user: {
        userId: string;
        username: string;
    }
    timeStamp: Date;
}

interface MessageStore {
    messages: Message[];

}