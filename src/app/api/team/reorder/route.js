import { NextResponse } from "next/server";
import db from "../../../../../models/index.js";
import { verifyJwtToken } from "@/lib/jwt";

// POST /api/team/reorder - Update order of team members (requires authentication)
export async function POST(request) {
  try {
    // Verify JWT token
    const token = request.headers.get("authorization")?.split(" ")[1];
    if (!token) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const decoded = await verifyJwtToken(token);
    if (!decoded) {
      return NextResponse.json(
        { success: false, error: "Invalid token" },
        { status: 401 }
      );
    }

    const members = await request.json();

    // Update each member with new display order
    await Promise.all(
      members.map((member) =>
        db.TeamMember.update(
          { displayOrder: member.displayOrder },
          { where: { id: member.id } }
        )
      )
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error reordering team members:", error);
    return NextResponse.json(
      { success: false, error: "Failed to reorder team members" },
      { status: 500 }
    );
  }
}
