import { NextRequest, NextResponse } from 'next/server';

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const accessToken = req.cookies.get('access_token')?.value;
  const refreshToken = req.cookies.get('refresh_token')?.value;
  const hasToken = !!(accessToken || refreshToken);

  // 1. Eximir totalmente estáticos y assets de Next.js
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/favicon.ico') ||
    pathname.match(/\.(?:svg|png|jpg|jpeg|gif|webp)$/)
  ) {
    return NextResponse.next();
  }

  // 2. Manejo de APIs (/api/*)
  if (pathname.startsWith('/api')) {
    // Endpoints públicos de autenticación
    if (pathname.startsWith('/api/auth')) {
      return NextResponse.next();
    }
    // Si la API requiere autenticación y no hay token, retornar JSON 401 en lugar de redirección HTML
    if (!hasToken) {
      return NextResponse.json({ message: 'No autorizado' }, { status: 401 });
    }
    return NextResponse.next();
  }

  // 3. Manejo de vistas/páginas del frontend
  const isLoginPage = pathname === '/login';

  if (!hasToken && !isLoginPage) {
    const loginUrl = new URL('/login', req.url);
    return NextResponse.redirect(loginUrl);
  }

  if (hasToken && isLoginPage) {
    const homeUrl = new URL('/', req.url);
    return NextResponse.redirect(homeUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
