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
    console.error("Encoded IDOR error:", error);

    return res.status(500).json({
      success: false,
      message: "unable to fetch encoded document",
    });
  }
};
