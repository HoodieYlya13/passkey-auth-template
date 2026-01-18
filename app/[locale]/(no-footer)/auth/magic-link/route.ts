import { verifyMagicLinkAction } from "@/actions/auth/magic-link/verify.magic.link.actions";
import { ERROR_CODES, tryCatch } from "@/utils/errors.utils";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const token = searchParams.get("token");
  const origin = request.nextUrl.origin;

  if (!token)
    return NextResponse.redirect(
      new URL("/auth?error=" + ERROR_CODES.AUTH[4], origin)
    );

  const [error, username] = await tryCatch(verifyMagicLinkAction(token));

  if (error)
    return NextResponse.redirect(
      new URL("/auth?error=" + ERROR_CODES.AUTH[1], origin)
    );

  return NextResponse.redirect(
    new URL(`/profile${username && `?username=${username}`}`, origin)
  );
}
