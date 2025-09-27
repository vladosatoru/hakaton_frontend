import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Проверяем, является ли путь админ-панелью
  if (pathname.startsWith("/admin")) {
    // Получаем токены из куков запроса
    const accessToken = request.cookies.get("accessToken")?.value;
    const refreshToken = request.cookies.get("refreshToken")?.value;

    // Если нет токенов, перенаправляем на страницу запрета доступа
    if (!accessToken || !refreshToken) {
      return NextResponse.redirect(new URL("/access-denied", request.url));
    }

    try {
      // Делаем API запрос для получения данных пользователя
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";
      const response = await fetch(`${apiUrl}/auth/profile`, {
        headers: {
          "Authorization": `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        cache: "no-store", // Важно для middleware
      });

      if (!response.ok) {
        if (response.status === 401) {
          // Токен невалидный или истек
          return NextResponse.redirect(new URL("/access-denied", request.url));
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const user = await response.json();
      console.log("User data:", user);

      // Проверяем роль пользователя
      if (user.role !== "ADMIN" && user.role !== "EDITOR") {
        return NextResponse.redirect(new URL("/access-denied", request.url));
      }

    } catch (error) {
      console.error("Auth check error:", error);
      return NextResponse.redirect(new URL("/access-denied", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};