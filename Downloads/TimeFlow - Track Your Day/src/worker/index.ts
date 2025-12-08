import { Hono } from "hono";
import {
  exchangeCodeForSessionToken,
  getOAuthRedirectUrl,
  authMiddleware,
  deleteSession,
  MOCHA_SESSION_TOKEN_COOKIE_NAME,
} from "@getmocha/users-service/backend";
import { getCookie, setCookie } from "hono/cookie";
import { ActivitySchema } from "@/shared/types";

const app = new Hono<{ Bindings: Env }>();

// Auth routes
app.get("/api/oauth/google/redirect_url", async (c) => {
  const redirectUrl = await getOAuthRedirectUrl("google", {
    apiUrl: c.env.MOCHA_USERS_SERVICE_API_URL,
    apiKey: c.env.MOCHA_USERS_SERVICE_API_KEY,
  });

  return c.json({ redirectUrl }, 200);
});

app.post("/api/sessions", async (c) => {
  const body = await c.req.json();

  if (!body.code) {
    return c.json({ error: "No authorization code provided" }, 400);
  }

  const sessionToken = await exchangeCodeForSessionToken(body.code, {
    apiUrl: c.env.MOCHA_USERS_SERVICE_API_URL,
    apiKey: c.env.MOCHA_USERS_SERVICE_API_KEY,
  });

  setCookie(c, MOCHA_SESSION_TOKEN_COOKIE_NAME, sessionToken, {
    httpOnly: true,
    path: "/",
    sameSite: "none",
    secure: true,
    maxAge: 60 * 24 * 60 * 60,
  });

  return c.json({ success: true }, 200);
});

app.get("/api/users/me", authMiddleware, async (c) => {
  return c.json(c.get("user"));
});

app.get("/api/logout", async (c) => {
  const sessionToken = getCookie(c, MOCHA_SESSION_TOKEN_COOKIE_NAME);

  if (typeof sessionToken === "string") {
    await deleteSession(sessionToken, {
      apiUrl: c.env.MOCHA_USERS_SERVICE_API_URL,
      apiKey: c.env.MOCHA_USERS_SERVICE_API_KEY,
    });
  }

  setCookie(c, MOCHA_SESSION_TOKEN_COOKIE_NAME, "", {
    httpOnly: true,
    path: "/",
    sameSite: "none",
    secure: true,
    maxAge: 0,
  });

  return c.json({ success: true }, 200);
});

// Activity routes
app.get("/api/activities", authMiddleware, async (c) => {
  const user = c.get("user");
  const date = c.req.query("date");

  if (!date) {
    return c.json({ error: "Date parameter is required" }, 400);
  }

  if (!user) {
    return c.json({ error: "Unauthorized" }, 401);
  }

  const { results } = await c.env.DB.prepare(
    "SELECT * FROM activities WHERE user_id = ? AND activity_date = ? ORDER BY created_at ASC"
  )
    .bind(user.id, date)
    .all();

  return c.json(results);
});

app.post("/api/activities", authMiddleware, async (c) => {
  const user = c.get("user");
  const body = await c.req.json();

  if (!user) {
    return c.json({ error: "Unauthorized" }, 401);
  }

  const validated = ActivitySchema.parse(body);

  // Check total minutes for the date
  const { total } = await c.env.DB.prepare(
    "SELECT COALESCE(SUM(duration_minutes), 0) as total FROM activities WHERE user_id = ? AND activity_date = ?"
  )
    .bind(user.id, validated.activity_date)
    .first() as { total: number };

  if (total + validated.duration_minutes > 1440) {
    return c.json(
      { error: "Total minutes for the day cannot exceed 1440" },
      400
    );
  }

  const result = await c.env.DB.prepare(
    "INSERT INTO activities (user_id, activity_date, activity_name, category, duration_minutes) VALUES (?, ?, ?, ?, ?)"
  )
    .bind(
      user.id,
      validated.activity_date,
      validated.activity_name,
      validated.category,
      validated.duration_minutes
    )
    .run();

  return c.json({ id: result.meta.last_row_id }, 201);
});

app.put("/api/activities/:id", authMiddleware, async (c) => {
  const user = c.get("user");
  const id = c.req.param("id");
  const body = await c.req.json();

  if (!user) {
    return c.json({ error: "Unauthorized" }, 401);
  }

  const validated = ActivitySchema.parse(body);

  // Get existing activity
  const existing = await c.env.DB.prepare(
    "SELECT * FROM activities WHERE id = ? AND user_id = ?"
  )
    .bind(id, user.id)
    .first();

  if (!existing) {
    return c.json({ error: "Activity not found" }, 404);
  }

  // Check total minutes (excluding current activity)
  const { total } = await c.env.DB.prepare(
    "SELECT COALESCE(SUM(duration_minutes), 0) as total FROM activities WHERE user_id = ? AND activity_date = ? AND id != ?"
  )
    .bind(user.id, validated.activity_date, id)
    .first() as { total: number };

  if (total + validated.duration_minutes > 1440) {
    return c.json(
      { error: "Total minutes for the day cannot exceed 1440" },
      400
    );
  }

  await c.env.DB.prepare(
    "UPDATE activities SET activity_name = ?, category = ?, duration_minutes = ?, activity_date = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ? AND user_id = ?"
  )
    .bind(
      validated.activity_name,
      validated.category,
      validated.duration_minutes,
      validated.activity_date,
      id,
      user.id
    )
    .run();

  return c.json({ success: true }, 200);
});

app.delete("/api/activities/:id", authMiddleware, async (c) => {
  const user = c.get("user");
  const id = c.req.param("id");

  if (!user) {
    return c.json({ error: "Unauthorized" }, 401);
  }

  await c.env.DB.prepare("DELETE FROM activities WHERE id = ? AND user_id = ?")
    .bind(id, user.id)
    .run();

  return c.json({ success: true }, 200);
});

export default app;
