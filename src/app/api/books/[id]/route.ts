import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { books } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function GET(
	request: Request,
	{ params }: { params: { id: string } }
) {
	try {
		const book = await db
			.select()
			.from(books)
			.where(eq(books.id, params.id))
			.limit(1);

		if (!book.length) {
			return NextResponse.json({ error: "Book not found" }, { status: 404 });
		}

		return NextResponse.json(book[0]);
	} catch (error) {
		return NextResponse.json(
			{ error: "Failed to fetch book details" },
			{ status: 500 }
		);
	}
}
