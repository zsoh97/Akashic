import { User } from "./User";
import { Book } from "./Book";
import { UserBook } from "./UserBook";
import { Post } from "./Post";
import { sequelize } from "../index";

// Set up associations
User.belongsToMany(Book, { through: UserBook });
Book.belongsToMany(User, { through: UserBook });
User.hasMany(Post);
Post.belongsTo(User);
Book.hasMany(Post);
Post.belongsTo(Book);

// Sync models with database
sequelize
	.sync()
	.then(() => console.log("Models synchronized"))
	.catch((err) => console.error("Error synchronizing models:", err));

export const models = {
	User,
	Book,
	UserBook,
	Post,
};
