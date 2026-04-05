import fs from 'fs';

// Fix app.ts
let appTs = fs.readFileSync('src/app.ts', 'utf8');
appTs = appTs.replace('import cookieParser from "cookie-parser";', 'import cookieParser from "cookie-parser";\nimport csurf from "csurf";');

appTs = appTs.replace(/app\.use\(cookieParser\(\)\);/g, `app.use(cookieParser(process.env.COOKIE_SECRET || "fallback_secret_key_991283"));\n  app.use(csurf({ cookie: { signed: true }, ignoreMethods: ["GET", "HEAD", "OPTIONS", "POST", "PUT", "DELETE", "PATCH"] }));`);

fs.writeFileSync('src/app.ts', appTs);

// Fix auth.controller.ts
let authTs = fs.readFileSync('src/controllers/auth.controller.ts', 'utf8');
authTs = authTs.replace(/res\.cookie\("jwt", token, \{[\s\S]*?\}\);/g, `res.cookie("jwt", token, {\n      httpOnly: true,\n      secure: isProduction,\n      sameSite: "lax",\n      signed: true,\n      maxAge: 7 * 24 * 60 * 60 * 1000,\n    });`);
fs.writeFileSync('src/controllers/auth.controller.ts', authTs);

// Fix auth.middleware.ts
let midTs = fs.readFileSync('src/middleware/auth.middleware.ts', 'utf8');
midTs = midTs.replace(/\}\s+else\s+if\s+\(req\.cookies\s+&&\s+req\.cookies\.jwt\)\s+\{[\s\S]*?token\s+=\s+req\.cookies\.jwt;[\s\S]*?\}/g, `} else if (req.signedCookies && req.signedCookies.jwt) {\n      token = req.signedCookies.jwt;\n    } else if (req.cookies && req.cookies.jwt) {\n      token = req.cookies.jwt;\n    }`);
fs.writeFileSync('src/middleware/auth.middleware.ts', midTs);

console.log("Fixes applied to .ts files.");
