import { supabase } from "../../lib/supabaseClient";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { name } = req.body;

  if (!name || name.trim().length === 0) {
    return res.status(400).json({ error: "Name is required" });
  }

  const deathGrape = Math.floor(Math.random() * 1000) + 1;

  const { data, error } = await supabase
    .from("players")
    .insert([
      {
        name: name.trim(),
        grapes_eaten: 0,
        bank_balance: 0,
        is_dead: false,
        death_grape_number: deathGrape,
      },
    ])
    .select()
    .single();

  if (error) return res.status(500).json({ error: error.message });
  res.status(200).json({ id: data.id });
}
