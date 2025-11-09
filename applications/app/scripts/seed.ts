import { hex } from "@better-auth/utils/hex";
import { faker } from "@faker-js/faker";
import { scryptAsync } from "@noble/hashes/scrypt.js";
import chalk from "chalk";
import { db } from "db";
import {
  account,
  client,
  invoice,
  member,
  organization,
  user
} from "db/schema";
import "dotenv/config";
import { eq } from "drizzle-orm";

async function seed() {
  console.log(chalk.cyan.bold("🌱 Starting database seed...\n"));

  // Create main admin user using Better Auth format
  const adminEmail = "admin@test.com";
  const adminPassword = "Password123@";
  const hashedPassword = await hashPassword(adminPassword);

  let userId: string;
  const now = new Date();

  console.log(chalk.blue("📝 Creating admin user with Better Auth format..."));

  const existingUser = await db
    .select()
    .from(user)
    .where(eq(user.email, adminEmail))
    .limit(1);

  if (existingUser.length > 0) {
    console.log(
      chalk.yellow("   → Admin user already exists, using existing user...")
    );

    userId = existingUser[0].id;

    // Update password if account exists
    const existingAccount = await db
      .select()
      .from(account)
      .where(eq(account.userId, userId))
      .limit(1);

    if (existingAccount.length > 0) {
      await db
        .update(account)
        .set({ password: hashedPassword, updatedAt: now })
        .where(eq(account.userId, userId));
      console.log(chalk.yellow("   → Password updated"));
    }
  } else {
    // Create user
    userId = crypto.randomUUID();

    await db.insert(user).values({
      id: userId,
      name: "Admin User",
      email: adminEmail,
      emailVerified: true,
      createdAt: now,
      updatedAt: now
    });

    // Create account in Better Auth format
    // For credential provider: accountId = email, providerId = "credential"
    await db.insert(account).values({
      id: crypto.randomUUID(),
      accountId: adminEmail, // Better Auth uses email as accountId for credentials
      providerId: "credential", // Better Auth uses "credential" for email/password
      userId: userId,
      password: hashedPassword,
      createdAt: now,
      updatedAt: now
    });

    console.log(chalk.green("   ✓ Admin user created with Better Auth format"));
  }

  // Create organization
  console.log(chalk.blue("🏢 Creating organization..."));

  const orgSlug = "test-org";
  const existingOrg = await db
    .select()
    .from(organization)
    .where(eq(organization.slug, orgSlug))
    .limit(1);

  let orgId: string;

  if (existingOrg.length > 0) {
    console.log(
      chalk.yellow(
        "   → Organization already exists, using existing organization..."
      )
    );

    orgId = existingOrg[0].id;
  } else {
    orgId = crypto.randomUUID();

    await db.insert(organization).values({
      id: orgId,
      name: "Test Organisation",
      slug: orgSlug,
      createdAt: now,
      updatedAt: now
    });

    console.log(chalk.green("   ✓ Organization created"));
  }

  // Create member (link user to organization)
  console.log(chalk.blue("👤 Creating member..."));

  const existingMember = await db
    .select()
    .from(member)
    .where(eq(member.userId, userId))
    .limit(1);

  if (existingMember.length === 0) {
    await db.insert(member).values({
      id: crypto.randomUUID(),
      organizationId: orgId,
      userId: userId,
      role: "owner",
      createdAt: now,
      updatedAt: now
    });

    console.log(chalk.green("   ✓ Member created"));
  } else {
    console.log(chalk.yellow("   → Member already exists, skipping..."));
  }

  // Create clients
  console.log(chalk.blue("👥 Creating clients..."));

  const existingClients = await db
    .select()
    .from(client)
    .where(eq(client.organizationId, orgId))
    .limit(10);

  let clients;

  if (existingClients.length >= 10) {
    console.log(
      chalk.yellow(
        `   → Clients already exist, using existing ${existingClients.length} clients...`
      )
    );

    clients = existingClients;
  } else {
    clients = [];

    const clientsToCreate = 10 - existingClients.length;

    for (let i = 0; i < clientsToCreate; i++) {
      const clientId = crypto.randomUUID();

      const [newClient] = await db
        .insert(client)
        .values({
          id: clientId,
          name: faker.person.fullName(),
          email: faker.internet.email(),
          phone: faker.phone.number(),
          address: {
            line1: faker.location.streetAddress(),
            line2: faker.location.secondaryAddress(),
            city: faker.location.city(),
            country: faker.location.country(),
            postalCode: faker.location.zipCode()
          },
          organizationId: orgId,
          createdAt: now,
          updatedAt: now
        })
        .returning();
      clients.push(newClient);
    }

    clients = [...existingClients, ...clients];
    console.log(chalk.green(`   ✓ Created ${clientsToCreate} new clients`));
  }

  // Create invoices
  console.log(chalk.blue("📄 Creating invoices..."));

  const existingInvoices = await db
    .select()
    .from(invoice)
    .where(eq(invoice.organizationId, orgId));

  const invoicesToCreate = Math.max(0, 20 - existingInvoices.length);

  if (invoicesToCreate > 0) {
    for (let i = 0; i < invoicesToCreate; i++) {
      const randomClient = faker.helpers.arrayElement(clients);
      const invoiceDate = faker.date.recent({ days: 30 });
      const dueDate = new Date(invoiceDate);

      dueDate.setDate(dueDate.getDate() + 30);

      const lineItems = Array.from({
        length: faker.number.int({ min: 1, max: 5 })
      }).map(() => {
        const quantity = faker.number.int({ min: 1, max: 10 });
        const unitPrice = parseFloat(
          faker.commerce.price({ min: 10, max: 1000 })
        );

        return {
          description: faker.commerce.productName(),
          quantity,
          unitPrice,
          total: quantity * unitPrice
        };
      });

      const subtotal = lineItems.reduce((sum, item) => sum + item.total, 0);
      const tax = subtotal * 0.2; // 20% tax
      const total = subtotal + tax;

      await db.insert(invoice).values({
        id: crypto.randomUUID(),
        organizationId: orgId,
        clientId: randomClient.id,
        invoiceNumber: `INV-${String(existingInvoices.length + i + 1).padStart(4, "0")}`,
        invoiceDate,
        dueDate,
        status: faker.helpers.arrayElement([
          "draft",
          "sent",
          "paid",
          "overdue",
          "cancelled"
        ]),
        lineItems,
        subtotal: subtotal.toString(),
        tax: tax.toString(),
        total: total.toString(),
        currency: "GBP",
        notes: faker.lorem.sentence(),
        createdAt: now,
        updatedAt: now
      });
    }

    console.log(chalk.green(`   ✓ Created ${invoicesToCreate} new invoices`));
  } else {
    console.log(
      chalk.yellow(
        `   → Invoices already exist (${existingInvoices.length}), skipping...`
      )
    );
  }

  const finalInvoiceCount = await db
    .select()
    .from(invoice)
    .where(eq(invoice.organizationId, orgId));

  console.log(chalk.green.bold("\n✅ Seed completed successfully!\n"));
  console.log(chalk.cyan("   📋 Summary:"));
  console.log(chalk.white(`   • Admin user: ${chalk.bold(adminEmail)}`));
  console.log(chalk.white(`   • Password: ${chalk.bold(adminPassword)}`));
  console.log(chalk.white(`   • Clients: ${chalk.bold(clients.length)}`));
  console.log(
    chalk.white(`   • Invoices: ${chalk.bold(finalInvoiceCount.length)}\n`)
  );
}

seed()
  .catch(error => {
    console.error(
      chalk.red.bold("\n❌ Error seeding database:\n"),
      chalk.red(error)
    );
    process.exit(1);
  })
  .finally(() => {
    process.exit(0);
  });

async function generateKey(password: string, salt: string) {
  const config = {
    N: 16384,
    r: 16,
    p: 1,
    dkLen: 64
  };

  return await scryptAsync(password.normalize("NFKC"), salt, {
    N: config.N,
    p: config.p,
    r: config.r,
    dkLen: config.dkLen,
    maxmem: 128 * config.N * config.r * 2
  });
}

async function hashPassword(password: string) {
  const salt = hex.encode(crypto.getRandomValues(new Uint8Array(16)));
  const key = await generateKey(password, salt);

  return `${salt}:${hex.encode(key)}`;
}
