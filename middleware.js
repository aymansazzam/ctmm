import { NextResponse } from 'next/server'

export function middleware(request) {
    // Change this to your desired password
    const CORRECT_PASSWORD = 'your-password-here'

    // Check if user is authenticated
    const authCookie = request.cookies.get('auth')
    if (authCookie?.value === CORRECT_PASSWORD) {
        return NextResponse.next()
    }

    // Check if this is the password submission
    if (request.method === 'POST') {
        const formData = await request.formData()
        const password = formData.get('password')
        
        if (password === CORRECT_PASSWORD) {
            const response = NextResponse.redirect(request.url)
            response.cookies.set('auth', CORRECT_PASSWORD)
            return response
        }
        
        return NextResponse.redirect(`${request.url}?error=1`)
    }

    // Show login page
    return new Response(
        `
        <!DOCTYPE html>
        <html>
            <head>
                <title>Login Required</title>
                <meta charset="utf-8">
                <meta name="viewport" content="width=device-width, initial-scale=1">
                <style>
                    body {
                        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        height: 100vh;
                        margin: 0;
                        background-color: #f5f5f5;
                    }
                    .container {
                        background: white;
                        padding: 2rem;
                        border-radius: 8px;
                        box-shadow: 0 0 10px rgba(0,0,0,0.1);
                    }
                    input, button {
                        display: block;
                        width: 100%;
                        margin: 0.5rem 0;
                        padding: 0.5rem;
                        border: 1px solid #ddd;
                        border-radius: 4px;
                    }
                    button {
                        background: #0070f3;
                        color: white;
                        border: none;
                        cursor: pointer;
                    }
                    .error {
                        color: red;
                        margin-top: 1rem;
                    }
                </style>
            </head>
            <body>
                <div class="container">
                    <h2>Accès Protégé</h2>
                    <form method="POST">
                        <input type="password" name="password" placeholder="Entrez le mot de passe" required>
                        <button type="submit">Accéder</button>
                    </form>
                    ${request.nextUrl.searchParams.get('error') ? '<p class="error">Mot de passe incorrect</p>' : ''}
                </div>
            </body>
        </html>
        `,
        {
            headers: { 'Content-Type': 'text/html' },
        }
    )
}

export const config = {
    matcher: '/',
} 