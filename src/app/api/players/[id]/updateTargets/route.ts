import { NextResponse } from 'next/server';
import { db } from '@/lib/postgres'; 

/**
 * Interface defining the shape of our Database Row for a Player.
 * This ensures type safety and prevents accessing undefined properties.
 */
interface PlayerRecord {
  id: number;
  targets: number[];
  hide_list: number[];
  score: number;
  code: number;
}

/**
 * POST Handler for the Critical Functionality Loop.
 * * Logic Flow:
 * 1. Validate incoming parameters and request body.
 * 2. Fetch the player record; if missing, fail explicitly.
 * 3. Validate the user-provided 'code' against current targets.
 * 4. Update the database record atomically (points + target rotation).
 * * @param request - The incoming HTTP Request object.
 * @param context - The dynamic route parameters (id).
 * @returns NextResponse containing success status or specific error details.
 */
export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  // --- 1. VALIDATION ---
  
  // Parse playerId from params
  const playerId = parseInt(params.id);
  if (isNaN(playerId)) {
    return NextResponse.json({ error: "Invalid Player ID format" }, { status: 400 });
  }

  // Parse and validate the body
  let body;
  try {
    body = await request.json();
  } catch (e) {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const { code } = body;
  if (typeof code !== 'number') {
    return NextResponse.json({ error: "Code must be a number" }, { status: 400 });
  }

  try {
    // --- 2. DATA FETCHING ---

    // Fetch the current player record
    const playerResult = await db.query<PlayerRecord>('SELECT * FROM players WHERE id = $1', [playerId]);
    
    // Explicit Error Check: Do not use object fallbacks. Fail if player is missing.
    if (playerResult.rows.length === 0) {
      return NextResponse.json({ error: "Player not found" }, { status: 404 });
    }

    const player = playerResult.rows[0];
    const currentTargets = player.targets || [];

    // --- 3. TARGET CHECK ---

    // Check if the input code matches any of the current targets
    // We use ANY() to check if the code exists within the array of target IDs
    const targetHitResult = await db.query(
      'SELECT id FROM players WHERE id = ANY($1) AND code = $2',
      [currentTargets, code]
    );

    // If no target matches, return an explicit 400 error.
    if (targetHitResult.rows.length === 0) {
      return NextResponse.json({ success: false, message: "Invalid target code provided" }, { status: 400 });
    }

    const hitId = targetHitResult.rows[0].id;

    // --- 4. TARGET ROTATION LOGIC ---

    // Filter out the hit target from the current list (immutable update)
    const updatedTargets = currentTargets.filter((id: number) => id !== hitId);

    // Fetch a new candidate for a new target
    // We explicitly exclude the current player, their hide list, and current targets
    const newTargetQuery = await db.query(
      `SELECT id FROM players 
       WHERE id != $1 
       AND NOT (id = ANY($2)) 
       AND NOT (id = ANY($3)) 
       ORDER BY RANDOM() LIMIT 1`,
      [playerId, player.hide_list || [], updatedTargets]
    );

    // Add the new target if one was found
    if (newTargetQuery.rows.length > 0) {
      updatedTargets.push(newTargetQuery.rows[0].id);
    }

    // --- 5. PERSISTENCE ---

    // Execute update. In a high-concurrency Java app, you might use @Transactional here.
    // In SQL, ensure this is a single block.
    await db.query(
      'UPDATE players SET score = score + 100, targets = $1 WHERE id = $2',
      [updatedTargets, playerId]
    );

    return NextResponse.json({ 
      success: true, 
      message: "Target eliminated",
      targets: updatedTargets 
    });

  } catch (err) {
    // --- 6. ERROR HANDLING ---
    // Log the actual error for server-side debugging
    console.error("Critical Functionality Loop Error:", err);
    
    // Return a structured error response, never leaking raw DB stack traces to the client
    return NextResponse.json({ 
      error: "Internal Server Error", 
      details: process.env.NODE_ENV === 'development' ? String(err) : undefined 
    }, { status: 500 });
  }
}