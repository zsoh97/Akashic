import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { userBooks, books } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET() {
	const session = await getServerSession(authOptions);
	if (!session?.user) {
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
	}

	try {
		const results = await db
			.select({
				id: books.id,
				title: books.title,
				author: books.author,
				coverImage: books.coverImage,
				status: userBooks.status,
			})
			.from(userBooks)
			.innerJoin(books, eq(books.id, userBooks.bookId))
			.where(eq(userBooks.userId, session.user.id));

		return NextResponse.json(results);
	} catch (error) {
		return NextResponse.json(
			{ error: "Failed to fetch user's books" },
			{ status: 500 }
		);
	}
}

export async function POST(request: Request) {
	const session = await getServerSession(authOptions);
	if (!session?.user) {
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
	}

	try {
		const { bookId, status } = await request.json();

		const result = await db
			.insert(userBooks)
			.values({
				userId: session.user.id,
				bookId,
				status,
			})
			.onConflictDoUpdate({
				target: [userBooks.userId, userBooks.bookId],
				set: { status },
			});

		return NextResponse.json({ success: true });
	} catch (error) {
		return NextResponse.json(
			{ error: "Failed to update book status" },
			{ status: 500 }
		);
	}
}
