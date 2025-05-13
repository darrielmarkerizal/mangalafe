import { NextResponse } from "next/server";
import db from "../../../../models/index.js";
import { verifyJwtToken } from "@/lib/jwt";

// GET /api/team - Get all team members
export async function GET(request) {
  try {
    const teamMembers = await db.TeamMember.findAll({
      order: [["displayOrder", "ASC"]],
    });
    return NextResponse.json({ success: true, data: teamMembers });
  } catch (error) {
    console.error("Error getting team members:", error);
    return NextResponse.json(
      { success: false, error: "Failed to get team members" },
      { status: 500 }
    );
  }
}

// POST /api/team - Create a new team member (requires authentication)
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

    const data = await request.json();

    // Calculate display order if not provided
    if (data.displayOrder === undefined) {
      const maxOrderResult = await db.TeamMember.findOne({
        order: [["displayOrder", "DESC"]],
      });

      data.displayOrder = maxOrderResult ? maxOrderResult.displayOrder + 1 : 0;
    }

    const newMember = await db.TeamMember.create(data);
    return NextResponse.json(
      { success: true, data: newMember },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating team member:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create team member" },
      { status: 500 }
    );
  }
}
