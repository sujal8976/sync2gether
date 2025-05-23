export type VoteType = 1 | 0 | -1;

export interface Video {
    id: string;
    youtubeVideoId: string;
    title: string;
    thumbnail: string;
    addedBy: string; // username of who added this video
    upVote: number; // total of 1
    downVote: number; // total of -1
    userVote: VoteType; // this will i handle in frontend
}

export interface PlayerState {
    videoId: string | null;
    isPlaying: boolean;
    currentTime: number;
    duration: number;
}