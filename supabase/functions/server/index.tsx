import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import * as kv from "./kv_store.tsx";
import { createClient } from "jsr:@supabase/supabase-js@2.49.8";

const app = new Hono();

// Enable logger
app.use('*', logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// Helper function to authenticate user
const authenticateUser = async (authHeader: string | null) => {
  if (!authHeader) {
    return null;
  }

  const accessToken = authHeader.split(' ')[1];
  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
  );

  const { data: { user }, error } = await supabase.auth.getUser(accessToken);
  if (error || !user) {
    return null;
  }

  return user.id;
};

// Health check endpoint
app.get("/make-server-e8fe712f/health", (c) => {
  return c.json({ status: "ok" });
});

// Sign up endpoint
app.post("/make-server-e8fe712f/signup", async (c) => {
  try {
    const { email, password, name } = await c.req.json();

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
    );

    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      user_metadata: { name },
      // Automatically confirm the user's email since an email server hasn't been configured.
      email_confirm: true
    });

    if (error) {
      console.log('Sign up error:', error);
      return c.json({ error: `Sign up error: ${error.message}` }, 400);
    }

    return c.json({ success: true, userId: data.user.id });
  } catch (error) {
    console.log('Sign up request error:', error);
    return c.json({ error: `Sign up request error: ${error.message}` }, 500);
  }
});

// Get all schedules for the authenticated user
app.get("/make-server-e8fe712f/schedules", async (c) => {
  try {
    const userId = await authenticateUser(c.req.header('Authorization'));
    if (!userId) {
      return c.json({ error: 'Unauthorized - please log in to view schedules' }, 401);
    }

    const schedules = await kv.getByPrefix(`schedule:${userId}:`);
    return c.json({ schedules });
  } catch (error) {
    console.log('Error fetching schedules:', error);
    return c.json({ error: `Error fetching schedules: ${error.message}` }, 500);
  }
});

// Create a new schedule
app.post("/make-server-e8fe712f/schedules", async (c) => {
  try {
    const userId = await authenticateUser(c.req.header('Authorization'));
    if (!userId) {
      return c.json({ error: 'Unauthorized - please log in to create schedules' }, 401);
    }

    const { title, description, startDate, endDate, priority, progress } = await c.req.json();
    const scheduleId = crypto.randomUUID();

    const schedule = {
      id: scheduleId,
      userId,
      title,
      description,
      startDate,
      endDate,
      priority: priority || 'medium',
      progress: progress || 0,
      createdAt: new Date().toISOString(),
    };

    await kv.set(`schedule:${userId}:${scheduleId}`, schedule);

    return c.json({ schedule });
  } catch (error) {
    console.log('Error creating schedule:', error);
    return c.json({ error: `Error creating schedule: ${error.message}` }, 500);
  }
});

app.put("/make-server-e8fe712f/schedules/:id", async (c) => {
  try {
    const userId = await authenticateUser(c.req.header('Authorization'));
    if (!userId) {
      return c.json({ error: 'Unauthorized - please log in to update schedules' }, 401);
    }

    const scheduleId = c.req.param('id');
    const existingSchedule = await kv.get(`schedule:${userId}:${scheduleId}`);

    if (!existingSchedule) {
      return c.json({ error: 'Schedule not found or unauthorized to update this schedule' }, 404);
    }

    const { title, description, startDate, endDate, priority, progress } = await c.req.json();

    const updatedSchedule = {
      ...existingSchedule,
      title,
      description,
      startDate,
      endDate,
      priority,
      progress,
      updatedAt: new Date().toISOString(),
    };

    await kv.set(`schedule:${userId}:${scheduleId}`, updatedSchedule);

    return c.json({ schedule: updatedSchedule });
  } catch (error) {
    console.log('Error updating schedule:', error);
    return c.json({ error: `Error updating schedule: ${error.message}` }, 500);
  }
});

// Delete a schedule
app.delete("/make-server-e8fe712f/schedules/:id", async (c) => {
  try {
    const userId = await authenticateUser(c.req.header('Authorization'));
    if (!userId) {
      return c.json({ error: 'Unauthorized - please log in to delete schedules' }, 401);
    }

    const scheduleId = c.req.param('id');
    const existingSchedule = await kv.get(`schedule:${userId}:${scheduleId}`);

    if (!existingSchedule) {
      return c.json({ error: 'Schedule not found or unauthorized to delete this schedule' }, 404);
    }

    await kv.del(`schedule:${userId}:${scheduleId}`);

    return c.json({ success: true });
  } catch (error) {
    console.log('Error deleting schedule:', error);
    return c.json({ error: `Error deleting schedule: ${error.message}` }, 500);
  }
});

Deno.serve(app.fetch);