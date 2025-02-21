export interface IUser {
	id: string;
	name: string;
	email: string;
	image: string | null;
	createdAt: Date;
}

export interface IBook {
	id: string; // ISBN
	title: string;
	author: string;
	coverImage: string | null;
	description: string | null;
	publishedDate: string | null;
	createdAt: Date;
}

export interface IUserBook {
	id: string;
	userId: string;
	bookId: string;
	status: "read" | "want-to-read";
	createdAt: Date;
}

export interface IPost {
	id: string;
	userId: string;
	bookId: string | null;
	content: string;
	createdAt: Date;
}
