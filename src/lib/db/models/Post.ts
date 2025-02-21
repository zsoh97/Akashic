import { Model, DataTypes } from "sequelize";
import { sequelize } from "../index";
import type { IPost } from "../types";
import { User } from "./User";
import { Book } from "./Book";

export class Post extends Model implements IPost {
	declare id: string;
	declare userId: string;
	declare bookId: string | null;
	declare content: string;
	declare createdAt: Date;

	// Instance methods
	async getAuthor() {
		const author = await this.get("user");
		return author;
	}

	async getBook() {
		if (!this.bookId) return null;
		const book = await this.get("book");
		return book;
	}
}

Post.init(
	{
		id: {
			type: DataTypes.UUID,
			defaultValue: DataTypes.UUIDV4,
			primaryKey: true,
		},
		userId: {
			type: DataTypes.UUID,
			allowNull: false,
			references: {
				model: User,
				key: "id",
			},
		},
		bookId: {
			type: DataTypes.UUID,
			references: {
				model: Book,
				key: "id",
			},
		},
		content: {
			type: DataTypes.TEXT,
			allowNull: false,
		},
		createdAt: {
			type: DataTypes.DATE,
			defaultValue: DataTypes.NOW,
		},
	},
	{
		sequelize,
		modelName: "Post",
	}
);
