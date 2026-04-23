import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";
import { Webhook } from "svix";
import { api } from "./_generated/api";

const http = httpRouter();

http.route({
  path: "/clerk-webhook",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    const webhookSecret = process.env.CLERK_WEBHOOK_SECRET;
    if (!webhookSecret) {
      throw new Error("Missing CLERK_WEBHOOK_SECRET environment variable");
    }

    const svix_id = request.headers.get("svix-id");
    const svix_signature = request.headers.get("svix-signature");
    const svix_timestamp = request.headers.get("svix-timestamp");

    if (!svix_id || !svix_signature || !svix_timestamp) {
      return new Response("Error occurred -- no svix headers", {
        status: 400,
      });
    }

    const body = await request.text();

    const wh = new Webhook(webhookSecret);
    let evt: any;

    try {
      evt = wh.verify(body, {
        "svix-id": svix_id,
        "svix-timestamp": svix_timestamp,
        "svix-signature": svix_signature,
      }) as any;
    } catch (err) {
      console.error("Error verifying webhook:", err);
      return new Response("Error occurred verifying signature", { status: 400 });
    }

    const payload = JSON.parse(body);
    console.log("Clerk webhook event:", evt.type, evt.data);

    const eventType = evt.type;

    if (eventType === "user.created") {
      const {
        id,
        email_addresses,
        first_name,
        last_name,
        image_url,
        profile_image_url,
        username: clerkUsername,
        primary_email_address_id,
      } = evt.data;

      const email =
        email_addresses?.[0]?.email_address ||
        (payload as any).email_address ||
        "";
      const name = `${first_name || ""} ${last_name || ""}`.trim();
      const username =
        clerkUsername ||
        (email ? email.split("@")[0] : `${id.substring(0, 8)}`);

      try {
        await ctx.runMutation(api.users.createUser, {
          email,
          fullname: name || username,
          image: image_url ?? profile_image_url ?? "",
          clerkId: id,
          username,
        });
      } catch (error) {
        console.error("Error creating user:", error);
        return new Response("Error creating user", { status: 500 });
      }
    }

    return new Response("Webhook processed successfully", { status: 200 });
  }),
});

export default http;
