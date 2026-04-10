import { NextResponse } from 'next/server';
import { z } from 'zod';

// 1. Define the "Shape" of allowed data
const ContactSchema = z.object({
  email: z.string().email("Invalid email address"),
  message: z.string().min(10, "Message must be at least 10 characters").max(500),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // 2. Validate the data
    const validation = ContactSchema.safeParse(body);

    if (!validation.success) {
      // Send back the specific error if validation fails
      return NextResponse.json(
        { errors: validation.error.flatten().fieldErrors }, 
        { status: 400 }
      );
    }

    // 3. If successful, the data is now "clean"
    const { email, message } = validation.data;
    console.log("Clean data received:", email, message);

    return NextResponse.json({ message: "Success!" }, { status: 200 });

  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}