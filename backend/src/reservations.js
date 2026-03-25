"use strict";

const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const {
  DynamoDBDocumentClient,
  PutCommand,
  QueryCommand
} = require("@aws-sdk/lib-dynamodb");
const { randomUUID } = require("crypto");

const TABLE_NAME = process.env.TABLE_NAME;
const GSI_NAME = "GSI1";
const GSI_PARTITION_VALUE = "RESERVATION";

const db = DynamoDBDocumentClient.from(new DynamoDBClient({}));

const response = (statusCode, body) => ({
  statusCode,
  headers: {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "*",
    "Access-Control-Allow-Methods": "OPTIONS,GET,POST"
  },
  body: JSON.stringify(body)
});

const badRequest = (message) => response(400, { message });

const validateReservation = (payload = {}) => {
  const required = ["studentId", "name", "email", "reservationDate", "laboratory"];
  const missing = required.filter((field) => !payload[field]);
  if (missing.length) {
    return { error: `Missing fields: ${missing.join(", ")}` };
  }

  const date = new Date(payload.reservationDate);
  if (Number.isNaN(date.getTime())) {
    return { error: "reservationDate must be a valid ISO date string" };
  }

  const offsetMinutes = Number(payload.timezoneOffsetMinutes ?? 0);
  const localDate = new Date(date.getTime() - offsetMinutes * 60 * 1000);

  const hour = localDate.getUTCHours();
  const minute = localDate.getUTCMinutes();
  const withinRange = hour >= 8 && hour <= 22;
  const onTheHour = minute === 0;

  if (!withinRange) {
    return { error: "reservationDate hour must be between 08:00 and 22:00 (local time)" };
  }

  if (!onTheHour) {
    return { error: "reservationDate must be on the hour (e.g., 14:00:00Z)" };
  }

  return {
    data: {
      studentId: String(payload.studentId),
      name: String(payload.name),
      email: String(payload.email),
      reservationDate: date.toISOString(),
      laboratory: String(payload.laboratory),
      timezoneOffsetMinutes: offsetMinutes
    }
  };
};

const createReservation = async (payload) => {
  const validation = validateReservation(payload);
  if (validation.error) {
    return badRequest(validation.error);
  }

  const item = {
    id: randomUUID(),
    ...validation.data,
    gsi1pk: GSI_PARTITION_VALUE,
    createdAt: new Date().toISOString()
  };

  await db.send(
    new PutCommand({
      TableName: TABLE_NAME,
      Item: item
    })
  );

  return response(201, { item });
};

const listReservations = async (queryParams = {}) => {
  const upcomingOnly = queryParams.upcoming !== "false";
  const start = queryParams.from || new Date().toISOString();

  const queryInput = {
    TableName: TABLE_NAME,
    IndexName: GSI_NAME,
    KeyConditionExpression: "gsi1pk = :pk" + (upcomingOnly ? " AND reservationDate >= :start" : ""),
    ExpressionAttributeValues: upcomingOnly
      ? { ":pk": GSI_PARTITION_VALUE, ":start": start }
      : { ":pk": GSI_PARTITION_VALUE },
    ScanIndexForward: true
  };

  const result = await db.send(new QueryCommand(queryInput));

  return response(200, { items: result.Items ?? [] });
};

exports.handler = async (event) => {
  if (!TABLE_NAME) {
    return response(500, { message: "Missing TABLE_NAME env variable" });
  }

  const method = event?.requestContext?.http?.method || event.httpMethod;

  if (method === "OPTIONS") {
    return response(200, { ok: true });
  }

  if (method === "GET") {
    try {
      return await listReservations(event.queryStringParameters);
    } catch (err) {
      console.error("GET /reservations error", err);
      return response(500, { message: "Failed to fetch reservations" });
    }
  }

  if (method === "POST") {
    try {
      const payload = JSON.parse(event.body || "{}");
      return await createReservation(payload);
    } catch (err) {
      console.error("POST /reservations error", err);
      return response(500, { message: "Failed to create reservation" });
    }
  }

  return response(405, { message: "Method Not Allowed" });
};
