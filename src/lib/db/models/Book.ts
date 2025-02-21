import { Model, DataTypes } from "sequelize";
import { sequelize } from "../index";
import type { IBook } from "../types";
import { User } from "./User";

export class Book extends Model implements IBook {
	declare id: string;
	declare title: string;
	declare author: string;
	declare coverImage: string | null;
	declare description: string | null;
	declare publishedDate: string | null;
	declare createdAt: Date;

	// Instance methods
	async getReaderCount() {
		const readers = await this.countUsers();
		return readers;
	}

	async getReadByUsers() {
		const readers = await this.getUsers({
			through: { where: { status: "read" } },
		});
		return readers;
	}

	async getPosts() {
		const posts = await this.getPosts({
			include: [{ model: User, attributes: ["id", "name", "image"] }],
			order: [["createdAt", "DESC"]],
		});
		return posts;
	}
}

Book.init(
	{
		// this is isbn
		id: {
			type: DataTypes.STRING,
			primaryKey: true,
		},
		title: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		author: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		coverImage: {
			type: DataTypes.STRING,
		},
		description: {
			type: DataTypes.TEXT,
		},
		publishedDate: {
			type: DataTypes.STRING,
		},
		createdAt: {
			type: DataTypes.DATE,
			defaultValue: DataTypes.NOW,
		},
	},
	{
		sequelize,
		modelName: "Book",
	}
);
