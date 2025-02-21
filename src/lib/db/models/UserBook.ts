import { Model, DataTypes } from "sequelize";
import { sequelize } from "../index";
import { User } from "./User";
import { Book } from "./Book";

export class UserBook extends Model {
	declare id: string;
	declare userId: string;
	declare bookId: string;
	declare status: "read" | "want-to-read";
	declare createdAt: Date;
}

UserBook.init(
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
			allowNull: false,
			references: {
				model: Book,
				key: "id",
			},
		},
		status: {
			type: DataTypes.ENUM("read", "want-to-read"),
			allowNull: false,
		},
		createdAt: {
			type: DataTypes.DATE,
			defaultValue: DataTypes.NOW,
		},
	},
	{
		sequelize,
		modelName: "UserBook",
	}
);
