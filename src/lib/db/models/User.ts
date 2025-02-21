import { Model, DataTypes } from "sequelize";
import { sequelize } from "../index";
import type { IUser } from "../types";
import { Book } from "./Book";

export class User extends Model implements IUser {
	declare id: string;
	declare name: string;
	declare email: string;
	declare image: string | null;
	declare createdAt: Date;

	// Instance methods
	async getReadBooks() {
		const books = await this.getBooks({
			through: { where: { status: "read" } },
		});
		return books;
	}

	async getWantToReadBooks() {
		const books = await this.getBooks({
			through: { where: { status: "want-to-read" } },
		});
		return books;
	}

	async addBookToShelf(bookId: string, status: "read" | "want-to-read") {
		await this.addBook(bookId, { through: { status } });
	}
}

User.init(
	{
		id: {
			type: DataTypes.UUID,
			defaultValue: DataTypes.UUIDV4,
			primaryKey: true,
		},
		name: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		email: {
			type: DataTypes.STRING,
			allowNull: false,
			unique: true,
		},
		image: {
			type: DataTypes.STRING,
		},
		createdAt: {
			type: DataTypes.DATE,
			defaultValue: DataTypes.NOW,
		},
	},
	{
		sequelize,
		modelName: "User",
	}
);
