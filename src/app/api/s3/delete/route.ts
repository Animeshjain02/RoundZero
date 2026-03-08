import { NextResponse } from "next/server";

export async function DELETE() {
  return NextResponse.json(
    {
      error:
        "This delete route is deprecated. Use the authenticated media router instead.",
    },
    { status: 410 },
  );
}
