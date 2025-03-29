export type DiscussionPost = {
	id: string;
	userId: string;
	userName: string;
	userAvatar?: string;
	title: string;
	content: string;
	createdAt: string;
	likes: number;
	dislikes: number;
	replies: Comment[];
	author: Author;
	userVote?: 'UP' | 'DOWN' | null;
}

export type Author = {
	id: string;
	name: string;
	avatar?: string;
}

export type Comment = {
	id: string;
	author: {
	  id: string;
	  name: string;
	  image: string;
	};
	content: string;
	createdAt: string;
	likes?: number;
	dislikes?: number;
	userVote?: 'UP' | 'DOWN'| 'NONE' | null;
	replies?: Comment[];
}