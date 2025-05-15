import { NextResponse } from "next/server";
import db from "../../../../models/index.js";
import { verifyJwtToken } from "@/lib/jwt";
import { Op } from "sequelize";

// GET /api/team - Get all team members with pagination, filtering, and sorting
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);

    // Pagination parameters
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const offset = (page - 1) * limit;

    // Search/filter parameters
    const search = searchParams.get("search") || "";
    const isActive = searchParams.get("isActive");

    // Sorting parameters
    const sortBy = searchParams.get("sortBy") || "displayOrder";
    const sortOrder = searchParams.get("sortOrder") || "ASC";

    // Build where clause for filtering
    const whereClause = {};

    if (search) {
      whereClause[Op.or] = [
        { name: { [Op.like]: `%${search}%` } },
        { position: { [Op.like]: `%${search}%` } },
      ];
    }

    if (isActive !== null && isActive !== undefined) {
      whereClause.isActive = isActive === "true";
    }

    // Execute query with all parameters
    const { count, rows } = await db.TeamMember.findAndCountAll({
      where: whereClause,
      order: [[sortBy, sortOrder]],
      limit,
      offset,
    });

    // Calculate pagination metadata
    const totalPages = Math.ceil(count / limit);
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;

    return NextResponse.json({
      success: true,
      data: rows,
      meta: {
        page,
        limit,
        totalItems: count,
        totalPages,
        hasNextPage,
        hasPrevPage,
      },
    });
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
