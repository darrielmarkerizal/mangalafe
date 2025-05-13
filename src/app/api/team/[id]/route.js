import { NextResponse } from "next/server";
import db from "../../../../../models/index.js";
import { verifyJwtToken } from "@/lib/jwt";

// GET /api/team/[id] - Get a single team member
export async function GET(request, { params }) {
  try {
    const { id } = params;
    const teamMember = await db.TeamMember.findByPk(id);

    if (!teamMember) {
      return NextResponse.json(
        { success: false, error: "Team member not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: teamMember });
  } catch (error) {
    console.error("Error getting team member:", error);
    return NextResponse.json(
      { success: false, error: "Failed to get team member" },
      { status: 500 }
    );
  }
}

// PUT /api/team/[id] - Update a team member (requires authentication)
export async function PUT(request, { params }) {
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

    const { id } = params;
    const data = await request.json();

    const teamMember = await db.TeamMember.findByPk(id);

    if (!teamMember) {
      return NextResponse.json(
        { success: false, error: "Team member not found" },
        { status: 404 }
      );
    }

    await teamMember.update(data);
    return NextResponse.json({ success: true, data: teamMember });
  } catch (error) {
    console.error("Error updating team member:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update team member" },
      { status: 500 }
    );
  }
}

// PATCH /api/team/[id] - Partially update a team member (requires authentication)
export async function PATCH(request, { params }) {
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

    const { id } = params;
    const data = await request.json();

    const teamMember = await db.TeamMember.findByPk(id);

    if (!teamMember) {
      return NextResponse.json(
        { success: false, error: "Team member not found" },
        { status: 404 }
      );
    }

    await teamMember.update(data);
    return NextResponse.json({ success: true, data: teamMember });
  } catch (error) {
    console.error("Error updating team member:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update team member" },
      { status: 500 }
    );
  }
}

// DELETE /api/team/[id] - Delete a team member (requires authentication)
export async function DELETE(request, { params }) {
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

    const { id } = params;
    const teamMember = await db.TeamMember.findByPk(id);

    if (!teamMember) {
      return NextResponse.json(
        { success: false, error: "Team member not found" },
        { status: 404 }
      );
    }

    await teamMember.destroy();

    // Re-order remaining team members
    const remainingMembers = await db.TeamMember.findAll({
      order: [["displayOrder", "ASC"]],
    });

    // Update display order for remaining members
    await Promise.all(
      remainingMembers.map((member, index) =>
        member.update({ displayOrder: index })
      )
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting team member:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete team member" },
      { status: 500 }
    );
  }
}
