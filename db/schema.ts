import { sql } from "drizzle-orm";
import {
  mysqlTable,
  timestamp,
  text,
  varchar,
  boolean,
  char,
  json,
  decimal,
  int,
  index,
  uniqueIndex,
} from "drizzle-orm/mysql-core";

// Users
export const users = mysqlTable("users", {
  // In MySQL/MariaDB, prefer varchar/char for IDs
  id: varchar("id", { length: 255 }).primaryKey(),

  phone: varchar("phone", { length: 50 }),
  email: varchar("email", { length: 255 }).notNull(),

  emailVerified: boolean("email_verified").default(false),
  verified: boolean("verified").default(false),
  verificationStatus: varchar("verification_status", { length: 50 }).default(
    "pending"
  ),

  name: varchar("name", { length: 255 }),
  image: text("image"),

  // Stripe
  stripeCustomerId: varchar("stripe_customer_id", { length: 255 }),
  isPremium: boolean("is_premium").default(false),
  premiumSince: timestamp("premium_since"),

  createdAt: timestamp("created_at").defaultNow(),
  // MySQL "ON UPDATE CURRENT_TIMESTAMP" support varies; safest is app-level updates.
  updatedAt: timestamp("updated_at").defaultNow().$onUpdate(() => new Date()),
});

// Sessions table - required by better-auth (singular name to match existing DB)
export const session = mysqlTable("session", {
  id: varchar("id", { length: 255 }).primaryKey(),
  userId: varchar("user_id", { length: 255 })
    .references(() => users.id)
    .notNull(),

  expiresAt: timestamp("expires_at").notNull(),
  token: text("token").notNull(),

  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull().$onUpdate(() => new Date()),

  ipAddress: varchar("ip_address", { length: 255 }),
  userAgent: text("user_agent"),
});

// Accounts table - required for OAuth (singular name to match existing DB)
export const account = mysqlTable("account", {
  id: varchar("id", { length: 255 }).primaryKey(),
  userId: varchar("user_id", { length: 255 })
    .references(() => users.id)
    .notNull(),

  accountId: varchar("account_id", { length: 255 }).notNull(),
  providerId: varchar("provider_id", { length: 255 }).notNull(),

  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  idToken: text("id_token"),

  accessTokenExpiresAt: timestamp("access_token_expires_at"),
  refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),

  scope: varchar("scope", { length: 255 }),
  password: text("password"),

  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull().$onUpdate(() => new Date()),
});

// Verification table - required by better-auth
export const verification = mysqlTable("verification", {
  id: varchar("id", { length: 255 }).primaryKey(),
  identifier: varchar("identifier", { length: 255 }).notNull(),
  value: text("value").notNull(),

  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at"),
  updatedAt: timestamp("updated_at").$onUpdate(() => new Date()),
});

// User profiles for onboarding data
export const userProfiles = mysqlTable(
  "user_profiles",
  {
    userId: varchar("user_id", { length: 255 })
      .primaryKey()
      .references(() => users.id, { onDelete: "cascade" }),

    experienceLevel: varchar("experience_level", { length: 50 })
      .notNull()
      .default("beginner"),

    // MySQL/MariaDB: no text[] arrays -> store as JSON
    investmentObjectives: json("investment_objectives")
      .default(sql`(JSON_ARRAY())`),

    riskTolerance: varchar("risk_tolerance", { length: 50 }).default("low"),
    completedOnboarding: boolean("completed_onboarding").default(false),
    hasSeenDashboardTips: boolean("has_seen_dashboard_tips").default(false),
    hasSeenChallengeTip: boolean("has_seen_challenge_tip").default(false),
    hasSeenAlertsTip: boolean("has_seen_alerts_tip").default(false),

    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow().$onUpdate(() => new Date()),
  },
  (table) => ({
    experienceLevelIdx: index("user_profiles_experience_level_idx").on(
      table.experienceLevel
    ),
    completedOnboardingIdx: index("user_profiles_completed_onboarding_idx").on(
      table.completedOnboarding
    ),
  })
);

// Encrypted Binance API credentials
export const binanceCredentials = mysqlTable(
  "binance_credentials",
  {
    userId: varchar("user_id", { length: 255 })
      .primaryKey()
      .references(() => users.id, { onDelete: "cascade" }),

    apiKeyEncrypted: text("api_key_encrypted").notNull(),
    apiSecretEncrypted: text("api_secret_encrypted").notNull(),

    isActive: boolean("is_active").default(true),
    lastSync: timestamp("last_sync"),

    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow().$onUpdate(() => new Date()),
  },
  (table) => ({
    isActiveIdx: index("binance_credentials_is_active_idx").on(table.isActive),
    lastSyncIdx: index("binance_credentials_last_sync_idx").on(table.lastSync),
  })
);

// Portfolio holdings
export const portfolioAssets = mysqlTable(
  "portfolio_assets",
  {
    // Replace uuid() with char(36) and generate in app
    id: char("id", { length: 36 })
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),

    userId: varchar("user_id", { length: 255 })
      .references(() => users.id, { onDelete: "cascade" })
      .notNull(),

    symbol: varchar("symbol", { length: 50 }).notNull(),
    amount: decimal("amount", { precision: 20, scale: 8 }).notNull(),

    lastSync: timestamp("last_sync").defaultNow(),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow().$onUpdate(() => new Date()),
  },
  (table) => ({
    userSymbolIdx: uniqueIndex("portfolio_assets_user_symbol_idx").on(
      table.userId,
      table.symbol
    ),
    userIdIdx: index("portfolio_assets_user_id_idx").on(table.userId),
    symbolIdx: index("portfolio_assets_symbol_idx").on(table.symbol),
    lastSyncIdx: index("portfolio_assets_last_sync_idx").on(table.lastSync),
  })
);

// Chat message history
export const chatMessages = mysqlTable(
  "chat_messages",
  {
    id: char("id", { length: 36 })
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),

    userId: varchar("user_id", { length: 255 })
      .references(() => users.id, { onDelete: "cascade" })
      .notNull(),

    content: text("content").notNull(),
    role: varchar("role", { length: 20 }).notNull().$type<"user" | "assistant">(),

    // jsonb -> json (default empty object)
    metadata: json("metadata").default(sql`(JSON_OBJECT())`),

    createdAt: timestamp("created_at").defaultNow(),
  },
  (table) => ({
    userIdIdx: index("chat_messages_user_id_idx").on(table.userId),
    roleIdx: index("chat_messages_role_idx").on(table.role),
    createdAtIdx: index("chat_messages_created_at_idx").on(table.createdAt),
  })
);

// Price cache
export const priceCache = mysqlTable(
  "price_cache",
  {
    symbol: varchar("symbol", { length: 50 }).primaryKey(),
    price: decimal("price", { precision: 20, scale: 8 }).notNull(),
    change24h: decimal("change_24h", { precision: 20, scale: 8 }).notNull(),
    changePercent24h: decimal("change_percent_24h", {
      precision: 10,
      scale: 4,
    }).notNull(),

    lastUpdated: timestamp("last_updated").defaultNow(),
  },
  (table) => ({
    lastUpdatedIdx: index("price_cache_last_updated_idx").on(table.lastUpdated),
  })
);

// Crypto price alerts
export const cryptoAlerts = mysqlTable(
  "crypto_alerts",
  {
    id: char("id", { length: 36 })
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),

    userId: varchar("user_id", { length: 255 })
      .references(() => users.id, { onDelete: "cascade" })
      .notNull(),

    symbol: varchar("symbol", { length: 20 }).notNull(),
    pairSymbol: varchar("pair_symbol", { length: 20 }).notNull(),

    alertType: varchar("alert_type", { length: 20 })
      .default("price")
      .$type<"price" | "volatility">(),
    isActive: boolean("is_active").default(true),

    threshold: decimal("threshold", { precision: 20, scale: 8 }).notNull(),
    initialPrice: decimal("initial_price", { precision: 20, scale: 8 }).notNull(),
    initialSide: varchar("initial_side", { length: 5 })
      .notNull()
      .$type<"above" | "below">(),

    triggered: boolean("triggered").default(false),
    triggeredAt: timestamp("triggered_at"),
    triggeredPrice: decimal("triggered_price", { precision: 20, scale: 8 }),

    acknowledged: boolean("acknowledged").default(false),
    acknowledgedAt: timestamp("acknowledged_at"),

    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow().$onUpdate(() => new Date()),
  },
  (table) => ({
    userIdIdx: index("crypto_alerts_user_id_idx").on(table.userId),
    symbolIdx: index("crypto_alerts_symbol_idx").on(table.symbol),
    userActiveIdx: index("crypto_alerts_user_active_idx").on(
      table.userId,
      table.triggered,
      table.acknowledged
    ),
  })
);

// Challenge progress tracking (XP system)
export const challengeProgress = mysqlTable(
  "challenge_progress",
  {
    id: char("id", { length: 36 })
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),

    userId: varchar("user_id", { length: 255 })
      .references(() => users.id, { onDelete: "cascade" })
      .notNull(),

    day: int("day").notNull(),
    openedAt: timestamp("opened_at").defaultNow(),
  },
  (table) => ({
    userDayIdx: uniqueIndex("challenge_progress_user_day_idx").on(
      table.userId,
      table.day
    ),
    userIdIdx: index("challenge_progress_user_id_idx").on(table.userId),
  })
);

// Push notification subscriptions (Web Push)
export const pushSubscriptions = mysqlTable(
  "push_subscriptions",
  {
    id: char("id", { length: 36 })
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),

    userId: varchar("user_id", { length: 255 })
      .references(() => users.id, { onDelete: "cascade" })
      .notNull(),

    endpoint: text("endpoint").notNull(),
    p256dh: text("p256dh").notNull(),
    auth: text("auth").notNull(),
    createdAt: timestamp("created_at").defaultNow(),
  },
  (table) => ({
    userIdIdx: index("push_subscriptions_user_id_idx").on(table.userId),
  })
);

// Cookie consent tracking
export const cookieConsent = mysqlTable("cookie_consent", {
  userId: varchar("user_id", { length: 255 })
    .primaryKey()
    .references(() => users.id, { onDelete: "cascade" }),

  consentedAt: timestamp("consented_at").notNull().defaultNow(),
  lastRefreshedAt: timestamp("last_refreshed_at").notNull().defaultNow(),

  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow().$onUpdate(() => new Date()),
});

// Payments (Stripe one-time payment audit trail)
export const payments = mysqlTable(
  "payments",
  {
    id: char("id", { length: 36 })
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),

    userId: varchar("user_id", { length: 255 })
      .references(() => users.id, { onDelete: "cascade" })
      .notNull(),

    stripeSessionId: varchar("stripe_session_id", { length: 255 }).notNull(),
    stripePaymentIntentId: varchar("stripe_payment_intent_id", { length: 255 }),

    amount: int("amount").notNull(),
    currency: varchar("currency", { length: 10 }).notNull().default("eur"),
    status: varchar("status", { length: 50 }).notNull().default("pending"),

    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow().$onUpdate(() => new Date()),
  },
  (table) => ({
    userIdIdx: index("payments_user_id_idx").on(table.userId),
    stripeSessionIdx: index("payments_stripe_session_idx").on(
      table.stripeSessionId
    ),
  })
);

// Note: Relations are commented out due to TypeScript compatibility issues with current Drizzle version
// The foreign key constraints in the schema provide the necessary database-level relationships
// Relations can be added back when using Drizzle queries if needed

// export const usersRelations = relations(users, ({ one, many }) => ({
//   profile: one(userProfiles),
//   binanceCredentials: one(binanceCredentials),
//   portfolioAssets: many(portfolioAssets),
//   chatMessages: many(chatMessages),
//   sessions: many(session),
//   accounts: many(account),
// }));

// export const userProfilesRelations = relations(userProfiles, ({ one }) => ({
//   user: one(users, {
//     fields: [userProfiles.userId],
//     references: [users.id],
//   }),
// }));

// export const binanceCredentialsRelations = relations(
//   binanceCredentials,
//   ({ one }) => ({
//     user: one(users, {
//       fields: [binanceCredentials.userId],
//       references: [users.id],
//     }),
//   })
// );

// export const portfolioAssetsRelations = relations(
//   portfolioAssets,
//   ({ one }) => ({
//     user: one(users, {
//       fields: [portfolioAssets.userId],
//       references: [users.id],
//     }),
//   })
// );

// export const chatMessagesRelations = relations(chatMessages, ({ one }) => ({
//   user: one(users, {
//     fields: [chatMessages.userId],
//     references: [users.id],
//   }),
// }));

// export const sessionRelations = relations(session, ({ one }) => ({
//   user: one(users, {
//     fields: [session.userId],
//     references: [users.id],
//   }),
// }));

// export const accountRelations = relations(account, ({ one }) => ({
//   user: one(users, {
//     fields: [account.userId],
//     references: [users.id],
//   }),
// }));
