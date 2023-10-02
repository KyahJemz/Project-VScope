import mongoose from "mongoose";

const { Schema } = mongoose;

const postSchema = new Schema(
  {
    Name: {
      type: String,
      required: true,
      encrypt: {
        bsonType: "string",
        algorithm: "AEAD_AES_256_CBC_HMAC_SHA_512-Random",
        keyId: "/encryption/encryption-key",
      },
    },
    Id: {
      type: String,
      required: true,
      encrypt: {
        bsonType: "string",
        algorithm: "AEAD_AES_256_CBC_HMAC_SHA_512-Random",
        keyId: "/encryption/encryption-key",
      },
    },
    Category: {
      type: String,
      required: true,
      encrypt: {
        bsonType: "string",
        algorithm: "AEAD_AES_256_CBC_HMAC_SHA_512-Random",
        keyId: "/encryption/encryption-key",
      },
    },
    Consern: {
      type: String,
      required: true,
      encrypt: {
        bsonType: "string",
        algorithm: "AEAD_AES_256_CBC_HMAC_SHA_512-Random",
        keyId: "/encryption/encryption-key",
      },
    },
    Department: {
      type: String,
      required: true,
      encrypt: {
        bsonType: "string",
        algorithm: "AEAD_AES_256_CBC_HMAC_SHA_512-Random",
        keyId: "/encryption/encryption-key",
      },
    },
    Status: {
      type: String,
      required: true,
    },
    Account_Id: {
      type: String,
      required: true,
      encrypt: {
        bsonType: "string",
        algorithm: "AEAD_AES_256_CBC_HMAC_SHA_512-Random",
        keyId: "/encryption/encryption-key",
      },
    },
    GoogleEmail: {
      type: String,
      required: true,
      encrypt: {
        bsonType: "string",
        algorithm: "AEAD_AES_256_CBC_HMAC_SHA_512-Random",
        keyId: "/encryption/encryption-key",
      },
    },
    Responses: {
      type: Array,
      required: false,
    },
    Details: {
      type: Object,
      required: false,
    },
  },
  { timestamps: true }
);

export default mongoose.model("dental-appointment", postSchema);
