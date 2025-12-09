import z from "zod";

export const ActivitySchema = z.object({
  activity_name: z.string().min(1, "Activity name is required"),
  category: z.string().optional(),
  duration_minutes: z.number().int().min(1, "Duration must be at least 1 minute"),
  activity_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format"),
});

export type ActivityInput = z.infer<typeof ActivitySchema>;

export interface Activity {
  id: number;
  user_id: string;
  activity_date: string;
  activity_name: string;
  category: string | null;
  duration_minutes: number;
  created_at: string;
  updated_at: string;
}
