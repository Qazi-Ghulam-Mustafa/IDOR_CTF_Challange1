import db from "../config/database.js";

export const getDashboard = (req, res) => {
  try {
    const userId = req.session.user.id;
    const documents = db
      .prepare(
        `
      SELECT id, title, content, created_at
      FROM documents
      WHERE owner_id = ?
      ORDER BY id DESC
    `,
      )
      .all(userId);

    const Challenges = db
      .prepare(
        `
      SELECT
        c.id,
        c.title,
        c.slug,
        c.description,
        COALESCE(up.completed, 0) AS completed
      FROM challenges c
      LEFT JOIN user_progress up
        ON up.challenge_id = c.id
        AND up.user_id = ?
      ORDER BY c.id ASC
    `,
      )
      .all(userId);

    return res.status(200).json({
      success: true,
      message: "Dashboard data fetched successfully!",
      user: req.session.user,
      documents,
      Challenges,
    });
  } catch (e) {
    console.error("Dashboard error : ", e);

    return res.status(500).json({
      success: false,
      message: "Unable to load dashboard.",
    });
  }
};
