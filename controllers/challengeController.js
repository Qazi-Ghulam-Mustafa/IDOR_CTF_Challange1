import db from "../config/database.js";

export const getPlainIdorDocument = (req, res) => {
  try {
    const documentId = Number(req.params.id);

    if (!Number.isSafeInteger(documentId) || documentId <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid document ID.",
      });
    }

    const document = db
      .prepare(
        `
  SELECT id, owner_id, title, content, created_at
  FROM documents
  WHERE id = ?
`,
      )
      .get(documentId);

    if (!document) {
      return res.status(404).json({
        success: false,
        message: "Document not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Document fetched successfully!",
      document,
    });
  } catch (e) {
    console.error("Plain idor error :", e);

    return res.status(500).json({
      success: false,
      message: "Unable to fetch document",
    });
  }
};

export const getEncodedIdorDocument = (req, res) => {
  try {
    const encodedId = req.params.encodedId;

    if (
      !/^[A-Za-z0-9+/]+={0,2}$/.test(encodedId) ||
      Buffer.from(encodedId, "base64").toString("base64") !== encodedId
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid Base64 document ID.",
      });
    }

    const decodedId = Buffer.from(encodedId, "base64").toString("utf8");
    const documentId = Number(decodedId);

    if (
      !Number.isSafeInteger(documentId) ||
      documentId <= 0 ||
      String(documentId) !== decodedId
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid encoded document document Id.",
      });
    }
    const document = db
      .prepare(
        `
        SELECT id, owner_id,title,content,created_at
        FROM documents
        WHERE id=?
        `,
      )
      .get(documentId);

    if (!document) {
      return res.status(404).json({
        success: false,
        message: "Document not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Encoded documnet fetched successfully",
      document,
    });
  } catch (e) {
    console.error("Encoded IDOR error:", e);

    return res.status(500).json({
      success: false,
      message: "unable to fetch encoded document",
    });
  }
};

const challengeHints = {
  "plain-idor":
    "Try changing the numeric document ID in the URL. Does the server verify document ownership?",
  "encoded-idor":
    "Base64 is encoding, not encryption. Can you decode the document reference?",
};

export const getChallenges = (req, res) => {
  try {
    const userId = req.session.user.id;

    const challenges = db
      .prepare(
        `SELECT
      c.id,
      c.title,
      c.slug,
      c.description,
      COALESCE(up.completed, 0)AS completed
      FROM challenges c
      LEFT JOIN user_progress up
      ON up.challenge_id=c.id
      AND up.user_id=?
      ORDER BY c.id ASC
      `,
      )
      .all(userId);

    const result = challenges.map((challenge) => ({
      ...challenge,
      hint: challengeHints[challenge.slug] || "No hint available.",
    }));

    return res.status(200).json({
      success: true,
      challenges: result,
    });
  } catch (e) {
    console.error("Get Challenges error: ", e);

    return res.status(500).json({
      success: false,
      message: "Unable to fetch challenges.",
    });
  }
};

export const submitFlag = (req, res) => {
  try {
    const userId = req.session.user.id;
    const { slug } = req.params;
    const { flag } = req.body;

    if (typeof flag !== "string" || !flag.trim()) {
      return res.status(400).json({
        success: false,
        message: "Please provide a flag",
      });
    }
    const challenge = db
      .prepare(
        `
      SELECT id,flag_value
      FROM challenges
      WHERE slug=?
      `,
      )
      .get(slug);

    if (!challenge) {
      return res.status(404).json({
        success: false,
        message: "Challenge not found",
      });
    }

    if (flag.trim() !== challenge.flag_value) {
      return res.status(400).json({
        success: false,
        message: "Incorrect flag. Try again!",
      });
    }

    db.prepare(
      `
      INSERT INTO user_progress
      (user_id, challenge_id, completed, completed_at)
      VALUES (?,?,1, CURRENT_TIMESTAMP)
      ON CONFLICT (user_id,challenge_id)
      DO UPDATE SET
      completed = 1,
      completed_at = COALESCE(
      user_progress.completed_at,
      CURRENT_TIMESTAMP
      ) 
      `,
    ).run(userId, challenge.id);

    return res.status(200).json({
      success: true,
      message: "Congratulations Challenges completed",
    });
  } catch (e) {
    console.error("Flag submission error : ", e);

    return res.status(500).json({
      success: false,
      message: "Unable to submit flag",
    });
  }
};
