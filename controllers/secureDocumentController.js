
import db from "../config/database.js";

export const getSecureDocument = (req, res) => {
  try {
    const userId = req.session.user.id;
    const documentId = Number(req.params.id);

    if (
      !Number.isSafeInteger(documentId) ||
      documentId <= 0
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid document ID.",
      });
    }

   
    const document = db
      .prepare(`
        SELECT id, owner_id, title, content, created_at
        FROM documents
        WHERE id = ? AND owner_id = ?
      `)
      .get(documentId, userId);

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
  } catch (error) {
    console.error("Secure document error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to fetch document.",
    });
  }
};
